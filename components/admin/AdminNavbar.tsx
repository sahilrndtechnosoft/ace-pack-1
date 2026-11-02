'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, Shield, Bell, User } from 'lucide-react';
import type { AdminPayload } from '@/lib/auth';

interface NavbarProps {
  admin: AdminPayload | null;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const AdminNavbar: React.FC<NavbarProps> = ({ admin, onToggleSidebar, onLogout }) => {
  return (
    <header className="h-16 bg-[#0D1117]/90 backdrop-blur-md border-b border-[#1E2633] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between text-gray-200">
      {/* Left: Mobile hamburger & current breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#161D27] hover:bg-[#1E2633] text-gray-300 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-bold text-gray-400">Admin Control Center</span>
          <span className="text-gray-600">/</span>
          <span className="font-extrabold text-[#b99750] uppercase tracking-wider">
            Live MySQL Persistence
          </span>
        </div>
      </div>

      {/* Right: Live View, Database status, Admin profile */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161D27] hover:bg-[#b99750] hover:text-[#0A0D12] text-xs font-bold text-gray-300 border border-[#1E2633] transition-all"
        >
          <span>Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Admin Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#1E2633]">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#161D27] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#b99750] text-[#0A0D12] font-black text-xs flex items-center justify-center">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {admin?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block">
                {admin?.email || 'admin@acepack.com'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
