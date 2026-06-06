const express = require('express');
const { allQuery, getQuery } = require('../database/db');
const router = express.Router();

/* GET /api/courses  — public */
router.get('/', async (_req, res) => {
  try {
    const courses = await allQuery(
      'SELECT id, name, title_ar, title_fr, description_ar, description_fr, price_dzd, duration_hours, level FROM courses WHERE is_active = 1'
    );
    res.json(courses);
  } catch (err) {
    console.error('[COURSES/list]', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

/* GET /api/courses/:id  — public (no video_url) */
router.get('/:id', async (req, res) => {
  try {
    const course = await getQuery(
      'SELECT * FROM courses WHERE id = ? AND is_active = 1',
      [req.params.id]
    );
    if (!course) return res.status(404).json({ error: 'الدورة غير موجودة' });

    const videos = await allQuery(
      'SELECT id, title_ar, title_fr, duration_min, sort_order, thumb_url FROM videos WHERE course_id = ? AND is_active = 1 ORDER BY sort_order',
      [course.id]
    );
    res.json({ ...course, videos });
  } catch (err) {
    console.error('[COURSES/one]', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

module.exports = router;
