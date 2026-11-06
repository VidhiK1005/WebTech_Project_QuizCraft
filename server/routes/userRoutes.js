const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET /api/users/:id - User profile information
router.get('/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
});

// GET /api/users/:id/stats - Real calculated statistics
router.get('/:id/stats', (req, res) => {
  try {
    const userId = req.params.id;

    // Aggregated stats from attempts table
    const aggregate = db.prepare(`
      SELECT 
        COUNT(id) as quizzes_completed,
        ROUND(AVG(percentage), 1) as avg_score,
        ROUND(MAX(percentage), 1) as best_score,
        SUM(total_questions) as total_questions_answered
      FROM attempts
      WHERE user_id = ?
    `).get(userId);

    // Category progress
    const categoryProgress = db.prepare(`
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.icon as category_icon,
        COUNT(DISTINCT a.quiz_id) as quizzes_taken,
        (SELECT COUNT(id) FROM quizzes WHERE category_id = c.id) as total_quizzes,
        ROUND(AVG(a.percentage), 1) as avg_category_score
      FROM categories c
      LEFT JOIN quizzes q ON c.id = q.category_id
      LEFT JOIN attempts a ON q.id = a.quiz_id AND a.user_id = ?
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all(userId);

    // Recent attempts (last 5)
    const recentAttempts = db.prepare(`
      SELECT 
        a.id,
        a.quiz_id,
        q.title as quiz_title,
        c.name as category_name,
        q.difficulty,
        a.score,
        a.total_questions,
        a.percentage,
        a.completed_at
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.completed_at DESC
      LIMIT 5
    `).all(userId);

    res.json({
      quizzesCompleted: aggregate.quizzes_completed || 0,
      averageScore: aggregate.avg_score !== null ? aggregate.avg_score : 0,
      bestScore: aggregate.best_score !== null ? aggregate.best_score : 0,
      totalQuestionsAnswered: aggregate.total_questions_answered || 0,
      categoryProgress,
      recentAttempts
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Failed to calculate user statistics.' });
  }
});

// GET /api/users/:userId/attempts - Complete attempt history
router.get('/:userId/attempts', (req, res) => {
  try {
    const userId = req.params.userId;

    const attempts = db.prepare(`
      SELECT 
        a.id,
        a.quiz_id,
        q.title as quiz_title,
        c.name as category_name,
        c.icon as category_icon,
        q.difficulty,
        a.score,
        a.total_questions,
        a.percentage,
        a.started_at,
        a.completed_at
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.completed_at DESC
    `).all(userId);

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ message: 'Failed to retrieve quiz history.' });
  }
});

module.exports = router;
