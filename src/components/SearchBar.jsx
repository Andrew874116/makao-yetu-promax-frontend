import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function SearchBar({ placeholder = "Search for houses, apartments, land...", onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    min_price: '',
    max_price: '',
    bedrooms: ''
  });
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch suggestions as user types
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/search_suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.type) params.append('type', filters.type);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    
    try {
      const res = await fetch(`${API}/api/advanced_search?${params.toString()}`);
      const results = await res.json();
      if (onSearch) onSearch(results);
      navigate(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingLeft: '40px',
              background: '#1A1A3E',
              border: '1px solid #2E2E5E',
              borderRadius: '40px',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1A1A3E',
              border: '1px solid #2E2E5E',
              borderRadius: '12px',
              marginTop: '8px',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid #2E2E5E' : 'none',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#252550'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.2rem' }}>{sug.type === 'location' ? '📍' : '🏠'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>{sug.value}</div>
                    <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.7rem' }}>
                      {sug.type === 'location' ? 'Location' : 'Property'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? '#E63030' : '#1A1A3E',
            border: '1px solid #2E2E5E',
            borderRadius: '40px',
            padding: '10px 16px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ⚙️
        </button>
        
        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: '#E63030',
            border: 'none',
            borderRadius: '40px',
            padding: '10px 24px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#1A1A3E',
          border: '1px solid #2E2E5E',
          borderRadius: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>Property Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <option value="">All Types</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>Min Price (Ksh)</label>
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => setFilters({...filters, min_price: e.target.value})}
              placeholder="e.g., 10000"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>Max Price (Ksh)</label>
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => setFilters({...filters, max_price: e.target.value})}
              placeholder="e.g., 50000"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '4px' }}>Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <option value="">Any</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}