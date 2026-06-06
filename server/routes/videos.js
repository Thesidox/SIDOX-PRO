const express  = require('express');
const { allQuery, runQuery, getQuery } = require('../database/db');
const { protect } = require('../middleware/auth');
const router = express.Router();

/* GET /api/videos/course/:courseId  — protected student */
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    /* verify student has enrollment for this course */
    if (req.user.role === 'student') {
      const enrolled = await getQuery(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = "active"',
        [req.user.id, req.params.courseId]
      );
      if (!enrolled)
        return res.status(403).json({ error: 'ليس لديك صلاحية الوصول لهذه الدورة' });
    }

    const videos = await allQuery(
      `SELECT id, title_ar, title_fr, video_url, thumb_url, duration_min, sort_order
       FROM videos
       WHERE course_id = ? AND is_active = 1
       ORDER BY sort_order`,
      [req.params.courseId]
    );
    res.json(videos);
  } catch (err) {
    console.error('[VIDEOS/list]', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

/* POST /api/videos/progress  — save watch progress */
router.post('/progress', protect, async (req, res) => {
  try {
    const { video_id, watched_secs, completed } = req.body;
    if (!video_id) return res.status(400).json({ error: 'video_id required' });

    await runQuery(`
      INSERT INTO progress (user_id, video_id, watched_secs, completed, last_watched)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, video_id) DO UPDATE SET
        watched_secs = MAX(watched_secs, excluded.watched_secs),
        completed    = excluded.completed,
        last_watched = CURRENT_TIMESTAMP
    `, [req.user.id, video_id, watched_secs || 0, completed ? 1 : 0]);

    res.json({ success: true });
  } catch (err) {
    console.error('[VIDEOS/progress]', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

/* GET /api/videos/progress/:courseId  — get student progress */
router.get('/progress/:courseId', protect, async (req, res) => {
  try {
    const progress = await allQuery(`
      SELECT p.video_id, p.watched_secs, p.completed, p.last_watched
      FROM progress p
      JOIN videos v ON v.id = p.video_id
      WHERE p.user_id = ? AND v.course_id = ?
    `, [req.user.id, req.params.courseId]);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
