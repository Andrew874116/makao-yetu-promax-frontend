import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function CommercialSpace() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/get_properties?type=commercial`)
      .then(res => res.json())
      .then(data => { setProperties(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>← Back to Home</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F5D200', marginBottom: '2rem' }}>🏢 Commercial Space</h1>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {properties.map(prop => (
              <Link key={prop.id} to={`/property/${prop.id}`} style={{ background: '#1A1A3E', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: 'white', border: '1px solid #2E2E5E' }}>
                <img src={`${API}/uploads/${prop.image}`} alt={prop.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3>{prop.title}</h3>
                  <p style={{ color: '#F5D200', fontSize: '1.3rem', fontWeight: 'bold' }}>Ksh {Number(prop.price).toLocaleString()}</p>
                  <p>📍 {prop.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}