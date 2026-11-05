import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Review({ attemptId, onNavigate }) {
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
        setError(err.message || 'Failed to retrieve answer review.');
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadAttempt();
    }
  }, [attemptId]);

  if (loading) return <Loading message="Loading questions and detailed explanations..." />;

  if (error || !attempt) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state-icon">⚠️</span>
          <h3>Review Unavailable</h3>
          <p>{error || 'No review records found for this attempt.'}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { quiz_title, category_name, score, total_questions, percentage, answers } = attempt;

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Top Banner */}
      <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('results', { attemptId })}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Results
          </button>
          <h1>Answer Review</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {quiz_title} • {category_name} • Score: {score}/{total_questions} ({percentage}%)
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('explore')}
        >
          Explore More Quizzes
        </button>
      </div>

      {/* Review Questions List */}
      <div className="review-list">
        {answers.map((item, index) => {
          const isCorrect = item.is_correct === 1;
          const userSelected = item.selected_answer;
          const correctLetter = item.correct_answer;

          const options = [
            { letter: 'A', text: item.option_a },
            { letter: 'B', text: item.option_b },
            { letter: 'C', text: item.option_c },
            { letter: 'D', text: item.option_d }
          ];

          return (
            <div 
              key={item.id} 
              className={`review-item-card ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="review-card-top">
                <span className="badge badge-category">Question #{index + 1}</span>
                {isCorrect ? (
                  <span className="badge badge-easy">✓ Correct</span>
                ) : userSelected ? (
                  <span className="badge badge-hard">✗ Incorrect</span>
                ) : (
                  <span className="badge badge-medium">⚠️ Unanswered</span>
                )}
              </div>

              <h3 className="review-question-text">{item.question_text}</h3>

              {/* Options Breakdown */}
              <div className="review-options-grid">
                {options.map(({ letter, text }) => {
                  const isThisCorrect = letter === correctLetter;
                  const isThisUserSelected = letter === userSelected;

                  let optionClass = 'review-option';
                  let statusTag = null;

                  if (isThisCorrect && isThisUserSelected) {
                    optionClass += ' user-correct';
                    statusTag = <span>✓ Your Correct Answer</span>;
                  } else if (isThisUserSelected && !isThisCorrect) {
                    optionClass += ' user-wrong';
                    statusTag = <span>✗ Your Answer</span>;
                  } else if (isThisCorrect && !isThisUserSelected) {
                    optionClass += ' actual-correct';
                    statusTag = <span>✓ Correct Answer</span>;
                  }

                  return (
                    <div key={letter} className={optionClass}>
                      <div>
                        <strong>{letter}.</strong> {text}
                      </div>
                      {statusTag}
                    </div>
                  );
                })}
              </div>

              {/* Pedagogical Explanation */}
              <div className="review-explanation">
                <strong>💡 Concept Explanation:</strong>
                {item.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
