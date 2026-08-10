// src/components/layout/Header.tsx
import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      {/* ✅ الجانب الأيمن */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          لوحة تحكم النظام
        </h1>
      </div>

      {/* ✅ الجانب الأيسر */}
      <div className="flex items-center gap-4">
        {/* ✅ الإشعارات */}
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* ✅ معلومات المستخدم */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.full_name}</p>
            <p className="text-xs text-gray-500">مدير النظام</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.full_name?.[0] || 'A'}
          </div>
        </div>

        {/* ✅ زر تسجيل الخروج (سريع) */}
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};