import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/signin');
    document.body.className = theme;
    localStorage.setItem('theme', theme);
    fetchUser();
  }, [theme]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API}/api/get_user/${localStorage.getItem('user_id')}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);
      try {
        const res = await fetch(`${API}/api/upload_profile_pic`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('profile_pic', data.url);
          setProfilePic(data.url);
        }
      } catch (error) {
        console.error('Error uploading profile pic:', error);
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '40px', color: 'var(--text)', textDecoration: 'none', marginBottom: '2rem' }}>← Back</Link>
        
        <h1 style={{ color: '#F5D200', marginBottom: '2rem' }}>⚙️ Settings</h1>

        {/* Profile Picture */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#E63030', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', overflow: 'hidden' }}>
            {profilePic ? <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </div>
          <label style={{ background: '#E63030', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'inline-block' }}>
            Upload Photo
            <input type="file" accept="image/*" onChange={handleProfilePicUpload} style={{ display: 'none' }} />
          </label>
          <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,.5)' }}>{user?.username}</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.4)' }}>{user?.email}</p>
        </div>

        {/* Theme Selector */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>🎨 Appearance</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setTheme('dark')} style={{ flex: 1, padding: '10px', background: theme === 'dark' ? '#E63030' : 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer' }}>🌙 Dark</button>
            <button onClick={() => setTheme('light')} style={{ flex: 1, padding: '10px', background: theme === 'light' ? '#E63030' : 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer' }}>☀️ Light</button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>🔔 Notifications</h3>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span>Push Notifications</span>
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ width: '40px', height: '20px', accentColor: '#E63030' }} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Email Alerts</span>
            <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} style={{ width: '40px', height: '20px', accentColor: '#E63030' }} />
          </label>
        </div>

        {/* Danger Zone */}
        <div style={{ background: 'rgba(230,48,48,.1)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E63030' }}>
          <h3 style={{ color: '#E63030', marginBottom: '1rem' }}>⚠️ Danger Zone</h3>
          <button style={{ width: '100%', padding: '10px', background: '#E63030', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}