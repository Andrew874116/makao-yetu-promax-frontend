import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000';

const SocialFeatures = () => {
  const [groupViewings, setGroupViewings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [watchReports, setWatchReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roommateForm, setRoommateForm] = useState({ budget: '', area: '', move_in_date: '' });
  const [reportForm, setReportForm] = useState({ type: 'water', location: '', description: '' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [g, p, r, w] = await Promise.all([
        fetch(`${API}/api/social/group_viewings`).then(res => res.json()),
        fetch(`${API}/api/social/property_votes`).then(res => res.json()),
        fetch(`${API}/api/social/roommates`).then(res => res.json()),
        fetch(`${API}/api/social/community_watch`).then(res => res.json())
      ]);
      setGroupViewings(g);
      setProperties(p);
      setRoommates(r);
      setWatchReports(w);
    } catch (err) {
      console.error('Error fetching social data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const joinViewing = async (viewingId) => {
    try {
      await fetch(`${API}/api/social/join_viewing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ viewing_id: viewingId })
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const voteProperty = async (propertyId, voteType) => {
    try {
      await fetch(`${API}/api/social/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ property_id: propertyId, vote: voteType })
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const submitRoommate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/social/find_roommate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(roommateForm)
      });
      setRoommateForm({ budget: '', area: '', move_in_date: '' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/api/social/community_report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(reportForm)
      });
      setReportForm({ type: 'water', location: '', description: '' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const contactOnWhatsApp = (roommate) => {
    const message = encodeURIComponent(`Hi! I saw your roommate listing on Makao Yetu. I'm looking for a room in ${roommate.area} with budget Ksh ${roommate.budget}. Let's connect!`);
    window.open(`https://wa.me/${roommate.phone || '254700000000'}?text=${message}`, '_blank');
  };

  if (loading) return <div className="loading-container"><div className="loader"></div><p>Loading community features...</p></div>;

  return (
    <>
      <style>{`
        .social-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .social-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
        .social-card { background: var(--card); border-radius: 20px; padding: 1.5rem; border: 1px solid var(--border); }
        .social-card h2 { color: #F5D200; margin-bottom: 1rem; font-size: 1.3rem; }
        .item-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .item-card { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 1rem; }
        .item-title { font-weight: bold; margin-bottom: 0.25rem; }
        .item-meta { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; }
        .vote-buttons { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .vote-up { background: #4CAF50; color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 20px; cursor: pointer; }
        .vote-down { background: #E63030; color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 20px; cursor: pointer; }
        .join-btn, .contact-btn { background: #E63030; color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 20px; cursor: pointer; margin-top: 0.5rem; }
        .social-form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .social-input, .social-select, .social-textarea { padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: inherit; }
        .social-textarea { resize: vertical; min-height: 80px; }
        .submit-btn { background: #E63030; color: white; border: none; padding: 0.75rem; border-radius: 10px; font-weight: bold; cursor: pointer; }
        .report-badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 20px; font-size: 0.7rem; margin-bottom: 0.5rem; }
        .report-water { background: #2196F3; }
        .report-power { background: #FF9800; }
        .report-security { background: #E63030; }
        .loader { width: 50px; height: 50px; border: 3px solid var(--border); border-top-color: #E63030; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
        .loading-container { text-align: center; padding: 3rem; color: var(--text); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="social-container">
        <div className="social-grid">
          <div className="social-card">
            <h2>👥 Group Viewings</h2>
            <div className="item-list">
              {groupViewings.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--muted)' }}>No group viewings scheduled</div> :
                groupViewings.map(v => (
                  <div key={v.id} className="item-card">
                    <div className="item-title">{v.property_title}</div>
                    <div className="item-meta">📍 {v.location} • 🕐 {new Date(v.scheduled_time).toLocaleString()}</div>
                    <div className="item-meta">👥 {v.participants || 0} people going</div>
                    <button className="join-btn" onClick={() => joinViewing(v.id)}>Join This Viewing</button>
                  </div>
                ))}
            </div>
          </div>

          <div className="social-card">
            <h2>🗳️ Property Voting</h2>
            <div className="item-list">
              {properties.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--muted)' }}>No properties to vote on</div> :
                properties.map(p => (
                  <div key={p.id} className="item-card">
                    <div className="item-title">{p.title}</div>
                    <div className="item-meta">💰 Ksh {Number(p.price).toLocaleString()}/month</div>
                    <div className="item-meta">👍 {p.upvotes || 0} fair • 👎 {p.downvotes || 0} overpriced</div>
                    <div className="vote-buttons">
                      <button className="vote-up" onClick={() => voteProperty(p.id, 'up')}>👍 Fair Price</button>
                      <button className="vote-down" onClick={() => voteProperty(p.id, 'down')}>👎 Overpriced</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="social-card">
            <h2>🏠 Roommate Finder</h2>
            <form className="social-form" onSubmit={submitRoommate}>
              <input type="number" className="social-input" placeholder="Your budget (Ksh)" value={roommateForm.budget} onChange={e => setRoommateForm({...roommateForm, budget: e.target.value})} required />
              <input type="text" className="social-input" placeholder="Preferred area (e.g., Westlands)" value={roommateForm.area} onChange={e => setRoommateForm({...roommateForm, area: e.target.value})} required />
              <input type="date" className="social-input" value={roommateForm.move_in_date} onChange={e => setRoommateForm({...roommateForm, move_in_date: e.target.value})} required />
              <button type="submit" className="submit-btn">🔍 Find Roommates</button>
            </form>
            <h3>Looking for roommates near you</h3>
            <div className="item-list">
              {roommates.map((rm, idx) => (
                <div key={idx} className="item-card">
                  <div className="item-title">{rm.username}</div>
                  <div className="item-meta">💰 Budget: Ksh {Number(rm.budget).toLocaleString()}</div>
                  <div className="item-meta">📍 Area: {rm.area}</div>
                  <div className="item-meta">📅 Moving: {new Date(rm.move_in_date).toLocaleDateString()}</div>
                  <button className="contact-btn" onClick={() => contactOnWhatsApp(rm)}>💬 Message on WhatsApp</button>
                </div>
              ))}
            </div>
          </div>

          <div className="social-card">
            <h2>👁️ Community Watch</h2>
            <form className="social-form" onSubmit={submitReport}>
              <select className="social-select" value={reportForm.type} onChange={e => setReportForm({...reportForm, type: e.target.value})}>
                <option value="water">💧 Water Issue</option>
                <option value="power">⚡ Power Outage</option>
                <option value="security">🚨 Security Alert</option>
              </select>
              <input type="text" className="social-input" placeholder="Location (e.g., Kilimani, Nairobi)" value={reportForm.location} onChange={e => setReportForm({...reportForm, location: e.target.value})} required />
              <textarea className="social-textarea" placeholder="Describe the issue..." value={reportForm.description} onChange={e => setReportForm({...reportForm, description: e.target.value})} required />
              <button type="submit" className="submit-btn">📢 Report Issue</button>
            </form>
            <h3>Recent Reports</h3>
            <div className="item-list">
              {watchReports.map((rep, idx) => (
                <div key={idx} className="item-card">
                  <span className={`report-badge report-${rep.report_type}`}>
                    {rep.report_type === 'water' && '💧 Water'}
                    {rep.report_type === 'power' && '⚡ Power'}
                    {rep.report_type === 'security' && '🚨 Security'}
                  </span>
                  <div className="item-title">{rep.location}</div>
                  <div className="item-meta">{rep.description}</div>
                  <div className="item-meta">📅 {new Date(rep.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialFeatures;