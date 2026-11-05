import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.user);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('alex@quizcraft.edu');
    setPassword('Password123!');
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Log in to continue your learning journey on QuizCraft.</p>
        </div>

        {/* Demo Account Quick-Fill Helper for College Presentation */}
        <div className="demo-credentials-box">
          <p><strong>Demo Student Account:</strong></p>
          <p>Email: <code>alex@quizcraft.edu</code></p>
          <p>Password: <code>Password123!</code></p>
          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={fillDemoCredentials}
          >
            Auto-Fill Demo Credentials
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input 
              id="login-email"
              type="email" 
              className="form-input" 
              placeholder="e.g. alex@quizcraft.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input 
              id="login-password"
              type="password" 
              className="form-input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <button onClick={() => onNavigate('register')}>Register now</button>
        </div>
      </div>
    </div>
  );
}
