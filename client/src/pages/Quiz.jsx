import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Quiz({ quizId, user, onNavigate }) {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const startTimeRef = useRef(new Date().toISOString());
  const timerRef = useRef(null);
  const isSubmittedRef = useRef(false);

  // 1. Fetch Quiz Data
  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);
        const data = await api.getQuizById(quizId);
        setQuiz(data);
        setQuestions(data.questions || []);
        setTimeLeft(data.duration || 300);
      } catch (err) {
        setError(err.message || 'Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (loading || !quiz || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, quiz]);

  // Handle Answer Selection
  const handleSelectOption = (optionLetter) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionLetter
    }));
  };

  // Submit Quiz Action (Auto or Manual)
  const handleSubmitQuiz = async () => {
    if (isSubmittedRef.current || submitting) return;
    isSubmittedRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: user ? user.id : 1, // Fallback demo user id if not logged in
        quizId: quiz.id,
        answers: selectedAnswers,
        startedAt: startTimeRef.current
      };

      const result = await api.submitAttempt(payload);
      onNavigate('results', { attemptId: result.attemptId });
    } catch (err) {
      setError(err.message || 'Error submitting your quiz attempt.');
      setSubmitting(false);
      isSubmittedRef.current = false;
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your quiz automatically.');
    handleSubmitQuiz();
  };

  // Navigation Handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) return <Loading message="Preparing your quiz session..." />;
  if (submitting) return <Loading message="Evaluating answers and generating score report..." />;

  if (error || !quiz || questions.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state-icon">⚠️</span>
          <h3>Quiz Could Not Be Loaded</h3>
          <p>{error || 'No questions available for this quiz.'}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('explore')}>
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentQ?.id] || null;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Format Time Remaining (MM:SS)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeWarning = timeLeft < 60;

  return (
    <div className="container fade-in">
      <div className="quiz-layout">
        {/* Top Header Bar */}
        <div className="quiz-header-bar">
          <div className="quiz-meta-info">
            <h2>{quiz.title}</h2>
            <div className="quiz-meta-sub">
              {quiz.category_name} • {quiz.difficulty} Level
            </div>
          </div>

          {/* Timer */}
          <div className={`timer-container ${isTimeWarning ? 'warning' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formattedTime}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-section">
          <div className="quiz-progress-text">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{answeredCount} of {questions.length} Answered</span>
          </div>
          <ProgressBar value={currentIndex + 1} max={questions.length} height={8} />
        </div>

        {/* Question Card */}
        <div className="question-card">
          <span className="question-number-pill">
            Question #{currentIndex + 1}
          </span>
          <h3 className="question-heading">
            {currentQ.question_text}
          </h3>

          {/* Options */}
          <div className="options-list">
            {[
              { letter: 'A', text: currentQ.option_a },
              { letter: 'B', text: currentQ.option_b },
              { letter: 'C', text: currentQ.option_c },
              { letter: 'D', text: currentQ.option_d }
            ].map(({ letter, text }) => (
              <button
                key={letter}
                type="button"
                className={`option-button ${currentAnswer === letter ? 'selected' : ''}`}
                onClick={() => handleSelectOption(letter)}
              >
                <div className="option-circle">{letter}</div>
                <div>{text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Control Buttons */}
        <div className="quiz-controls">
          <button 
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentIndex < questions.length - 1 ? (
              <button 
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next Question →
              </button>
            ) : (
              <button 
                className="btn btn-success"
                onClick={handleSubmitQuiz}
              >
                Submit Quiz ✓
              </button>
            )}
          </div>
        </div>

        {/* Question Selector Dots for Quick Navigation */}
        <div className="question-dots-card">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
            Jump to Question:
          </span>
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isActive = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                className={`question-dot ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
