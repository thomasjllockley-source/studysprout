import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, []);

  const fetchPet = useCallback(async () => {
    try {
      const res = await api.get('/pets');
      setPet(res.data);
    } catch (err) {
      console.error('Failed to fetch pet:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchUser(), fetchPet()]);
    setLoading(false);
  }, [fetchUser, fetchPet]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppContext.Provider value={{ user, pet, loading, setUser, setPet, refreshData, fetchUser, fetchPet }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
