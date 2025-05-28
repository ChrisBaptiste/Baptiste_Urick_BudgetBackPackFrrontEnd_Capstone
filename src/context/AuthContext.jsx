// src/context/AuthContext.jsx - Fixed version
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token validation function
  const validateToken = async (tokenToValidate) => {
    try {
      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenToValidate}`;
      
      // Try to fetch user data or validate token
      // Since you don't have a /me endpoint yet, we'll just assume it's valid
      // In production, you should add a GET /api/auth/me endpoint
      
      return true; // Token is valid
    } catch (error) {
      console.error('Token validation failed:', error);
      return false; // Token is invalid
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        
        if (isValid) {
          setToken(storedToken);
          // TODO: Fetch user data here when you add /api/auth/me endpoint
          // const response = await axios.get('/api/auth/me');
          // setUser(response.data);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Set up axios response interceptor for automatic logout on 401
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          console.log('Received 401, logging out user');
          logoutAction();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const loginAction = (newToken, userData = null) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      if (userData) {
        setUser(userData);
      }
      
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error during login action:', error);
    }
  };

  const logoutAction = () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout action:', error);
    }
  };

  const authContextValue = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    loginAction,
    logoutAction,
    setUser, // Expose for future use
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};