// src/api/tenants.ts
import { api } from './client';
import { Tenant, TenantCreate, TenantUpdate, ApiResponse, PaginatedResponse } from '@/types';

export const tenantsApi = {
  // ✅ الحصول على جميع المستأجرين
  getAll: (params?: { skip?: number; limit?: number }) =>
    api.get<PaginatedResponse<Tenant>>('/api/v1/tenants', { params }),

  // ✅ الحصول على مستأجر بواسطة المعرف
  getById: (id: number) =>
    api.get<Tenant>(`/api/v1/tenants/${id}`),

  // ✅ إنشاء مستأجر جديد
  create: (data: TenantCreate) =>
    api.post<Tenant>('/api/v1/tenants', data),

  // ✅ تحديث مستأجر
  update: (id: number, data: TenantUpdate) =>
    api.put<Tenant>(`/api/v1/tenants/${id}`, data),

  // ✅ حذف مستأجر
  delete: (id: number, force?: boolean) =>
    api.delete<{ success: boolean; message: string }>(
      `/api/v1/tenants/${id}${force ? '?force=true' : ''}`
    ),

  // ✅ تغيير حالة المستأجر
  toggleStatus: (id: number) =>
    api.post<{ success: boolean; message: string }>(
      `/api/v1/tenants/${id}/toggle-status`
    ),

  // ✅ إعادة توليد مفتاح التفعيل
  regenerateLicense: (id: number) =>
    api.post<{ success: boolean; license_key: string }>(
      `/api/v1/licenses/${id}/regenerate`
    ),
};