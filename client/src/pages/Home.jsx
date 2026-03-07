import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PetDisplay from '../components/PetDisplay';
import ProgressBar from '../components/ProgressBar';
import StatsCard from '../components/StatsCard';
import api from '../api';

const petTypes = [
  { type: 'hamster', emoji: '🐹', label: 'Hamster' },
  { type: 'dog', emoji: '🐕', label: 'Dog' },
  { type: 'cat', emoji: '🐱', label: 'Cat' },
  { type: 'raccoon', emoji: '🦝', label: 'Raccoon' },
];

export default function Home() {
  const { user, pet, loading, refreshData } = useApp();
  const navigate = useNavigate();
  const [showPetSetup, setShowPetSetup] = useState(false);
  const [selectedType, setSelectedType] = useState('hamster');
  const [petName, setPetName] = useState('');
  const [creating, setCreating] = useState(false);
  const [equippedDetails, setEquippedDetails] = useState([]);

  useEffect(() => {
    if (!loading && !pet) {
      setShowPetSetup(true);
    }
  }, [loading, pet]);

  useEffect(() => {
    if (pet) {
      const equipped = JSON.parse(pet.equipped_items || '[]');
      if (equipped.length > 0) {
        api.get('/wardrobe').then(res => {
          const details = res.data.filter(item => equipped.includes(item.id));
          setEquippedDetails(details);
        });
      } else {
        setEquippedDetails([]);
      }
    }
  }, [pet]);

  const createPet = async () => {
    if (!petName.trim()) return;
    setCreating(true);
    try {
      await api.post('/pets', { name: petName.trim(), type: selectedType });
      await refreshData();
      setShowPetSetup(false);
    } catch (err) {
      console.error('Failed to create pet:', err);
    }
    setCreating(false);
  };

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (showPetSetup) {
    return (
      <div className="page pet-setup-page">
        <div className="pet-setup-card">
          <h1>Welcome to StudySprout!</h1>
          <p>Choose your study buddy</p>
          <div className="pet-type-grid">
            {petTypes.map(p => (
              <button
                key={p.type}
                className={`pet-type-btn ${selectedType === p.type ? 'selected' : ''}`}
                onClick={() => setSelectedType(p.type)}
              >
                <span className="pet-type-emoji">{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Name your pet..."
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="pet-name-input"
            maxLength={20}
          />
          <button
            className="btn-primary"
            onClick={createPet}
            disabled={!petName.trim() || creating}
          >
            {creating ? 'Creating...' : 'Adopt Pet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <header className="home-header">
        <h1>StudySprout</h1>
        <p>Welcome back, {user?.username || 'Student'}!</p>
      </header>

      {pet && (
        <div className="pet-section">
          <PetDisplay pet={pet} equippedDetails={equippedDetails} size="large" />
          <div className="pet-bars">
            <ProgressBar
              value={pet.happiness}
              label="Happiness"
              color="#ff6b6b"
            />
            <ProgressBar
              value={pet.xp}
              label="Pet XP"
              color="#51cf66"
            />
          </div>
        </div>
      )}

      <div className="stats-grid">
        <StatsCard icon="⭐" label="Total XP" value={user?.xp || 0} color="#667eea" />
        <StatsCard icon="🪙" label="Coins" value={user?.coins || 0} color="#fcc419" />
        <StatsCard icon="🔥" label="Streak" value={`${user?.streak_count || 0} days`} color="#ff6b6b" />
      </div>

      <div className="quick-actions">
        <button className="action-btn study-btn" onClick={() => navigate('/start-session')}>
          <span className="action-icon">📖</span>
          <span>Start Study Session</span>
        </button>
        <button className="action-btn wardrobe-btn" onClick={() => navigate('/wardrobe')}>
          <span className="action-icon">👔</span>
          <span>View Wardrobe</span>
        </button>
        <button className="action-btn calendar-btn" onClick={() => navigate('/calendar')}>
          <span className="action-icon">📅</span>
          <span>View Calendar</span>
        </button>
      </div>
    </div>
  );
}
