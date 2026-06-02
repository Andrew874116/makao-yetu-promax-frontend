// ============================================================
// FREE MAP VIEW - Shows all properties on interactive map
// Uses OpenStreetMap - COMPLETELY FREE, no API key needed!
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API = 'https://makao-yetu-promax.onrender.com';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom markers for different property types (color-coded)
const getMarkerIcon = (type) => {
  const colors = {
    rent: '#2563EB',      // Blue - For Rent
    sale: '#E63030',      // Red - For Sale
    land: '#2D5016',      // Green - Land
    commercial: '#7A3E9C' // Purple - Commercial
  };
  
  const color = colors[type] || '#E63030';
  
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    className: 'custom-marker',
    iconSize: [14, 14],
    popupAnchor: [0, -7]
  });
};

// Component to center map on user location
function LocationFinder({ onLocationFound }) {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          onLocationFound({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [map, onLocationFound]);

  return null;
}

// Component to change map view when property selected
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom || 14);
    }
  }, [center, zoom, map]);
  return null;
}

export default function FreeMapView() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.286389, lng: 36.817223 }); // Nairobi CBD
  const [geocodedProperties, setGeocodedProperties] = useState([]);

  // ============================================================
  // FETCH PROPERTIES
  // ============================================================
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${API}/api/get_properties`);
      const data = await res.json();
      setProperties(data);
      
      // Geocode addresses to coordinates
      await geocodeProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // GEOCODE ADDRESSES (or use saved coordinates if available)
  // ============================================================
  const geocodeProperties = async (props) => {
    const geocoded = [];
    
    for (const prop of props) {
      // If property already has saved coordinates, use them immediately!
      if (prop.latitude && prop.longitude) {
        geocoded.push({
          ...prop,
          lat: parseFloat(prop.latitude),
          lng: parseFloat(prop.longitude)
        });
      } else {
        // Otherwise geocode from address using Nominatim (FREE)
        try {
          const address = `${prop.location}, Kenya`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
          );
          const data = await response.json();
          
          if (data && data[0]) {
            geocoded.push({
              ...prop,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
          } else {
            // Fallback to Nairobi CBD coordinates
            geocoded.push({
              ...prop,
              lat: -1.286389,
              lng: 36.817223
            });
          }
        } catch (error) {
          console.error('Geocoding error for:', prop.title, error);
          geocoded.push({
            ...prop,
            lat: -1.286389,
            lng: 36.817223
          });
        }
      }
      
      // Small delay to respect Nominatim's usage policy
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setGeocodedProperties(geocoded);
  };

  // ============================================================
  // CENTER MAP ON SELECTED PROPERTY
  // ============================================================
  const centerOnProperty = (property) => {
    if (property.lat && property.lng) {
      setMapCenter({ lat: property.lat, lng: property.lng });
      setSelectedProperty(property);
    }
  };

  // ============================================================
  // CALCULATE DISTANCE BETWEEN TWO POINTS (Haversine formula)
  // ============================================================
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // ============================================================
  // GET DISTANCE FROM USER'S LOCATION
  // ============================================================
  const getDistanceFromUser = (property) => {
    if (!userLocation || !property.lat || !property.lng) return null;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, property.lat, property.lng);
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading map and properties...
      </div>
    );
  }

  // ============================================================
  // RENDER PAGE
  // ============================================================
  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        
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
            marginBottom: '1rem' 
          }}
        >
          ← Back to Home
        </Link>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          🗺️ Property Map
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '1rem' }}>
          {geocodedProperties.length} properties mapped • Click any pin to see details
        </p>
        
        {/* ============================================================ */}
        {/* TWO COLUMN LAYOUT: Map + Property List */}
        {/* ============================================================ */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          
          {/* LEFT: Interactive Map */}
          <div style={{ 
            background: '#1A1A3E', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: '1px solid #2E2E5E',
            height: '600px'
          }}>
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              {/* Dark mode tile layer */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              {/* User Location Finder */}
              <LocationFinder onLocationFound={setUserLocation} />
              
              {/* Change View when property selected */}
              {selectedProperty && selectedProperty.lat && selectedProperty.lng && (
                <ChangeMapView center={{ lat: selectedProperty.lat, lng: selectedProperty.lng }} zoom={15} />
              )}
              
              {/* Property Markers */}
              {geocodedProperties.map((prop) => (
                <Marker
                  key={prop.id}
                  position={[prop.lat, prop.lng]}
                  icon={getMarkerIcon(prop.prop_type)}
                  eventHandlers={{
                    click: () => setSelectedProperty(prop)
                  }}
                >
                  <Popup>
                    <div style={{ 
                      fontFamily: 'Outfit, sans-serif',
                      background: '#1A1A3E',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '8px',
                      minWidth: '220px'
                    }}>
                      <img 
                        src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150'} 
                        alt={prop.title}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                      />
                      <h4 style={{ color: '#F5D200', margin: '0 0 4px 0', fontSize: '14px' }}>{prop.title}</h4>
                      <p style={{ margin: '2px 0', fontSize: '11px', color: 'rgba(255,255,255,.7)' }}>📍 {prop.location}</p>
                      <p style={{ margin: '2px 0', fontSize: '12px', fontWeight: 'bold', color: '#F5D200' }}>
                        Ksh {Number(prop.price).toLocaleString()}{prop.prop_type === 'rent' ? '/mo' : ''}
                      </p>
                      <a 
                        href={`/property/${prop.id}`}
                        style={{
                          display: 'inline-block',
                          background: '#E63030',
                          color: 'white',
                          textDecoration: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          marginTop: '8px'
                        }}
                      >
                        View Details →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {/* RIGHT: Property List Sidebar */}
          <div style={{ 
            background: '#1A1A3E', 
            borderRadius: '16px', 
            padding: '1rem', 
            border: '1px solid #2E2E5E',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📋 Nearby Properties</h3>
            
            {userLocation && (
              <div style={{ 
                background: 'rgba(76,175,80,.15)', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                fontSize: '0.8rem',
                color: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📍 Location detected! Click any pin to see distance
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {geocodedProperties.map((prop) => {
                const distance = getDistanceFromUser(prop);
                return (
                  <div 
                    key={prop.id}
                    onClick={() => centerOnProperty(prop)}
                    style={{ 
                      background: selectedProperty?.id === prop.id ? 'rgba(230,48,48,.2)' : '#0D0D2B',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      border: selectedProperty?.id === prop.id ? '1px solid #E63030' : '1px solid #2E2E5E',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <img 
                        src={prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80'} 
                        alt={prop.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'inline-block', 
                          background: prop.prop_type === 'rent' ? '#2563EB' : prop.prop_type === 'sale' ? '#E63030' : '#2D5016', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '0.6rem', 
                          color: 'white',
                          marginBottom: '4px'
                        }}>
                          {prop.prop_type === 'rent' ? 'RENT' : prop.prop_type === 'sale' ? 'SALE' : 'LAND'}
                        </div>
                        <h4 style={{ fontSize: '0.85rem', color: 'white', marginBottom: '2px' }}>{prop.title}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.6)' }}>📍 {prop.location.split(',')[0]}</p>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#F5D200' }}>
                          Ksh {Number(prop.price).toLocaleString()}
                        </div>
                        {distance && (
                          <div style={{ fontSize: '0.65rem', color: '#4CAF50', marginTop: '4px' }}>
                            🚗 {distance}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div style={{ 
          marginTop: '1rem', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          flexWrap: 'wrap',
          padding: '0.75rem',
          background: '#1A1A3E',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '14px', height: '14px', background: '#2563EB', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem' }}>For Rent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '14px', height: '14px', background: '#E63030', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem' }}>For Sale</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '14px', height: '14px', background: '#2D5016', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem' }}>Land</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '14px', height: '14px', background: '#7A3E9C', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.75rem' }}>Commercial</span>
          </div>
        </div>
        
        {/* Note about geocoding */}
        <p style={{ 
          textAlign: 'center', 
          fontSize: '0.7rem', 
          color: 'rgba(255,255,255,.4)', 
          marginTop: '1rem' 
        }}>
          📍 Property locations are approximate. Powered by OpenStreetMap 
        </p>
      </div>
    </div>
  );
}