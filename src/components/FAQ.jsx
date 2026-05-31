import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: 'How do I know listings are real?', a: 'Every agent is verified with ID and all properties are checked before going live.' },
    { q: 'Is there a "viewing fee"?', a: 'NEVER! If anyone asks for a viewing fee, report them immediately.' },
    { q: 'How does M-Pesa payment work?', a: 'You pay through our secure escrow. Money is only released when you confirm move-in.' },
    { q: 'Can I list my property?', a: 'Yes! Create an account, upload your ID, and start listing.' },
  ];

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>← Back to Home</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F5D200', marginBottom: '2rem' }}>❓ Frequently Asked Questions</h1>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ background: '#1A1A3E', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #2E2E5E' }}>
            <div onClick={() => setOpen(open === idx ? null : idx)} style={{ padding: '1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              {faq.q} <span>{open === idx ? '▲' : '▼'}</span>
            </div>
            {open === idx && <div style={{ padding: '0 1rem 1rem 1rem', color: 'rgba(255,255,255,.7)', borderTop: '1px solid #2E2E5E' }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}