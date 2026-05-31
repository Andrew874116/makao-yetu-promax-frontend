import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>← Back to Home</Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F5D200', marginBottom: '1rem' }}>Contact Us</h1>
            <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: '2rem' }}>Have questions? We're here to help.</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📞</span>
                <div><strong>Phone</strong><br/>+254 700 000 000</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>✉️</span>
                <div><strong>Email</strong><br/>hello@makaoyetu.co.ke</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📍</span>
                <div><strong>Office</strong><br/>Nairobi, Kenya</div>
              </div>
            </div>
          </div>
          
          <div style={{ background: '#1A1A3E', borderRadius: '20px', padding: '2rem', border: '1px solid #2E2E5E' }}>
            <h2 style={{ color: '#E63030', marginBottom: '1rem' }}>Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
              <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '12px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
              <textarea placeholder="Your Message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows="5" style={{ width: '100%', padding: '12px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white', resize: 'vertical' }}></textarea>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#E63030', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{sent ? '✅ Sent!' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}