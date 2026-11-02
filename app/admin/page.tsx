'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Layers,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  FileDown,
  Activity,
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Settings,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';

interface OverviewData {
  stats: {
    totalPages: number;
    totalSections: number;
    activeSections: number;
    totalBlogs: number;
    totalEvents: number;
    totalDownloads: number;
    totalMedia: number;
    maintenanceMode: boolean;
    siteName: string;
    logoUrl: string;
  };
  recentLogs: Array<{
    id: string;
    admin_email: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: string;
    created_at: string;
  }>;
  recentSections: Array<{
    id: string;
    page_slug: string;
    section_key: string;
    title: string;
    page_title: string;
    updated_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Live Status Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Live MySQL Synchronized
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">Database: acepack_cms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {admin?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Dynamic content control center for Ace Packaging. All changes persist in MySQL and appear live on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#b99750]' : ''}`} />
            <span>Refresh Stats</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
          >
            <span>Live Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Pages */}
        <Link
          href="/admin/pages"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pages</span>
            <div className="w-7 h-7 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalPages ?? '...'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Managed routes</span>
        </Link>

        {/* Sections */}
        <Link
          href="/admin/sections"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Sections</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalSections ?? '...'}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">
            {data?.stats?.activeSections ?? 0} Live & Active
          </span>
        </Link>

        {/* Blogs */}
        <Link
          href="/admin/blogs"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Articles</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalBlogs ?? '...'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Published posts</span>
        </Link>

        {/* Events */}
        <Link
          href="/admin/events"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Expos</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalEvents ?? '...'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Trade exhibitions</span>
        </Link>

        {/* Media */}
        <Link
          href="/admin/media"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Media</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalMedia ?? '...'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Assets library</span>
        </Link>

        {/* Downloads */}
        <Link
          href="/admin/downloads"
          className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Downloads</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">
            {data?.stats?.totalDownloads ?? '...'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">Catalogues & PDFs</span>
        </Link>
      </div>

      {/* Quick Launchpad Actions */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Instant CMS Quick Actions
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">Direct management shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/admin/sections?page=home"
            className="p-3.5 rounded-2xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-snug group-hover:text-[#b99750] transition-colors">
                Edit Homepage Sections
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Hero, Facts, Stats, CTA</span>
            </div>
          </Link>

          <Link
            href="/admin/header-footer"
            className="p-3.5 rounded-2xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-snug group-hover:text-[#b99750] transition-colors">
                Header &amp; Footer
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Logo, Nav, Copyright</span>
            </div>
          </Link>

          <Link
            href="/admin/blogs"
            className="p-3.5 rounded-2xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-snug group-hover:text-[#b99750] transition-colors">
                Create Blog Article
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Publish insights</span>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="p-3.5 rounded-2xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-snug group-hover:text-[#b99750] transition-colors">
                Upload Media
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Images, PDFs &amp; Videos</span>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="p-3.5 rounded-2xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-snug group-hover:text-[#b99750] transition-colors">
                Global Settings
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Branding &amp; Contact info</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Split: Recently Modified Sections & Real-time Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recently Modified Sections (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#b99750]" />
              <h2 className="text-sm font-extrabold text-white">Recently Updated Sections</h2>
            </div>
            <Link
              href="/admin/sections"
              className="text-xs font-bold text-[#b99750] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {(!data?.recentSections || data.recentSections.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">No section updates recorded yet.</p>
            ) : (
              data.recentSections.map((sec) => (
                <Link
                  key={sec.id}
                  href={`/admin/sections?page=${sec.page_slug}`}
                  className="p-3 rounded-xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] flex items-center justify-between transition-colors group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                      {sec.page_title || sec.page_slug}
                    </span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-[#b99750] transition-colors">
                      {sec.title || sec.section_key}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                      Key: {sec.section_key}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {formatDate(sec.updated_at)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Real-time Activity Logs (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-extrabold text-white">Administrator Activity Trail</h2>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs font-bold text-[#b99750] hover:underline flex items-center gap-1"
            >
              <span>Audit History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 overflow-x-auto">
            {(!data?.recentLogs || data.recentLogs.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">No activity logged yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E2633] text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                    <th className="pb-2">Action</th>
                    <th className="pb-2">Target</th>
                    <th className="pb-2">Admin</th>
                    <th className="pb-2 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2230]">
                  {data.recentLogs.slice(0, 7).map((log) => (
                    <tr key={log.id} className="hover:bg-[#141A24]/60">
                      <td className="py-2.5 pr-2 font-mono font-bold text-[#b99750]">
                        {log.action}
                      </td>
                      <td className="py-2.5 pr-2 text-gray-300 font-medium truncate max-w-[140px]">
                        {log.entity_type} {log.entity_id ? `(${log.entity_id.replace(/^sec_|^page_|^blog_/, '')})` : ''}
                      </td>
                      <td className="py-2.5 pr-2 text-gray-400 font-mono text-[11px]">
                        {log.admin_email}
                      </td>
                      <td className="py-2.5 text-right text-[11px] text-gray-500 font-mono">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
