import React from 'react';

export default function ProgressBar({ value = 0, max = 100, height = 8 }) {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));

  return (
    <div className="progress-track" style={{ height: `${height}px` }}>
      <div 
        className="progress-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
