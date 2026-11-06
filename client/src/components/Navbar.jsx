import React, { useState } from 'react';

export default function Navbar({ activePage, onNavigate, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <div className="brand-icon">Q</div>
          <span className="brand-name">
            Quiz<span className="brand-highlight">Craft</span>
          </span>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="navbar-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-nav">
            <li>
              <button 
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activePage === 'explore' ? 'active' : ''}`}
                onClick={() => handleNavClick('explore')}
              >
                Explore
              </button>
            </li>
            {user && (
              <>
                <li>
                  <button 
                    className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleNavClick('dashboard')}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activePage === 'history' ? 'active' : ''}`}
                    onClick={() => handleNavClick('history')}
                  >
                    History
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
                    onClick={() => handleNavClick('profile')}
                  >
                    Profile
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className="navbar-auth">
            {user ? (
              <>
                <span className="user-greeting">👋 {user.name}</span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleNavClick('login')}
                >
                  Log In
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleNavClick('register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
