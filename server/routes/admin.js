const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt   = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('../database/db');
const { adminPassword } = require('../middleware/auth');
const router = express.Router();

router.use(adminPassword);

/* ── STATS ── */
router.get('/stats', async (_req, res) => {
  try {
    const total   = await getQuery('SELECT COUNT(*) AS c FROM users WHERE role = "student"');
    const active  = await getQuery('SELECT COUNT(*) AS c FROM users WHERE role = "student" AND status = "active"');
    const courses = await allQuery('SELECT c.name, COUNT(e.id) AS enrolled FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id GROUP BY c.id');
    const recent  = await allQuery('SELECT username, last_login FROM users WHERE role = "student" ORDER BY last_login DESC LIMIT 5');
    res.json({ totalStudents: total.c, activeStudents: active.c, courseBreakdown: courses, recentLogins: recent });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── GENERATE ACCESS CODES ── */
router.post('/generate-codes', async (req, res) => {
  try {
    const { course_id, course_name, count = 1, email, phone } = req.body;
    if (!course_id) return res.status(400).json({ error: 'course_id required' });
    const limit = Math.min(parseInt(count) || 1, 100);
    const created = [];

    for (let i = 0; i < limit; i++) {
      const access_code = 'SIDOX-' + uuidv4().substring(0, 8).toUpperCase();
      const username    = 'student_' + uuidv4().substring(0, 6);
      const hash        = await bcrypt.hash(access_code, 10);

      const userResult = await runQuery(
        'INSERT INTO users (username, password_hash, role, email, phone, status) VALUES (?,?,?,?,?,?)',
        [username, hash, 'student', email || null, phone || null, 'active']
      );
      await runQuery(
        'INSERT INTO enrollments (user_id, course_id, access_code, status) VALUES (?,?,?,?)',
        [userResult.id, course_id, access_code, 'active']
      );
      created.push({ access_code, user_id: userResult.id, course_name: course_name || course_id });
    }
    res.json({ success: true, count: created.length, codes: created });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── LIST STUDENTS ── */
router.get('/students', async (_req, res) => {
  try {
    const students = await allQuery(`
      SELECT u.id, u.username, u.email, u.phone, u.status, u.created_at, u.last_login,
             e.access_code, c.name AS course
      FROM users u
      LEFT JOIN enrollments e ON e.user_id = u.id
      LEFT JOIN courses     c ON c.id = e.course_id
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC
    `);
    res.json(students);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── DEACTIVATE STUDENT ── */
router.post('/students/:id/deactivate', async (req, res) => {
  try {
    await runQuery('UPDATE users SET status = "inactive" WHERE id = ? AND role = "student"', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── REACTIVATE STUDENT ── */
router.post('/students/:id/activate', async (req, res) => {
  try {
    await runQuery('UPDATE users SET status = "active" WHERE id = ? AND role = "student"', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── ADD VIDEO ── */
router.post('/videos', async (req, res) => {
  try {
    const { course_id, title_ar, title_fr, video_url, thumb_url, duration_min, sort_order } = req.body;
    if (!course_id || !video_url) return res.status(400).json({ error: 'course_id and video_url required' });
    const r = await runQuery(
      'INSERT INTO videos (course_id, title_ar, title_fr, video_url, thumb_url, duration_min, sort_order) VALUES (?,?,?,?,?,?,?)',
      [course_id, title_ar || '', title_fr || '', video_url, thumb_url || '', duration_min || 0, sort_order || 1]
    );
    res.json({ success: true, video_id: r.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── DELETE VIDEO ── */
router.delete('/videos/:id', async (req, res) => {
  try {
    await runQuery('UPDATE videos SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── LIST CONTACT MESSAGES ── */
router.get('/messages', async (_req, res) => {
  try {
    const msgs = await allQuery('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
