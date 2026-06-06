const express = require('express');
const { runQuery } = require('../database/db');
const router = express.Router();

/* POST /api/contact/send */
router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, message, course_interest } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'الاسم والرسالة مطلوبان' });
    const r = await runQuery(
      'INSERT INTO contact_messages (name, email, phone, message, course_interest) VALUES (?,?,?,?,?)',
      [name.trim(), email || null, phone || null, message.trim(), course_interest || null]
    );
    res.json({ success: true, id: r.id, message: 'تم استلام رسالتك بنجاح!' });
  } catch (err) {
    console.error('[CONTACT/send]', err);
    res.status(500).json({ error: 'فشل إرسال الرسالة' });
  }
});

module.exports = router;
