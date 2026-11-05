import React from 'react';

export default function ProtectedRoute({ user, onNavigate, children }) {
  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="empty-state">
          <span className="empty-state-icon">🔒</span>
          <h3>Access Restricted</h3>
          <p>You need to be logged into your QuizCraft student account to access this page.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('login')}>
              Log In
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('register')}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
