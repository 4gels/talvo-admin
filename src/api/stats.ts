// src/api/stats.ts
import { api } from './client';
import { SystemStats } from '@/types';

export const statsApi = {
  // ✅ الحصول على إحصائيات النظام
  getSystemStats: () =>
    api.get<SystemStats>('/api/v1/stats'),
};