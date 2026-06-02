// ============================================================
// USER PROFILE PAGE - View profile, stats, settings
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ listings: 0, favorites: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user info
      const userRes = await fetch(`${API}/api/get_user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      setUser(userData);
      
      // Fetch user stats
      const statsRes = await fetch(`${API}/api/user_stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ['token', 'username', 'user_id', 'is_admin', 'is_verified'].forEach(k => localStorage.removeItem(k));
    navigate('/signin');
  };

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            background: '#1A1A3E', 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '2px solid #F5D200'
          }}>
            👤
          </div>
          <h1 style={{ color: '#F5D200' }}>{user?.username}</h1>
          <p style={{ color: 'rgba(255,255,255,.6)' }}>{user?.email}</p>
          {user?.is_verified === 1 && (
            <span style={{ 
              display: 'inline-block', 
              background: 'rgba(76,175,80,.2)', 
              color: '#4CAF50', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.7rem',
              marginTop: '8px'
            }}>
              ✅ Verified Account
            </span>
          )}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1A1A3E', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #2E2E5E' }}>
            <div style={{ fontSize: '1.5rem', color: '#F5D200' }}>{stats.listings}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Listings</div>
          </div>
          <div style={{ background: '#1A1A3E', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #2E2E5E' }}>
            <div style={{ fontSize: '1.5rem', color: '#F5D200' }}>{stats.favorites}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Favorites</div>
          </div>
          <div style={{ background: '#1A1A3E', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #2E2E5E' }}>
            <div style={{ fontSize: '1.5rem', color: '#F5D200' }}>{stats.bookings}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>Bookings</div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1rem', border: '1px solid #2E2E5E', marginBottom: '1rem' }}>
          <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📱 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/my-bookings" style={{ color: 'white', textDecoration: 'none', padding: '8px', background: '#0D0D2B', borderRadius: '8px' }}>📅 My Bookings</Link>
            <Link to="/favorites" style={{ color: 'white', textDecoration: 'none', padding: '8px', background: '#0D0D2B', borderRadius: '8px' }}>❤️ My Favorites</Link>
            <Link to="/add-property" style={{ color: 'white', textDecoration: 'none', padding: '8px', background: '#0D0D2B', borderRadius: '8px' }}>➕ List a Property</Link>
            <Link to="/chat" style={{ color: 'white', textDecoration: 'none', padding: '8px', background: '#0D0D2B', borderRadius: '8px' }}>💬 Messages</Link>
          </div>
        </div>

        {/* Settings */}
        <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1rem', border: '1px solid #2E2E5E' }}>
          <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>⚙️ Settings</h3>
          <button 
            onClick={logout}
            style={{
              width: '100%',
              padding: '12px',
              background: '#E63030',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}