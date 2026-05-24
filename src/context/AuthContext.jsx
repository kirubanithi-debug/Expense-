import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_API = 'http://localhost:5000/api/auth';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('expense_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failure');
      }

      const safeUser = await response.json();
      localStorage.setItem('expense_user', JSON.stringify(safeUser));
      setUser(safeUser);
      return safeUser;
    } catch (error) {
      console.error('Registration Protocol Exception:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Access denied');
      }

      const safeUser = await response.json();
      localStorage.setItem('expense_user', JSON.stringify(safeUser));
      setUser(safeUser);
      return safeUser;
    } catch (error) {
      console.error('Authentication Handshake Exception:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('expense_user');
    setUser(null);
  };

  const updateBudget = (budget) => {
    const updated = { ...user, budget };
    localStorage.setItem('expense_user', JSON.stringify(updated));
    setUser(updated);
  };

  const updateSettings = (settings) => {
    const updated = { ...user, settings: { ...user.settings, ...settings } };
    localStorage.setItem('expense_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateBudget, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
