require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const { initDB }   = require('./database/db');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ═══════════════════════════════
   1.  SECURITY — Helmet
═══════════════════════════════ */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc : ["'self'"],
      scriptSrc  : ["'self'", "'unsafe-inline'"],
      styleSrc   : ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc    : ["'self'", 'https://fonts.gstatic.com'],
      imgSrc     : ["'self'", 'data:', 'https:'],
      mediaSrc   : ["'self'", 'https:'],
      connectSrc : ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

/* ═══════════════════════════════
   2.  RATE LIMITING
═══════════════════════════════ */
const globalLimiter = rateLimit({
  windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 min
  max      : parseInt(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders  : false,
  message  : { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 10,
  message : { error: 'محاولات كثيرة جداً، يرجى المحاولة بعد 15 دقيقة' },
});

app.use(globalLimiter);

/* ═══════════════════════════════
   3.  CORS
═══════════════════════════════ */
app.use(cors({
  origin     : process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods    : ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-admin-password'],
}));

/* ═══════════════════════════════
   4.  BODY PARSER
═══════════════════════════════ */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ═══════════════════════════════
   5.  STATIC — React build
═══════════════════════════════ */
app.use(express.static(path.join(__dirname, '../client/build')));

/* ═══════════════════════════════
   6.  API ROUTES
═══════════════════════════════ */
const authRoutes    = require('./routes/auth');
const courseRoutes  = require('./routes/courses');
const videoRoutes   = require('./routes/videos');
const adminRoutes   = require('./routes/admin');
const contactRoutes = require('./routes/contact');

app.use('/api/auth',    authLimiter, authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos',  videoRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', platform: 'SIDOX EDU', timestamp: new Date().toISOString() })
);

/* ═══════════════════════════════
   7.  SERVE REACT for all other routes
═══════════════════════════════ */
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
);

/* ═══════════════════════════════
   8.  GLOBAL ERROR HANDLER
═══════════════════════════════ */
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error  : process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    status : err.status || 500,
  });
});

/* ═══════════════════════════════
   9.  START — init DB then listen
═══════════════════════════════ */
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║   SIDOX EDU — Educational Platform      ║
║   منصة SIDOX للمحتوى التعليمي           ║
╠══════════════════════════════════════════╣
║  ✅ Server    : http://localhost:${PORT}    ║
║  ✅ Env       : ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║  ✅ DB        : SQLite ready             ║
╚══════════════════════════════════════════╝`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
