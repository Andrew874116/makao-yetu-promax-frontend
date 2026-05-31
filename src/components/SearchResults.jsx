// ============================================================
// SEARCH RESULTS PAGE - Shows results from user search
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // ============================================================
  // GET SEARCH QUERY FROM URL AND FETCH RESULTS
  // ============================================================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    fetchSearchResults(params);
  }, [location.search]);

  const fetchSearchResults = async (params) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/advanced_search?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
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

  const resultPairs = pairProperties(results);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Searching for properties...
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
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          🔍 Search Results
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          {searchQuery && `Showing results for "${searchQuery}" • `}
          Found {results.length} property{results.length !== 1 ? 'ies' : ''}
        </p>
        
        {/* No Results */}
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1A1A3E', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#F5D200' }}>No properties found</h3>
            <p style={{ color: 'rgba(255,255,255,.6)' }}>Try adjusting your search criteria or browse all listings</p>
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
              Browse All Properties
            </Link>
          </div>
        ) : (
          // ============================================================
          // RESULTS GRID - 2 cards per row on mobile
          // ============================================================
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultPairs.map((pair, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {pair.map(prop => (
                  <Link key={prop.id} to={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#1A1A3E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2E2E5E' }}>
                      <img 
                        src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'} 
                        alt={prop.title} 
                        style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'inline-block', background: prop.prop_type === 'rent' ? '#2563EB' : '#E63030', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', marginBottom: '6px' }}>
                          {prop.prop_type === 'rent' ? 'RENT' : 'SALE'}
                        </div>
                        <h3 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '4px' }}>{prop.title}</h3>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', marginBottom: '6px' }}>📍 {prop.location}</p>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5D200' }}>
                          Ksh {Number(prop.price).toLocaleString()}{prop.prop_type === 'rent' && <span style={{ fontSize: '0.7rem' }}>/mo</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', color: '#4CAF50' }}>✅ Verified</span>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.5)' }}>👁️ {prop.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {pair.length === 1 && <div style={{ visibility: 'hidden' }} />}
              </div>
            ))}
          </div>
        )}
        
        {/* Back to Top Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            style={{ 
              background: 'rgba(255,255,255,.1)', 
              border: '1px solid #2E2E5E', 
              padding: '8px 24px', 
              borderRadius: '40px', 
              color: 'white', 
              cursor: 'pointer' 
            }}
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}