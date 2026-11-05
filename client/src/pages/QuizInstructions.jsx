import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../services/api';

export default function QuizInstructions({ quizId, onNavigate }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const data = await api.getQuizById(quizId);
        setQuiz(data);
      } catch (err) {
        setError(err.message || 'Failed to load quiz details.');
      } finally {
        setLoading(false);
      }
    }
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (loading) return <Loading message="Loading quiz instructions..." />;
  if (error || !quiz) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state-icon">⚠️</span>
          <h3>Quiz Not Available</h3>
          <p>{error || 'The requested quiz could not be found.'}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('explore')}>
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const formatMinutes = (sec) => Math.floor(sec / 60);

  return (
    <div className="container fade-in" style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <div className="card" style={{ padding: '3rem 2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span className="badge badge-category">{quiz.category_name}</span>
          <span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{quiz.title}</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          {quiz.description}
        </p>

        {/* Quick Parameters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          backgroundColor: 'var(--background)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {quiz.question_count || (quiz.questions ? quiz.questions.length : 5)}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Questions
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatMinutes(quiz.duration)} Mins
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Duration
            </div>
          </div>

          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              Passing
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              60% Score
            </div>
          </div>
        </div>

        {/* Official Rules & Instructions */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Important Quiz Guidelines</h3>
        <ul style={{
          paddingLeft: '1.5rem',
          marginBottom: '2.5rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <li>Each question has exactly <strong>one correct answer</strong>.</li>
          <li>Select the best answer choice among options A, B, C, or D.</li>
          <li>You are free to navigate back and forth between questions using the <strong>Previous</strong> and <strong>Next</strong> controls.</li>
          <li>A countdown timer will run during the quiz. When time expires, your answers will be <strong>automatically submitted</strong>.</li>
          <li>You can manually click <strong>Submit Quiz</strong> at any time once you are satisfied with your answers.</li>
          <li>After submission, you will immediately receive your final score, percentage, and detailed question-by-question explanations.</li>
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate('explore')}
          >
            ← Back to Explore
          </button>

          <button 
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('quiz', { quizId: quiz.id })}
          >
            Start Quiz Now 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
