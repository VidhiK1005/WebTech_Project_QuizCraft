import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import CSS Design System in recommended cascading order
import './styles/global.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/home.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/explore.css';
import './styles/quiz.css';
import './styles/results.css';
import './styles/profile.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
