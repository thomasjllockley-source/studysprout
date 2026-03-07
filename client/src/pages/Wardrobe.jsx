import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../api';

const itemEmojis = {
  hat: '🎩',
  glasses: '👓',
  scarf: '🧣',
  collar: '📿',
  bow: '🎀',
  cape: '🦸',
};

const categories = ['all', 'hat', 'glasses', 'scarf', 'collar', 'bow', 'cape'];

export default function Wardrobe() {
  const navigate = useNavigate();
  const { user, refreshData, fetchPet } = useApp();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get('/wardrobe');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const buyItem = async (itemId) => {
    setBuying(itemId);
    try {
      await api.post(`/wardrobe/buy/${itemId}`);
      await refreshData();
      await fetchItems();
    } catch (err) {
      console.error('Failed to buy item:', err);
    }
    setBuying(null);
  };

  const toggleEquip = async (itemId) => {
    try {
      await api.post(`/wardrobe/equip/${itemId}`);
      await fetchPet();
      await fetchItems();
    } catch (err) {
      console.error('Failed to toggle equip:', err);
    }
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.type === filter);

  return (
    <div className="page wardrobe-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Wardrobe</h1>
        <div className="coins-display">🪙 {user?.coins || 0}</div>
      </header>

      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-tab ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : `${itemEmojis[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loading">Loading items...</div>
      ) : (
        <div className="wardrobe-grid">
          {filteredItems.map(item => (
            <div key={item.id} className={`wardrobe-card ${item.owned ? 'owned' : ''} ${item.equipped ? 'equipped' : ''}`}>
              <div className="wardrobe-card-emoji">{itemEmojis[item.type]}</div>
              <div className="wardrobe-card-name">{item.name}</div>
              <div className="wardrobe-card-desc">{item.description}</div>
              <div className="wardrobe-card-price">🪙 {item.price}</div>

              {!item.owned && (
                <button
                  className="btn-buy"
                  disabled={(user?.coins || 0) < item.price || buying === item.id}
                  onClick={() => buyItem(item.id)}
                >
                  {buying === item.id ? 'Buying...' : (user?.coins || 0) < item.price ? 'Not enough' : 'Buy'}
                </button>
              )}

              {item.owned && (
                <button
                  className={`btn-equip ${item.equipped ? 'equipped' : ''}`}
                  onClick={() => toggleEquip(item.id)}
                >
                  {item.equipped ? 'Unequip' : 'Equip'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
