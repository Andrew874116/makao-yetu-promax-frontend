import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function ReferFriend() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchReferralData();
    }
  }, [token]);

  const fetchReferralData = async () => {
    try {
      const res = await fetch(`${API}/api/referral/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReferralCode(data.code);
      setReferrals(data.referrals);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const message = `Join Makao Yetu using my referral code: ${referralCode} and get Ksh 500 off your first booking! https://makaoyetu.co.ke/signup?ref=${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '40px', color: 'var(--text)', textDecoration: 'none', marginBottom: '2rem' }}>← Back</Link>
        
        <h1 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>👥 Refer Friends</h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>Invite friends and earn Ksh 500 for each successful referral!</p>

        {/* Referral Code Box */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎁</div>
          <h3 style={{ color: '#F5D200' }}>Your Referral Code</h3>
          <div style={{ background: '#E63030', padding: '12px', borderRadius: '8px', margin: '1rem 0', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '4px' }}>{referralCode || 'LOADING...'}</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={copyCode} style={{ flex: 1, background: '#4CAF50', border: 'none', padding: '10px', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>{copied ? '✅ Copied!' : '📋 Copy Code'}</button>
            <button onClick={shareOnWhatsApp} style={{ flex: 1, background: '#25D366', border: 'none', padding: '10px', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>📱 Share on WhatsApp</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--card)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', color: '#F5D200' }}>{referrals.length}</div>
            <div style={{ fontSize: '0.8rem' }}>Friends Joined</div>
          </div>
          <div style={{ background: 'var(--card)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '2rem', color: '#F5D200' }}>Ksh {referrals.length * 500}</div>
            <div style={{ fontSize: '0.8rem' }}>Total Earned</div>
          </div>
        </div>

        {/* Referral History */}
        <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📜 Referral History</h3>
          {referrals.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)' }}>No referrals yet. Share your code!</p>
          ) : (
            referrals.map((ref, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{ref.friend_name}</span>
                <span style={{ color: '#4CAF50' }}>+Ksh 500</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}