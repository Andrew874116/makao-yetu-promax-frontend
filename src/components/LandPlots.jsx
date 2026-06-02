import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function LandPlots() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchLandProperties();
  }, []);

  const fetchLandProperties = async () => {
    try {
      const res = await fetch(`${API}/api/get_properties`);
      const allProps = await res.json();
      const props = Array.isArray(allProps) ? allProps : [];
      // Filter only land properties
      const landProps = props.filter(p => p.prop_type === 'land');
      setProperties(landProps);
    } catch (error) {
      console.error('Error fetching land:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    if (locationFilter && !prop.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Pair properties for mobile (2 per row)
  const pairProperties = (props) => {
    const pairs = [];
    for (let i = 0; i < props.length; i += 2) {
      pairs.push(props.slice(i, i + 2));
    }
    return pairs;
  };

  const propertyPairs = pairProperties(filteredProperties);

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
          Loading land listings...
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      {/* Header with back button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '1rem' }}>
          ← Back to Home
        </Link>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200' }}>🌾 Land & Plots for Sale</h1>
          <p style={{ color: 'rgba(255,255,255,.7)' }}>Find the perfect piece of land across Kenya</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <select 
            value={locationFilter} 
            onChange={e => setLocationFilter(e.target.value)}
            style={{ background: '#1A1A3E', border: '1px solid #2E2E5E', padding: '10px 16px', borderRadius: '8px', color: 'white', flex: 1, minWidth: '150px' }}
          >
            <option value="">All Locations</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Kiambu">Kiambu</option>
            <option value="Machakos">Machakos</option>
            <option value="Kajiado">Kajiado</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
            <option value="Eldoret">Eldoret</option>
          </select>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '1rem', color: 'rgba(255,255,255,.5)', fontSize: '0.85rem' }}>
          Found {filteredProperties.length} land {filteredProperties.length === 1 ? 'plot' : 'plots'}
        </div>

        {/* Land Grid - Horizontal pairs */}
        {filteredProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#1A1A3E', borderRadius: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
            <h3 style={{ color: '#F5D200' }}>No land listings found</h3>
            <p style={{ color: 'rgba(255,255,255,.6)' }}>Check back soon for new land listings in your area</p>
            <Link to="/add-property" style={{ display: 'inline-block', marginTop: '1rem', background: '#E63030', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none' }}>
              List Your Land →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {propertyPairs.map((pair, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {pair.map(prop => (
                  <Link key={prop.id} to={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#1A1A3E', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2E2E5E', transition: 'transform 0.2s' }}>
                      <img 
                        src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'} 
                        alt={prop.title} 
                        style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ background: '#2D5016', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white' }}>LAND</span>
                          {prop.acres && <span style={{ fontSize: '0.65rem', color: '#F5D200' }}>🌾 {prop.acres} acres</span>}
                        </div>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</h3>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', marginBottom: '0.5rem' }}>📍 {prop.location}</p>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#F5D200' }}>Ksh {Number(prop.price).toLocaleString()}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)', marginTop: '0.25rem' }}>💰 Price per acre: Ksh {(Number(prop.price) / (prop.acres || 1)).toLocaleString()}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {pair.length === 1 && <div style={{ visibility: 'hidden' }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Banner */}
      <div style={{ background: 'linear-gradient(135deg, #2D5016, #4CAF50)', margin: '2rem 1rem', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
        <h3 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>Own a piece of Kenya</h3>
        <p style={{ color: 'white', marginBottom: '1rem' }}>List your land for sale and reach thousands of buyers</p>
        <Link to="/add-property" style={{ background: '#F5D200', color: '#0D0D2B', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
          📢 List Your Land
        </Link>
      </div>
    </div>
  );
}