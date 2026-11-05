import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import api from '../services/api';

export default function Profile({ user, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfileAndStats() {
      if (!user) return;
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          api.getUserProfile(user.id),
          api.getUserStats(user.id)
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    }

    loadProfileAndStats();
  }, [user]);

  if (loading) return <Loading message="Loading profile information..." />;

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="container fade-in">
      <div className="profile-header">
        <h1>Student Profile</h1>
        <p>Manage your account credentials and inspect your overall academic statistics.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Profile Info Header Card */}
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <h2>{profile?.name || user?.name}</h2>
          <p>{profile?.email || user?.email}</p>
          <span className="profile-joined">
            Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <h3 style={{ marginBottom: '1.25rem' }}>Learning Statistics</h3>
      <div className="stats-grid">
        <StatCard 
          title="Quizzes Completed" 
          value={stats?.quizzesCompleted ?? 0} 
          icon="🎓" 
          color="#635BFF" 
        />
        <StatCard 
          title="Average Score" 
          value={`${stats?.averageScore ?? 0}%`} 
          icon="📊" 
          color="#22C55E" 
        />
        <StatCard 
          title="Best Score" 
          value={`${stats?.bestScore ?? 0}%`} 
          icon="🌟" 
          color="#F59E0B" 
        />
        <StatCard 
          title="Questions Solved" 
          value={stats?.totalQuestionsAnswered ?? 0} 
          icon="✅" 
          color="#60A5FA" 
        />
      </div>

      {/* Quick Navigation Actions */}
      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('explore')}
          >
            Take Another Quiz
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => onNavigate('history')}
          >
            View Complete Quiz History
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
