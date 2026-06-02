import React, { useEffect, useState, useRef } from 'react';

const API = 'https://makao-yetu-promax.onrender.com';

const REWARDS = [
  { name: '10 XP', xp: 10, color: '#4CAF50' },
  { name: '20 XP', xp: 20, color: '#8BC34A' },
  { name: '50 XP', xp: 50, color: '#F5D200' },
  { name: 'Ksh 5 Airtime', xp: 0, color: '#2196F3' },
  { name: '100 XP', xp: 100, color: '#E63030' },
  { name: '30 XP', xp: 30, color: '#FF9800' },
  { name: 'Featured Listing', xp: 0, color: '#9C27B0' },
  { name: 'Free Booking', xp: 0, color: '#00BCD4' }
];

const Gamification = () => {
  const [stats, setStats] = useState({ level: 1, xp: 0, next_level_xp: 100 });
  const [badges, setBadges] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, badgesRes, questsRes] = await Promise.all([
        fetch(`${API}/api/gamification/stats`, { headers }),
        fetch(`${API}/api/gamification/badges`, { headers }),
        fetch(`${API}/api/gamification/quests`, { headers })
      ]);

      const statsData = await statsRes.json();
      const badgesData = await badgesRes.json();
      const questsData = await questsRes.json();

      setStats(statsData);
      setBadges(badgesData);
      setQuests(questsData);
    } catch (err) {
      console.error('Error fetching gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const completeQuest = async (questId) => {
    try {
      await fetch(`${API}/api/gamification/complete_quest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quest_id: questId })
      });
      fetchData();
    } catch (err) {
      console.error('Error completing quest:', err);
    }
  };

  const spinWheel = async () => {
    if (spinning || !wheelRef.current) return;
    setSpinning(true);
    setSpinResult(null);

    const randomRotation = Math.floor(Math.random() * (3600 - 720 + 1) + 720);
    wheelRef.current.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
    wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;

    const segmentAngle = 360 / REWARDS.length;
    const finalAngle = randomRotation % 360;
    const segmentIndex = Math.floor((360 - finalAngle) / segmentAngle) % REWARDS.length;
    const landedReward = REWARDS[segmentIndex];

    setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/gamification/spin`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSpinResult(data.reward || landedReward.name);
        fetchData();
      } catch (err) {
        console.error('Error spinning wheel:', err);
        setSpinResult(landedReward.name);
      } finally {
        setSpinning(false);
      }
    }, 3100);
  };

  const xpPercentage = (stats.xp / stats.next_level_xp) * 100;

  if (loading) {
    return <div className="loading-container"><div className="loader"></div><p>Loading your gaming profile...</p></div>;
  }

  return (
    <>
      <style>{`
        .gamification-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .level-card { background: var(--card); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: center; border: 1px solid var(--border); }
        .level-number { font-size: 3rem; font-weight: bold; color: #F5D200; }
        .level-title { font-size: 1rem; color: var(--text); margin-bottom: 1rem; }
        .xp-progress { background: rgba(255,255,255,0.1); border-radius: 10px; height: 12px; overflow: hidden; margin: 1rem 0; }
        .xp-fill { background: linear-gradient(90deg, #E63030, #F5D200); height: 100%; border-radius: 10px; transition: width 0.5s ease; }
        .xp-text { font-size: 0.8rem; color: var(--muted); }
        .badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .badge-item { text-align: center; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
        .badge-icon { font-size: 2rem; }
        .badge-name { font-size: 0.7rem; color: var(--text); margin-top: 0.25rem; }
        .badge-earned { opacity: 1; }
        .badge-locked { opacity: 0.4; }
        .quest-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .quest-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
        .quest-info h4 { margin: 0 0 0.25rem 0; color: #F5D200; }
        .quest-info p { font-size: 0.8rem; color: var(--muted); margin: 0; }
        .quest-reward { font-size: 0.8rem; color: #4CAF50; }
        .quest-btn { background: #E63030; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .quest-btn:disabled { background: #666; cursor: not-allowed; }
        .wheel-container { display: flex; flex-direction: column; align-items: center; margin-top: 1rem; }
        .wheel-wrapper { position: relative; width: 300px; height: 300px; margin: 1rem auto; }
        .wheel { width: 100%; height: 100%; border-radius: 50%; position: relative; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.3); }
        .wheel-segment { position: absolute; width: 50%; height: 50%; transform-origin: 100% 100%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; text-align: center; font-weight: bold; }
        .wheel-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; background: #1A1A3E; border-radius: 50%; z-index: 10; border: 3px solid #F5D200; }
        .wheel-pointer { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid #F5D200; z-index: 20; }
        .spin-btn { background: #E63030; color: white; border: none; padding: 12px 30px; border-radius: 40px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 1rem; }
        .spin-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin-result { margin-top: 1rem; padding: 1rem; background: rgba(76,175,80,0.2); border-radius: 12px; text-align: center; color: #4CAF50; font-weight: bold; }
        .loader { width: 50px; height: 50px; border: 3px solid var(--border); border-top-color: #E63030; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
        .loading-container { text-align: center; padding: 3rem; color: var(--text); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="gamification-container">
        <div className="level-card">
          <div className="level-number">Level {stats.level}</div>
          <div className="level-title">
            {stats.level >= 10 ? '👑 Property Legend' :
             stats.level >= 7 ? '💎 Property Master' :
             stats.level >= 4 ? '⭐ Homebody' :
             stats.level >= 2 ? '🔑 Key Holder' : '🏠 Bedsitter Rookie'}
          </div>
          <div className="xp-progress"><div className="xp-fill" style={{ width: `${xpPercentage}%` }} /></div>
          <div className="xp-text">{stats.xp} / {stats.next_level_xp} XP • {xpPercentage.toFixed(0)}% to next level</div>
        </div>

        <div className="level-card">
          <h3>🏅 Badges Collection</h3>
          <div className="badges-grid">
            {badges.map((badge, idx) => (
              <div key={idx} className={`badge-item ${badge.earned ? 'badge-earned' : 'badge-locked'}`}>
                <div className="badge-icon">{badge.icon || '🏅'}</div>
                <div className="badge-name">{badge.name}</div>
                {badge.earned && <div style={{ fontSize: '0.6rem', color: '#4CAF50' }}>✓ Earned</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="level-card">
          <h3>📋 Weekly Quests</h3>
          <div className="quest-list">
            {quests.map((quest) => (
              <div key={quest.id} className="quest-item">
                <div className="quest-info"><h4>{quest.quest_name}</h4><p>Complete to earn XP!</p></div>
                <div className="quest-reward">+{quest.xp_reward} XP</div>
                <button className="quest-btn" onClick={() => completeQuest(quest.id)} disabled={quest.completed}>
                  {quest.completed ? '✓ Completed' : 'Complete'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="level-card">
          <h3>🎡 Lucky Spin Wheel</h3>
          <div className="wheel-container">
            <div className="wheel-wrapper">
              <div className="wheel-pointer"></div>
              <div className="wheel" ref={wheelRef}>
                {REWARDS.map((reward, idx) => {
                  const angle = idx * 45 * Math.PI / 180;
                  return (
                    <div key={idx} className="wheel-segment" style={{
                      transform: `rotate(${idx * 45}deg)`,
                      backgroundColor: reward.color,
                      clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
                      transformOrigin: '100% 100%',
                      left: '50%', top: '50%'
                    }}>
                      <div style={{ transform: 'rotate(22.5deg)', position: 'absolute', left: '30%', top: '30%', fontSize: '10px' }}>
                        {reward.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="wheel-center"></div>
            </div>
            <button className="spin-btn" onClick={spinWheel} disabled={spinning}>{spinning ? '🎲 Spinning...' : '🎰 Spin Now!'}</button>
            {spinResult && <div className="spin-result">🎉 You won: {spinResult}! 🎉</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gamification;