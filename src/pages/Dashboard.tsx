// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { StatsCards } from '@/components/stats/StatsCards';
import { Building2, Users, Key, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { statsApi } from '@/api/stats';
import { SystemStats } from '@/types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsApi.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 لوحة التحكم</h1>
        <p className="text-gray-500">نظرة عامة على النظام</p>
      </div>

      {/* ✅ البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستأجرين</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total_tenants || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600">✅ {stats?.active_tenants || 0} نشط</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-red-600">❌ {stats?.inactive_tenants || 0} غير نشط</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total_users || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المفاتيح النشطة</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.active_tenants || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Key className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total_sales?.toLocaleString() || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ توزيع الخطط */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 توزيع الخطط</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Basic</p>
              <p className="text-2xl font-bold text-gray-800">{stats.plan_distribution.basic}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Pro</p>
              <p className="text-2xl font-bold text-gray-800">{stats.plan_distribution.pro}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Enterprise</p>
              <p className="text-2xl font-bold text-gray-800">{stats.plan_distribution.enterprise}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};