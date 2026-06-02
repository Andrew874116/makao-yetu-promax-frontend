// ============================================================
// MAKAO YETU - MAIN HOMEPAGE
// Features: Property listings, Search, Filters, Favorites, Recent Searches
// ============================================================

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = 'https://makao-yetu-promax.onrender.com';

// ============================================================
// STYLES - Maasai Electric Theme (Mobile First)
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg: #0D0D2B;
    --nav: #080818;
    --card: #1A1A3E;
    --red: #E63030;
    --red-lt: #FF6060;
    --gold: #F5D200;
    --border: #2E2E5E;
    --muted: rgba(255,255,255,.45);
  }
  
  body { font-family: 'Outfit', sans-serif; background: var(--bg); color: #fff; }
  
  /* NAVBAR */
  .nav { position: sticky; top: 0; z-index: 1000; background: rgba(8,8,24,.98); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); padding: 0 1rem; }
  .nav-inner { max-width: 1200px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .brand { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--red); text-decoration: none; }
  .brand span { color: #4CAF50; }
  .menu-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; display: none; }
  .nav-links { display: flex; gap: 0.2rem; }
  .nav-link { font-size: 0.85rem; font-weight: 500; padding: 0.4rem 0.8rem; color: rgba(255,255,255,.55); text-decoration: none; border-radius: 8px; transition: all 0.18s; white-space: nowrap; }
  .nav-link:hover { background: rgba(230,48,48,.15); color: var(--red-lt); }
  .nav-btn { background: var(--red); color: white; padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; text-decoration: none; display: inline-block; }
  .nav-btn-ghost { background: transparent; color: rgba(255,255,255,.7); border: 1.5px solid rgba(255,255,255,.2); padding: 0.38rem 0.9rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; text-decoration: none; }
  .user-name { font-size: 0.85rem; color: var(--gold); font-weight: 500; background: rgba(245,210,0,.15); padding: 0.3rem 0.8rem; border-radius: 20px; }
  
  /* MOBILE MENU */
  .mobile-menu { position: fixed; top: 60px; left: 0; right: 0; background: var(--nav); border-bottom: 1px solid var(--border); padding: 1rem; display: none; flex-direction: column; gap: 0.75rem; z-index: 999; }
  .mobile-menu a, .mobile-menu button { padding: 0.75rem; text-align: center; width: 100%; background: var(--card); border-radius: 8px; color: white; text-decoration: none; border: none; font-size: 0.9rem; }
  .mobile-menu.show { display: flex; }
  
  /* HERO SECTION */
  .hero { background: var(--nav); min-height: auto; display: flex; align-items: center; padding: 1.5rem 1rem; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800') center/cover; opacity: 0.1; }
  .hero-content { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; width: 100%; }
  .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(230,48,48,.2); border: 1px solid rgba(230,48,48,.45); color: var(--red-lt); font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 100px; margin-bottom: 1rem; }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; color: white; line-height: 1.2; margin-bottom: 0.75rem; }
  .hero p { color: rgba(255,255,255,.6); font-size: 0.9rem; margin-bottom: 1.5rem; }
  .hero-stats { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--gold); }
  .hero-stat-label { font-size: 0.65rem; color: var(--muted); }
  
  /* SEARCH BOX */
  .search-box { background: rgba(26,26,62,.95); border: 1.5px solid var(--border); border-radius: 16px; padding: 1rem; margin-top: 1rem; }
  .search-tabs { display: flex; gap: 0.3rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .search-tab { padding: 0.35rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: none; background: rgba(255,255,255,.06); color: rgba(255,255,255,.5); }
  .search-tab.active { background: var(--red); color: white; }
  .search-row { display: flex; gap: 0.5rem; flex-direction: column; }
  .s-wrap { width: 100%; }
  .s-wrap label { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,.4); margin-bottom: 4px; text-transform: uppercase; display: block; }
  .s-wrap select, .s-wrap input { width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.85rem; color: #fff; background: rgba(255,255,255,.07); outline: none; }
  .search-btn { background: var(--red); color: white; border: none; border-radius: 10px; padding: 0.7rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; }
  
  /* CAROUSEL */
  .carousel-container { position: relative; margin-bottom: 2rem; overflow: hidden; border-radius: 16px; }
  .carousel-track { display: flex; transition: transform 0.5s ease; }
  .carousel-slide { flex: 0 0 100%; }
  .carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px; z-index: 10; }
  .carousel-prev { left: 8px; }
  .carousel-next { right: 8px; }
  
  /* SECTIONS */
  .section { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; }
  .sec-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .sec-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--red); }
  .sec-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #fff; }
  .see-all { font-size: 0.75rem; font-weight: 600; color: var(--gold); text-decoration: none; }
  
  /* CARDS - Horizontal Pairs (2 per row on mobile) */
  .cards-grid { display: flex; flex-direction: column; gap: 1rem; }
  .card-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  
  .prop-card { background: var(--card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); transition: all 0.25s; cursor: pointer; text-decoration: none; color: inherit; display: block; position: relative; }
  .prop-card:hover { transform: translateY(-3px); border-color: var(--red); }
  .featured-card { border: 2px solid var(--gold); }
  .card-img { position: relative; height: 140px; overflow: hidden; background: var(--border); }
  .card-img img { width: 100%; height: 100%; object-fit: cover; }
  .card-badge { position: absolute; top: 6px; left: 6px; padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }
  .featured-badge { position: absolute; top: 6px; right: 6px; background: var(--gold); color: #0D0D2B; padding: 2px 8px; border-radius: 20px; font-size: 0.6rem; font-weight: 700; }
  .new-badge { position: absolute; top: 6px; right: 6px; background: #4CAF50; color: white; padding: 2px 8px; border-radius: 20px; font-size: 0.6rem; font-weight: 700; }
  .favorite-btn { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 14px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; z-index: 2; }
  .b-rent { background: rgba(37,99,235,.9); color: white; }
  .b-sale { background: var(--red); color: white; }
  .b-land { background: #2D5016; color: white; }
  .b-commercial { background: #7A3E9C; color: white; }
  .card-body { padding: 0.75rem; }
  .card-price { font-size: 1rem; font-weight: 700; color: var(--gold); }
  .card-price span { font-size: 0.65rem; font-weight: 500; color: var(--muted); }
  .card-title { font-size: 0.8rem; font-weight: 600; color: #fff; margin: 0.25rem 0 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-loc { font-size: 0.7rem; color: var(--muted); margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-feats { display: flex; gap: 0.75rem; font-size: 0.65rem; color: var(--muted); }
  .card-foot { border-top: 1px solid var(--border); padding: 0.5rem 0.75rem; display: flex; justify-content: space-between; align-items: center; }
  .contact-btn { background: var(--red); color: white; border: none; border-radius: 6px; padding: 0.25rem 0.7rem; font-size: 0.7rem; font-weight: 600; cursor: pointer; }
  
  /* FILTER BAR */
  .filter-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .filter-select { flex: 1; min-width: 120px; padding: 0.6rem; background: var(--card); border: 1px solid var(--border); border-radius: 8px; color: white; font-size: 0.8rem; cursor: pointer; }
  
  /* AD BANNERS */
  .ad-banner { background: linear-gradient(135deg, #E63030, #FF6060); border-radius: 12px; padding: 1rem; margin: 0.5rem 0; text-align: center; cursor: pointer; }
  .ad-banner h4 { color: var(--gold); font-size: 0.9rem; margin-bottom: 0.25rem; }
  .ad-banner p { font-size: 0.7rem; color: white; opacity: 0.9; }
  .ad-banner.promoted { background: linear-gradient(135deg, #F5D200, #FFE84D); }
  .ad-banner.promoted h4 { color: #E63030; }
  .ad-banner.promoted p { color: #0D0D2B; }
  
  /* FOOTER */
  .footer { background: var(--nav); border-top: 1px solid var(--border); padding: 2rem 1rem 1rem; }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
  .footer-brand { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--red); }
  .footer-brand span { color: #4CAF50; }
  .footer-tagline { color: var(--muted); font-size: 0.8rem; line-height: 1.5; }
  .footer-heading { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,.25); margin-bottom: 0.75rem; }
  .footer-link { display: block; color: rgba(255,255,255,.55); font-size: 0.8rem; text-decoration: none; margin-bottom: 0.5rem; }
  .footer-inp { width: 100%; padding: 0.6rem; border-radius: 8px; border: 1px solid var(--border); background: rgba(255,255,255,.05); color: white; margin-bottom: 0.5rem; }
  .footer-sub { width: 100%; padding: 0.6rem; background: var(--red); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,.08); padding-top: 1rem; display: flex; flex-direction: column; gap: 1rem; text-align: center; }
  .footer-copy { color: rgba(255,255,255,.22); font-size: 0.7rem; }
  .socials { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; }
  .social-pill { background: rgba(255,255,255,.05); color: rgba(255,255,255,.5); padding: 4px 12px; border-radius: 100px; font-size: 0.7rem; text-decoration: none; }
  
  /* SKELETON LOADER */
  .skeleton { background: linear-gradient(90deg,#1A1A3E 25%,#252550 50%,#1A1A3E 75%); background-size: 200%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
  
  /* TABLET & DESKTOP BREAKPOINTS */
  @media (min-width: 768px) {
    .menu-btn { display: none; }
    .nav-links { display: flex !important; }
    .mobile-menu { display: none !important; }
    .hero h1 { font-size: 2.5rem; }
    .search-row { flex-direction: row; }
    .cards-grid { gap: 1.5rem; }
    .card-pair { gap: 1rem; }
    .card-img { height: 180px; }
    .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.5fr; }
    .footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; }
  }
  
  @media (min-width: 1024px) {
    .hero h1 { font-size: 3rem; }
    .card-img { height: 200px; }
    .section { padding: 3rem 2rem; }
  }
`;

// ============================================================
// SKELETON CARD COMPONENT (Shows while loading)
// ============================================================
function SkeletonCard() {
  return (
    <div className="prop-card">
      <div className="skeleton" style={{ height: 140 }} />
      <div style={{ padding: '0.75rem' }}>
        <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 10, width: '40%' }} />
      </div>
    </div>
  );
}

// ============================================================
// PROPERTY CARD COMPONENT (Displays each property)
// ============================================================
function PropCard({ prop, isFavorited, onFavoriteToggle }) {
  const navigate = useNavigate();
  const imgSrc = prop.image ? `${API}/uploads/${prop.image}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400';
  const isRent = prop.prop_type === 'rent';
  const isFeatured = prop.is_featured === 1;
  const isNew = prop.created_at && new Date(prop.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  let typeClass = 'b-rent';
  if (prop.prop_type === 'sale') typeClass = 'b-sale';
  else if (prop.prop_type === 'land') typeClass = 'b-land';
  else if (prop.prop_type === 'commercial') typeClass = 'b-commercial';
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(prop.id);
  };
  
  return (
    <Link to={`/property/${prop.id}`} className={`prop-card ${isFeatured ? 'featured-card' : ''}`}>
      <div className="card-img">
        <img src={imgSrc} alt={prop.title} loading="lazy" />
        <span className={`card-badge ${typeClass}`}>
          {prop.prop_type === 'rent' ? 'Rent' : prop.prop_type === 'sale' ? 'Sale' : prop.prop_type === 'land' ? 'Land' : 'Comm'}
        </span>
        {isFeatured && <span className="featured-badge">⭐</span>}
        {isNew && !isFeatured && <span className="new-badge">NEW</span>}
        <button onClick={handleFavoriteClick} className="favorite-btn">
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-body">
        <div className="card-price">Ksh {Number(prop.price).toLocaleString()}<span>{isRent ? '/mo' : ''}</span></div>
        <div className="card-title">{prop.title}</div>
        <div className="card-loc">{prop.location.split(',')[0]}</div>
        <div className="card-feats">
          {prop.bedrooms > 0 && <span>🛏 {prop.bedrooms}</span>}
          {prop.bathrooms > 0 && <span>🚿 {prop.bathrooms}</span>}
          {prop.views !== undefined && <span>👁️ {prop.views}</span>}
        </div>
      </div>
      <div className="card-foot">
        <span style={{ fontSize:'0.65rem', color:'#4CAF50' }}>✅ Verified</span>
        <button className="contact-btn" onClick={e => e.preventDefault()}>View</button>
      </div>
    </Link>
  );
}

// ============================================================
// FEATURED CAROUSEL COMPONENT (Auto-sliding)
// ============================================================
function FeaturedCarousel({ properties }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!properties || properties.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % properties.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [properties]);
  
  if (!properties || properties.length === 0) return null;
  
  const goToSlide = (index) => {
    setCurrentIndex((index + properties.length) % properties.length);
  };
  
  const current = properties[currentIndex];
  const imgSrc = current.image ? `${API}/uploads/${current.image}` : 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800';
  
  return (
    <div className="carousel-container">
      <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {properties.map((prop) => (
          <div key={prop.id} className="carousel-slide">
            <Link to={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #1A1A3E 0%, #252550 100%)', borderRadius: 16, overflow: 'hidden' }}>
                <img src={imgSrc} alt={prop.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'white' }}>{prop.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold' }}>Ksh {Number(prop.price).toLocaleString()}</p>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>👁️ {prop.views || 0} views</p>
                  <button className="contact-btn" style={{ marginTop: '0.5rem', width: '100%' }}>View →</button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {properties.length > 1 && (
        <>
          <button className="carousel-btn carousel-prev" onClick={() => goToSlide(currentIndex - 1)}>◀</button>
          <button className="carousel-btn carousel-next" onClick={() => goToSlide(currentIndex + 1)}>▶</button>
        </>
      )}
    </div>
  );
}

// ============================================================
// MAIN MAKAO YETU COMPONENT
// ============================================================
export default function MakaoYetu() {
  const nav = useNavigate();
  
  // ============================================================
  // STATE VARIABLES
  // ============================================================
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('rent');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('');
  const [rentals, setRentals] = useState([]);
  const [sales, setSales] = useState([]);
  const [land, setLand] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);

  const token = localStorage.getItem('token');
  const fullName = localStorage.getItem('username') || '';
  const firstName = fullName.split(' ')[0];

  // ============================================================
  // FETCH DATA ON PAGE LOAD
  // ============================================================
  useEffect(() => {
    fetchAllProperties();
    if (token) {
      fetchFavorites();
      fetchRecentSearches();
    }
  }, [token]);

  // ============================================================
  // FETCH ALL PROPERTIES FROM API
  // ============================================================
  const fetchAllProperties = async () => {
    try {
      const res = await fetch(`${API}/api/get_properties`);
      const allProps = await res.json();
      const props = Array.isArray(allProps) ? allProps : [];
      setFeatured(props.filter(p => p.is_featured === 1 || p.is_promoted === 1).slice(0, 5));
      setRentals(props.filter(p => p.prop_type === 'rent'));
      setSales(props.filter(p => p.prop_type === 'sale'));
      setLand(props.filter(p => p.prop_type === 'land'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FAVORITES FUNCTIONS
  // ============================================================
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const favs = await res.json();
      setFavorites(favs.map(f => f.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (propertyId) => {
    if (!token) {
      nav('/signin');
      return;
    }
    
    const isFavorited = favorites.includes(propertyId);
    const method = isFavorited ? 'DELETE' : 'POST';
    
    try {
      await fetch(`${API}/api/favorites/${propertyId}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (isFavorited) {
        setFavorites(favorites.filter(id => id !== propertyId));
      } else {
        setFavorites([...favorites, propertyId]);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  // ============================================================
  // RECENT SEARCHES FUNCTIONS
  // ============================================================
  const fetchRecentSearches = async () => {
    try {
      const res = await fetch(`${API}/api/recent_searches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const searches = await res.json();
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  };

  const saveSearch = async (query, type) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/recent_searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query, type })
      });
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  // ============================================================
  // SEARCH FUNCTIONS
  // ============================================================
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    
    if (token) {
      await saveSearch(searchQuery, tab);
    }
    
    try {
      nav(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
      setShowSuggestions(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`${API}/api/search_suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Suggestion error:', error);
    }
  };

  // ============================================================
  // FILTER PROPERTIES
  // ============================================================
  const filterProperties = (properties) => {
    let filtered = [...properties];
    if (locationFilter) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(p => p.prop_type === typeFilter);
    }
    if (bedroomsFilter && bedroomsFilter !== 'all') {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(bedroomsFilter));
    }
    return filtered;
  };

  const filteredRentals = filterProperties(rentals);
  const filteredSales = filterProperties(sales);
  const filteredLand = filterProperties(land);

  // ============================================================
  // LOGOUT FUNCTION
  // ============================================================
  const logout = () => {
    ['token', 'username', 'user_id', 'is_admin', 'is_verified'].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // ============================================================
  // PAIR PROPERTIES FOR HORIZONTAL LAYOUT (2 per row)
  // ============================================================
  const pairProperties = (props) => {
    const pairs = [];
    for (let i = 0; i < props.length; i += 2) {
      pairs.push(props.slice(i, i + 2));
    }
    return pairs;
  };

  const getCurrentProperties = () => {
    switch(tab) {
      case 'rent': return filteredRentals;
      case 'sale': return filteredSales;
      case 'land': return filteredLand;
      default: return filteredRentals;
    }
  };

  const currentPairs = pairProperties(getCurrentProperties().slice(0, 8));

  // ============================================================
  // RENDER PAGE
  // ============================================================
  return (
    <>
      <style>{styles}</style>

      {/* ============================================================ */}
      
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">🇰🇪 Kenya's #1 Trusted Platform</div>
          <h1>Find Your Perfect <em>Home</em> in Kenya</h1>
          <p>Verified rentals, sales & land. No scams. No hidden fees.</p>
          <div className="hero-stats">
            <div><div className="hero-stat-num">5K+</div><div className="hero-stat-label">Listings</div></div>
            <div><div className="hero-stat-num">35</div><div className="hero-stat-label">Counties</div></div>
            <div><div className="hero-stat-num">12K+</div><div className="hero-stat-label">Happy Users</div></div>
          </div>
          
          {/* ============================================================ */}
          {/* SEARCH BOX WITH AUTOCOMPLETE & RECENT SEARCHES */}
          {/* ============================================================ */}
          <div className="search-box">
            <div className="search-tabs">
              {[['rent', '🏠 Rent'], ['sale', '💰 Sale'], ['land', '🌾 Land']].map(([v, l]) => (
                <button key={v} className={`search-tab${tab === v ? ' active' : ''}`} onClick={() => setTab(v)}>{l}</button>
              ))}
            </div>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="🔍 Search houses, apartments, land in Kenya..."
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
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
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
                      maxHeight: '250px',
                      overflowY: 'auto'
                    }}>
                      {searchSuggestions.map((sug, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchQuery(sug.value);
                            setShowSuggestions(false);
                            handleSearch();
                          }}
                          style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            borderBottom: idx < searchSuggestions.length - 1 ? '1px solid #2E2E5E' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#252550'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <span>{sug.type === 'location' ? '📍' : '🏠'}</span>
                          <div>
                            <div style={{ color: 'white' }}>{sug.value}</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.5)' }}>
                              {sug.type === 'location' ? 'Location' : 'Property'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  style={{
                    background: '#E63030',
                    border: 'none',
                    borderRadius: '40px',
                    padding: '0 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {searching ? '...' : 'Search'}
                </button>
              </div>
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.4)' }}>Recent:</span>
                  {recentSearches.slice(0, 5).map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(search.search_query);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      style={{
                        background: 'rgba(255,255,255,.1)',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,.6)',
                        cursor: 'pointer'
                      }}
                    >
                      🔍 {search.search_query}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Filter Row */}
            <div className="search-row">
              <div className="s-wrap">
                <label>📍 Location</label>
                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                  <option value="">All Areas</option>
                  {['Nairobi CBD', 'Westlands', 'Kilimani', 'Kileleshwa', 'Lavington', 'Karen', 'Langata', 'Rongai', 'Kitengela', 'Ruiru', 'Thika', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="s-wrap">
                <label>🏠 Property Type</label>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="s-wrap">
                <label>🛏 Bedrooms</label>
                <select value={bedroomsFilter} onChange={e => setBedroomsFilter(e.target.value)}>
                  <option value="all">Any</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED CAROUSEL */}
      {/* ============================================================ */}
      {!loading && featured.length > 0 && (
        <div className="section">
          <div className="sec-hdr">
            <div><div className="sec-label">Premium Picks</div><div className="sec-title">⭐ Featured Listings</div></div>
          </div>
          <FeaturedCarousel properties={featured} />
        </div>
      )}

      {/* ============================================================ */}
      {/* PROPERTIES GRID - Horizontal Pairs (2 per row) */}
      {/* ============================================================ */}
      <div className="section">
        <div className="sec-hdr">
          <div>
            <div className="sec-label">
              {tab === 'rent' ? 'Available Now' : tab === 'sale' ? 'Premium Properties' : 'Land & Plots'}
            </div>
            <div className="sec-title">
              {tab === 'rent' ? '🏠 For Rent' : tab === 'sale' ? '💰 For Sale' : '🌾 Land for Sale'}
            </div>
          </div>
          <Link to={`/${tab === 'rent' ? 'rentals' : tab === 'sale' ? 'for-sale' : 'land'}`} className="see-all">See all →</Link>
        </div>
        
        {/* Quick Filter Bar */}
        <div className="filter-bar">
          <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            <option value="">📍 All Locations</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
          </select>
          <select className="filter-select" value={bedroomsFilter} onChange={e => setBedroomsFilter(e.target.value)}>
            <option value="all">🛏 Any Beds</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
          </select>
        </div>

        <div className="cards-grid">
          {loading ? (
            <>
              <div className="card-pair"><SkeletonCard /><SkeletonCard /></div>
              <div className="card-pair"><SkeletonCard /><SkeletonCard /></div>
            </>
          ) : currentPairs.length > 0 ? (
            currentPairs.map((pair, idx) => (
              <div key={idx}>
                <div className="card-pair">
                  {pair.map(prop => (
                    <PropCard 
                      key={prop.id} 
                      prop={prop} 
                      isFavorited={favorites.includes(prop.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                  {pair.length === 1 && <div style={{ visibility: 'hidden' }} />}
                </div>
                {/* Ad Banner after every 2 pairs */}
                {(idx + 1) % 2 === 0 && idx !== currentPairs.length - 1 && (
                  <div className="ad-banner" onClick={() => nav('/add-property')}>
                    <h4>📢 List Your Property</h4>
                    <p>Get featured and reach thousands of tenants →</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              No properties found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* PROMOTED BANNER */}
      {/* ============================================================ */}
      <div className="ad-banner promoted" style={{ margin: '0 1rem' }} onClick={() => nav('/for-sale')}>
        <h4>🔥 HOT DEALS THIS WEEK</h4>
        <p>Discounted properties in Westlands & Kilimani. Limited time offer →</p>
      </div>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Makao<span>Yetu</span></div>
              <div className="footer-tagline">Kenya's most trusted property platform. Find your dream home today.</div>
            </div>
            <div>
              <div className="footer-heading">For Tenants</div>
              <Link to="/rentals" className="footer-link">🏠 Find Rentals</Link>
              <Link to="/for-sale" className="footer-link">💰 Buy Property</Link>
              <Link to="/land" className="footer-link">🌾 Buy Land</Link>
              <Link to="/favorites" className="footer-link">❤️ My Favorites</Link>
            </div>
            <div>
              <div className="footer-heading">For Landlords</div>
              <Link to="/add-property" className="footer-link">📢 List Property</Link>
              <Link to="/admin" className="footer-link">⚙️ Admin Panel</Link>
            </div>
            <div>
              <div className="footer-heading">Company</div>
              <Link to="/about" className="footer-link">📖 About Us</Link>
              <Link to="/contact" className="footer-link">📞 Contact</Link>
              <Link to="/faq" className="footer-link">❓ FAQ</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Makao Yetu. 🇰🇪 Proudly Kenyan</span>
            <div className="socials">
              <a href="#" className="social-pill">Facebook</a>
              <a href="#" className="social-pill">Instagram</a>
              <a href="#" className="social-pill">X</a>
              <a href="#" className="social-pill">WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}