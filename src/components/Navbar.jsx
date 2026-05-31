import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username') || '';
    const adminStatus = localStorage.getItem('is_admin') === '1';
    setIsLoggedIn(!!token);
    setUsername(storedUsername);
    setFirstName(storedUsername.split(' ')[0]);
    setIsAdmin(adminStatus);
  }, []);

  const logout = () => {
    ['token', 'username', 'user_id', 'is_admin', 'is_verified'].forEach(k => localStorage.removeItem(k));
    window.location.href = '/';
  };

  const bottomNavItems = [
    { path: '/', icon: '🏠', label: 'Home', active: location.pathname === '/' },
    { path: '/search', icon: '🔍', label: 'Discover', active: location.pathname === '/search' },
    { path: '/add-property', icon: '➕', label: 'Add', active: location.pathname === '/add-property', requiresAuth: true },
    { path: '/reels', icon: '🎬', label: 'Reels', active: location.pathname === '/reels' },
    { path: '/profile', icon: '👤', label: 'Profile', active: location.pathname === '/profile' },
  ];
  const visibleBottomNav = bottomNavItems.filter(item => !item.requiresAuth || isLoggedIn);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(8,8,24,.98); backdrop-filter: blur(14px); border-top: 1px solid #2E2E5E; display: flex; justify-content: space-around; align-items: center; padding: 8px 16px; z-index: 1000; overflow-x: auto; }
        .bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: white; font-size: 0.7rem; padding: 4px 12px; border-radius: 8px; }
        .bottom-nav-item .icon { font-size: 1.4rem; filter: brightness(0) invert(1); }
        .bottom-nav-item.active .icon { filter: brightness(0) invert(1) sepia(1) hue-rotate(350deg) saturate(5); }
        .bottom-nav-item.active { color: #F5D200; }
        .main-content { padding-bottom: 70px; min-height: 100vh; }
        .top-bar { position: sticky; top: 0; z-index: 999; background: linear-gradient(135deg, #006600, #BB0000, #000000); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
        .brand { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: white; text-decoration: none; }
        .brand span { color: #F5D200; }
        .menu-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 60px; right: 16px; background: var(--card, #1A1A3E); border: 1px solid var(--border, #2E2E5E); border-radius: 12px; padding: 8px; min-width: 200px; z-index: 1001; max-height: 400px; overflow-y: auto; }
        .dropdown-menu a, .dropdown-menu button { display: flex; align-items: center; gap: 12px; padding: 10px 16px; text-decoration: none; color: white; width: 100%; background: none; border: none; cursor: pointer; border-radius: 8px; }
        .dropdown-menu a:hover, .dropdown-menu button:hover { background: rgba(230,48,48,.15); color: #F5D200; }
        .dropdown-divider { height: 1px; background: #2E2E5E; margin: 8px 0; }
        @media (min-width: 768px) { .bottom-nav { max-width: 500px; left: 50%; transform: translateX(-50%); border-radius: 30px 30px 0 0; } }
      `}</style>

      <div className="top-bar">
        <Link to="/" className="brand">Makao<span>Yetu</span></Link>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        {menuOpen && (
          <div className="dropdown-menu">
            <Link to="/rentals" onClick={() => setMenuOpen(false)}>🏠 Rent</Link>
            <Link to="/for-sale" onClick={() => setMenuOpen(false)}>💰 Buy</Link>
            <Link to="/land" onClick={() => setMenuOpen(false)}>🌾 Land</Link>
            <Link to="/hostels" onClick={() => setMenuOpen(false)}>🏘️ Hostels</Link>
            <Link to="/commercial" onClick={() => setMenuOpen(false)}>🏢 Commercial</Link>
            <Link to="/gallery" onClick={() => setMenuOpen(false)}>🖼️ Gallery</Link>
            <Link to="/map" onClick={() => setMenuOpen(false)}>🗺️ Map</Link>
            <Link to="/compare" onClick={() => setMenuOpen(false)}>🔍 Compare</Link>
            <Link to="/mortgage-calculator" onClick={() => setMenuOpen(false)}>🏦 Calculator</Link>
            {isLoggedIn && <Link to="/chat" onClick={() => setMenuOpen(false)}>💬 Messages</Link>}
            {isLoggedIn && <Link to="/favorites" onClick={() => setMenuOpen(false)}>❤️ Favorites</Link>}
            {isLoggedIn && <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>📅 Bookings</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>}
            <Link to="/about" onClick={() => setMenuOpen(false)}>📖 About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>📞 Contact</Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)}>❓ FAQ</Link>
            <Link to="/settings" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
            <div className="dropdown-divider"></div>
            {!isLoggedIn ? (
              <>
                <Link to="/signin" onClick={() => setMenuOpen(false)}>🔐 Sign In</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>📝 Sign Up</Link>
              </>
            ) : (
              <>
                <span style={{ padding: '8px 16px', color: '#F5D200' }}>👋 Hi, {firstName}</span>
                <button onClick={() => { logout(); setMenuOpen(false); }}>🚪 Logout</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bottom-nav">
        {visibleBottomNav.map((item) => (
          <Link key={item.path} to={item.path} className={`bottom-nav-item ${item.active ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}