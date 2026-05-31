// ============================================================
// WATER RELIABILITY WIDGET - Shows water availability score
// ============================================================

import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function WaterReliabilityWidget({ area }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [userRating, setUserRating] = useState(3);
  const [userComment, setUserComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (area) {
      fetchData();
    }
  }, [area]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/water_reliability/${encodeURIComponent(area)}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching water data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/water_report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          area: area,
          rating: userRating,
          comment: userComment
        })
      });
      if (res.ok) {
        alert('Thank you for your report!');
        setShowReport(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '8px', textAlign: 'center' }}>Loading water data...</div>;
  }

  if (!data) return null;

  return (
    <div style={{
      background: '#1A1A3E',
      borderRadius: '12px',
      padding: '12px',
      marginTop: '12px',
      border: `2px solid ${data.status_color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>💧 Water Reliability</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: data.status_color }}>
            {data.status} ({data.score}/10)
          </div>
        </div>
        <button
          onClick={() => setShowReport(!showReport)}
          style={{
            background: 'rgba(255,255,255,.1)',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            color: 'white',
            fontSize: '0.7rem',
            cursor: 'pointer'
          }}
        >
          📢 Report
        </button>
      </div>
      
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.5)' }}>
        Based on {data.total_reports} community reports
      </div>
      
      {/* Report Form */}
      {showReport && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#0D0D2B', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>How is water availability in this area?</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                style={{
                  background: star <= userRating ? '#F5D200' : '#2E2E5E',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: star <= userRating ? '1rem' : '0.8rem'
                }}
              >
                {star <= userRating ? '💧' : '○'}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Optional: Add details about water schedule, tanker prices, etc."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              background: '#1A1A3E',
              border: '1px solid #2E2E5E',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.75rem',
              marginBottom: '8px',
              resize: 'vertical'
            }}
            rows="2"
          />
          <button
            onClick={submitReport}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '8px',
              background: '#E63030',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      )}
    </div>
  );
}