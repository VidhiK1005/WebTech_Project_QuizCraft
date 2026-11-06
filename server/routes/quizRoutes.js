const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET /api/quizzes - List quizzes with optional filters (category, difficulty, search)
router.get('/', (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let query = `
      SELECT 
        q.id, 
        q.category_id, 
        c.name as category_name, 
        c.icon as category_icon,
        q.title, 
        q.description, 
        q.difficulty, 
        q.duration, 
        q.question_count
      FROM quizzes q
      JOIN categories c ON q.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ' AND (c.name = ? OR q.category_id = ?)';
      params.push(category, category);
    }

    if (difficulty && difficulty !== 'All') {
      query += ' AND q.difficulty = ?';
      params.push(difficulty);
    }

    if (search && search.trim() !== '') {
      query += ' AND (q.title LIKE ? OR q.description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY q.id ASC';

    const quizzes = db.prepare(query).all(...params);
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
});

// GET /api/quizzes/category/:categoryId
router.get('/category/:categoryId', (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const quizzes = db.prepare(`
      SELECT 
        q.id, 
        q.category_id, 
        c.name as category_name, 
        c.icon as category_icon,
        q.title, 
        q.description, 
        q.difficulty, 
        q.duration, 
        q.question_count
      FROM quizzes q
      JOIN categories c ON q.category_id = c.id
      WHERE q.category_id = ?
      ORDER BY q.id ASC
    `).all(categoryId);

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching category quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes for this category.' });
  }
});

// GET /api/quizzes/:id - Quiz details with questions (answers omitted for live quiz attempt)
router.get('/:id', (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = db.prepare(`
      SELECT 
        q.id, 
        q.category_id, 
        c.name as category_name, 
        c.icon as category_icon,
        q.title, 
        q.description, 
        q.difficulty, 
        q.duration, 
        q.question_count
      FROM quizzes q
      JOIN categories c ON q.category_id = c.id
      WHERE q.id = ?
    `).get(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Include questions for taking the quiz
    const questions = db.prepare(`
      SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
    `).all(quizId);

    res.json({
      ...quiz,
      questions
    });
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ message: 'Failed to load quiz details.' });
  }
});

module.exports = router;
