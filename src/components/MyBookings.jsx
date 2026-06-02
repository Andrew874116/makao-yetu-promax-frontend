import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

const S = {
  page: { minHeight:'100vh', background:'#FDF6EE', fontFamily:"'Outfit',sans-serif" },
  nav: { background:'white', borderBottom:'1.5px solid #F0E4D0', padding:'0 2rem',
    display:'flex', alignItems:'center', justifyContent:'space-between', height:64 },
  logo: { fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:900, color:'#C4622D', textDecoration:'none' },
  logoSpan: { color:'#2D5016' },
  content: { maxWidth:900, margin:'2.5rem auto', padding:'0 1.5rem' },
  heading: { fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', fontWeight:700, color:'#1E1A16', marginBottom:4 },
  sub: { color:'#6B5B4E', fontSize:'0.9rem', marginBottom:'2rem' },
  card: { background:'white', border:'1.5px solid #F0E4D0', borderRadius:14, padding:'1.25rem 1.5rem',
    marginBottom:'1rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'1rem', alignItems:'center' },
  propTitle: { fontWeight:700, fontSize:'1rem', color:'#1E1A16', marginBottom:4 },
  propLoc: { fontSize:'0.85rem', color:'#6B5B4E', marginBottom:8 },
  meta: { display:'flex', gap:'1.25rem', flexWrap:'wrap' },
  metaItem: { fontSize:'0.82rem', color:'#6B5B4E', display:'flex', alignItems:'center', gap:4 },
  amount: { fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color:'#C4622D', textAlign:'right' },
  ref: { fontSize:'0.78rem', color:'#B0A090', textAlign:'right', marginTop:4 },
  badge: { display:'inline-block', padding:'3px 10px', borderRadius:100, fontSize:'0.72rem',
    fontWeight:700, textTransform:'uppercase', background:'#EAF3DE', color:'#2D5016', marginTop:6 },
  empty: { textAlign:'center', padding:'4rem 2rem', color:'#6B5B4E' },
  emptyIcon: { fontSize:'3rem', marginBottom:'1rem' },
  link: { color:'#C4622D', fontWeight:700, textDecoration:'none' },
};

export default function MyBookings() {
  const nav = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { nav('/signin'); return; }
    fetch(`${API}/api/my_bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setBookings(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setError('Could not load bookings.'); setLoading(false); });
  }, [nav]);

  const logout = () => {
    ['token','username','user_id'].forEach(k => localStorage.removeItem(k));
    nav('/signin');
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.page}>
        <nav style={S.nav}>
          <Link to="/" style={S.logo}>Makao<span style={S.logoSpan}>Yetu</span></Link>
          <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
            <span style={{ color:'#6B5B4E', fontSize:'0.9rem' }}>Hi, {username}</span>
            <button onClick={logout} style={{ background:'none', border:'1.5px solid #F0E4D0', borderRadius:8,
              padding:'6px 14px', fontSize:'0.85rem', cursor:'pointer', color:'#6B5B4E', fontFamily:"'Outfit',sans-serif" }}>
              Log out
            </button>
          </div>
        </nav>

        <div style={S.content}>
          <h1 style={S.heading}>My Bookings</h1>
          <p style={S.sub}>All your property booking transactions in one place.</p>

          {loading && <p style={{ color:'#6B5B4E' }}>Loading your bookings...</p>}
          {error && <p style={{ color:'#C4622D' }}>{error}</p>}

          {!loading && bookings.length === 0 && (
            <div style={S.empty}>
              <div style={S.emptyIcon}>🏠</div>
              <p style={{ fontWeight:600, marginBottom:8 }}>No bookings yet</p>
              <p>Browse listings and book a property to see your transactions here.</p>
              <Link to="/" style={{ ...S.link, display:'inline-block', marginTop:'1rem' }}>Browse Properties →</Link>
            </div>
          )}

          {bookings.map(b => (
            <div key={b.id} style={S.card}>
              <div>
                <div style={S.propTitle}>{b.property_title}</div>
                <div style={S.propLoc}>📍 {b.location}</div>
                <div style={S.meta}>
                  <span style={S.metaItem}>📅 {new Date(b.created_at).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <span style={S.metaItem}>📱 {b.payment_method?.toUpperCase()}</span>
                  <span style={S.metaItem}>📞 {b.phone}</span>
                </div>
                <span style={S.badge}>{b.status}</span>
              </div>
              <div>
                <div style={S.amount}>Ksh {Number(b.amount).toLocaleString()}</div>
                <div style={S.ref}>Ref: {b.mpesa_ref}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
