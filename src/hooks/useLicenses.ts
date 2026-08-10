// src/hooks/useLicenses.ts
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { licensesApi } from '@/api/licenses';
import { LicenseGenerate, LicenseResponse } from '@/types';

export const useLicenses = () => {
  const [loading, setLoading] = useState(false);

  // ✅ توليد مفتاح جديد
  const generateLicense = useCallback(async (data: LicenseGenerate) => {
    try {
      setLoading(true);
      const response = await licensesApi.generate(data);
      toast.success('✅ تم توليد المفتاح بنجاح!');
      return { success: true, data: response };
    } catch (error) {
      toast.error('فشل توليد المفتاح');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ التحقق من المفتاح
  const validateLicense = useCallback(async (licenseKey: string) => {
    try {
      const response = await licensesApi.validate(licenseKey);
      return { success: true, data: response };
    } catch (error) {
      return { success: false };
    }
  }, []);

  // ✅ إعادة توليد مفتاح لمستأجر
  const regenerateLicense = useCallback(async (tenantId: number) => {
    try {
      setLoading(true);
      const response = await licensesApi.regenerate(tenantId);
      toast.success('✅ تم إعادة توليد المفتاح بنجاح');
      return { success: true, license_key: response.license_key };
    } catch (error) {
      toast.error('فشل إعادة توليد المفتاح');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    generateLicense,
    validateLicense,
    regenerateLicense,
  };
};