import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pause, Play, X } from 'lucide-react';

export default function Timer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, duration } = location.state || {};

  const [timeLeft, setTimeLeft] = useState((duration || 25) * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const totalSeconds = (duration || 25) * 60;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!subject || !duration) {
      navigate('/start-session');
      return;
    }
  }, [subject, duration, navigate]);

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/result', {
        state: { subject, duration, completed: true }
      });
    }
  }, [timeLeft, navigate, subject, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleCancel = () => {
    clearInterval(intervalRef.current);
    navigate('/');
  };

  if (!subject) return null;

  return (
    <div className="page timer-page">
      <div className="timer-subject">{subject}</div>

      <div className="timer-circle-container">
        <svg className="timer-svg" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r="120"
            className="timer-track"
          />
          <circle
            cx="130"
            cy="130"
            r="120"
            className="timer-progress"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-digits">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="timer-label">{isPaused ? 'Paused' : 'Studying'}</span>
        </div>
      </div>

      <div className="timer-controls">
        <button
          className="timer-btn pause-btn"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play size={28} /> : <Pause size={28} />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        <button
          className="timer-btn cancel-btn"
          onClick={() => setShowCancel(true)}
        >
          <X size={28} />
          <span>Cancel</span>
        </button>
      </div>

      {showCancel && (
        <div className="modal-overlay" onClick={() => setShowCancel(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Session?</h3>
            <p>You'll lose progress for this session. Are you sure?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCancel(false)}>Keep Going</button>
              <button className="btn-danger" onClick={handleCancel}>Cancel Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
