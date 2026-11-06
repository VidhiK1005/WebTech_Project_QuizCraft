const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

// Use DB_PATH env var (set to /tmp/quizcraft.db on Vercel) or default local path
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'quizcraft.db');

// Ensure database file directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Enable foreign key constraints and WAL mode for reliability
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize schema if not present
const schemaPath = path.resolve(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

module.exports = db;
