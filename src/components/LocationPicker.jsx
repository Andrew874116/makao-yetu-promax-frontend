// ============================================================
// LOCATION PICKER - Like Google Maps!
// Features: INSTANT suggestions as you type, click to pin, drag marker
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });
  return null;
}

// Component to set map view
function SetMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function LocationPicker({ onLocationChange, initialLocation, address }) {
  const [location, setLocation] = useState(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -1.286389, lng: 36.817223 });
  const searchRef = useRef(null);
  const typingTimerRef = useRef(null);

  // ============================================================
  // FETCH ADDRESS SUGGESTIONS INSTANTLY (NO ENTER KEY NEEDED!)
  // ============================================================
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearching(true);
    try {
      // Using Nominatim's search endpoint with instant results
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}, Kenya&format=json&limit=8&addressdetails=1&dedupe=1`
      );
      const data = await response.json();
      
      const formattedSuggestions = data.map(item => ({
        display_name: item.display_name.split(',').slice(0, 4).join(','),
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        importance: item.importance
      }));
      
      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setSearching(false);
    }
  };

  // ============================================================
  // INSTANT SEARCH AS USER TYPES (NO DELAY!)
  // ============================================================
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    
    // Clear previous timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set new timer (300ms delay to avoid too many API calls)
    typingTimerRef.current = setTimeout(() => {
      if (value.length >= 2) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // ============================================================
  // REVERSE GEOCODE - Get address from coordinates
  // ============================================================
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const shortAddress = data.display_name.split(',').slice(0, 4).join(',');
        return shortAddress;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // ============================================================
  // HANDLE LOCATION SELECTION
  // ============================================================
  const handleLocationSelect = async (coords, selectedAddress = null) => {
    setLocation(coords);
    setMapCenter(coords);
    
    let fullAddress = selectedAddress;
    if (!fullAddress) {
      fullAddress = await reverseGeocode(coords.lat, coords.lng);
    }
    
    setSearchQuery(fullAddress);
    
    if (onLocationChange) {
      onLocationChange({
        lat: coords.lat,
        lng: coords.lng,
        address: fullAddress
      });
    }
    
    setShowSuggestions(false);
  };

  // ============================================================
  // HANDLE SUGGESTION CLICK
  // ============================================================
  const handleSuggestionClick = (suggestion) => {
    const coords = {
      lat: suggestion.lat,
      lng: suggestion.lon
    };
    handleLocationSelect(coords, suggestion.display_name);
  };

  // ============================================================
  // GET CURRENT LOCATION
  // ============================================================
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(coords);
          handleLocationSelect(coords);
        },
        (error) => {
          alert('Unable to get your location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '0.78rem', 
        fontWeight: 700, 
        color: 'rgba(255,255,255,.4)',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        📍 Pin Property Location on Map
      </label>
      
      {/* ============================================================ */}
      {/* SEARCH BAR WITH AUTOCOMPLETE - INSTANT RESULTS! */}
      {/* ============================================================ */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder="🔍 Type any location... e.g., Westlands, Kilimani, Nairobi CBD"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '40px',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            
            {/* Suggestions Dropdown - Appears INSTANTLY as you type */}
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
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
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
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#252550'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '1.2rem' }}>
                      {sug.type === 'house' ? '🏠' : sug.type === 'commercial' ? '🏢' : '📍'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: '500' }}>
                        {sug.display_name}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.5)' }}>
                        {sug.type === 'residential' ? '🏘️ Residential Area' : 
                         sug.type === 'commercial' ? '🏢 Commercial Area' : 
                         sug.type === 'house' ? '🏠 Property' : '📍 Location'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Loading indicator */}
            {searching && (
              <div style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,.4)'
              }}>
                🔍
              </div>
            )}
          </div>
          
          <button
            onClick={getCurrentLocation}
            style={{
              padding: '0 20px',
              background: '#1A1A3E',
              border: '1px solid #2E2E5E',
              borderRadius: '40px',
              color: '#4CAF50',
              cursor: 'pointer',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            📍 My Location
          </button>
        </div>
      </div>
      
      {/* ============================================================ */}
      {/* INTERACTIVE MAP */}
      {/* ============================================================ */}
      <div style={{ 
        height: '400px', 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: '1px solid #2E2E5E',
        marginBottom: '0.5rem'
      }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <SetMapView center={mapCenter} zoom={14} />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {location && (
            <Marker 
              position={[location.lat, location.lng]}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const newPos = e.target.getLatLng();
                  handleLocationSelect({ lat: newPos.lat, lng: newPos.lng });
                }
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <strong style={{ color: '#F5D200' }}>📍 Property Location</strong>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                    {searchQuery.split(',').slice(0, 2).join(',')}
                  </div>
                  <hr style={{ margin: '5px 0', borderColor: '#2E2E5E' }} />
                  <div style={{ fontSize: '0.7rem', color: '#4CAF50' }}>
                    Drag to adjust
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      {/* ============================================================ */}
      {/* SELECTED LOCATION INFO */}
      {/* ============================================================ */}
      {location && (
        <div style={{ 
          background: 'rgba(76,175,80,.15)', 
          padding: '0.75rem', 
          borderRadius: '8px',
          fontSize: '0.8rem',
          borderLeft: '3px solid #4CAF50'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ color: '#4CAF50' }}>✅ Exact location pinned!</span>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)', marginTop: '4px' }}>
                📍 Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)', marginTop: '4px' }}>
                🏠 {searchQuery}
              </div>
            </div>
            <button
              onClick={() => {
                setLocation(null);
                setSearchQuery('');
                setSuggestions([]);
                if (onLocationChange) onLocationChange(null);
              }}
              style={{
                background: 'rgba(230,48,48,.2)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '20px',
                color: '#FF6060',
                cursor: 'pointer',
                fontSize: '0.7rem'
              }}
            >
              Remove Pin
            </button>
          </div>
        </div>
      )}
      
      {/* ============================================================ */}
      {/* HELP TIP */}
      {/* ============================================================ */}
      <p style={{ 
        fontSize: '0.65rem', 
        color: 'rgba(255,255,255,.4)', 
        marginTop: '0.5rem',
        textAlign: 'center'
      }}>
        💡 <strong>Pro Tip:</strong> Start typing any area name - suggestions appear automatically! 
        Click a suggestion, click on the map, or drag the pin to set the EXACT location.
      </p>
    </div>
  );
}