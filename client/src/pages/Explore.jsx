import React, { useState, useEffect } from 'react';
import QuizCard from '../components/QuizCard';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Explore({ initialCategory = 'All', onNavigate }) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const catData = await api.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch quizzes whenever category, difficulty or search changes
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        const data = await api.getQuizzes({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          search: searchTerm
        });
        setQuizzes(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch quizzes.');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchQuizzes();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const handleStartQuiz = (quizId) => {
    onNavigate('instructions', { quizId });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchTerm('');
  };

  return (
    <div className="container fade-in">
      <div className="explore-header">
        <h1>Explore Tech Quizzes</h1>
        <p>Choose from 18+ comprehensive quizzes across computer science and engineering disciplines.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search quizzes by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchTerm.trim() !== '') && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Quick Category Pills */}
      <div className="category-pills">
        <button 
          className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          ✨ All Disciplines
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <Loading message="Filtering quizzes..." />
      ) : quizzes.length > 0 ? (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onStartQuiz={handleStartQuiz} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>No Quizzes Found</h3>
          <p>We couldn't find any quizzes matching your search or active filters. Try adjusting your criteria.</p>
          <button 
            className="btn btn-primary"
            onClick={handleResetFilters}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
