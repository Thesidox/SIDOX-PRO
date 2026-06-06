const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { getQuery, runQuery, allQuery } = require('../database/db');
const { protect } = require('../middleware/auth');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'sidox_secret';
const EXPIRE  = process.env.JWT_EXPIRE  || '7d';

/* POST /api/auth/login  — admin or student by access_code */
router.post('/login', async (req, res) => {
  try {
    const { username, password, access_code } = req.body;

    /* ── Student login via access_code ── */
    if (access_code) {
      const enrollment = await getQuery(
        `SELECT e.*, u.id AS uid, u.status, c.name AS course_name
         FROM enrollments e
         JOIN users   u ON u.id = e.user_id
         JOIN courses c ON c.id = e.course_id
         WHERE e.access_code = ?`,
        [access_code.toUpperCase().trim()]
      );
      if (!enrollment)
        return res.status(401).json({ error: 'رمز الدخول غير صحيح' });
      if (enrollment.status !== 'active' || enrollment.status_enroll !== undefined)
        return res.status(401).json({ error: 'الحساب غير مفعل' });

      await runQuery('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [enrollment.uid]);

      const token = jwt.sign(
        { userId: enrollment.uid, role: 'student', courseId: enrollment.course_id },
        SECRET, { expiresIn: EXPIRE }
      );
      return res.json({
        success : true,
        token,
        user    : { id: enrollment.uid, role: 'student', course: enrollment.course_name, access_code },
      });
    }

    /* ── Admin / instructor login ── */
    if (!username || !password)
      return res.status(400).json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });

    const user = await getQuery('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (!user)
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    if (user.status !== 'active')
      return res.status(401).json({ error: 'الحساب معطل' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });

    await runQuery('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET, { expiresIn: EXPIRE }
    );
    return res.json({
      success: true,
      token,
      user   : { id: user.id, username: user.username, role: user.role },
    });

  } catch (err) {
    console.error('[AUTH/login]', err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

/* POST /api/auth/verify */
router.post('/verify', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
