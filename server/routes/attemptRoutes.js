const express = require('express');
const db = require('../database/db');

const router = express.Router();

// POST /api/attempts - Submit and score a quiz attempt
router.post('/', (req, res) => {
  try {
    const { userId, quizId, answers, startedAt } = req.body;

    if (!userId || !quizId) {
      return res.status(400).json({ message: 'User ID and Quiz ID are required.' });
    }

    // Verify quiz exists and fetch its official questions with correct answers
    const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const officialQuestions = db.prepare(`
      SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
    `).all(quizId);

    const totalQuestions = officialQuestions.length;
    let score = 0;

    // Build map of user's answers: { questionId: selectedOption }
    const userAnswersMap = {};
    if (answers && typeof answers === 'object') {
      Object.keys(answers).forEach(qId => {
        userAnswersMap[qId] = answers[qId];
      });
    }

    // Calculate score and review breakdown
    const breakdown = officialQuestions.map(q => {
      const selected = userAnswersMap[q.id] || null;
      const isCorrect = (selected !== null && selected.toUpperCase() === q.correct_answer.toUpperCase()) ? 1 : 0;
      if (isCorrect) {
        score++;
      }
      return {
        questionId: q.id,
        selectedAnswer: selected,
        correctAnswer: q.correct_answer,
        isCorrect
      };
    });

    const percentage = totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(1)) : 0;

    // Insert attempt into database
    const insertAttemptStmt = db.prepare(`
      INSERT INTO attempts (user_id, quiz_id, score, total_questions, percentage, started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, COALESCE(?, datetime('now')), datetime('now'))
    `);

    const result = insertAttemptStmt.run(userId, quizId, score, totalQuestions, percentage, startedAt || null);
    const attemptId = result.lastInsertRowid;

    // Insert each question's answer in attempt_answers
    const insertAnswerStmt = db.prepare(`
      INSERT INTO attempt_answers (attempt_id, question_id, selected_answer, correct_answer, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of breakdown) {
      insertAnswerStmt.run(attemptId, item.questionId, item.selectedAnswer, item.correctAnswer, item.isCorrect);
    }

    return res.status(201).json({
      message: 'Quiz submitted successfully!',
      attemptId,
      score,
      totalQuestions,
      percentage,
      quizTitle: quiz.title
    });
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    res.status(500).json({ message: 'Failed to record quiz submission.' });
  }
});

// GET /api/attempts/:id - Full details of an attempt with question breakdowns & explanations
router.get('/:id', (req, res) => {
  try {
    const attemptId = req.params.id;

    const attempt = db.prepare(`
      SELECT 
        a.id,
        a.user_id,
        a.quiz_id,
        q.title as quiz_title,
        c.name as category_name,
        q.difficulty,
        a.score,
        a.total_questions,
        a.percentage,
        a.started_at,
        a.completed_at
      FROM attempts a
      JOIN quizzes q ON a.quiz_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE a.id = ?
    `).get(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt record not found.' });
    }

    // Get individual answer breakdown
    const answers = db.prepare(`
      SELECT 
        aa.id,
        aa.question_id,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        aa.selected_answer,
        aa.correct_answer,
        aa.is_correct,
        q.explanation
      FROM attempt_answers aa
      JOIN questions q ON aa.question_id = q.id
      WHERE aa.attempt_id = ?
      ORDER BY aa.id ASC
    `).all(attemptId);

    res.json({
      ...attempt,
      answers
    });
  } catch (error) {
    console.error('Error fetching attempt details:', error);
    res.status(500).json({ message: 'Failed to retrieve attempt details.' });
  }
});

module.exports = router;
