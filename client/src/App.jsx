import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import QuizInstructions from './pages/QuizInstructions';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Review from './pages/Review';
import Profile from './pages/Profile';
import History from './pages/History';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('quizcraft_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Navigate Handler
  const handleNavigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('quizcraft_user', JSON.stringify(userData));
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('quizcraft_user');
    handleNavigate('home');
  };

  return (
    <>
      <Navbar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className="main-content">
        {activePage === 'home' && (
          <Home onNavigate={handleNavigate} user={user} />
        )}

        {activePage === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        )}

        {activePage === 'register' && (
          <Register onRegisterSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        )}

        {activePage === 'explore' && (
          <Explore 
            initialCategory={pageParams.category || 'All'} 
            onNavigate={handleNavigate} 
          />
        )}

        {activePage === 'instructions' && (
          <QuizInstructions 
            quizId={pageParams.quizId} 
            onNavigate={handleNavigate} 
          />
        )}

        {activePage === 'quiz' && (
          <Quiz 
            quizId={pageParams.quizId} 
            user={user} 
            onNavigate={handleNavigate} 
          />
        )}

        {activePage === 'results' && (
          <Results 
            attemptId={pageParams.attemptId} 
            onNavigate={handleNavigate} 
          />
        )}

        {activePage === 'review' && (
          <Review 
            attemptId={pageParams.attemptId} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* Protected Routes: require student login */}
        {activePage === 'dashboard' && (
          <ProtectedRoute user={user} onNavigate={handleNavigate}>
            <Dashboard user={user} onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}

        {activePage === 'history' && (
          <ProtectedRoute user={user} onNavigate={handleNavigate}>
            <History user={user} onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}

        {activePage === 'profile' && (
          <ProtectedRoute user={user} onNavigate={handleNavigate}>
            <Profile user={user} onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </>
  );
}
