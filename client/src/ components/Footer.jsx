import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>QuizCraft</h3>
            <p>
              Learn. Play. Challenge Yourself. A modern, engaging educational platform engineered for college learners and competitive tech enthusiasts.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><button onClick={() => onNavigate('home')}>Home</button></li>
              <li><button onClick={() => onNavigate('explore')}>Explore Quizzes</button></li>
              <li><button onClick={() => onNavigate('dashboard')}>Dashboard</button></li>
              <li><button onClick={() => onNavigate('history')}>Quiz History</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Topics</h4>
            <ul>
              <li><button onClick={() => onNavigate('explore', { category: 'Programming' })}>Programming</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Web Development' })}>Web Development</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Database Management' })}>Databases</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'Computer Networks' })}>Networks & Security</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Student Project</h4>
            <ul>
              <li><span>Full-Stack Web Tech</span></li>
              <li><span>React • Express • SQLite</span></li>
              <li><span>NPTEL Ref Integration</span></li>
              <li><span>College Demonstration</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} QuizCraft Web Application. All rights reserved.</p>
          <p>Built with React & Express</p>
        </div>
      </div>
    </footer>
  );
}
