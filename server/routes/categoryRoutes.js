const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET /api/categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(q.id) as quiz_count
      FROM categories c
      LEFT JOIN quizzes q ON c.id = q.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

module.exports = router;
