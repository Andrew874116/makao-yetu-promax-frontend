import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const API = 'https://makao-yetu-promax.onrender.com';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, phone: form.phone, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('is_verified', 0);
      localStorage.setItem('is_admin', 0);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/google_auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('is_admin', 0);
      navigate('/');
    } catch (err) {
      setError('Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D2B', padding: '1rem' }}>
      <div style={{ background: '#1A1A3E', padding: '2rem', borderRadius: '20px', width: '100%', maxWidth: '450px', border: '1px solid #2E2E5E' }}>
        <h1 style={{ textAlign: 'center', color: '#F5D200', marginBottom: '1rem' }}>Create Account</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google signup failed')} theme="filled_black" shape="pill" />
        </div>
        <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>or</div>
        {error && <div style={{ background: 'rgba(230,48,48,.2)', color: '#FF6060', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Full Name" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
          <input type="tel" name="phone" placeholder="Phone (e.g., 0712345678)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '12px', cursor: 'pointer' }}>{showPassword ? '🙈' : '👁️'}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input type={showConfirm ? 'text' : 'password'} name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
            <span onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '10px', top: '12px', cursor: 'pointer' }}>{showConfirm ? '🙈' : '👁️'}</span>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#E63030', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Already have an account? <Link to="/signin" style={{ color: '#F5D200' }}>Sign In</Link></p>
      </div>
    </div>
  );
}