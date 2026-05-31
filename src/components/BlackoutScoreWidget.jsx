// ============================================================
// BLACKOUT SCORE WIDGET - Shows electricity reliability
// ============================================================

import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function BlackoutScoreWidget({ area }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (area) {
      fetchData();
    }
  }, [area]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/api/blackout_score/${encodeURIComponent(area)}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching blackout data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '8px', textAlign: 'center' }}>Loading power data...</div>;
  }

  if (!data) return null;

  const getScoreColor = () => {
    if (data.score >= 7) return '#4CAF50';
    if (data.score >= 4) return '#F5D200';
    return '#E63030';
  };

  return (
    <div style={{
      background: '#1A1A3E',
      borderRadius: '12px',
      padding: '12px',
      marginTop: '12px',
      border: `2px solid ${getScoreColor()}`
    }}>
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>⚡ Electricity Reliability</span>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getScoreColor() }}>
          {data.status} ({data.score}/10)
        </div>
      </div>
      
      {data.generator_hours_per_day > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#F5D200' }}>
          🔌 Generator runs ~{data.generator_hours_per_day} hours/day
        </div>
      )}
      
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,.5)', marginTop: '8px' }}>
        Based on {data.total_reports} community reports
      </div>
    </div>
  );
}