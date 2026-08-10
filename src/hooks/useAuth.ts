// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { User, LoginRequest } from '@/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ تحميل المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // ✅ تسجيل الدخول
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authApi.login(data);
      
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success(`مرحباً ${response.user.full_name}`);
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      toast.error('فشل تسجيل الدخول');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ تسجيل الخروج
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  }, [navigate]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
};