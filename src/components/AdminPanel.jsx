import { useState, useEffect } from 'react';

const API = 'https://makao-yetu-promax.onrender.com';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/pending_verifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setError(data.error);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/verify_user/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert('User verified successfully!');
        fetchPendingVerifications();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const rejectUser = async (userId) => {
    // Changed from confirm() to window.confirm()
    if (!window.confirm('Reject this user? They will need to re-upload their ID.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/reject_user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert('User rejected');
        fetchPendingVerifications();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to reject user');
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👑 Admin Dashboard</h1>
        <h2 style={styles.subtitle}>Pending Landlord Verifications</h2>

        {error && <div style={styles.error}>{error}</div>}

        {users.length === 0 ? (
          <div style={styles.empty}>No pending verifications ✅</div>
        ) : (
          <div style={styles.userList}>
            {users.map(user => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.userInfo}>
                  <strong style={{ fontSize: '16px', color: '#F5D200' }}>{user.username}</strong>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,.7)' }}>{user.email}</span>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,.5)' }}>📱 {user.phone || 'No phone'}</span>
                  {user.id_document && (
                    <a href={`${API}/uploads/${user.id_document}`} target="_blank" rel="noreferrer" style={styles.viewId}>
                      🔍 View ID Document
                    </a>
                  )}
                </div>
                <div style={styles.actions}>
                  <button onClick={() => approveUser(user.id)} style={styles.approveBtn}>
                    ✅ Approve
                  </button>
                  <button onClick={() => rejectUser(user.id)} style={styles.rejectBtn}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0D0D2B',
    padding: '40px 20px'
  },
  card: {
    background: '#1A1A3E',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #2E2E5E'
  },
  title: {
    color: '#F5D200',
    fontSize: '28px',
    marginBottom: '10px',
    fontFamily: 'Playfair Display, serif'
  },
  subtitle: {
    color: 'white',
    fontSize: '18px',
    marginBottom: '30px',
    borderBottom: '1px solid #2E2E5E',
    paddingBottom: '10px'
  },
  loading: {
    textAlign: 'center',
    color: 'white',
    padding: '50px',
    background: '#0D0D2B',
    minHeight: '100vh',
    fontSize: '18px'
  },
  error: {
    background: 'rgba(230,48,48,0.2)',
    color: '#FF6060',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  empty: {
    textAlign: 'center',
    color: '#4CAF50',
    padding: '40px',
    fontSize: '18px'
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  userCard: {
    background: '#0D0D2B',
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    border: '1px solid #2E2E5E'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    color: 'white'
  },
  viewId: {
    color: '#F5D200',
    fontSize: '12px',
    textDecoration: 'none',
    marginTop: '5px',
    display: 'inline-block'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  approveBtn: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  rejectBtn: {
    background: '#E63030',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};