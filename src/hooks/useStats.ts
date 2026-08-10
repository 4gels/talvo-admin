// src/hooks/useStats.ts
import { useState, useEffect, useCallback } from 'react';
import { statsApi } from '@/api/stats';
import { SystemStats } from '@/types';
import toast from 'react-hot-toast';

export const useStats = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statsApi.getSystemStats();
      setStats(data);
    } catch (error) {
      toast.error('فشل تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    loadStats,
  };
};