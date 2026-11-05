import React from 'react';

export default function CategoryCard({ category, onSelect }) {
  const getIconEmoji = (icon) => {
    switch (icon) {
      case 'code': return '💻';
      case 'globe': return '🌐';
      case 'database': return '🗄️';
      case 'calculator': return '📐';
      case 'network': return '🔗';
      case 'lightbulb': return '💡';
      default: return '📚';
    }
  };

  return (
    <div 
      className="card" 
      style={{ padding: '1.75rem', cursor: 'pointer' }}
      onClick={() => onSelect && onSelect(category.name)}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1rem'
      }}>
        {getIconEmoji(category.icon)}
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{category.name}</h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem', minHeight: '42px' }}>
        {category.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
          {category.quiz_count ? `${category.quiz_count} Quizzes` : 'Explore'}
        </span>
        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>→</span>
      </div>
    </div>
  );
}
