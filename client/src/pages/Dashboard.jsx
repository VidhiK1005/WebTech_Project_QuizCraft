import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Dashboard({ user, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await api.getUserStats(user.id);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (loading) return <Loading message="Loading your student dashboard..." />;

  const getEmojiForCategory = (name) => {
    switch (name) {
      case 'Programming': return '💻';
      case 'Web Development': return '🌐';
      case 'Database Management': return '🗄️';
      case 'Mathematics': return '📐';
      case 'Computer Networks': return '🔗';
      case 'General Knowledge': return '💡';
      default: return '📚';
    }
  };

  return (
    <div className="container fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user.name}!</h1>
          <p>Here is an overview of your quiz performance and learning progress.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('explore')}
        >
          Explore New Quizzes
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* 4 Key Statistics Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Quizzes Completed" 
          value={stats?.quizzesCompleted ?? 0} 
          icon="🏆" 
          color="#635BFF" 
        />
        <StatCard 
          title="Average Score" 
          value={`${stats?.averageScore ?? 0}%`} 
          icon="📈" 
          color="#22C55E" 
        />
        <StatCard 
          title="Best Score" 
          value={`${stats?.bestScore ?? 0}%`} 
          icon="⭐" 
          color="#F59E0B" 
        />
        <StatCard 
          title="Questions Answered" 
          value={stats?.totalQuestionsAnswered ?? 0} 
          icon="🎯" 
          color="#60A5FA" 
        />
      </div>

      {/* Main Grid: Recent Attempts & Category Progress */}
      <div className="dashboard-main-grid">
        {/* Left Column: Recent Attempts */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Recent Quiz Attempts</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('history')}
            >
              View Full History
            </button>
          </div>

          {stats?.recentAttempts && stats.recentAttempts.length > 0 ? (
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <td>
                      <strong>{attempt.quiz_title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-category">{attempt.category_name}</span>
                    </td>
                    <td>
                      {attempt.score} / {attempt.total_questions}
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: attempt.percentage >= 70 ? 'var(--success)' : 'var(--warning)' 
                      }}>
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onNavigate('review', { attemptId: attempt.id })}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <span className="empty-state-icon">📝</span>
              <h3>No Quizzes Attempted Yet</h3>
              <p>Take your first quiz to begin populating your performance metrics!</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('explore')}
              >
                Browse Quizzes
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Category Mastery Progress */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Domain Progress</h3>
          </div>

          {stats?.categoryProgress && stats.categoryProgress.map((cat) => {
            const completedCount = cat.quizzes_taken || 0;
            const totalCount = cat.total_quizzes || 3;
            const progressPercent = Math.round((completedCount / totalCount) * 100);

            return (
              <div key={cat.category_id} className="cat-progress-item">
                <div className="cat-progress-header">
                  <span>
                    {getEmojiForCategory(cat.category_name)} {cat.category_name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {completedCount} of {totalCount} completed ({progressPercent}%)
                  </span>
                </div>
                <ProgressBar value={completedCount} max={totalCount} height={7} />
              </div>
            );
          })}

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <button 
              className="btn btn-outline" 
              style={{ width: '100%' }}
              onClick={() => onNavigate('explore')}
            >
              Continue Next Domain →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
