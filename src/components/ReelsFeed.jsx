// ============================================================
// REELS FEED - TikTok-style vertical video feed
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';

const API = 'https://makao-yetu-promax.onrender.com';

export default function ReelsFeed() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const playerRefs = useRef([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API}/api/get_reels`);
      const data = await res.json();
      setReels(data);
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reelId) => {
    try {
      await fetch(`${API}/api/reel/${reelId}/like`, { method: 'POST' });
      setReels(reels.map(reel => 
        reel.id === reelId ? { ...reel, likes: reel.likes + 1 } : reel
      ));
    } catch (error) {
      console.error('Error liking reel:', error);
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollTop;
    const reelHeight = window.innerHeight;
    const newIndex = Math.round(scrollPosition / reelHeight);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setPlaying(true);
      // Pause all other videos
      playerRefs.current.forEach((player, idx) => {
        if (idx !== newIndex && player) {
          player.getInternalPlayer()?.pause();
        }
      });
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        Loading reels...
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
        <h3>No reels yet</h3>
        <p>Check back soon for property video tours!</p>
        <Link to="/" style={{ color: '#F5D200' }}>Browse Properties →</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          padding: '1rem', 
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>←</Link>
          <h2 style={{ color: '#F5D200', fontSize: '1.2rem' }}>Property Reels</h2>
          <div style={{ width: '30px' }}></div>
        </div>

        {/* Reels Container */}
        <div 
          onScroll={handleScroll}
          style={{ 
            height: '100vh', 
            overflowY: 'scroll', 
            scrollSnapType: 'y mandatory'
          }}
        >
          {reels.map((reel, idx) => (
            <div
              key={reel.id}
              style={{
                height: '100vh',
                scrollSnapAlign: 'start',
                position: 'relative',
                background: '#000'
              }}
            >
              {/* Video Player */}
              <ReactPlayer
                ref={el => playerRefs.current[idx] = el}
                url={reel.video_url}
                playing={idx === currentIndex && playing}
                loop={true}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  file: {
                    attributes: {
                      style: { objectFit: 'cover' }
                    }
                  }
                }}
              />
              
              {/* Overlay Content */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem 1rem',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white'
              }}>
                <Link to={`/property/${reel.property_id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ color: '#F5D200', marginBottom: '4px', fontSize: '1.1rem' }}>{reel.property_title}</h3>
                  <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}>📍 {reel.location}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#F5D200' }}>
                    Ksh {Number(reel.price).toLocaleString()}{reel.prop_type === 'rent' && '/mo'}
                  </p>
                </Link>
              </div>
              
              {/* Right Side Actions */}
              <div style={{
                position: 'absolute',
                right: '12px',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center'
              }}>
                <button onClick={() => handleLike(reel.id)} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ❤️
                  <span style={{ fontSize: '0.7rem', color: 'white' }}>{reel.likes || 0}</span>
                </button>
                
                <Link to={`/property/${reel.property_id}`} style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  💬
                  <span style={{ fontSize: '0.7rem', color: 'white' }}>Details</span>
                </Link>
                
                <a href={`https://wa.me/?text=Check out this property: ${reel.property_title} - ${window.location.origin}/property/${reel.property_id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📱
                  <span style={{ fontSize: '0.7rem', color: 'white' }}>Share</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}