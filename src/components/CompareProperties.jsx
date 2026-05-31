// ============================================================
// PROPERTY COMPARISON TOOL - Compare up to 3 properties side by side
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function CompareProperties() {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API}/api/get_properties`);
      const data = await res.json();
      // Just store for search, no need to keep all
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    try {
      const res = await fetch(`${API}/api/advanced_search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const addToCompare = (property) => {
    if (selectedProperties.length >= 3) {
      alert('You can only compare up to 3 properties');
      return;
    }
    if (!selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromCompare = (propertyId) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  const clearCompare = () => {
    setSelectedProperties([]);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    return Number(num).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', color: 'white', textAlign: 'center' }}>
        Loading...
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
          🔍 Compare Properties
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          Compare up to 3 properties side by side to make the best decision
        </p>

        {/* Search Box */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 2) handleSearch();
                else setSearchResults([]);
              }}
              placeholder="Search properties to compare..."
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#1A1A3E',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#1A1A3E',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {searchResults.map(prop => (
                  <div key={prop.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #2E2E5E',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => addToCompare(prop)}
                  onMouseEnter={e => e.currentTarget.style.background = '#252550'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <strong style={{ color: '#F5D200' }}>{prop.title}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.6)' }}>{prop.location}</p>
                    </div>
                    <div style={{ color: '#F5D200', fontWeight: 'bold' }}>
                      Ksh {formatNumber(prop.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={clearCompare} style={{
            padding: '12px 24px',
            background: '#E63030',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Clear All ({selectedProperties.length}/3)
          </button>
        </div>

        {/* Comparison Table */}
        {selectedProperties.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              background: '#1A1A3E',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: '#0D0D2B', borderBottom: '2px solid #2E2E5E' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#F5D200', width: '200px' }}>Feature</th>
                  {selectedProperties.map(prop => (
                    <th key={prop.id} style={{ padding: '1rem', textAlign: 'left', color: '#F5D200' }}>
                      <div>
                        <strong>{prop.title}</strong>
                        <button 
                          onClick={() => removeFromCompare(prop.id)}
                          style={{ 
                            float: 'right', 
                            background: 'none', 
                            border: 'none', 
                            color: '#E63030', 
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                          }}
                        >✕</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Image row */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>📸 Photo</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem' }}>
                      <img 
                        src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150'}
                        alt={prop.title}
                        style={{ width: '100%', maxWidth: '150px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    </td>
                  ))}
                </tr>
                
                {/* Location */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>📍 Location</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', color: 'rgba(255,255,255,.8)' }}>{prop.location}</td>
                  ))}
                </tr>
                
                {/* Type */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>🏷️ Type</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', color: 'rgba(255,255,255,.8)' }}>
                      {prop.prop_type === 'rent' ? 'For Rent' : prop.prop_type === 'sale' ? 'For Sale' : prop.prop_type}
                    </td>
                  ))}
                </tr>
                
                {/* Price */}
                <tr style={{ borderBottom: '1px solid #2E2E5E', background: 'rgba(245,210,0,.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>💰 Price</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#F5D200' }}>
                      Ksh {formatNumber(prop.price)}{prop.prop_type === 'rent' && <span style={{ fontSize: '0.8rem' }}>/mo</span>}
                    </td>
                  ))}
                </tr>
                
                {/* Bedrooms */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>🛏️ Bedrooms</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', color: 'rgba(255,255,255,.8)' }}>{prop.bedrooms || 'N/A'}</td>
                  ))}
                </tr>
                
                {/* Bathrooms */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>🚿 Bathrooms</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', color: 'rgba(255,255,255,.8)' }}>{prop.bathrooms || 'N/A'}</td>
                  ))}
                </tr>
                
                {/* Views */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>👁️ Views</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem', color: 'rgba(255,255,255,.8)' }}>{formatNumber(prop.views)} views</td>
                  ))}
                </tr>
                
                {/* Action Buttons */}
                <tr style={{ borderBottom: '1px solid #2E2E5E' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#F5D200' }}>🔗 Actions</td>
                  {selectedProperties.map(prop => (
                    <td key={prop.id} style={{ padding: '1rem' }}>
                      <Link to={`/property/${prop.id}`} style={{
                        background: '#E63030',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        display: 'inline-block'
                      }}>
                        View Details →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            background: '#1A1A3E', 
            borderRadius: '16px',
            border: '1px solid #2E2E5E'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#F5D200' }}>No properties selected</h3>
            <p style={{ color: 'rgba(255,255,255,.6)' }}>Search and add up to 3 properties to compare them side by side</p>
          </div>
        )}
      </div>
    </div>
  );
}