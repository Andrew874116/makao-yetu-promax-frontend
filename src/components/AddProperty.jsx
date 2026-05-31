// ============================================================
// ADD PROPERTY PAGE - With Auto-Save Drafts, Multiple Photos & Video
// Includes: Rent, Sale, Land, Commercial, HOSTELS with Bed Spacing + Price per Student
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LocationPicker from './LocationPicker';

const API = 'http://localhost:5000';

const styles = {
  page: { minHeight: '100vh', background: '#0D0D2B', fontFamily: "'Outfit', sans-serif" },
  nav: { 
    background: '#080818', 
    borderBottom: '1.5px solid #2E2E5E', 
    padding: '0 2rem',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    height: 64,
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 900, color: '#E63030', textDecoration: 'none' },
  logoSpan: { color: '#4CAF50' },
  content: { maxWidth: 800, margin: '2.5rem auto', padding: '0 1.5rem' },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#F5D200', marginBottom: 8 },
  sub: { color: 'rgba(255,255,255,.45)', fontSize: '0.9rem', marginBottom: '2rem' },
  label: { 
    display: 'block', 
    fontSize: '0.78rem', 
    fontWeight: 700, 
    color: 'rgba(255,255,255,.4)',
    textTransform: 'uppercase', 
    letterSpacing: '0.5px', 
    marginBottom: 6, 
    marginTop: '1.25rem' 
  },
  input: { 
    width: '100%', 
    padding: '0.75rem 1rem', 
    border: '1.5px solid #2E2E5E',
    borderRadius: 10, 
    fontSize: '0.95rem', 
    color: '#fff', 
    background: '#0D0D2B', 
    outline: 'none' 
  },
  textarea: { 
    width: '100%', 
    padding: '0.75rem 1rem', 
    border: '1.5px solid #2E2E5E',
    borderRadius: 10, 
    fontSize: '0.95rem', 
    color: '#fff', 
    background: '#0D0D2B', 
    outline: 'none',
    resize: 'vertical', 
    minHeight: 100 
  },
  select: { 
    width: '100%', 
    padding: '0.75rem 1rem', 
    border: '1.5px solid #2E2E5E',
    borderRadius: 10, 
    fontSize: '0.95rem', 
    color: '#fff', 
    background: '#0D0D2B', 
    outline: 'none' 
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  btn: { 
    width: '100%', 
    padding: '0.9rem', 
    background: '#E63030', 
    color: 'white', 
    border: 'none',
    borderRadius: 10, 
    fontSize: '1rem', 
    fontWeight: 700, 
    cursor: 'pointer', 
    marginTop: '1.75rem' 
  },
  success: { 
    background: 'rgba(76,175,80,.15)', 
    border: '1px solid #4CAF50', 
    color: '#4CAF50',
    borderRadius: 8, 
    padding: '0.75rem 1rem', 
    fontSize: '0.9rem', 
    marginTop: '1rem', 
    textAlign: 'center' 
  },
  error: { 
    background: 'rgba(230,48,48,.15)', 
    border: '1px solid #E63030', 
    color: '#FF6060',
    borderRadius: 8, 
    padding: '0.75rem 1rem', 
    fontSize: '0.9rem', 
    marginTop: '1rem' 
  },
  badge: { background: '#E63030', color: 'white', borderRadius: 100, padding: '4px 14px', fontSize: '0.8rem', fontWeight: 700 },
  mediaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' },
  mediaItem: { position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '2px solid #2E2E5E' },
  mediaPreview: { width: '100%', height: '100%', objectFit: 'cover' },
  removeBtn: { position: 'absolute', top: '5px', right: '5px', background: '#E63030', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: 'white', cursor: 'pointer', fontSize: '12px' },
  uploadBox: { border: '2px dashed #2E2E5E', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#1A1A3E', marginTop: '0.5rem' },
  promoNote: { background: 'rgba(245,210,0,.1)', padding: '10px', borderRadius: 8, color: '#F5D200', fontSize: '13px', textAlign: 'center', marginTop: '1rem' },
  autoSaveStatus: { textAlign: 'center', fontSize: '0.7rem', color: '#4CAF50', marginTop: '0.5rem' },
  totalIncome: { background: 'rgba(76,175,80,.1)', padding: '10px', borderRadius: '8px', marginTop: '8px', textAlign: 'center' }
};

export default function AddProperty() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '', 
    location: '', 
    price: '', 
    prop_type: 'rent',
    bedrooms: '1', 
    bathrooms: '1', 
    description: '',
    bed_spacing: '2',           // For hostels: how many students share a room
    price_per_student: '',      // For hostels: price each student pays
    property_type: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [propertyLocation, setPropertyLocation] = useState(null);
  
  // Auto-save states
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  const token = localStorage.getItem('token');

  const locations = [
    'Nairobi CBD', 'Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Karen',
    'Langata', 'South B', 'South C', 'Eastlands', 'Ruiru', 'Thika', 'Rongai',
    'Kitengela', 'Athi River', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Tatu City', 'Konza Technopolis'
  ];

  const propertyTypes = [
    'Studio', 'Bedsitter', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms',
    '5+ Bedrooms', 'Apartment', 'Maisonette', 'Townhouse', 'Bungalow', 'Mansion',
    'Servant Quarters', 'Commercial Space'
  ];

  // Bed spacing options for hostels (how many students share a room)
  const bedSpacingOptions = [
    { value: '1', label: '1 student (Private room)', priceHint: 'Each student pays full price' },
    { value: '2', label: '2 students (Sharing)', priceHint: 'Price per student, room total = 2x' },
    { value: '3', label: '3 students (Sharing)', priceHint: 'Price per student, room total = 3x' },
    { value: '4', label: '4 students (Sharing)', priceHint: 'Price per student, room total = 4x' },
    { value: '6', label: '6 students (Dormitory style)', priceHint: 'Price per student, room total = 6x' },
    { value: '8', label: '8 students (Dormitory style)', priceHint: 'Price per student, room total = 8x' },
    { value: '10', label: '10+ students (Large dormitory)', priceHint: 'Price per student, room total = 10x' }
  ];

  // Calculate total room income for hostels
  const calculateTotalIncome = () => {
    if (form.prop_type === 'hostel' && form.price_per_student && form.bed_spacing) {
      return Number(form.price_per_student) * Number(form.bed_spacing);
    }
    return 0;
  };

  // ============================================================
  // AUTO-SAVE DRAFT FUNCTIONS
  // ============================================================
  const autoSaveDraft = () => {
    const draftData = {
      form,
      images: images.map(img => img.name),
      video: video?.name,
      propertyLocation,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`property_draft_${token}`, JSON.stringify(draftData));
    setAutoSaveStatus('Draft saved');
    setLastSaved(new Date());
    setTimeout(() => setAutoSaveStatus(''), 2000);
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`property_draft_${token}`);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      const hoursSince = (new Date() - new Date(draft.timestamp)) / 1000 / 60 / 60;
      if (hoursSince < 24) {
        if (window.confirm('You have an unsaved draft from ' + new Date(draft.timestamp).toLocaleString() + '. Load it?')) {
          setForm(draft.form);
          setPropertyLocation(draft.propertyLocation);
        }
      }
    }
  }, [token]);

  // Auto-save every 30 seconds when form has content
  useEffect(() => {
    if (!form.title && !form.location) return;
    const interval = setInterval(() => {
      autoSaveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [form, images, video, propertyLocation]);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      // 500MB max for 10-minute videos
      if (file.size > 500 * 1024 * 1024) {
        alert('Video too large. Max 500MB for 10-minute videos.');
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleLocationChange = (locationData) => {
    setPropertyLocation(locationData);
    if (locationData && locationData.address) {
      setForm(prev => ({ ...prev, location: locationData.address.split(',')[0] }));
    }
  };

  const submit = async () => {
    setError('');
    setSuccess('');
    
    if (!form.title || !form.location || !form.price)
      return setError('Title, location and price are required.');

    // For hostels, validate price per student
    if (form.prop_type === 'hostel' && !form.price_per_student) {
      return setError('Please enter price per student for this hostel.');
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images', img));
    if (video) fd.append('video', video);
    if (propertyLocation) {
      fd.append('latitude', propertyLocation.lat);
      fd.append('longitude', propertyLocation.lng);
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/add_property`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to list property');
      
      // Clear draft after successful submission
      localStorage.removeItem(`property_draft_${token}`);
      setSuccess(`✅ Property listed! ID: ${data.property_id}`);
      setTimeout(() => nav(`/property/${data.property_id}`), 2000);
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = calculateTotalIncome();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        
        <nav style={styles.nav}>
          <Link to="/" style={styles.logo}>Makao<span style={styles.logoSpan}>Yetu</span></Link>
          <span style={styles.badge}>List a Property</span>
          <Link to="/" style={{ fontSize:'0.88rem', color:'rgba(255,255,255,.55)', textDecoration:'none' }}>← Back</Link>
        </nav>

        <div style={styles.content}>
          <h1 style={styles.heading}>List Your Property</h1>
          <p style={styles.sub}>Fill in the details below. You can add up to 10 photos and a video tour!</p>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          {/* ============================================================ */}
          {/* Basic Info */}
          {/* ============================================================ */}
          <label style={styles.label}>Property Title</label>
          <input 
            style={styles.input} 
            name="title" 
            placeholder={form.prop_type === 'hostel' ? "e.g. Tatu City Student Hostel - Near University" : "e.g. Spacious 2-bedroom in Kilimani"} 
            value={form.title} 
            onChange={change} 
          />

          <div style={styles.row}>
            <div>
              <label style={styles.label}>Location</label>
              <select style={styles.select} name="location" value={form.location} onChange={change}>
                <option value="">Select location...</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Listing Type</label>
              <select style={styles.select} name="prop_type" value={form.prop_type} onChange={change}>
                <option value="rent">🏠 For Rent</option>
                <option value="sale">💰 For Sale</option>
                <option value="land">🌾 Land</option>
                <option value="commercial">🏢 Commercial Space</option>
                <option value="hostel">🏘️ Hostel / Student Housing</option>
              </select>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Price - Different label for hostels */}
          {/* ============================================================ */}
          <div style={styles.row3}>
            <div>
              <label style={styles.label}>
                {form.prop_type === 'hostel' ? '💰 Total Room Price (Ksh/month)' : '💰 Price (Ksh)'}
              </label>
              <input 
                style={styles.input} 
                type="number" 
                name="price" 
                placeholder={form.prop_type === 'hostel' ? "e.g. 20000 (total for the room)" : "e.g. 25000"} 
                value={form.price} 
                onChange={change} 
              />
              {form.prop_type === 'hostel' && (
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)', marginTop: '4px' }}>
                  This is the total room price before dividing by students
                </p>
              )}
            </div>
            
            {form.prop_type !== 'hostel' && (
              <>
                <div>
                  <label style={styles.label}>Bedrooms</label>
                  <select style={styles.select} name="bedrooms" value={form.bedrooms} onChange={change}>
                    <option value="0">0 Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Bathrooms</label>
                  <select style={styles.select} name="bathrooms" value={form.bathrooms} onChange={change}>
                    <option value="0">0 Bathrooms</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4+ Bathrooms</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* ============================================================ */}
          {/* HOSTEL-SPECIFIC: Bed Spacing + Price per Student */}
          {/* ============================================================ */}
          {form.prop_type === 'hostel' && (
            <>
              <div style={styles.row}>
                <div>
                  <label style={styles.label}>👥 Students per Room (Bed Spacing)</label>
                  <select style={styles.select} name="bed_spacing" value={form.bed_spacing} onChange={change}>
                    {bedSpacingOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)', marginTop: '4px' }}>
                    How many students will share this room?
                  </p>
                </div>
                <div>
                  <label style={styles.label}>💰 Price per Student (Ksh/month)</label>
                  <input 
                    style={styles.input} 
                    type="number" 
                    name="price_per_student" 
                    placeholder="e.g. 5000" 
                    value={form.price_per_student} 
                    onChange={change}
                  />
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)', marginTop: '4px' }}>
                    Each student pays this amount
                  </p>
                </div>
              </div>

              {/* Total Room Income Calculation */}
              {form.price_per_student && form.bed_spacing && (
                <div style={styles.totalIncome}>
                  <span style={{ fontSize: '0.85rem', color: '#4CAF50' }}>
                    💰 <strong>Room Breakdown:</strong>
                  </span>
                  <br/>
                  <span style={{ fontSize: '0.75rem', color: '#F5D200' }}>
                    {form.bed_spacing} students × Ksh {Number(form.price_per_student).toLocaleString()} = 
                    <strong> Ksh {totalIncome.toLocaleString()}/month total room income</strong>
                  </span>
                  <br/>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>
                    Listed total price: Ksh {Number(form.price).toLocaleString()}/month
                  </span>
                  {Number(form.price) !== totalIncome && Number(form.price) > 0 && (
                    <p style={{ fontSize: '0.7rem', color: '#FF9800', marginTop: '4px' }}>
                      ⚠️ Total room price (Ksh {Number(form.price).toLocaleString()}) doesn't match calculated income (Ksh {totalIncome.toLocaleString()})
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* ============================================================ */}
          {/* Property Type (Studio, Apartment, etc.) */}
          {/* ============================================================ */}
          <label style={styles.label}>Property Type</label>
          <select style={styles.select} name="property_type" value={form.property_type} onChange={change}>
            <option value="">Select type...</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          {/* ============================================================ */}
          {/* Description */}
          {/* ============================================================ */}
          <label style={styles.label}>Description</label>
          <textarea 
            style={styles.textarea} 
            name="description"
            placeholder={form.prop_type === 'hostel' ? 
              "Describe the hostel: distance to university, amenities, curfew rules, meal plans, common areas, security, etc." : 
              "Describe the property — size, amenities, nearby landmarks, parking, security, etc."}
            value={form.description} 
            onChange={change} 
          />

          {/* ============================================================ */}
          {/* Location Picker */}
          {/* ============================================================ */}
          <LocationPicker 
            onLocationChange={handleLocationChange}
            initialLocation={propertyLocation}
            address={form.location}
          />

          {/* ============================================================ */}
          {/* Multiple Photo Upload */}
          {/* ============================================================ */}
          <label style={styles.label}>📸 Property Photos (Up to 10)</label>
          <div style={styles.uploadBox} onClick={() => document.getElementById('image-upload').click()}>
            <div style={{ fontSize: '2rem' }}>🖼️</div>
            <div style={{ color: 'rgba(255,255,255,.6)' }}>Click to upload photos</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.8rem' }}>JPG, PNG, WEBP • Max 10 photos</div>
          </div>
          <input id="image-upload" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImages} />
          
          {imagePreviews.length > 0 && (
            <div style={styles.mediaGrid}>
              {imagePreviews.map((preview, idx) => (
                <div key={idx} style={styles.mediaItem}>
                  <img src={preview} alt={`Preview ${idx}`} style={styles.mediaPreview} />
                  <button style={styles.removeBtn} onClick={() => removeImage(idx)}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* Video Upload (Up to 10 minutes) */}
          {/* ============================================================ */}
          <label style={styles.label}>🎬 Property Video/Reel (Optional - Up to 10 minutes)</label>
          <div style={styles.uploadBox} onClick={() => document.getElementById('video-upload').click()}>
            <div style={{ fontSize: '2rem' }}>📹</div>
            <div style={{ color: 'rgba(255,255,255,.6)' }}>Click to upload a video tour or reel</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.8rem' }}>MP4, MOV • Up to 10 minutes • Max 500MB</div>
          </div>
          <input 
  id="video-upload" 
  type="file" 
  accept="video/*" 
  style={{ display: 'none' }} 
  onChange={handleVideo}
  // No size limit - Cloudinary will handle it
/>
          
          {videoPreview && (
            <div style={styles.mediaItem}>
              <video src={videoPreview} style={styles.mediaPreview} controls />
              <button style={styles.removeBtn} onClick={removeVideo}>✕</button>
            </div>
          )}

          {/* ============================================================ */}
          {/* Auto-Save Status */}
          {/* ============================================================ */}
          {autoSaveStatus && (
            <div style={styles.autoSaveStatus}>
              💾 {autoSaveStatus} {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}
            </div>
          )}

          {/* ============================================================ */}
          {/* Promo Note */}
          {/* ============================================================ */}
          <div style={styles.promoNote}>
            💡 <strong>Pro Tip:</strong> Properties with photos and videos get 5x more views! 
            {form.prop_type === 'hostel' && ' Hostels with clear pricing per student get more applications.'}
          </div>

          {/* ============================================================ */}
          {/* Submit Button */}
          {/* ============================================================ */}
          <button 
            style={{ ...styles.btn, background: loading ? '#A01C1C' : '#E63030' }} 
            onClick={submit} 
            disabled={loading}
          >
            {loading ? 'Publishing...' : '🚀 Publish Listing'}
          </button>
        </div>
      </div>
    </>
  );
}