 import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('promanage_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) { console.warn("Auth check failed:", error); }
  }, []);

  const login = (email, password) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('promanage_users') || '[]');
      const foundUser = storedUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const userData = { name: foundUser.name, email: foundUser.email };
        localStorage.setItem('promanage_user', JSON.stringify(userData));
        setUser(userData); setIsAuthenticated(true); navigate('/dashboard'); return true;
      }
      if (email === 'john@company.com' && password === 'password123') {
        const userData = { name: 'John Doe', email: 'john@company.com' };
        localStorage.setItem('promanage_user', JSON.stringify(userData));
        setUser(userData); setIsAuthenticated(true); navigate('/dashboard'); return true;
      }
      return false;
    } catch (error) { console.error("Login error:", error); return false; }
  };

  const signup = (name, email, password) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('promanage_users') || '[]');
      const exists = storedUsers.find(u => u.email === email);
      if (exists) return false;
      const newUser = { name, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('promanage_users', JSON.stringify(storedUsers));
      const userData = { name, email };
      localStorage.setItem('promanage_user', JSON.stringify(userData));
      setUser(userData); setIsAuthenticated(true); navigate('/dashboard'); return true;
    } catch (error) { console.error("Signup error:", error); return false; }
  };

  const logout = () => {
    localStorage.removeItem('promanage_user');
    setUser(null); setIsAuthenticated(false); navigate('/login');
  };

  return (<AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>);
}

export const useAuth = () => { return useContext(AuthContext); };