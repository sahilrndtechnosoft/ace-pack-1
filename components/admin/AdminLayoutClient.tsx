'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import type { AdminPayload } from '@/lib/auth';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AdminContextType {
  admin: AdminPayload | null;
  refreshAdmin: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  refreshAdmin: async () => {},
  showToast: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const isLoginPage = pathname === '/admin/login';

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchAdmin = async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        if (isLoginPage) {
          router.replace('/admin');
        }
      } else {
        setAdmin(null);
        if (!isLoginPage) {
          router.replace('/admin/login');
        }
      }
    } catch (err) {
      setAdmin(null);
      if (!isLoginPage) {
        router.replace('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setAdmin(null);
      showToast('Logged out successfully.', 'info');
      router.replace('/admin/login');
    } catch {
      router.replace('/admin/login');
    }
  };

  // If loading and not login page, show initial sleek skeleton
  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center text-[#b99750]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#b99750] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            Authenticating Session...
          </span>
        </div>
      </div>
    );
  }

  // If on login page, render child without dashboard chrome
  if (isLoginPage) {
    return (
      <AdminContext.Provider value={{ admin, refreshAdmin: fetchAdmin, showToast }}>
        {children}
        {/* Toast notifications */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 pointer-events-auto transition-all ${
                t.type === 'error'
                  ? 'bg-red-950/90 border-red-500/50 text-red-200'
                  : 'bg-[#161D27]/95 border-[#b99750]/60 text-white'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0" />
              )}
              <span className="flex-1">{t.message}</span>
            </div>
          ))}
        </div>
      </AdminContext.Provider>
    );
  }

  return (
    <AdminContext.Provider value={{ admin, refreshAdmin: fetchAdmin, showToast }}>
      <div className="min-h-screen bg-[#07090D] text-gray-100 flex flex-col font-sans">
        {/* Collapsible Sidebar */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
          <AdminNavbar
            admin={admin}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Toast Stack */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 pointer-events-auto backdrop-blur-md transition-all ${
                t.type === 'error'
                  ? 'bg-red-950/90 border-red-500/60 text-red-200'
                  : 'bg-[#161D27]/95 border-[#b99750]/60 text-white'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#b99750] shrink-0" />
              )}
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminContext.Provider>
  );
};
