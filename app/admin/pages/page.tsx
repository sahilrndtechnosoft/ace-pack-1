'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Layers,
  Globe,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots_index: number;
  is_published: number;
  section_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const { showToast } = useAdmin();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<Partial<PageItem> | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const json = await res.json();
        setPages(json.pages || []);
      }
    } catch {
      showToast('Failed to load pages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage?.title || !activePage?.slug) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePage),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to create page.', 'error');
        setSubmitting(false);
        return;
      }

      showToast('Page created successfully in MySQL!');
      setCreateModalOpen(false);
      setActivePage(null);
      fetchPages();
    } catch {
      showToast('Network error creating page.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage?.id || !activePage?.title) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePage),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update page.', 'error');
        setSubmitting(false);
        return;
      }

      showToast('Page SEO & settings updated!');
      setEditModalOpen(false);
      setActivePage(null);
      fetchPages();
    } catch {
      showToast('Network error updating page.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all its sections? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/pages?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete page.', 'error');
        return;
      }
      showToast(`Page "${title}" deleted.`);
      fetchPages();
    } catch {
      showToast('Network error deleting page.', 'error');
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Pages Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage website routes, SEO metadata, visibility, and link directly to section editors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActivePage({
              title: '',
              slug: '',
              seo_title: '',
              seo_description: '',
              og_image: '/images/hero-bg-image.jpg',
              robots_index: 1,
              is_published: 1,
            });
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by title or URL slug..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {filteredPages.length} {filteredPages.length === 1 ? 'Page' : 'Pages'}
        </span>
      </div>

      {/* Pages Data Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading pages from MySQL...
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No pages matched your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Page Title &amp; Slug</th>
                  <th className="py-3.5 px-4">Sections</th>
                  <th className="py-3.5 px-4">SEO Title</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm leading-tight">
                            {page.title}
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono block mt-0.5">
                            /{page.slug === 'home' ? '' : page.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/sections?page=${page.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] border border-[#222C3D] text-[11px] font-bold transition-all"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{page.section_count} Sections</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 max-w-[240px]">
                      <span className="text-gray-300 block truncate" title={page.seo_title || page.title}>
                        {page.seo_title || page.title}
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate" title={page.seo_description || 'No description'}>
                        {page.seo_description || 'No description'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {page.is_published ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <XCircle className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/${page.slug === 'home' ? '' : page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview Live Page"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setActivePage(page);
                            setEditModalOpen(true);
                          }}
                          title="Edit SEO & Page Metadata"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {page.slug !== 'home' && (
                          <button
                            type="button"
                            onClick={() => handleDeletePage(page.id, page.title)}
                            title="Delete Page"
                            className="p-2 rounded-lg bg-[#141A24] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit SEO / Metadata Modal */}
      {editModalOpen && activePage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-extrabold text-white text-base">Edit SEO &amp; Page Metadata</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={activePage.title || ''}
                  onChange={(e) => setActivePage({ ...activePage, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={activePage.seo_title || ''}
                  onChange={(e) => setActivePage({ ...activePage, seo_title: e.target.value })}
                  placeholder="Appears in Google search results and browser tab"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={activePage.seo_description || ''}
                  onChange={(e) => setActivePage({ ...activePage, seo_description: e.target.value })}
                  placeholder="Summary snippet displayed on search engine previews"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <MediaInput
                label="Social Sharing Image (OG Image)"
                value={activePage.og_image || ''}
                onChange={(url) => setActivePage({ ...activePage, og_image: url })}
                placeholder="/images/hero-bg-image.jpg"
                category="pages"
                helpText="Directly upload or paste the image shown when shared on social media."
              />

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(activePage.robots_index)}
                    onChange={(e) => setActivePage({ ...activePage, robots_index: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                  />
                  <span className="text-xs text-gray-300 font-medium">Allow Search Engines to Index</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(activePage.is_published)}
                    onChange={(e) => setActivePage({ ...activePage, is_published: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                  />
                  <span className="text-xs text-emerald-400 font-bold">Published</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2633]">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Page Modal */}
      {createModalOpen && activePage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-extrabold text-white text-base">Create New Page Route</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Compliance"
                  value={activePage.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    setActivePage({ ...activePage, title, slug: activePage.slug ? activePage.slug : slug });
                  }}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. export-compliance"
                  value={activePage.slug || ''}
                  onChange={(e) => setActivePage({ ...activePage, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={activePage.seo_title || ''}
                  onChange={(e) => setActivePage({ ...activePage, seo_title: e.target.value })}
                  placeholder="Title shown in browser and search results"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  value={activePage.seo_description || ''}
                  onChange={(e) => setActivePage({ ...activePage, seo_description: e.target.value })}
                  placeholder="Brief summary for search engines"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <MediaInput
                label="Social Sharing Image (OG Image)"
                value={activePage.og_image || ''}
                onChange={(url) => setActivePage({ ...activePage, og_image: url })}
                placeholder="/images/hero-bg-image.jpg"
                category="pages"
                helpText="Optional Open Graph image for social platforms."
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2633]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
