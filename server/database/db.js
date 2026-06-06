const sqlite3 = require('sqlite3').verbose();
const bcrypt  = require('bcryptjs');
const path    = require('path');
const fs      = require('fs');

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, 'sidox.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

let db;

const initDB = () => new Promise((resolve, reject) => {
  db = new sqlite3.Database(DB_PATH, async (err) => {
    if (err) { return reject(err); }
    console.log('✅ SQLite connected:', DB_PATH);
    await createTables();
    await seedAdmin();
    resolve(db);
  });
});

const createTables = () => new Promise((resolve, reject) => {
  db.serialize(() => {
    /* ── USERS (admins + students) ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        username      TEXT    UNIQUE NOT NULL,
        password_hash TEXT    NOT NULL,
        role          TEXT    NOT NULL DEFAULT 'student',
        email         TEXT,
        phone         TEXT,
        status        TEXT    NOT NULL DEFAULT 'active',
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login    DATETIME
      )
    `);

    /* ── COURSES ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        name           TEXT UNIQUE NOT NULL,
        title_ar       TEXT,
        title_fr       TEXT,
        description_ar TEXT,
        description_fr TEXT,
        price_dzd      INTEGER NOT NULL DEFAULT 0,
        duration_hours INTEGER,
        level          TEXT    DEFAULT 'Débutant',
        is_active      INTEGER DEFAULT 1,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* ── VIDEOS ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS videos (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id    INTEGER NOT NULL,
        title_ar     TEXT,
        title_fr     TEXT,
        video_url    TEXT NOT NULL,
        thumb_url    TEXT,
        duration_min INTEGER DEFAULT 0,
        sort_order   INTEGER DEFAULT 1,
        is_active    INTEGER DEFAULT 1,
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    /* ── ENROLLMENTS ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id      INTEGER NOT NULL,
        course_id    INTEGER NOT NULL,
        access_code  TEXT UNIQUE NOT NULL,
        status       TEXT    DEFAULT 'active',
        enrolled_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id),
        FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    /* ── PROGRESS ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id      INTEGER NOT NULL,
        video_id     INTEGER NOT NULL,
        watched_secs INTEGER DEFAULT 0,
        completed    INTEGER DEFAULT 0,
        last_watched DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, video_id),
        FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
      )
    `);

    /* ── CONTACT MESSAGES ── */
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        name           TEXT NOT NULL,
        email          TEXT,
        phone          TEXT,
        message        TEXT NOT NULL,
        course_interest TEXT,
        status         TEXT DEFAULT 'new',
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) reject(err);
      else { console.log('✅ All tables ready'); resolve(); }
    });
  });
});

const seedAdmin = async () => {
  const admin = await getQuery('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    await runQuery(
      `INSERT INTO users (username, password_hash, role, status) VALUES (?, ?, 'admin', 'active')`,
      ['admin', hash]
    );
    console.log('✅ Admin user seeded (username: admin)');
  }

  const ac = await getQuery('SELECT id FROM courses WHERE name = ?', ['AutoCAD']);
  if (!ac) {
    await runQuery(`
      INSERT INTO courses (name, title_ar, title_fr, description_ar, description_fr, price_dzd, duration_hours, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['AutoCAD',
       'دورة AutoCAD الاحترافية',
       'Cours AutoCAD Professionnel',
       'تعلم AutoCAD من الصفر حتى الاحتراف مع مشاريع عملية حقيقية',
       "Apprenez AutoCAD de zéro jusqu'au niveau avancé avec des projets réels",
       3500, 40, 'Débutant à Intermédiaire']
    );
  }
  const co = await getQuery('SELECT id FROM courses WHERE name = ?', ['Covadis']);
  if (!co) {
    await runQuery(`
      INSERT INTO courses (name, title_ar, title_fr, description_ar, description_fr, price_dzd, duration_hours, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Covadis',
       'دورة Covadis للمسح والطوبوغرافيا',
       'Cours Covadis Topographie',
       'إتقان برنامج Covadis للمسح الطوبوغرافي وحسابات التضاريس',
       'Maîtrisez Covadis pour la topographie et les calculs de terrain',
       5000, 35, 'Débutant à Intermédiaire']
    );
  }
  console.log('✅ Default courses ready');
};

/* ── Query helpers ── */
const runQuery = (sql, params = []) => new Promise((res, rej) => {
  db.run(sql, params, function (err) {
    if (err) rej(err);
    else res({ id: this.lastID, changes: this.changes });
  });
});

const getQuery = (sql, params = []) => new Promise((res, rej) => {
  db.get(sql, params, (err, row) => { if (err) rej(err); else res(row); });
});

const allQuery = (sql, params = []) => new Promise((res, rej) => {
  db.all(sql, params, (err, rows) => { if (err) rej(err); else res(rows || []); });
});

module.exports = { initDB, runQuery, getQuery, allQuery };
