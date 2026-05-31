// ============================================================
// HOSTELS PAGE - Student housing / dorms
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function Hostels() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/get_properties?type=hostel`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading hostels...
      </div>
    );
  }

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          🏘️ Student Hostels
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          Affordable housing near universities and colleges
        </p>

        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1A1A3E', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏘️</div>
            <h3>No hostels listed yet</h3>
            <p>Check back soon for student housing options</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {properties.map(prop => (
              <Link key={prop.id} to={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#1A1A3E', borderRadius: '16px', overflow: 'hidden', border: '1px solid #2E2E5E' }}>
                  <img 
                    src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'} 
                    alt={prop.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'inline-block', background: '#E63030', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', marginBottom: '8px' }}>
                      HOSTEL
                    </div>
                    <h3 style={{ color: 'white', marginBottom: '4px' }}>{prop.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.6)' }}>📍 {prop.location}</p>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F5D200' }}>
                      Ksh {Number(prop.price).toLocaleString()}/month
                    </div>
                    {prop.bed_spacing && (
                      <p style={{ fontSize: '0.7rem', color: '#4CAF50', marginTop: '4px' }}>
                        🛏️ {prop.bed_spacing} students per room
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}