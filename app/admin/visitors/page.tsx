'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  Flame,
  Globe,
  Laptop,
  Loader2,
  Mail,
  MonitorSmartphone,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { AdminPagination } from '@/components/admin/AdminPagination';

type LeadTier = 'hot' | 'warm' | 'cold';

interface Visitor {
  visitor_id: string;
  ip_address: string | null;
  device_type: string;
  browser: string | null;
  os: string | null;
  initial_landing_page: string | null;
  initial_referrer: string | null;
  country: string | null;
  city: string | null;
  visit_count: number;
  first_visit_at: string;
  last_visit_at: string;
  pageviews: number;
  product_views: number;
  inquiries: number;
  ip_inquiries: number;
  lead_name: string | null;
  lead_company: string | null;
  lead_email: string | null;
  same_ip: number;
  same_device: number;
  lead_score: number;
  lead_tier: LeadTier;
  lead_reasons: string[];
}

interface Stats {
  totalVisitors: number;
  newVisitorsToday: number;
  returningVisitors: number;
  hotLeads: number;
  warmLeads: number;
  linkedInquiries: number;
  totalPageviews: number;
  pageviewsToday: number;
}

interface Detail {
  visitor: Visitor;
  logs: Array<{ id: string; page_url: string; page_title: string | null; referrer: string | null; created_at: string }>;
  inquiries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string | null;
    subject: string | null;
    category: string | null;
    status: string;
    created_at: string;
    match_type: 'visitor' | 'network';
  }>;
  related: Array<{ visitor_id: string; device_type: string; browser: string | null; os: string | null; visit_count: number; last_visit_at: string; same_device: number }>;
}

