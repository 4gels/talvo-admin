// src/components/tenants/TenantForm.tsx
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tenant, TenantCreate } from '@/types';
import { useTenants } from '@/hooks/useTenants';
import { X } from 'lucide-react';

// ✅ Schema التحقق
const tenantSchema = z.object({
  name: z.string().min(2, 'اسم الشركة مطلوب'),
  arabic_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  subscription_plan: z.enum(['basic', 'pro', 'enterprise']),
  max_users: z.number().min(1, 'عدد المستخدمين مطلوب'),
  subscription_days: z.number().min(30, 'مدة الاشتراك يجب أن تكون 30 يوم على الأقل'),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  tenant?: Tenant;
  onClose: () => void;
  onSuccess: () => void;
}

export const TenantForm: React.FC<TenantFormProps> = ({
  tenant,
  onClose,
  onSuccess,
}) => {
  const { createTenant, updateTenant } = useTenants();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant?.name || '',
      arabic_name: tenant?.arabic_name || '',
      phone: tenant?.phone || '',
      email: tenant?.email || '',
      address: tenant?.address || '',
      subscription_plan: (tenant?.subscription_plan as any) || 'basic',
      max_users: tenant?.max_users || 5,
      subscription_days: 365,
      is_active: tenant?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name,
        arabic_name: tenant.arabic_name || '',
        phone: tenant.phone || '',
        email: tenant.email || '',
        address: tenant.address || '',
        subscription_plan: tenant.subscription_plan as any,
        max_users: tenant.max_users,
        subscription_days: 365,
        is_active: tenant.is_active,
      });
    }
  }, [tenant, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (tenant) {
        await updateTenant(tenant.id, data);
      } else {
        await createTenant(data as TenantCreate);
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {tenant ? '✏️ تعديل مستأجر' : '➕ إضافة مستأجر جديد'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ النموذج */}
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
                الهاتف
              </label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="رقم الهاتف"
                dir="ltr"
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

            <div className="flex items-center gap-2 pt-2">
              <input
                {...register('is_active')}
                type="checkbox"
                id="isActive"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                نشط
              </label>
            </div>
          </div>

          {/* ✅ الأزرار */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الحفظ...
                </span>
              ) : (
                tenant ? 'تحديث' : 'إنشاء'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};