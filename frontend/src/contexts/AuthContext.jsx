import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;

  // Set up axios interceptor for authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', {
        email,
        password,
        role
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      toast.success('Login successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', userData);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      toast.success('Registration successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const forgotPassword = async (email, role) => {
    try {
      setError(null);
      const response = await axios.post('/auth/forgot-password', { email, role });
      toast.success('Password reset instructions sent to your email');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset instructions';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await axios.post('/auth/reset-password', { token, password });
      toast.success('Password reset successful');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await axios.put(`/${user.role}/profile`, updates);
      setUser(prev => ({ ...prev, ...response.data.data }));
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put('/auth/update-password', { currentPassword, newPassword });
      toast.success('Password updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      setError(message);
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePassword,
    setError
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};