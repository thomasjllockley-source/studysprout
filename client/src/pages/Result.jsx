import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshData } = useApp();
  const { subject, duration, completed } = location.state || {};

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!subject || !duration) {
      navigate('/');
      return;
    }
    if (saved) return;

    const saveSession = async () => {
      try {
        const res = await api.post('/sessions', {
          subject,
          duration_minutes: duration,
          completed: true,
        });
        setResult(res.data);
        setSaved(true);
        await refreshData();
      } catch (err) {
        console.error('Failed to save session:', err);
      }
      setLoading(false);
    };

    saveSession();
  }, [subject, duration, navigate, refreshData, saved]);

  if (!subject) return null;

  return (
    <div className="page result-page">
      <div className="result-card">
        <div className="result-celebration">🎉</div>
        <h1>Great Job!</h1>
        <p className="result-subtitle">You studied <strong>{subject}</strong> for <strong>{duration} minutes</strong></p>

        {loading && <p className="result-loading">Calculating rewards...</p>}

        {result && (
          <div className="result-rewards">
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <span className="reward-label">XP Earned</span>
              <span className="reward-value">+{result.session.xp_earned}</span>
            </div>
            <div className="reward-item">
              <span className="reward-icon">🪙</span>
              <span className="reward-label">Coins Earned</span>
              <span className="reward-value">+{result.session.coins_earned}</span>
            </div>
            {result.happiness_gain > 0 && (
              <div className="reward-item">
                <span className="reward-icon">❤️</span>
                <span className="reward-label">Pet Happiness</span>
                <span className="reward-value">+{result.happiness_gain}</span>
              </div>
            )}
            <div className="reward-item">
              <span className="reward-icon">🔥</span>
              <span className="reward-label">Streak</span>
              <span className="reward-value">{result.streak} days</span>
            </div>
          </div>
        )}

        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
