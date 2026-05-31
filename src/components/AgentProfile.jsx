// ============================================================
// 🆕 AGENT PROFILE PAGE - Shows agent info, ratings, and reviews
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API = 'http://localhost:5000';

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAgent();
    fetchRatings();
  }, [id]);

  const fetchAgent = async () => {
    try {
      const res = await fetch(`${API}/api/get_user/${id}`);
      const data = await res.json();
      setAgent(data);
    } catch (error) {
      console.error('Error fetching agent:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await fetch(`${API}/api/agent/${id}/ratings`);
      const data = await res.json();
      setRatings(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const submitRating = async () => {
    if (!token) {
      setMessage('Please login to rate this agent');
      return;
    }
    
    if (userRating === 0) {
      setMessage('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/agent/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: userRating, review: userReview })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Rating submitted! Thank you for your feedback.');
        fetchRatings(); // Refresh ratings
        setUserRating(0);
        setUserReview('');
      } else {
        setMessage(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      setMessage('Error submitting rating');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!agent) {
    return <div style={{ background: '#0D0D2B', minHeight: '100vh', padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;
  }

  const avgRating = ratings?.avg_rating || 0;
  const totalRatings = ratings?.total_ratings || 0;
  const fullStars = Math.floor(avgRating);
  const hasHalfStar = avgRating % 1 >= 0.5;

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        
        {/* Agent Info Card */}
        <div style={{ background: '#1A1A3E', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid #2E2E5E' }}>
          <div style={{ fontSize: '4rem' }}>👤</div>
          <h1 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>{agent.username}</h1>
          <p style={{ color: 'rgba(255,255,255,.7)' }}>{agent.email}</p>
          <p style={{ color: 'rgba(255,255,255,.5)' }}>📞 {agent.phone || 'Phone not provided'}</p>
          
          {/* Star Rating Display */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', color: '#F5D200' }}>
                {'⭐'.repeat(fullStars)}{hasHalfStar && '½'}{'☆'.repeat(5 - Math.ceil(avgRating))}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F5D200' }}>{avgRating.toFixed(1)}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.8rem' }}>{totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}</p>
          </div>
          
          {/* Verified Badge */}
          {agent.is_verified === 1 && (
            <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(76,175,80,.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', color: '#4CAF50' }}>
              ✅ Verified Agent
            </div>
          )}
        </div>
        
        {/* Rate Agent Form - Only show if logged in */}
        {token && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>Rate this Agent</h3>
            
            {/* Star Rating Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    color: star <= userRating ? '#F5D200' : 'rgba(255,255,255,.3)'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            
            {/* Review Textarea */}
            <textarea
              placeholder="Write your review (optional)"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                background: '#0D0D2B',
                border: '1px solid #2E2E5E',
                borderRadius: '8px',
                color: 'white',
                marginBottom: '1rem',
                resize: 'vertical'
              }}
            />
            
            {/* Submit Button */}
            <button
              onClick={submitRating}
              disabled={submitting}
              style={{
                background: '#E63030',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            
            {/* Success/Error Message */}
            {message && <div style={{ marginTop: '1rem', padding: '8px', background: 'rgba(76,175,80,.2)', borderRadius: '8px', color: '#4CAF50' }}>{message}</div>}
          </div>
        )}
        
        {/* Reviews List */}
        {ratings?.reviews?.length > 0 && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📝 Reviews</h3>
            {ratings.reviews.map((review, idx) => (
              <div key={idx} style={{ borderBottom: idx < ratings.reviews.length - 1 ? '1px solid #2E2E5E' : 'none', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{review.user_name}</span>
                  <span style={{ color: '#F5D200' }}>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '0.9rem' }}>{review.review}</p>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.7rem' }}>{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}