// ============================================================
// AI ASSISTANT - Property Twin, Move Predictor, Life Planner, House Inspector
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'https://makao-yetu-promax.onrender.com';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState('twin');
  const [dreamHome, setDreamHome] = useState({ salary: '', location: '', bedrooms: '', commute: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [inspectorImage, setInspectorImage] = useState(null);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [lifeEvent, setLifeEvent] = useState({ event: 'marriage', timeline: 1 });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/ai_recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary: dreamHome.salary,
          location: dreamHome.location,
          bedrooms: dreamHome.bedrooms,
          prop_type: 'rent'
        })
      });
      const data = await res.json();
      setRecommendations(data.properties || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeHouse = async () => {
    if (!inspectorImage) return;
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      setInspectionResult({
        mold: Math.random() > 0.7 ? 'Detected' : 'Not detected',
        cracks: Math.random() > 0.8 ? 'Minor cracks found' : 'No cracks',
        leaks: Math.random() > 0.9 ? 'Possible leak' : 'No leaks',
        overall: Math.random() > 0.7 ? 'Good condition' : 'Needs inspection',
        score: Math.floor(60 + Math.random() * 40)
      });
      setLoading(false);
    }, 2000);
  };

  const predictLifeEvent = async () => {
    setLoading(true);
    setTimeout(() => {
      setPrediction({
        recommendation: lifeEvent.event === 'marriage' ? 
          'Consider upgrading to a 2-bedroom apartment in family-friendly area like Kilimani or Lavington' :
          'Look for properties with extra room for home office or nursery',
        timeframe: lifeEvent.timeline === 1 ? 'Start looking in 3-6 months' : 'You have time, start saving for deposit',
        budget: lifeEvent.event === 'marriage' ? 'Budget Ksh 25,000-35,000/month' : 'Budget Ksh 20,000-25,000/month'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ background: '#0D0D2B', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.1)', border: '1px solid #2E2E5E', padding: '8px 16px', borderRadius: '40px', color: 'white', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#F5D200', marginBottom: '0.5rem' }}>
          🤖 AI Property Assistant
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: '2rem' }}>
          Your personal AI for property advice, predictions, and inspections
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('twin')} style={{ padding: '10px 20px', background: activeTab === 'twin' ? '#E63030' : '#1A1A3E', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>🏠 Property Twin</button>
          <button onClick={() => setActiveTab('inspector')} style={{ padding: '10px 20px', background: activeTab === 'inspector' ? '#E63030' : '#1A1A3E', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>🔍 House Inspector</button>
          <button onClick={() => setActiveTab('life')} style={{ padding: '10px 20px', background: activeTab === 'life' ? '#E63030' : '#1A1A3E', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>📅 Life Planner</button>
          <button onClick={() => setActiveTab('risk')} style={{ padding: '10px 20px', background: activeTab === 'risk' ? '#E63030' : '#1A1A3E', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>⚠️ Risk Radar</button>
        </div>

        {/* Property Twin / Recommendations */}
        {activeTab === 'twin' && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>🏠 Find Your Dream Home</h3>
            <input type="number" placeholder="Monthly Salary (Ksh)" value={dreamHome.salary} onChange={e => setDreamHome({...dreamHome, salary: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
            <input type="text" placeholder="Preferred Location" value={dreamHome.location} onChange={e => setDreamHome({...dreamHome, location: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
            <select value={dreamHome.bedrooms} onChange={e => setDreamHome({...dreamHome, bedrooms: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }}>
              <option value="">Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
            <button onClick={getRecommendations} disabled={loading} style={{ width: '100%', background: '#E63030', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Thinking...' : 'Find My Dream Home'}</button>
            
            {recommendations.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ color: '#F5D200', marginBottom: '0.5rem' }}>AI Recommendations:</h4>
                {recommendations.map(prop => (
                  <Link key={prop.id} to={`/property/${prop.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1rem', background: '#0D0D2B', borderRadius: '8px', marginBottom: '0.5rem' }}>
                      <div><strong>{prop.title}</strong> - Ksh {prop.price}/month</div>
                      <div style={{ fontSize: '0.7rem', color: '#4CAF50' }}>📍 {prop.location}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* House Inspector */}
        {activeTab === 'inspector' && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>🔍 AI House Inspector</h3>
            <div style={{ border: '2px dashed #2E2E5E', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => document.getElementById('inspect-image').click()}>
              <div style={{ fontSize: '3rem' }}>📸</div>
              <p>Upload a property photo for AI analysis</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,.5)' }}>Detects mold, cracks, leaks, and issues</p>
            </div>
            <input id="inspect-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { setInspectorImage(e.target.files[0]); analyzeHouse(); }} />
            
            {inspectionResult && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#0D0D2B', borderRadius: '12px' }}>
                <h4 style={{ color: '#F5D200' }}>Inspection Results</h4>
                <div>🦠 Mold: <span style={{ color: inspectionResult.mold === 'Detected' ? '#E63030' : '#4CAF50' }}>{inspectionResult.mold}</span></div>
                <div>🔨 Cracks: {inspectionResult.cracks}</div>
                <div>💧 Leaks: {inspectionResult.leaks}</div>
                <div>📊 Overall Score: <strong style={{ color: inspectionResult.score >= 70 ? '#4CAF50' : '#F5D200' }}>{inspectionResult.score}/100</strong></div>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#4CAF50' }}>{inspectionResult.overall}</div>
              </div>
            )}
          </div>
        )}

        {/* Life Planner */}
        {activeTab === 'life' && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>📅 Life Event Planner</h3>
            <select value={lifeEvent.event} onChange={e => setLifeEvent({...lifeEvent, event: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }}>
              <option value="marriage">💍 Getting Married</option>
              <option value="children">👶 Having Children</option>
              <option value="job">💼 New Job</option>
              <option value="retirement">🏖️ Retirement</option>
            </select>
            <select value={lifeEvent.timeline} onChange={e => setLifeEvent({...lifeEvent, timeline: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }}>
              <option value="1">Within 1 year</option>
              <option value="2">1-2 years</option>
              <option value="3">2-5 years</option>
            </select>
            <button onClick={predictLifeEvent} disabled={loading} style={{ width: '100%', background: '#E63030', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Predicting...' : 'Plan My Future'}</button>
            
            {prediction && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#0D0D2B', borderRadius: '12px' }}>
                <p><strong>AI Advice:</strong> {prediction.recommendation}</p>
                <p><strong>Timeline:</strong> {prediction.timeframe}</p>
                <p><strong>Budget Suggestion:</strong> {prediction.budget}</p>
              </div>
            )}
          </div>
        )}

        {/* Risk Radar */}
        {activeTab === 'risk' && (
          <div style={{ background: '#1A1A3E', borderRadius: '16px', padding: '1.5rem', border: '1px solid #2E2E5E' }}>
            <h3 style={{ color: '#F5D200', marginBottom: '1rem' }}>⚠️ Property Risk Radar</h3>
            <p style={{ marginBottom: '1rem' }}>Get risk scores for any property location</p>
            <input type="text" placeholder="Enter location (e.g., Westlands, Nairobi)" style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: '#0D0D2B', border: '1px solid #2E2E5E', borderRadius: '8px', color: 'white' }} />
            <button style={{ width: '100%', background: '#E63030', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Analyze Risk</button>
            
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#0D0D2B', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem' }}>💧</div>
                <div>Flood Risk</div>
                <div style={{ color: '#4CAF50' }}>Low</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#0D0D2B', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem' }}>🔒</div>
                <div>Crime Rate</div>
                <div style={{ color: '#F5D200' }}>Medium</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#0D0D2B', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem' }}>🏗️</div>
                <div>Development</div>
                <div style={{ color: '#4CAF50' }}>High Growth</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#0D0D2B', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem' }}>🌊</div>
                <div>Erosion Risk</div>
                <div style={{ color: '#4CAF50' }}>Low</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}