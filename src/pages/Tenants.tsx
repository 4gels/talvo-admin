// src/pages/Tenants.tsx
import React, { useState } from 'react';
import { useTenants } from '@/hooks/useTenants';
import { TenantCard } from '@/components/tenants/TenantCard';
import { TenantForm } from '@/components/tenants/TenantForm';
import { Plus, Search, Filter } from 'lucide-react';

export const Tenants: React.FC = () => {
  const { tenants, loading, loadTenants } = useTenants();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.arabic_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* ✅ الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏢 المستأجرين</h1>
          <p className="text-gray-500">إدارة الشركات والمؤسسات المستخدمة للنظام</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          إضافة مستأجر
        </button>
      </div>

      {/* ✅ شريط البحث */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="بحث عن مستأجر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* ✅ قائمة المستأجرين */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Building2 className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-2">لا توجد مستأجرين</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            إضافة مستأجر جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} onUpdate={loadTenants} />
          ))}
        </div>
      )}

      {/* ✅ نافذة إضافة مستأجر */}
      {showForm && (
        <TenantForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadTenants();
          }}
        />
      )}
    </div>
  );
};