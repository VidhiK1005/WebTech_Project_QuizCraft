import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Results({ attemptId, onNavigate }) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAttempt() {
      try {
        setLoading(true);
        const data = await api.getAttemptById(attemptId);
        setAttempt(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve quiz results.');
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadAttempt();
    }
  }, [attemptId]);

  if (loading) return <Loading message="Loading quiz results..." />;

  if (error || !attempt) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state-icon">⚠️</span>
          <h3>Result Not Found</h3>
          <p>{error || 'Unable to locate attempt score.'}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { score, total_questions, percentage, quiz_title, quiz_id } = attempt;
  const incorrectCount = total_questions - score;

  // Performance Evaluation Message
  const getFeedback = (pct) => {
    if (pct >= 90) return { title: 'Excellent!', msg: 'Outstanding mastery of the material! Keep pushing your boundaries.', icon: '🏆', type: 'success' };
    if (pct >= 70) return { title: 'Great Job!', msg: 'Solid conceptual understanding demonstrated.', icon: '🎉', type: 'success' };
    if (pct >= 50) return { title: 'Good Effort!', msg: 'You passed! A quick review of the explanations will solidify your knowledge.', icon: '👍', type: 'warning' };
    return { title: 'Keep Practicing!', msg: 'Do not be discouraged. Review the answers below to learn the correct concepts.', icon: '💪', type: 'warning' };
  };

  const feedback = getFeedback(percentage);

  return (
    <div className="container fade-in">
      <div className="results-card">
        <div className={`results-icon ${feedback.type}`}>
          {feedback.icon}
        </div>

        <div className="results-badge-wrapper">
          <span className="badge badge-category">{attempt.category_name}</span>
        </div>

        <h1>{feedback.title}</h1>
        <p className="results-feedback-msg" style={{ color: 'var(--text-muted)' }}>
          {feedback.msg}
        </p>

        {/* Big Score Visual */}
        <div className="score-circle-display">
          <div className="score-main-number">{score} / {total_questions}</div>
          <div className="score-percentage">{percentage}% Score</div>
        </div>

        {/* Breakdown Row */}
        <div className="results-stats-row">
          <div className="res-stat-item">
            <h4 style={{ color: 'var(--success)' }}>{score}</h4>
            <p>Correct</p>
          </div>
          <div className="res-stat-item">
            <h4 style={{ color: 'var(--error)' }}>{incorrectCount}</h4>
            <p>Incorrect</p>
          </div>
          <div className="res-stat-item">
            <h4 style={{ color: 'var(--primary)' }}>{total_questions}</h4>
            <p>Total</p>
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('review', { attemptId: attempt.id })}
          >
            Review Answers & Explanations 📖
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('instructions', { quizId })}
          >
            Try Again 🔄
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard 📊
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('explore')}
          >
            Explore More Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}
