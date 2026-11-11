import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check initial authentication state
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Attempt to fetch current user profile from the backend
        const response = await authService.getCurrentUser();
        if (response && response.user) {
          setUser(response.user);
          localStorage.setItem('auth_user', JSON.stringify(response.user));
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        // If backend returns 401 or is unreachable but storedUser exists
        console.warn('Session verification notice:', err.message);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await authService.register({ name, email, password });
      return { success: true, message: response.message || 'Registration successful!' };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Registration failed. Please check your details.',
      };
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authService.login({ email, password, rememberMe });
      const { user: userData, token: authToken } = response;

      setUser(userData);
      setToken(authToken);

      if (rememberMe) {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid email or password.',
      };
    }
  };

  // Demo Login (Useful for instant UI review before backend launch)
  const loginDemo = () => {
    const mockUser = {
      id: 999,
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      created_at: new Date().toISOString(),
    };
    const mockToken = 'demo-jwt-token-sample-preview';

    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API notice:', err.message);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    loginDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
