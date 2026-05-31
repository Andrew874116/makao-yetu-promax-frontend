// ============================================================
// PROPERTY DETAIL PAGE - Shows full property information
// Features: Booking, WhatsApp Share, Favorites, Price Comparison, Chat
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import WaterReliabilityWidget from './WaterReliabilityWidget';
import BlackoutScoreWidget from './BlackoutScoreWidget';

const API = 'http://localhost:5000';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ============================================================
  // STATE VARIABLES
  // ============================================================
  const [prop, setProp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [booking, setBooking] = useState(false);
  const [bookResult, setBookResult] = useState(null);
  const [bookError, setBookError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [priceComparison, setPriceComparison] = useState(null);
  
  const token = localStorage.getItem('token');

  // ============================================================
  // FETCH PROPERTY DATA ON PAGE LOAD
  // ============================================================
  useEffect(() => {
    fetchProperty();
    if (token) {
      checkFavorite();
    }
  }, [id, token]);

  // ============================================================
  // FETCH PROPERTY DETAILS FROM API
  // ============================================================
  const fetchProperty = async () => {
    try {
      const res = await fetch(`${API}/api/get_property/${id}`);
      const data = await res.json();
      setProp(data);
      fetchPriceComparison();
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH PRICE COMPARISON (Area Average vs Current Price)
  // ============================================================
  const fetchPriceComparison = async () => {
    try {
      const res = await fetch(`${API}/api/price_comparison/${id}`);
      const data = await res.json();
      setPriceComparison(data);
    } catch (error) {
      console.error('Error fetching price comparison:', error);
    }
  };

  // ============================================================
  // CHECK IF PROPERTY IS IN USER'S FAVORITES
  // ============================================================
  const checkFavorite = async () => {
    try {
      const res = await fetch(`${API}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const favorites = await res.json();
      setIsFavorited(favorites.some(f => f.id === parseInt(id)));
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  // ============================================================
  // TOGGLE FAVORITE (Add/Remove from wishlist)
  // ============================================================
  const toggleFavorite = async () => {
    if (!token) {
      navigate('/signin');
      return;
    }
    
    const method = isFavorited ? 'DELETE' : 'POST';
    try {
      await fetch(`${API}/api/favorites/${id}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  // ============================================================
  // SHARE ON WHATSAPP
  // ============================================================
  const shareOnWhatsApp = () => {
    const message = `Check out this property: ${prop.title}\n📍 ${prop.location}\n💰 Ksh ${Number(prop.price).toLocaleString()}\n👁️ ${prop.views || 0} views\n\nView more: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // ============================================================
  // HANDLE BOOKING SUBMISSION
  // ============================================================
  const handleBook = async () => {
    setBookError('');
    if (!token) return navigate('/signin');
    if (!phone) return setBookError('Enter your M-Pesa phone number.');

    setBooking(true);
    try {
      const res = await fetch(`${API}/api/book_property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ property_id: prop.id, amount: prop.price, phone, payment_method: method }),
      });
      const data = await res.json();
      if (!res.ok) return setBookError(data.error || 'Booking failed');
      setBookResult(data);
    } catch {
      setBookError('Server error. Try again.');
    } finally {
      setBooking(false);
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', color: 'white', textAlign: 'center', padding: '4rem' }}>
        Loading property details...
      </div>
    );
  }

  // ============================================================
  // PROPERTY NOT FOUND
  // ============================================================
  if (!prop) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', color: 'white', textAlign: 'center', padding: '4rem' }}>
        Property not found
      </div>
    );
  }

  // ============================================================
  // VARIABLES FOR DISPLAY
  // ============================================================
  const isRent = prop.prop_type === 'rent';
  const imgSrc = prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';

  // ============================================================
  // RENDER PAGE
  // ============================================================
  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* BACK BUTTON */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        
        {/* MAIN CONTENT - 2 COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
          
          {/* ============================================================ */}
          {/* LEFT COLUMN - PROPERTY DETAILS */}
          {/* ============================================================ */}
          <div>
            {/* Property Image */}
            <img src={imgSrc} alt={prop.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px' }} />
            
            <div style={{ marginTop: '1.5rem' }}>
              {/* Type Badge & Favorite Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ background: isRent ? '#2563EB' : '#E63030', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: 'white' }}>
                  {prop.prop_type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                </span>
                <button onClick={toggleFavorite} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                  {isFavorited ? '❤️' : '🤍'}
                </button>
              </div>
              
              {/* Title */}
              <h1 style={{ fontSize: '1.8rem', color: '#F5D200', marginTop: '0.5rem' }}>{prop.title}</h1>
              <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: '1rem' }}>📍 {prop.location}</p>
              
              {/* Property Specs */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {prop.bedrooms > 0 && <span>🛏 {prop.bedrooms} Bedroom(s)</span>}
                {prop.bathrooms > 0 && <span>🚿 {prop.bathrooms} Bathroom(s)</span>}
                <span>👁️ {prop.views || 0} views</span>
              </div>
              
              {/* Price */}
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5D200' }}>
                Ksh {Number(prop.price).toLocaleString()}{isRent && <span style={{ fontSize: '0.9rem' }}>/month</span>}
              </div>
              
              {/* PRICE COMPARISON SECTION */}
              {priceComparison && (
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  marginTop: '1rem',
                  borderLeft: `4px solid ${priceComparison.verdict_color}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.7)' }}>
                      📊 Area average: <strong>Ksh {priceComparison.area_average.toLocaleString()}</strong>
                    </span>
                    <span style={{ 
                      background: priceComparison.verdict_color, 
                      color: priceComparison.verdict_color === '#F5D200' ? '#0D0D2B' : 'white',
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {priceComparison.verdict}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.5)', marginTop: '0.5rem' }}>
                    Based on {priceComparison.similar_count} similar properties in this area
                    {priceComparison.price_difference_percent !== 0 && (
                      <span> • {Math.abs(priceComparison.price_difference_percent)}% {priceComparison.price_difference_percent < 0 ? 'below' : 'above'} average</span>
                    )}
                  </div>
                </div>
              )}
              <WaterReliabilityWidget area={prop.location} />
<BlackoutScoreWidget area={prop.location} />
              
              {/* Description */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>Description</h3>
                <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: '1.6' }}>{prop.description || 'No description provided.'}</p>
              </div>
              
              {/* Agent Information */}
              <div style={{ marginTop: '1.5rem', background: '#1A1A3E', padding: '1rem', borderRadius: '12px' }}>
                <h3 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>👤 Agent Information</h3>
                <p><strong>Name:</strong> {prop.agent_name}</p>
                <p><strong>Phone:</strong> {prop.agent_phone}</p>
                <p><strong>Email:</strong> {prop.agent_email}</p>
                <Link to={`/agent/${prop.user_id}`} style={{ color: '#F5D200', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}>
                  View Agent Profile →
                </Link>
              </div>
            </div>
          </div>
          
          {/* ============================================================ */}
          {/* RIGHT COLUMN - BOOKING CARD (Sticky) */}
          {/* ============================================================ */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
              
              {/* Booking Confirmation Result */}
              {bookResult ? (
                <div style={{ background: '#EAF3DE', color: '#2D5016', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <strong>✅ Booking Confirmed!</strong><br/>
                  Ref: {bookResult.mpesa_ref}<br/>
                  Amount: Ksh {Number(bookResult.amount).toLocaleString()}
                </div>
              ) : (
                <>
                  <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>{isRent ? '📅 Book This Property' : '💰 Purchase Enquiry'}</h3>
                  
                  {/* Phone Input */}
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>M-Pesa / Contact Phone</label>
                  <input 
                    type="tel" 
                    placeholder="07XXXXXXXX" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} 
                  />
                  
                  {/* Payment Method Selection */}
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>Payment Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {['mpesa', 'card', 'cash'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setMethod(m)} 
                        style={{ 
                          padding: '8px', 
                          background: method === m ? '#E63030' : '#0D0D2B', 
                          border: '1px solid #2E2E5E', 
                          borderRadius: '8px', 
                          color: 'white', 
                          cursor: 'pointer' 
                        }}
                      >
                        {m === 'mpesa' ? '📱 M-Pesa' : m === 'card' ? '💳 Card' : '💵 Cash'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Error Message */}
                  {bookError && <div style={{ background: 'rgba(230,48,48,.2)', color: '#FF6060', padding: '8px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem' }}>{bookError}</div>}
                  
                  {/* Book Button */}
                  <button 
                    onClick={handleBook} 
                    disabled={booking} 
                    style={{ width: '100%', padding: '12px', background: '#E63030', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}
                  >
                    {booking ? 'Processing...' : (isRent ? 'Confirm Booking' : 'Send Enquiry')}
                  </button>
                  
                  {/* WhatsApp Share Button */}
                  <button 
                    onClick={shareOnWhatsApp} 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      background: '#25D366', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px' 
                    }}
                  >
                    📱 Share on WhatsApp
                  </button>
                  
                 {/* Chat with Agent Button - Starts a conversation */}
<button 
  onClick={() => {
    // Store the agent info to start conversation
    localStorage.setItem('chat_with_agent', JSON.stringify({
      agent_id: prop.user_id,
      agent_name: prop.agent_name,
      property_id: prop.id,
      property_title: prop.title
    }));
    navigate('/chat');
  }} 
  style={{ 
    width: '100%', 
    padding: '12px', 
    background: '#4CAF50', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px',
    marginTop: '10px'
  }}
>
  💬 Message Agent
</button>
                  
                  {/* Disclaimer */}
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: '1rem' }}>
                    No payment charged yet. Agent will contact you.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}