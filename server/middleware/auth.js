const jwt = require('jsonwebtoken');
const { getQuery } = require('../database/db');

const SECRET = process.env.JWT_SECRET || 'sidox_secret';

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'غير مصرح. يرجى تسجيل الدخول.' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await getQuery(
      'SELECT id, username, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );
    if (!user || user.status !== 'active')
      return res.status(401).json({ error: 'المستخدم غير موجود أو معطل.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'التوكن غير صالح أو منتهي الصلاحية.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'هذا المسار للمدير فقط.' });
  next();
};

const adminPassword = (req, res, next) => {
  const pass = req.headers['x-admin-password'];
  if (pass !== (process.env.ADMIN_PASSWORD || 'admin123'))
    return res.status(401).json({ error: 'كلمة مرور المدير غير صحيحة.' });
  next();
};

module.exports = { protect, adminOnly, adminPassword };
