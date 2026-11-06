/**
 * Vercel Serverless Entry Point for QuizCraft Express API
 *
 * On cold start (empty DB), the database is auto-seeded so quizzes
 * are available immediately without a separate setup step.
 *
 * NOTE: Vercel Serverless uses an ephemeral /tmp filesystem.
 * Data persists only within the same function instance lifetime.
 * For production persistence, migrate to PlanetScale / Turso / Neon.
 */

// Point DB to /tmp so we can write to it on Vercel
process.env.DB_PATH = '/tmp/quizcraft.db';

const express = require('express');
const cors = require('cors');

// Bootstrap database (creates schema on first run)
const db = require('../database/db');

// Auto-seed on cold start if the DB is empty
(function seedIfEmpty() {
  try {
    const { c } = db.prepare('SELECT COUNT(*) as c FROM categories').get();
    if (c === 0) {
      console.log('[QuizCraft] Empty DB detected on cold start – seeding…');
      // Run seed inline to reuse the same db connection
      const bcrypt = require('bcryptjs');

      db.exec('PRAGMA foreign_keys = OFF;');
      db.exec('DELETE FROM attempt_answers;');
      db.exec('DELETE FROM attempts;');
      db.exec('DELETE FROM questions;');
      db.exec('DELETE FROM quizzes;');
      db.exec('DELETE FROM categories;');
      db.exec('DELETE FROM users;');
      db.exec('PRAGMA foreign_keys = ON;');

      // Load and run full seed data by executing the seed module
      // We reset module cache so it re-runs with the shared db module
      delete require.cache[require.resolve('../database/seed')];
      require('../database/seed');

      console.log('[QuizCraft] Seeding complete.');
    }
  } catch (e) {
    console.error('[QuizCraft] Seed error:', e.message);
  }
})();

// Routes
const authRoutes = require('../routes/authRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const quizRoutes = require('../routes/quizRoutes');
const attemptRoutes = require('../routes/attemptRoutes');
const userRoutes = require('../routes/userRoutes');

const app = express();

// CORS – allow all Vercel preview URLs and localhost
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server / curl
    const ok = !origin || /vercel\.app$/.test(origin) || /localhost/.test(origin);
    callback(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health
app.get('/api/health', (_req, res) =>
  res.json({ status: 'online', platform: 'QuizCraft API', timestamp: new Date().toISOString() })
);

// API
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes',    quizRoutes);
app.use('/api/attempts',   attemptRoutes);
app.use('/api/users',      userRoutes);

app.use('/api/*', (_req, res) => res.status(404).json({ message: 'API route not found.' }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;
