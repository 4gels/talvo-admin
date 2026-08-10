// src/utils/api.ts
import { apiClient } from '@/api/client';

// ✅ دوال مساعدة للـ API
export const api = {
  get: <T>(url: string, params?: any) =>
    apiClient.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    apiClient.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    apiClient.put<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    apiClient.patch<T>(url, data).then((res) => res.data),
};