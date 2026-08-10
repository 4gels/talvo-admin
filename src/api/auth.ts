// src/api/auth.ts
import { api } from './client';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authApi = {
  // ✅ تسجيل الدخول
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/api/v1/auth/login', data),

  // ✅ الحصول على المستخدم الحالي
  getCurrentUser: () =>
    api.get<User>('/api/v1/auth/me'),

  // ✅ تسجيل الخروج
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};