import React from 'react';

export default function StatCard({ title, value, icon, color = 'var(--primary)' }) {
  return (
    <div className="stat-card">
      <div 
        className="stat-icon-wrapper" 
        style={{ 
          backgroundColor: `${color}15`, 
          color: color 
        }}
      >
        <span>{icon}</span>
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
}
