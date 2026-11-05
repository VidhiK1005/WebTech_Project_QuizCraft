import React from 'react';

export default function QuizCard({ quiz, onStartQuiz }) {
  const getDifficultyBadgeClass = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge badge-easy';
      case 'Medium': return 'badge badge-medium';
      case 'Hard': return 'badge badge-hard';
      default: return 'badge';
    }
  };

  const formatMinutes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins > 1 ? 's' : ''}`;
  };

  return (
    <div className="quiz-card">
      <div>
        <div className="quiz-card-top">
          <span className="badge badge-category">{quiz.category_name}</span>
          <span className={getDifficultyBadgeClass(quiz.difficulty)}>{quiz.difficulty}</span>
        </div>
        <h3 className="quiz-card-title">{quiz.title}</h3>
        <p className="quiz-card-desc">{quiz.description}</p>
      </div>

      <div>
        <div className="quiz-card-meta">
          <div className="quiz-card-meta-item">
            <span>❓</span>
            <span>{quiz.question_count || 5} Questions</span>
          </div>
          <div className="quiz-card-meta-item">
            <span>⏱️</span>
            <span>{formatMinutes(quiz.duration)}</span>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onStartQuiz(quiz.id)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
