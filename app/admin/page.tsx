'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Edit3,
  ExternalLink,
  FileDown,
  FileText,
  Grid,
  Image as ImageIcon,
  Inbox,
  Mail,
  Package,
  PenLine,
  RefreshCw,
  Settings,
  Users,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { CMS_PAGES, type CmsSectionDef } from '@/lib/cms/registry';

interface OverviewData {
  stats: {
    totalPages: number;
    totalCategories: number;
    totalProducts: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalEvents: number;
    totalDownloads: number;
    totalMedia: number;
    totalContacts?: number;
    unreadContacts?: number;
    newVisitorsToday?: number;
    totalVisitors?: number;
  };
  recentLogs: Array<{ id: string; admin_email: string; action: string; entity_type: string; details: string; created_at: string }>;
  recentSections: Array<{ id: string; page_slug: string; section_key: string; updated_at: string }>;
  recentContacts?: Array<{ id: string; name: string; email: string; company: string | null; status: string; created_at: string }>;
  draftPages: Array<{ page_slug: string; page_title: string; count: number }>;
}

// Plain-language names for the activity log.
const ACTION_TEXT: Record<string, string> = {
  PUBLISH_SECTION: 'published page content',
  UPDATE_SECTION_DRAFT: 'saved a draft of page content',
  CREATE_SECTION: 'added page content',
  DELETE_SECTION: 'deleted old page content',
  CREATE_PAGE: 'created a page',
  UPDATE_PAGE: 'updated page settings / SEO',
  DELETE_PAGE: 'deleted a page',
  CREATE_BLOG: 'wrote a new blog post',
  UPDATE_BLOG: 'edited a blog post',
  DELETE_BLOG: 'deleted a blog post',
  UPLOAD_MEDIA: 'uploaded a file',
  REPLACE_MEDIA: 'replaced a file',
  UPDATE_MEDIA_ALT: 'updated an image description',
  DELETE_MEDIA: 'deleted a file',
  UPDATE_SITE_SETTINGS: 'changed site-wide settings',
  CREATE_EVENT: 'added an event',
  UPDATE_EVENT: 'edited an event',
  DELETE_EVENT: 'deleted an event',
};

const PAGES = Object.entries(CMS_PAGES as Record<string, { title: string; path: string; sections: Record<string, CmsSectionDef> }>);

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

