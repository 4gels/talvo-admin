import { api } from './client';
import { LicenseGenerate, LicenseResponse, LicenseValidate } from '@/types';

export const licensesApi = {
  // ✅ توليد مفتاح جديد
  generate: (data: LicenseGenerate) =>
    api.post<LicenseResponse>('/api/v1/licenses/generate', data),

  // ✅ التحقق من المفتاح
  validate: (licenseKey: string) =>
    api.get<LicenseValidate>(`/api/v1/licenses/${licenseKey}/validate`),

  // ✅ إعادة توليد مفتاح لمستأجر
  regenerate: (tenantId: number) =>
    api.post<{ success: boolean; license_key: string }>(
      `/api/v1/licenses/${tenantId}/regenerate`
    ),
};