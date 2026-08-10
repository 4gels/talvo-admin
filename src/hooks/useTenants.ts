// src/hooks/useTenants.ts
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tenantsApi } from '@/api/tenants';
import { Tenant, TenantCreate, TenantUpdate } from '@/types';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // ✅ تحميل المستأجرين
  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tenantsApi.getAll({ limit: 100 });
      setTenants(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast.error('فشل تحميل المستأجرين');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ إنشاء مستأجر
  const createTenant = useCallback(async (data: TenantCreate) => {
    try {
      const response = await tenantsApi.create(data);
      toast.success('تم إنشاء المستأجر بنجاح');
      await loadTenants();
      return { success: true, data: response };
    } catch (error) {
      return { success: false };
    }
  }, [loadTenants]);

  // ✅ تحديث مستأجر
  const updateTenant = useCallback(async (id: number, data: TenantUpdate) => {
    try {
      const response = await tenantsApi.update(id, data);
      toast.success('تم تحديث المستأجر بنجاح');
      await loadTenants();
      return { success: true, data: response };
    } catch (error) {
      return { success: false };
    }
  }, [loadTenants]);

  // ✅ حذف مستأجر
  const deleteTenant = useCallback(async (id: number, force?: boolean) => {
    try {
      await tenantsApi.delete(id, force);
      toast.success('تم حذف المستأجر بنجاح');
      await loadTenants();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }, [loadTenants]);

  // ✅ تغيير حالة مستأجر
  const toggleStatus = useCallback(async (id: number) => {
    try {
      const response = await tenantsApi.toggleStatus(id);
      toast.success(response.message);
      await loadTenants();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }, [loadTenants]);

  // ✅ إعادة توليد مفتاح
  const regenerateLicense = useCallback(async (id: number) => {
    try {
      const response = await tenantsApi.regenerateLicense(id);
      toast.success('تم إعادة توليد المفتاح بنجاح');
      return { success: true, license_key: response.license_key };
    } catch (error) {
      return { success: false };
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return {
    tenants,
    loading,
    total,
    loadTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    toggleStatus,
    regenerateLicense,
  };
};