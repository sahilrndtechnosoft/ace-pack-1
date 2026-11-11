'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  FileDown,
  Settings,
  History,
  User,
  LogOut,
  ChevronRight,
  ExternalLink,
  Grid,
  Package,
  Mail,
  Users,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const NAV_GROUPS = [
  { heading: null, items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }] },
  {
    heading: 'Website Content',
    items: [
      { label: 'Website Pages', href: '/admin/pages', icon: FileText },
      { label: 'Blog Management', href: '/admin/blogs', icon: BookOpen },
      { label: 'Events & Expos', href: '/admin/events', icon: Calendar },
      { label: 'Download Center', href: '/admin/downloads', icon: FileDown },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    heading: 'Product Catalogue',
    items: [
      { label: 'Categories', href: '/admin/categories', icon: Grid },
      { label: 'Products', href: '/admin/products', icon: Package },
    ],
  },
  {
    heading: 'Site-wide Settings',
    items: [
      { label: 'Header, Footer & Contact', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    heading: 'Leads & Analytics',
    items: [
      { label: 'Contact Inquiries', href: '/admin/contacts', icon: Mail },
      { label: 'Site Visitors', href: '/admin/visitors', icon: Users },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'Activity Logs', href: '/admin/activity', icon: History },
      { label: 'Admin Profile', href: '/admin/profile', icon: User },
    ],
  },
];

export const AdminSidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0D1117] border-r border-[#1E2633] text-gray-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1E2633] px-6 flex items-center justify-between shrink-0 bg-[#0A0D12]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 border border-[#b99750]/40 flex items-center justify-center text-[#b99750] font-black text-sm">
              AP
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-wide block leading-none">
                Ace Packaging
              </span>
              <span className="text-[10px] uppercase font-bold text-[#b99750] tracking-wider block mt-1">
                Admin CMS v2.0
              </span>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Website"
            className="w-8 h-8 rounded-lg bg-[#161D27] hover:bg-[#b99750] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading ?? 'main'} className="space-y-1.5 pb-3">
              {group.heading && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  {group.heading}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#b99750] text-[#0A0D12] font-extrabold shadow-sm'
                        : 'text-gray-300 hover:bg-[#161D27] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-[#0A0D12]' : 'text-[#b99750]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Database & User Status Footer */}
        <div className="p-4 border-t border-[#1E2633] bg-[#0A0D12] shrink-0 space-y-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#131922] border border-[#1E2633] text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">MySQL 8.4</span>
            <span className="text-gray-500">•</span>
            <span>acepack_cms</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
