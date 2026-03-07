import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';

const presetDurations = [
  { minutes: 15, label: '15 min', desc: 'Quick review' },
  { minutes: 25, label: '25 min', desc: 'Pomodoro' },
  { minutes: 30, label: '30 min', desc: 'Half hour' },
  { minutes: 45, label: '45 min', desc: 'Deep focus' },
  { minutes: 60, label: '60 min', desc: 'Full session' },
];

export default function StartSession() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleStart = () => {
    if (!subject.trim()) return;
    const mins = useCustom ? parseInt(customDuration) : duration;
    if (!mins || mins < 1 || mins > 180) return;

    navigate('/timer', {
      state: { subject: subject.trim(), duration: mins }
    });
  };

  return (
    <div className="page start-session-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Start Session</h1>
      </header>

      <div className="session-form">
        <div className="form-group">
          <label>What are you studying?</label>
          <input
            type="text"
            placeholder="e.g., Math, Biology, History..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="form-input"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label>How long?</label>
          <div className="duration-grid">
            {presetDurations.map(d => (
              <button
                key={d.minutes}
                className={`duration-card ${!useCustom && duration === d.minutes ? 'selected' : ''}`}
                onClick={() => { setDuration(d.minutes); setUseCustom(false); }}
              >
                <Clock size={18} />
                <span className="duration-value">{d.label}</span>
                <span className="duration-desc">{d.desc}</span>
              </button>
            ))}
            <button
              className={`duration-card ${useCustom ? 'selected' : ''}`}
              onClick={() => setUseCustom(true)}
            >
              <Clock size={18} />
              <span className="duration-value">Custom</span>
              <span className="duration-desc">Set your own</span>
            </button>
          </div>
        </div>

        {useCustom && (
          <div className="form-group">
            <label>Custom duration (minutes)</label>
            <input
              type="number"
              placeholder="1-180"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              className="form-input"
              min="1"
              max="180"
            />
          </div>
        )}

        <button
          className="btn-primary btn-large"
          onClick={handleStart}
          disabled={!subject.trim() || (useCustom && (!customDuration || parseInt(customDuration) < 1))}
        >
          Begin Session
        </button>
      </div>
    </div>
  );
}
