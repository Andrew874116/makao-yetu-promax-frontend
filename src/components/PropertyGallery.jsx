// ============================================================
// PROPERTY GALLERY - Pinterest-style masonry grid
// ============================================================

import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Link } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

export default function PropertyGallery() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API}/api/get_properties`);
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading gallery...
      </div>
    );
  }

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        <Link to="/" style={{ 
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
        }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          🖼️ Property Gallery
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          Discover beautiful properties across Kenya • {properties.length} properties
        </p>

        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
          style={{ display: 'flex', gap: '1rem' }}
        >
          <style>{`
            .masonry-grid {
              display: flex;
              gap: 1rem;
            }
            .masonry-grid-column {
              background-clip: padding-box;
            }
            .masonry-grid-column > div {
              margin-bottom: 1rem;
            }
          `}</style>
          
          {properties.map((prop) => {
            const imgUrl = prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400';
            const randomHeight = 250 + Math.random() * 150;
            
            return (
              <div key={prop.id} style={{ 
                background: '#1A1A3E', 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: '1px solid #2E2E5E',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => window.location.href = `/property/${prop.id}`}
              >
                <img 
                  src={imgUrl} 
                  alt={prop.title}
                  style={{ width: '100%', height: `${randomHeight}px`, objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: prop.prop_type === 'rent' ? '#2563EB' : '#E63030', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.6rem', 
                      color: 'white' 
                    }}>
                      {prop.prop_type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                    </span>
                    {prop.is_featured && <span style={{ color: '#F5D200' }}>⭐ Featured</span>}
                  </div>
                  <h3 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '4px' }}>{prop.title}</h3>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>{prop.location}</p>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5D200', marginTop: '0.5rem' }}>
                    Ksh {Number(prop.price).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
}