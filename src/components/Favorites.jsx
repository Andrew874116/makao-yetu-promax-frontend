// ============================================================
// FAVORITES PAGE - Shows user's saved/wishlist properties
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ============================================================
  // CHECK IF USER IS LOGGED IN
  // ============================================================
  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchFavorites();
  }, [token]);

  // ============================================================
  // FETCH USER'S FAVORITED PROPERTIES
  // ============================================================
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REMOVE PROPERTY FROM FAVORITES
  // ============================================================
  const removeFavorite = async (propertyId) => {
    try {
      await fetch(`${API}/api/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFavorites(favorites.filter(f => f.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // ============================================================
  // PAIR PROPERTIES FOR MOBILE (2 per row)
  // ============================================================
  const pairProperties = (props) => {
    const pairs = [];
    for (let i = 0; i < props.length; i += 2) {
      pairs.push(props.slice(i, i + 2));
    }
    return pairs;
  };

  const favoritePairs = pairProperties(favorites);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading your favorites...
      </div>
    );
  }

  // ============================================================
  // RENDER PAGE
  // ============================================================
  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Back Button */}
        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(255,255,255,.1)', 
            border: '1px solid #2E2E5E', 
            padding: '8px 16px', 
            borderRadius: '40px', 
            color: 'white', 
            textDecoration: 'none', 
            marginBottom: '2rem' 
          }}
        >
          ← Back to Home
        </Link>
        
        {/* Header */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          ❤️ Your Favorites
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
        </p>
        
        {/* Empty State - No favorites yet */}
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1A1A3E', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ color: '#F5D200' }}>No favorites yet</h3>
            <p style={{ color: 'rgba(255,255,255,.6)' }}>Start saving properties you love by clicking the heart icon!</p>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-block', 
                marginTop: '1rem', 
                background: '#E63030', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                textDecoration: 'none' 
              }}
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          // ============================================================
          // FAVORITES GRID - 2 cards per row on mobile
          // ============================================================
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {favoritePairs.map((pair, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {pair.map(prop => (
                  <div key={prop.id} style={{ background: '#1A1A3E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2E2E5E' }}>
                    
                    {/* Property Image */}
                    <img 
                      src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'} 
                      alt={prop.title} 
                      style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                    />
                    
                    {/* Property Info */}
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'inline-block', background: prop.prop_type === 'rent' ? '#2563EB' : '#E63030', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', marginBottom: '6px' }}>
                        {prop.prop_type === 'rent' ? 'RENT' : 'SALE'}
                      </div>
                      <h3 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '4px' }}>{prop.title}</h3>
                      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', marginBottom: '6px' }}>📍 {prop.location}</p>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5D200', marginBottom: '8px' }}>
                        Ksh {Number(prop.price).toLocaleString()}{prop.prop_type === 'rent' && <span style={{ fontSize: '0.7rem' }}>/mo</span>}
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/property/${prop.id}`} 
                          style={{ 
                            flex: 1, 
                            background: '#E63030', 
                            color: 'white', 
                            textAlign: 'center', 
                            padding: '6px', 
                            borderRadius: '6px', 
                            textDecoration: 'none', 
                            fontSize: '0.75rem' 
                          }}
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => removeFavorite(prop.id)} 
                          style={{ 
                            background: 'rgba(230,48,48,.2)', 
                            color: '#FF6060', 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize: '0.75rem' 
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Fill empty slot if odd number of properties */}
                {pair.length === 1 && <div style={{ visibility: 'hidden' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}