const card = 'rounded-2xl bg-[#0D1117] border border-[#1E2633]';

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const s = data?.stats;
  const unread = s?.unreadContacts ?? 0;
  const draftSections = (data?.draftPages ?? []).reduce((n, p) => n + Number(p.count), 0);

  // Only show edits to sections that appear on the website, labelled the way the editor names them.
  const recentEdits = useMemo(
    () =>
      (data?.recentSections ?? [])
        .map((row) => {
          const page = (CMS_PAGES as Record<string, { title: string; sections: Record<string, CmsSectionDef> }>)[row.page_slug];
          const section = page?.sections[row.section_key];
          return page && section ? { ...row, pageTitle: page.title, label: section.label } : null;
        })
        .filter((row): row is NonNullable<typeof row> => row !== null)
        .slice(0, 6),
    [data]
  );

  const attention = [
    {
      show: unread > 0,
      icon: Inbox,
      tone: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
      title: `${unread} new inquir${unread === 1 ? 'y' : 'ies'}`,
      text: 'Customers are waiting for a reply.',
      href: '/admin/contacts',
      action: 'Open inquiries',
    },
    {
      show: draftSections > 0,
      icon: PenLine,
      tone: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      title: `${draftSections} unpublished change${draftSections === 1 ? '' : 's'}`,
      text: `Saved but not live yet on: ${(data?.draftPages ?? []).map((p) => p.page_title).join(', ')}.`,
      href: `/admin/pages/${data?.draftPages?.[0]?.page_slug ?? ''}`,
      action: 'Review & publish',
    },
    {
      show: (s?.draftBlogs ?? 0) > 0,
      icon: BookOpen,
      tone: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
      title: `${s?.draftBlogs} blog draft${s?.draftBlogs === 1 ? '' : 's'}`,
      text: 'Articles that are not published yet.',
      href: '/admin/blogs',
      action: 'Open blog',
    },
  ].filter((item) => item.show);

  const stats = [
    { label: 'Website pages', value: s?.totalPages, href: '/admin/pages', icon: FileText },
    { label: 'Published blogs', value: s?.publishedBlogs, href: '/admin/blogs', icon: BookOpen },
    { label: 'Products', value: s?.totalProducts, href: '/admin/products', icon: Package },
    { label: 'Categories', value: s?.totalCategories, href: '/admin/categories', icon: Grid },
    { label: 'Events', value: s?.totalEvents, href: '/admin/events', icon: Calendar },
    { label: 'Downloads', value: s?.totalDownloads, href: '/admin/downloads', icon: FileDown },
    { label: 'Media files', value: s?.totalMedia, href: '/admin/media', icon: ImageIcon },
    { label: 'Visitors today', value: s?.newVisitorsToday, href: '/admin/visitors', icon: Users },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {greeting()}, {admin?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">What would you like to update on the website today?</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            aria-label="Refresh dashboard"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#222C3D] text-gray-300 hover:text-white hover:bg-[#161D27] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-sm font-black"
          >
            View website <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {failed && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
          <span className="inline-flex items-center gap-2"><AlertCircle className="w-4 h-4" /> The dashboard couldn’t load. Check your connection and try again.</span>
          <button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 font-bold cursor-pointer">Try again</button>
        </div>
      )}

      {/* Needs attention */}
      <section aria-labelledby="attention-heading">
        <h2 id="attention-heading" className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">Needs your attention</h2>
        {loading && !data ? (
          <div className="grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className={`${card} h-28 animate-pulse`} />)}</div>
        ) : attention.length === 0 ? (
          <div className={`${card} p-5 text-sm text-gray-300`}>All caught up: no new inquiries, unpublished changes or blog drafts.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {attention.map(({ icon: Icon, tone, title, text, href, action }) => (
              <Link key={title} href={href} className={`group rounded-2xl border p-5 flex flex-col gap-2 hover:brightness-125 transition ${tone}`}>
                <Icon className="w-5 h-5" />
                <span className="text-base font-black text-white">{title}</span>
                <span className="text-xs text-gray-300 line-clamp-2">{text}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold">{action} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Edit the website */}
      <section aria-labelledby="edit-heading">
        <div className="flex items-end justify-between mb-3">
          <h2 id="edit-heading" className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Edit your website</h2>
          <Link href="/admin/pages" className="text-xs font-bold text-[#b99750] hover:underline">All pages & SEO →</Link>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {PAGES.map(([slug, page]) => (
            <Link key={slug} href={`/admin/pages/${slug}`} className={`${card} group p-4 hover:border-[#b99750]/60 transition-colors`}>
              <span className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{page.title}</span>
                <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-[#b99750]" />
              </span>
              <span className="block text-[11px] text-gray-500 mt-1">
                {Object.keys(page.sections).length} section{Object.keys(page.sections).length === 1 ? '' : 's'} · {page.path}
              </span>
            </Link>
          ))}
          <Link href="/admin/settings" className="group p-4 rounded-2xl border border-[#b99750]/40 bg-[#b99750]/10 hover:bg-[#b99750]/20 transition-colors">
            <span className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Header, Footer & Contact</span>
              <Settings className="w-4 h-4 text-[#b99750]" />
            </span>
            <span className="block text-[11px] text-gray-400 mt-1">Shown on every page</span>
          </Link>
          <Link href="/admin/blogs" className="group p-4 rounded-2xl border border-[#b99750]/40 bg-[#b99750]/10 hover:bg-[#b99750]/20 transition-colors">
            <span className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Blog articles</span>
              <BookOpen className="w-4 h-4 text-[#b99750]" />
            </span>
            <span className="block text-[11px] text-gray-400 mt-1">Write, edit & publish</span>
          </Link>
        </div>
      </section>

      {/* At a glance */}
      <section aria-labelledby="glance-heading">
        <h2 id="glance-heading" className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">At a glance</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {stats.map(({ label, value, href, icon: Icon }) => (
            <Link key={label} href={href} className={`${card} p-4 hover:border-[#b99750]/60 transition-colors`}>
              <Icon className="w-4 h-4 text-[#b99750]" />
              <span className="block text-2xl font-black text-white mt-2 tabular-nums">
                {loading && !data ? <span className="inline-block w-10 h-6 rounded bg-[#1E2633] animate-pulse" /> : value ?? 0}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest inquiries */}
        <section aria-labelledby="leads-heading" className={`${card} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 id="leads-heading" className="font-bold text-white flex items-center gap-2"><Mail className="w-4 h-4 text-[#b99750]" /> Latest inquiries</h2>
            <Link href="/admin/contacts" className="text-xs font-bold text-[#b99750] hover:underline">View all</Link>
          </div>
          {loading && !data ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-xl bg-[#141A24] animate-pulse" />)}</div>
          ) : !data?.recentContacts?.length ? (
            <p className="text-sm text-gray-400">No inquiries yet. Messages from the website contact forms will appear here.</p>
          ) : (
            <ul className="divide-y divide-[#1A2230]">
              {data.recentContacts.slice(0, 5).map((lead) => (
                <li key={lead.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {lead.name}{lead.company ? <span className="text-gray-400 font-normal"> · {lead.company}</span> : null}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {lead.status === 'unread' && <span className="block text-[10px] font-bold text-sky-300">NEW</span>}
                    <span className="text-[11px] text-gray-500">{timeAgo(lead.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recently edited */}
        <section aria-labelledby="edits-heading" className={`${card} p-5`}>
          <h2 id="edits-heading" className="font-bold text-white flex items-center gap-2 mb-4"><PenLine className="w-4 h-4 text-[#b99750]" /> Recently edited content</h2>
          {loading && !data ? (
            <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-xl bg-[#141A24] animate-pulse" />)}</div>
          ) : recentEdits.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing edited yet. Pick a page above to start.</p>
          ) : (
            <ul className="divide-y divide-[#1A2230]">
              {recentEdits.map((row) => (
                <li key={row.id}>
                  <Link href={`/admin/pages/${row.page_slug}`} className="py-2.5 flex items-center justify-between gap-3 group">
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white truncate group-hover:text-[#b99750]">{row.label}</span>
                      <span className="block text-xs text-gray-500">{row.pageTitle} page</span>
                    </span>
                    <span className="text-[11px] text-gray-500 shrink-0">{timeAgo(row.updated_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Activity */}
      <section aria-labelledby="activity-heading" className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="activity-heading" className="font-bold text-white">Recent activity</h2>
          <Link href="/admin/activity" className="text-xs font-bold text-[#b99750] hover:underline">Full history</Link>
        </div>
        {loading && !data ? (
          <div className="h-24 rounded-xl bg-[#141A24] animate-pulse" />
        ) : !data?.recentLogs?.length ? (
          <p className="text-sm text-gray-400">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.recentLogs.slice(0, 6).map((log) => (
              <li key={log.id} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-gray-300 min-w-0 truncate">
                  <span className="font-semibold text-white">{log.admin_email.split('@')[0]}</span>{' '}
                  {ACTION_TEXT[log.action] ?? log.action.toLowerCase().replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-gray-500 shrink-0">{timeAgo(log.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
