import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>← Back to Home</Link>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#F5D200' }}>About Makao Yetu</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.2rem', maxWidth: '700px', margin: '1rem auto' }}>Kenya's most trusted property platform.</p>
        </div>

        <div style={{ background: '#1A1A3E', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', border: '1px solid #2E2E5E' }}>
          <h2 style={{ color: '#E63030', marginBottom: '1rem' }}>🎯 Our Mission</h2>
          <p style={{ color: 'rgba(255,255,255,.8)' }}>To make finding and renting property in Kenya safe, transparent, and stress-free.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { number: '5,000+', label: 'Active Listings', icon: '🏠' },
            { number: '35+', label: 'Counties', icon: '🗺️' },
            { number: '12,000+', label: 'Happy Tenants', icon: '😊' },
            { number: '98%', label: 'Verification Rate', icon: '✅' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', border: '1px solid #2E2E5E' }}>
              <div style={{ fontSize: '3rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5D200' }}>{stat.number}</div>
              <div style={{ color: 'rgba(255,255,255,.6)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}