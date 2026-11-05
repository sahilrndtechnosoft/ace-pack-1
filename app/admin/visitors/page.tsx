'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Activity,
  Layers,
  ArrowUpRight,
  ExternalLink,
  X,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface SiteVisitor {
  id: string;
  visitor_id: string;
  ip_address: string | null;
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string | null;
  os: string | null;
  initial_landing_page: string | null;
  initial_referrer: string | null;
  country: string | null;
  city: string | null;
  visit_count: number;
  first_visit_at: string;
  last_visit_at: string;
  created_at: string;
}

interface VisitorLog {
  id: string;
  page_url: string;
  page_title: string | null;
  referrer: string | null;
  is_new_visitor: number;
  ip_address: string | null;
  device_type: string;
  browser: string | null;
  os: string | null;
  created_at: string;
}

interface VisitorStats {
  totalVisitors: number;
  newVisitorsToday: number;
  newVisitorsThisWeek: number;
  returningVisitors: number;
  totalPageviews: number;
  pageviewsToday: number;
  desktopCount: number;
  mobileCount: number;
  tabletCount: number;
  topPages: Array<{ path: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
}

export default function VisitorsAdminPage() {
  const [visitors, setVisitors] = useState<SiteVisitor[]>([]);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitorType, setVisitorType] = useState('all'); // 'all', 'new', 'returning'
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // 'today', '7days', '30days', 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<SiteVisitor | null>(null);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchVisitors = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        visitor_type: visitorType,
        device_type: deviceFilter,
        date_range: dateRange,
      });

      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      }

      const res = await fetch(`/api/admin/visitors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
        setCurrentPage(data.page || 1);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching site visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors(currentPage);
  }, [visitorType, deviceFilter, dateRange, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVisitors(1);
  };

  const openVisitorDetail = async (visitor: SiteVisitor) => {
    setSelectedVisitor(visitor);
    setDetailModalOpen(true);
    setLoadingDetail(true);

    try {
      const res = await fetch(`/api/admin/visitors?visitor_id=${encodeURIComponent(visitor.visitor_id)}`);
      if (res.ok) {
        const data = await res.json();
        setVisitorLogs(data.logs || []);
        if (data.visitor) {
          setSelectedVisitor(data.visitor);
        }
      }
    } catch (err) {
      console.error('Error fetching visitor detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeleteVisitor = async (visitorId: string) => {
    try {
      const res = await fetch(`/api/admin/visitors?visitor_id=${encodeURIComponent(visitorId)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVisitors((prev) => prev.filter((v) => v.visitor_id !== visitorId));
        setDeleteConfirmId(null);
        if (detailModalOpen && selectedVisitor?.visitor_id === visitorId) {
          setDetailModalOpen(false);
          setSelectedVisitor(null);
        }
        setToastMessage('Visitor record deleted.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting visitor:', err);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  // Percentages for Devices
  const totalDev = stats ? (stats.desktopCount + stats.mobileCount + stats.tabletCount) || 1 : 1;
  const deskPct = stats ? Math.round((stats.desktopCount / totalDev) * 100) : 0;
  const mobPct = stats ? Math.round((stats.mobileCount / totalDev) * 100) : 0;
  const tabPct = stats ? Math.round((stats.tabletCount / totalDev) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161B22] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161B22] p-6 rounded-2xl border border-[#1E2633]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Live Web Traffic
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Site Visitors &amp; Audience Logs</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time tracking of new and returning visitors across all Ace Packaging catalog and product pages.
          </p>
        </div>

        <button
          onClick={() => fetchVisitors(currentPage)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F2733] hover:bg-[#283344] text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-[#2D3848] shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Traffic</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Total Unique Visitors</span>
            <Users className="w-4 h-4 text-[#b99750]" />
          </div>
          <div className="text-2xl font-black text-white">{stats?.totalVisitors ?? 0}</div>
          <span className="text-[10px] text-gray-400">Unique visitors identified</span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium">New Visitors Today</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{stats?.newVisitorsToday ?? 0}</div>
          <span className="text-[10px] text-emerald-400/80">
            {stats?.newVisitorsThisWeek ?? 0} this past week
          </span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Returning Visitors</span>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{stats?.returningVisitors ?? 0}</div>
          <span className="text-[10px] text-gray-400">Multi-session repeat clients</span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Total Pageviews</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats?.totalPageviews ?? 0}</div>
          <span className="text-[10px] text-gray-400">
            {stats?.pageviewsToday ?? 0} hits today
          </span>
        </div>
      </div>

      {/* Analytics Insights: Devices & Landing Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device Breakdown */}
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#1E2633]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-3">
            Traffic By Device
          </span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" /> Desktop
                </span>
                <span className="text-emerald-400">{deskPct}% ({stats?.desktopCount ?? 0})</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D1117] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${deskPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Mobile
                </span>
                <span className="text-blue-400">{mobPct}% ({stats?.mobileCount ?? 0})</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D1117] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${mobPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Tablet className="w-3.5 h-3.5 text-purple-400" /> Tablet
                </span>
                <span className="text-purple-400">{tabPct}% ({stats?.tabletCount ?? 0})</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D1117] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${tabPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Landing Pages */}
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#1E2633]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-3">
            Top Landing Pages
          </span>
          <div className="space-y-2">
            {stats?.topPages && stats.topPages.length > 0 ? (
              stats.topPages.map((page, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 bg-[#0D1117] rounded-lg border border-[#1E2633]"
                >
                  <span className="truncate max-w-[180px] font-mono text-gray-300 text-[11px]" title={page.path}>
                    {page.path}
                  </span>
                  <span className="font-bold text-[#b99750] px-2 py-0.5 rounded bg-[#b99750]/10 text-[11px]">
                    {page.count} visits
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No landing pages recorded yet.</p>
            )}
          </div>
        </div>

        {/* Top Browsers */}
        <div className="bg-[#161B22] p-5 rounded-2xl border border-[#1E2633]">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-3">
            Top Browsers
          </span>
          <div className="space-y-2">
            {stats?.topBrowsers && stats.topBrowsers.length > 0 ? (
              stats.topBrowsers.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 bg-[#0D1117] rounded-lg border border-[#1E2633]"
                >
                  <span className="text-gray-300 font-medium text-[11px]">
                    {b.browser}
                  </span>
                  <span className="font-bold text-gray-400 px-2 py-0.5 rounded bg-[#1F2733] text-[11px]">
                    {b.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No browser data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visitor Type Filter */}
          <div className="flex items-center bg-[#0D1117] p-1 rounded-lg border border-[#1E2633]">
            {[
              { id: 'all', label: 'All Visitors' },
              { id: 'new', label: 'New Only' },
              { id: 'returning', label: 'Returning' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setVisitorType(btn.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  visitorType === btn.id
                    ? 'bg-[#b99750] text-[#0A0D12]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Device Filter */}
          <select
            value={deviceFilter}
            onChange={(e) => {
              setDeviceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#0D1117] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#b99750]"
          >
            <option value="all">All Devices</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#0D1117] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-[#b99750]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search IP, Visitor ID, OS, URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2633] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                  fetchVisitors(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#b99750] hover:bg-[#cfa144] text-[#0A0D12] rounded-lg text-xs font-bold transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Visitors Table */}
      <div className="bg-[#161B22] rounded-2xl border border-[#1E2633] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E2633] bg-[#0D1117]/60 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Visitor / Client</th>
                <th className="py-3 px-4">Device &amp; OS</th>
                <th className="py-3 px-4">Initial Landing Page</th>
                <th className="py-3 px-4">IP &amp; Location</th>
                <th className="py-3 px-4">First Visit</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2633]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#b99750]" />
                    <span>Analyzing web visitor logs...</span>
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#b99750]" />
                    <p className="font-semibold text-gray-300">No visitors logged matching your filters.</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      As soon as users browse the website, their visits and sessions will automatically appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                visitors.map((item) => {
                  const isNew = item.visit_count <= 1;
                  return (
                    <tr key={item.id} className="hover:bg-[#1C2330] transition-colors">
                      {/* Visitor ID & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-white font-semibold">
                            {item.visitor_id.substring(0, 16)}...
                          </span>
                          {isNew ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              NEW
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b99750]/20 text-[#b99750] border border-[#b99750]/30">
                              {item.visit_count} visits
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Device & OS */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-200 font-medium">
                          {getDeviceIcon(item.device_type)}
                          <span>{item.device_type}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">{item.os || 'Unknown OS'}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {item.browser || 'Browser'}
                        </div>
                      </td>

                      {/* Initial Landing Page */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-mono text-gray-300 text-[11px] truncate block" title={item.initial_landing_page || '/'}>
                          {item.initial_landing_page || '/'}
                        </span>
                        {item.initial_referrer && (
                          <span className="text-[10px] text-gray-500 truncate block mt-0.5">
                            Ref: {item.initial_referrer}
                          </span>
                        )}
                      </td>

                      {/* IP & Location */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-gray-300 text-[11px] block">
                          {item.ip_address || 'unknown'}
                        </span>
                        {(item.city || item.country) && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Globe className="w-2.5 h-2.5 text-[#b99750]" />
                            {[item.city, item.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </td>

                      {/* First Visit */}
                      <td className="py-3.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {formatDate(item.first_visit_at)}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-gray-300 text-[11px] whitespace-nowrap font-medium">
                        {formatDate(item.last_visit_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openVisitorDetail(item)}
                            className="px-2.5 py-1.5 bg-[#1F2733] hover:bg-[#b99750] hover:text-[#0A0D12] text-gray-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            title="View Session Activity"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Activity</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(item.visitor_id)}
                            className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                            title="Delete Visitor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={20}
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchVisitors(page);
          }}
        />
      </div>

      {/* Visitor Detail Modal */}
      {detailModalOpen && selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1E2633] flex items-center justify-between bg-[#0D1117]">
              <div>
                <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block">
                  Visitor Session &amp; Journey
                </span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="font-mono">{selectedVisitor.visitor_id}</span>
                  {selectedVisitor.visit_count > 1 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b99750]/20 text-[#b99750]">
                      Returning ({selectedVisitor.visit_count} visits)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      New Visitor
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#1F2733] hover:bg-[#283344] text-gray-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Device</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    {getDeviceIcon(selectedVisitor.device_type)}
                    <span>{selectedVisitor.device_type}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Operating System</span>
                  <span className="text-xs font-bold text-white">{selectedVisitor.os || 'N/A'}</span>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Browser</span>
                  <span className="text-xs font-bold text-white">{selectedVisitor.browser || 'N/A'}</span>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Hits</span>
                  <span className="text-xs font-bold text-[#b99750]">{selectedVisitor.visit_count} sessions</span>
                </div>
              </div>

              {/* Network & Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">IP &amp; Geographic Location</span>
                  <div className="text-xs text-gray-300 font-mono">{selectedVisitor.ip_address || 'unknown'}</div>
                  {(selectedVisitor.city || selectedVisitor.country) && (
                    <div className="text-[11px] text-gray-400 mt-1">
                      {[selectedVisitor.city, selectedVisitor.country].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Visitor Timeline</span>
                  <div className="text-[11px] text-gray-300">
                    <strong className="text-gray-400">First Seen:</strong> {formatDate(selectedVisitor.first_visit_at)}
                  </div>
                  <div className="text-[11px] text-gray-300 mt-0.5">
                    <strong className="text-gray-400">Last Active:</strong> {formatDate(selectedVisitor.last_visit_at)}
                  </div>
                </div>
              </div>

              {/* Initial Entry URL */}
              <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Initial Entry Page &amp; Referrer
                </span>
                <div className="text-xs font-mono text-emerald-400">
                  {selectedVisitor.initial_landing_page || '/'}
                </div>
                {selectedVisitor.initial_referrer && (
                  <div className="text-[11px] text-gray-400 mt-1">
                    Referred by: {selectedVisitor.initial_referrer}
                  </div>
                )}
              </div>

              {/* Activity Log / Pageviews Timeline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#b99750]" />
                    <span>Pageviews &amp; Actions Log</span>
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Recent {visitorLogs.length} events
                  </span>
                </div>

                {loadingDetail ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#b99750]" />
                    <span>Loading journey history...</span>
                  </div>
                ) : visitorLogs.length === 0 ? (
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-[#1E2633] text-center text-xs text-gray-500">
                    No individual pageview logs available for this session.
                  </div>
                ) : (
                  <div className="bg-[#0D1117] rounded-xl border border-[#1E2633] overflow-hidden">
                    <div className="max-h-60 overflow-y-auto divide-y divide-[#1E2633]">
                      {visitorLogs.map((log) => (
                        <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-4 hover:bg-[#161B22]/50">
                          <div className="min-w-0">
                            <div className="font-mono text-gray-200 text-[11px] truncate">
                              {log.page_url}
                            </div>
                            {log.page_title && (
                              <div className="text-[10px] text-gray-400 truncate mt-0.5">
                                {log.page_title}
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-gray-400 block">
                              {formatDate(log.created_at)}
                            </span>
                            {log.is_new_visitor ? (
                              <span className="text-[9px] font-bold text-emerald-400">First Visit</span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1E2633] flex items-center justify-between bg-[#0D1117]">
              <button
                onClick={() => setDeleteConfirmId(selectedVisitor.visitor_id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 py-1.5 px-3 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Visitor Record</span>
              </button>

              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-[#1F2733] hover:bg-[#283344] text-white rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Visitor Record?</h3>
              <p className="text-xs text-gray-400 mt-1">
                This will delete this visitor and their pageview history.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#1F2733] hover:bg-[#283344] text-gray-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVisitor(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
