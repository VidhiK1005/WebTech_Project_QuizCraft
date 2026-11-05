import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import api from '../services/api';

export default function Home({ onNavigate, user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load home categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>✨</span> Next-Gen Interactive Tech Learning
          </div>
          <h1 className="hero-title">
            Learn. Play. <span className="hero-highlight">Challenge Yourself.</span>
          </h1>
          <p className="hero-subtitle">
            Master computer science, software engineering, databases, and foundational cybersecurity through timed, conceptual quizzes with comprehensive explanations.
          </p>
          <div className="hero-cta">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate(user ? 'dashboard' : 'register')}
            >
              {user ? 'Go to Dashboard' : 'Start Learning Free'}
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('explore')}
            >
              Explore Quizzes
            </button>
          </div>

          {/* Platform Highlight Stats */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">6+</div>
              <div className="stat-label">Core Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">18+</div>
              <div className="stat-label">Curated Quizzes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">90+</div>
              <div className="stat-label">MCQ Challenges</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Detailed Explanations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Explore Topics</span>
            <h2 className="section-title">Knowledge Across Computer Science</h2>
            <p>From algorithmic problem solving and web tech to cybersecurity reconnaissance.</p>
          </div>

          <div className="category-preview-grid">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                category={cat} 
                onSelect={(catName) => onNavigate('explore', { category: catName })} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* How QuizCraft Works */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">A Proven Framework for Mastery</h2>
            <p>Designed to help you evaluate your knowledge and retain technical concepts.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-badge">1</div>
              <h4>Pick Your Domain</h4>
              <p>Choose from Programming, Web Development, Databases, Networks, or Cyber Security.</p>
            </div>
            <div className="step-card">
              <div className="step-badge">2</div>
              <h4>Take Timed Quizzes</h4>
              <p>Tackle interactive questions under realistic countdown pressure with auto-submission.</p>
            </div>
            <div className="step-card">
              <div className="step-badge">3</div>
              <h4>Review & Retain</h4>
              <p>Analyze mistakes instantly with deep explanations and monitor your profile growth over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Built for Serious Learners</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">⏱️</div>
              <h3>Real-Time Countdown</h3>
              <p>Practice time-management skills with automatic timers that submit your work when time expires.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">📊</div>
              <h3>Live Learning Analytics</h3>
              <p>Track your quizzes completed, average score, category proficiencies, and recent historical attempts.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">💡</div>
              <h3>In-Depth Answer Review</h3>
              <p>Review every question with immediate feedback, clear correct answers, and thorough technical rationales.</p>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="cta-banner">
            <h2>Ready to Test Your Tech Skills?</h2>
            <p>Join QuizCraft today, challenge yourself with high-yield quizzes, and track your progress.</p>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate(user ? 'explore' : 'register')}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
