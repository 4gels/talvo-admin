// src/components/licenses/LicenseGenerator.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { licensesApi } from '@/api/licenses';
import { X, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ Schema التحقق
const licenseSchema = z.object({
  name: z.string().min(2, 'اسم الشركة مطلوب'),
  arabic_name: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  subscription_plan: z.enum(['basic', 'pro', 'enterprise']),
  max_users: z.number().min(1, 'عدد المستخدمين مطلوب'),
  subscription_days: z.number().min(30, 'مدة الاشتراك يجب أن تكون 30 يوم على الأقل'),
});

type FormData = z.infer<typeof licenseSchema>;

interface LicenseGeneratorProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LicenseGenerator: React.FC<LicenseGeneratorProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      subscription_plan: 'basic',
      max_users: 5,
      subscription_days: 365,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await licensesApi.generate(data);
      
      if (result.success) {
        setGeneratedKey(result.license_key);
        setAdminPassword(result.admin_password);
        toast.success('✅ تم توليد المفتاح بنجاح!');
        
        // ✅ نسخ المفتاح تلقائياً
        navigator.clipboard.writeText(result.license_key);
        toast.success('📋 تم نسخ المفتاح إلى الحافظة');
        
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      toast.error('فشل توليد المفتاح');
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast.success('تم نسخ المفتاح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">🔑 توليد مفتاح تفعيل جديد</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ نموذج التوليد */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الشركة *
              </label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="اسم الشركة"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم بالعربية
              </label>
              <input
                {...register('arabic_name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="الاسم بالعربية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="admin@company.com"
                dir="ltr"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الهاتف
              </label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="رقم الهاتف"
                dir="ltr"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                {...register('address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="العنوان بالكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                خطة الاشتراك *
              </label>
              <select
                {...register('subscription_plan')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عدد المستخدمين *
              </label>
              <input
                {...register('max_users', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="5"
                min="1"
              />
              {errors.max_users && (
                <p className="text-red-500 text-xs mt-1">{errors.max_users.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مدة الاشتراك (أيام) *
              </label>
              <input
                {...register('subscription_days', { valueAsNumber: true })}
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="365"
                min="30"
              />
              {errors.subscription_days && (
                <p className="text-red-500 text-xs mt-1">{errors.subscription_days.message}</p>
              )}
            </div>
          </div>

          {/* ✅ المفتاح المُولد */}
          {generatedKey && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800">✅ تم توليد المفتاح بنجاح!</p>
                  <div className="mt-2 p-2 bg-white rounded border border-green-200">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-sm font-mono text-gray-700 truncate" dir="ltr">
                        {generatedKey}
                      </code>
                      <button
                        onClick={copyKey}
                        className="p-1 hover:bg-gray-100 rounded transition flex-shrink-0"
                      >
                        <Copy size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                  {adminPassword && (
                    <p className="mt-2 text-sm text-gray-600">
                      🔒 كلمة مرور المدير: <strong>{adminPassword}</strong>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    ⚠️ تم نسخ المفتاح تلقائياً، يرجى حفظه في مكان آمن
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ الأزرار */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !!generatedKey}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التوليد...
                </span>
              ) : generatedKey ? (
                '✅ تم التوليد'
              ) : (
                '🔑 توليد المفتاح'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              إغلاق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};