const TIER_STYLE: Record<LeadTier, string> = {
  hot: 'bg-red-500/15 text-red-300 border-red-500/30',
  warm: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  cold: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const DEVICE_ICON: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>> = { Mobile: Smartphone, Tablet: Tablet, Desktop: Laptop };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const select = 'h-10 rounded-xl border border-[#222C3D] bg-[#141A24] px-3 text-xs text-white focus:outline-none focus:border-[#b99750]';

function LeadBadge({ tier, score }: { tier: LeadTier; score: number }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${TIER_STYLE[tier]}`}>
      {tier === 'hot' && <Flame className="h-3 w-3" aria-hidden="true" />}
      {tier} · {score}
    </span>
  );
}

export default function VisitorsAdminPage() {
  const { showToast } = useAdmin();
  const [items, setItems] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [lead, setLead] = useState('all');
  const [device, setDevice] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState<'recent' | 'score'>('score');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<{ kind: 'ip' | 'device_of'; value: string; label: string } | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setFailed(false);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      lead,
      device_type: device,
      date_range: dateRange,
      sort,
    });
    if (query) params.set('search', query);
    if (groupFilter) params.set(groupFilter.kind, groupFilter.value);
    try {
      const res = await fetch(`/api/admin/visitors?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setItems(json.items || []);
      setTotal(json.total || 0);
      setStats(json.stats || null);
      setSelected(new Set());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, lead, device, dateRange, sort, query, groupFilter]);

  // Debounce typing so every keystroke doesn't hit the server.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const allOnPageSelected = items.length > 0 && items.every((v) => selected.has(v.visitor_id));
  const toggleAll = () =>
    setSelected(allOnPageSelected ? new Set() : new Set(items.map((v) => v.visitor_id)));
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const deleteVisitors = async (ids: string[]) => {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} visitor${ids.length === 1 ? '' : 's'} and their page-view history? Linked inquiries are kept. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/visitors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_ids: ids }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      showToast(data.message || 'Deleted.');
      if (detail && ids.includes(detail.visitor.visitor_id)) setDetail(null);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const openDetail = async (visitorId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/visitors?visitor_id=${encodeURIComponent(visitorId)}`);
      if (!res.ok) throw new Error();
      setDetail(await res.json());
    } catch {
      showToast('Could not load this visitor.', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const applyGroup = (kind: 'ip' | 'device_of', value: string, label: string) => {
    setDetail(null);
    setPage(1);
    setGroupFilter({ kind, value, label });
  };

  const kpis = useMemo(
    () => [
      { label: 'Hot leads', value: stats?.hotLeads, icon: Flame, tone: 'text-red-300', onClick: () => { setLead('hot'); setPage(1); } },
      { label: 'Warm leads', value: stats?.warmLeads, icon: Flame, tone: 'text-amber-300', onClick: () => { setLead('warm'); setPage(1); } },
      { label: 'Visitors (new today)', value: stats ? `${stats.totalVisitors} (${stats.newVisitorsToday})` : undefined, icon: Users, tone: 'text-[#b99750]' },
      { label: 'Page views (today)', value: stats ? `${stats.totalPageviews} (${stats.pageviewsToday})` : undefined, icon: Eye, tone: 'text-[#b99750]' },
    ],
    [stats]
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Site Visitors &amp; Leads</h1>
          <p className="text-sm text-gray-400 mt-1">
            Who is browsing, how interested they are, and which visitors share a network or device.
          </p>
        </div>
        <button type="button" onClick={load} disabled={loading} aria-label="Refresh" className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#222C3D] text-gray-300 hover:text-white hover:bg-[#161D27] disabled:opacity-50 cursor-pointer">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, tone, onClick }) => {
          const Tag = onClick ? 'button' : 'div';
          return (
            <Tag key={label} {...(onClick ? { type: 'button' as const, onClick } : {})} className={`text-left rounded-2xl bg-[#0D1117] border border-[#1E2633] p-4 ${onClick ? 'hover:border-[#b99750]/60 cursor-pointer' : ''}`}>
              <Icon className={`w-4 h-4 ${tone}`} aria-hidden="true" />
              <span className="block text-2xl font-black text-white mt-2 tabular-nums">{value ?? '…'}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </Tag>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-[#222C3D] p-1" role="group" aria-label="Lead type">
            {[
              ['all', 'All'],
              ['hot', 'Hot'],
              ['warm', 'Warm'],
              ['cold', 'Cold'],
              ['inquired', 'Sent inquiry'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={lead === value}
                onClick={() => {
                  setLead(value);
                  setPage(1);
                }}
                className={`px-3 h-8 rounded-lg text-xs font-bold cursor-pointer ${lead === value ? 'bg-[#b99750] text-[#0A0D12]' : 'text-gray-300 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <select aria-label="Device" value={device} onChange={(e) => { setDevice(e.target.value); setPage(1); }} className={select}>
            <option value="all">All devices</option>
            <option value="Desktop">Desktop</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
          </select>
          <select aria-label="Last active" value={dateRange} onChange={(e) => { setDateRange(e.target.value); setPage(1); }} className={select}>
            <option value="all">Any time</option>
            <option value="today">Active today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as 'recent' | 'score')} className={select}>
            <option value="score">Sort: lead score</option>
            <option value="recent">Sort: most recent</option>
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company, IP, page…"
              aria-label="Search visitors"
              className={`${select} w-full pl-9`}
            />
          </div>
        </div>
        {groupFilter && (
          <div className="flex items-center gap-2 text-xs text-sky-200">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1">
              Showing visitors on {groupFilter.label}
              <button type="button" onClick={() => setGroupFilter(null)} aria-label="Clear filter" className="cursor-pointer hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#b99750]/40 bg-[#161D27] px-4 py-3">
          <span className="text-sm font-bold text-white">{selected.size} selected</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelected(new Set())} className="px-3 h-9 rounded-xl border border-[#222C3D] text-xs font-bold text-gray-300 hover:text-white cursor-pointer">
              Clear
            </button>
            <button type="button" disabled={deleting} onClick={() => deleteVisitors([...selected])} className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-xs font-black disabled:opacity-50 cursor-pointer">
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {failed ? (
          <div role="alert" className="p-10 text-center text-sm text-red-300">
            Visitors couldn’t be loaded. <button type="button" onClick={load} className="underline cursor-pointer">Try again</button>
          </div>
        ) : loading && items.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#b99750]"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading visitors…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No visitors match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} aria-label="Select all visitors on this page" className="w-4 h-4 accent-[#b99750] cursor-pointer" />
                  </th>
                  <th className="py-3 px-3">Lead</th>
                  <th className="py-3 px-3">Interest</th>
                  <th className="py-3 px-3">Device</th>
                  <th className="py-3 px-3">Network</th>
                  <th className="py-3 px-3">Last active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {items.map((v) => {
                  const DeviceIcon = DEVICE_ICON[v.device_type] ?? MonitorSmartphone;
                  return (
                    <tr key={v.visitor_id} className={`hover:bg-[#141A24]/60 ${selected.has(v.visitor_id) ? 'bg-[#b99750]/5' : ''}`}>
                      <td className="py-3 px-4 align-top">
                        <input type="checkbox" checked={selected.has(v.visitor_id)} onChange={() => toggleOne(v.visitor_id)} aria-label={`Select visitor ${v.lead_name || v.visitor_id}`} className="w-4 h-4 accent-[#b99750] cursor-pointer" />
                      </td>
                      <td className="py-3 px-3 align-top">
                        <LeadBadge tier={v.lead_tier} score={v.lead_score} />
                        {v.lead_name ? (
                          <p className="mt-1.5 font-bold text-white text-sm">
                            {v.lead_name}
                            {v.lead_company && <span className="font-normal text-gray-400"> · {v.lead_company}</span>}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-gray-500 font-mono text-[11px]">{v.visitor_id.slice(0, 18)}…</p>
                        )}
                        {v.lead_email && <p className="text-[11px] text-gray-400">{v.lead_email}</p>}
                      </td>
                      <td className="py-3 px-3 align-top text-gray-300 max-w-[260px]">
                        <p className="line-clamp-2">{v.lead_reasons.slice(0, 3).join(' · ') || '—'}</p>
                      </td>
                      <td className="py-3 px-3 align-top text-gray-300">
                        <span className="inline-flex items-center gap-1.5"><DeviceIcon className="w-3.5 h-3.5 text-[#b99750]" aria-hidden="true" />{v.device_type}</span>
                        <p className="text-[11px] text-gray-500">{[v.browser, v.os].filter(Boolean).join(' · ')}</p>
                        {v.same_device > 0 && (
                          <button type="button" onClick={() => applyGroup('device_of', v.visitor_id, 'the same device')} className="mt-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-200 hover:bg-violet-500/20 cursor-pointer">
                            Same device ×{v.same_device + 1}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-gray-300">
                        <span className="font-mono">{v.ip_address || '—'}</span>
                        <p className="text-[11px] text-gray-500">{[v.city, v.country].filter(Boolean).join(', ') || 'Location unknown'}</p>
                        {v.same_ip > 0 && v.ip_address && (
                          <button type="button" onClick={() => applyGroup('ip', v.ip_address as string, `IP ${v.ip_address}`)} className="mt-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-200 hover:bg-sky-500/20 cursor-pointer">
                            Same IP ×{v.same_ip + 1}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top text-gray-300 whitespace-nowrap">
                        {fmt(v.last_visit_at)}
                        <p className="text-[11px] text-gray-500">{v.visit_count} visit{v.visit_count === 1 ? '' : 's'} · {v.pageviews} pages</p>
                      </td>
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <button type="button" onClick={() => openDetail(v.visitor_id)} className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-[#b99750] text-[#0A0D12] text-[11px] font-black cursor-pointer">
                          {detailLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />} Details
                        </button>
                        <button type="button" onClick={() => deleteVisitors([v.visitor_id])} aria-label="Delete visitor" className="ml-1 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/15 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <AdminPagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} pageSizeOptions={[20, 50, 100]} />
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="visitor-title" onKeyDown={(e) => e.key === 'Escape' && setDetail(null)}>
          <div className="w-full max-w-2xl h-full overflow-y-auto bg-[#0A0D12] border-l border-[#1E2633]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#1E2633] bg-[#0A0D12] px-5 py-4">
              <div>
                <LeadBadge tier={detail.visitor.lead_tier} score={detail.visitor.lead_score} />
                <h2 id="visitor-title" className="mt-2 text-lg font-black text-white">
                  {detail.visitor.lead_name || 'Anonymous visitor'}
                  {detail.visitor.lead_company && <span className="text-gray-400 font-semibold"> · {detail.visitor.lead_company}</span>}
                </h2>
                <p className="text-[11px] font-mono text-gray-500">{detail.visitor.visitor_id}</p>
              </div>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close" autoFocus className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#161D27] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-5 text-sm">
              <section>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b99750] mb-2">Why this score</h3>
                <ul className="flex flex-wrap gap-2">
                  {detail.visitor.lead_reasons.map((r) => (
                    <li key={r} className="rounded-full border border-[#222C3D] bg-[#141A24] px-3 py-1 text-xs text-gray-200">{r}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b99750] mb-2">Inquiries</h3>
                {detail.inquiries.length === 0 ? (
                  <p className="text-gray-400">No inquiry from this visitor or network yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {detail.inquiries.map((q) => (
                      <li key={q.id} className="rounded-xl border border-[#1E2633] bg-[#0D1117] p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-white">{q.name}{q.company ? <span className="text-gray-400 font-normal"> · {q.company}</span> : null}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${q.match_type === 'visitor' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-sky-500/15 text-sky-200'}`}>
                            {q.match_type === 'visitor' ? 'Sent by this visitor' : 'Same network (IP)'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-300">
                          <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a> · <a href={`tel:${q.phone}`} className="hover:underline">{q.phone}</a>
                        </p>
                        <p className="text-xs text-gray-500">{[q.subject, q.category].filter(Boolean).join(' · ')} · {fmt(q.created_at)}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <a href="/admin/contacts" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#b99750] hover:underline"><Mail className="w-3.5 h-3.5" /> Open Contact Inquiries</a>
              </section>

              <section>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b99750] mb-2">Device &amp; network</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <dt className="text-gray-500">Device</dt><dd className="text-gray-200">{detail.visitor.device_type} · {[detail.visitor.browser, detail.visitor.os].filter(Boolean).join(' · ')}</dd>
                  <dt className="text-gray-500">IP address</dt><dd className="font-mono text-gray-200">{detail.visitor.ip_address || '—'}</dd>
                  <dt className="text-gray-500">Location</dt><dd className="text-gray-200">{[detail.visitor.city, detail.visitor.country].filter(Boolean).join(', ') || 'Unknown'}</dd>
                  <dt className="text-gray-500">First seen</dt><dd className="text-gray-200">{fmt(detail.visitor.first_visit_at)}</dd>
                  <dt className="text-gray-500">Came from</dt><dd className="text-gray-200 break-all">{detail.visitor.initial_referrer || 'Direct / unknown'}</dd>
                  <dt className="text-gray-500">Landing page</dt><dd className="text-gray-200 break-all">{detail.visitor.initial_landing_page || '—'}</dd>
                </dl>
              </section>

              <section>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b99750] mb-2">
                  <Globe className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />Other visitors on this network ({detail.related.length})
                </h3>
                {detail.related.length === 0 ? (
                  <p className="text-gray-400">No other visitors share this IP address.</p>
                ) : (
                  <>
                    <ul className="divide-y divide-[#1A2230] rounded-xl border border-[#1E2633]">
                      {detail.related.map((r) => (
                        <li key={r.visitor_id}>
                          <button type="button" onClick={() => openDetail(r.visitor_id)} className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#141A24] cursor-pointer">
                            <span className="text-xs text-gray-200">
                              {r.device_type} · {[r.browser, r.os].filter(Boolean).join(' · ')}
                              {r.same_device ? <span className="ml-2 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-200">Same device</span> : null}
                            </span>
                            <span className="text-[11px] text-gray-500">{r.visit_count} visits · {fmt(r.last_visit_at)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {detail.visitor.ip_address && (
                      <button type="button" onClick={() => applyGroup('ip', detail.visitor.ip_address as string, `IP ${detail.visitor.ip_address}`)} className="mt-2 text-xs font-bold text-[#b99750] hover:underline cursor-pointer">
                        Show all of them in the list →
                      </button>
                    )}
                  </>
                )}
              </section>

              <section>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#b99750] mb-2">Journey ({detail.logs.length} most recent pages)</h3>
                {detail.logs.length === 0 ? (
                  <p className="text-gray-400">No page views recorded.</p>
                ) : (
                  <ol className="space-y-1.5 border-l border-[#222C3D] pl-4">
                    {detail.logs.map((l) => (
                      <li key={l.id} className="text-xs">
                        <span className="font-mono text-gray-200 break-all">{l.page_url}</span>
                        <span className="text-gray-500"> · {fmt(l.created_at)}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <div className="pt-2 border-t border-[#1E2633]">
                <button type="button" disabled={deleting} onClick={() => deleteVisitors([detail.visitor.visitor_id])} className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/15 text-xs font-bold disabled:opacity-50 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Delete this visitor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
