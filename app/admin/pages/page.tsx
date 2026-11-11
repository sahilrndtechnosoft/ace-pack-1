'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, ExternalLink, FileText, Loader2, Plus, Search, Settings2, Trash2, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { CMS_PAGES } from '@/lib/cms/registry';
import { isBuiltInSlug } from '@/lib/cms/pages/custom';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots_index: number;
  is_published: number;
  updated_at: string;
}

type FormState = {
  id?: string;
  title: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  canonical_url: string;
  robots_index: boolean;
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  seo_title: '',
  seo_description: '',
  og_image: '',
  canonical_url: '',
  robots_index: true,
  is_published: true,
};

// Built-in pages are listed in the order visitors meet them in the main menu.
const BUILT_IN_ORDER = Object.keys(CMS_PAGES);

const pagePath = (slug: string) =>
  (CMS_PAGES as Record<string, { path: string }>)[slug]?.path ?? (slug === 'home' ? '/' : `/${slug}`);

const inputClass =
  'w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]';

export default function AdminPagesPage() {
  const { showToast } = useAdmin();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setPages(json.pages || []);
    } catch {
      showToast('Could not load pages. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rank = (slug: string) => {
      const i = BUILT_IN_ORDER.indexOf(slug);
      return i === -1 ? (isBuiltInSlug(slug) ? 500 : 1000) : i;
    };
    return pages
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.slug.includes(q))
      .sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title));
  }, [pages, search]);

  const openSeo = (page: PageItem) =>
    setForm({
      id: page.id,
      title: page.title,
      slug: page.slug,
      seo_title: page.seo_title ?? '',
      seo_description: page.seo_description ?? '',
      og_image: page.og_image ?? '',
      canonical_url: page.canonical_url ?? '',
      robots_index: page.robots_index !== 0,
      is_published: page.is_published !== 0,
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.title.trim()) return showToast('Page name is required.', 'error');
    if (!form.id && !form.slug.trim()) return showToast('URL is required.', 'error');
    if (form.canonical_url && !/^https?:\/\//i.test(form.canonical_url)) {
      return showToast('Canonical URL must start with https://', 'error');
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          seo_title: form.seo_title.trim() || null,
          seo_description: form.seo_description.trim() || null,
          og_image: form.og_image.trim() || null,
          canonical_url: form.canonical_url.trim() || null,
          robots_index: form.robots_index ? 1 : 0,
          is_published: form.is_published ? 1 : 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      showToast(form.id ? 'Page settings saved.' : `Page created at /${form.slug}. Add its content next.`);
      setForm(null);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (page: PageItem) => {
    if (!window.confirm(`Delete the page "${page.title}" (/${page.slug}) and all its content? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${encodeURIComponent(page.id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      showToast(`"${page.title}" deleted.`);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed.', 'error');
    }
  };

  const editingBuiltIn = form?.id ? isBuiltInSlug(form.slug) : false;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Website Pages</h1>
          <p className="text-sm text-gray-400 mt-1">Choose a page to edit its content, or change how it appears in Google.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find a page…"
          aria-label="Find a page"
          className={`${inputClass} pl-9`}
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-sm font-bold rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading pages…
        </div>
      ) : visible.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm rounded-2xl bg-[#0D1117] border border-[#1E2633]">No pages match your search.</div>
      ) : (
        <ul className="rounded-2xl bg-[#0D1117] border border-[#1E2633] divide-y divide-[#1A2230]">
          {visible.map((page) => {
            const builtIn = isBuiltInSlug(page.slug);
            const path = pagePath(page.slug);
            return (
              <li key={page.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white">{page.title}</span>
                      {!builtIn && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300">Custom page</span>}
                      {!builtIn && !page.is_published && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300">Not published</span>}
                      {page.robots_index === 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300">Hidden from Google</span>}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{path}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/pages/${page.slug}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Content
                  </Link>
                  <button type="button" onClick={() => openSeo(page)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#222C3D] text-gray-200 hover:bg-[#161D27] text-xs font-bold cursor-pointer">
                    <Settings2 className="w-3.5 h-3.5" /> SEO & Settings
                  </button>
                  <a href={path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#222C3D] text-gray-200 hover:bg-[#161D27] text-xs font-bold">
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                  {!builtIn && (
                    <button type="button" onClick={() => remove(page)} aria-label={`Delete ${page.title}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/15 text-xs font-bold cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {form && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="page-form-title">
          <form onSubmit={save} className="w-full max-w-xl bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="page-form-title" className="text-lg font-black text-white">
                  {form.id ? `${form.title}: SEO & Settings` : 'Create New Page'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.id ? 'How this page appears in Google and when shared. Empty fields keep the current built-in values.' : 'Creates a page with a banner and content blocks you can fill in next.'}
                </p>
              </div>
              <button type="button" onClick={() => setForm(null)} aria-label="Close" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#161D27] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pf-title" className="block text-xs font-bold text-gray-300 mb-1.5">Page name</label>
                <input id="pf-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="pf-slug" className="block text-xs font-bold text-gray-300 mb-1.5">URL</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">/</span>
                  <input
                    id="pf-slug"
                    value={form.slug}
                    disabled={editingBuiltIn}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="new-page"
                    className={`${inputClass} disabled:opacity-50`}
                  />
                </div>
                {editingBuiltIn && <p className="text-[11px] text-gray-500 mt-1">Built-in page URLs can’t change (keeps SEO and links safe).</p>}
              </div>
            </div>

            <div>
              <label htmlFor="pf-seo-title" className="block text-xs font-bold text-gray-300 mb-1.5">Google title <span className="text-gray-500 font-normal">({form.seo_title.length}/60)</span></label>
              <input id="pf-seo-title" value={form.seo_title} maxLength={120} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} placeholder="Leave empty to keep the current title" className={inputClass} />
            </div>
            <div>
              <label htmlFor="pf-seo-desc" className="block text-xs font-bold text-gray-300 mb-1.5">Google description <span className="text-gray-500 font-normal">({form.seo_description.length}/160)</span></label>
              <textarea id="pf-seo-desc" rows={3} value={form.seo_description} maxLength={320} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} placeholder="Leave empty to keep the current description" className={inputClass} />
            </div>
            <MediaInput label="Image shown when shared on social media" value={form.og_image} onChange={(v) => setForm({ ...form, og_image: v })} category="pages" placeholder="Optional" />
            <details>
              <summary className="text-xs font-bold text-gray-400 cursor-pointer">Advanced</summary>
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="pf-canonical" className="block text-xs font-bold text-gray-300 mb-1.5">Canonical URL</label>
                  <input id="pf-canonical" value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} placeholder="Optional, e.g. https://www.acepack.co.in/about" className={inputClass} />
                </div>
                <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
                  <input type="checkbox" checked={form.robots_index} onChange={(e) => setForm({ ...form, robots_index: e.target.checked })} className="w-4 h-4 accent-[#b99750]" />
                  Allow Google to show this page in search results
                </label>
                {!editingBuiltIn && (
                  <label className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 accent-[#b99750]" />
                    Published (visible to visitors)
                  </label>
                )}
              </div>
            </details>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2633]">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2.5 rounded-xl border border-[#222C3D] text-gray-300 text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black disabled:opacity-50 cursor-pointer">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {form.id ? 'Save settings' : 'Create page'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
