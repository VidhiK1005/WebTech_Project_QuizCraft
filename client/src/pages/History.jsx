import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../services/api';

export default function History({ user, onNavigate }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await api.getUserAttempts(user.id);
        setAttempts(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve quiz history.');
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  if (loading) return <Loading message="Loading your quiz attempt history..." />;

  return (
    <div className="container fade-in">
      <div className="profile-header">
        <h1>Quiz History</h1>
        <p>Review all your past quiz submissions, timestamps, and answer breakdowns.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {attempts && attempts.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>
                    <strong>{attempt.quiz_title}</strong>
                  </td>
                  <td>
                    <span className="badge badge-category">{attempt.category_name}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${attempt.difficulty?.toLowerCase()}`}>
                      {attempt.difficulty}
                    </span>
                  </td>
                  <td>
                    <strong>{attempt.score}</strong> / {attempt.total_questions}
                  </td>
                  <td>
                    <span style={{ 
                      fontWeight: 800, 
                      color: attempt.percentage >= 70 ? 'var(--success)' : 'var(--warning)' 
                    }}>
                      {attempt.percentage}%
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(attempt.completed_at).toLocaleString()}
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('review', { attemptId: attempt.id })}
                    >
                      Review Answers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">📜</span>
          <h3>You haven't attempted any quizzes yet</h3>
          <p>Explore our library of computer science and technology quizzes to test your knowledge.</p>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('explore')}
          >
            Explore Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
