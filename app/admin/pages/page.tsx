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
  Calendar,
  Share2,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingPage, setViewingPage] = useState<PageItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<Partial<PageItem> | null>(null);
  const [formTab, setFormTab] = useState<'general' | 'seo' | 'social'>('general');
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
      if (viewingPage?.id === activePage.id) {
        setViewingPage((prev) => (prev ? { ...prev, ...activePage } as PageItem : null));
      }
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
      if (viewingPage?.id === id) {
        setViewModalOpen(false);
        setViewingPage(null);
      }
      fetchPages();
    } catch {
      showToast('Network error deleting page.', 'error');
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.seo_title && p.seo_title.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalItems = filteredPages.length;
  const paginatedPages = filteredPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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
            setFormTab('general');
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search pages by title, slug, or SEO title..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {filteredPages.length} {filteredPages.length === 1 ? 'Page' : 'Pages'} Total
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
                {paginatedPages.map((page) => (
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
                      <div className="flex items-center gap-1.5">
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
                        {page.robots_index === 0 && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            NoIndex
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail View Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewingPage(page);
                            setViewModalOpen(true);
                          }}
                          title="View Page Details"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Live Preview Button */}
                        <a
                          href={`/${page.slug === 'home' ? '' : page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview Live Page"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setActivePage(page);
                            setFormTab('general');
                            setEditModalOpen(true);
                          }}
                          title="Edit SEO & Page Metadata"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
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

        {/* Universal Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

      {/* Detail View Modal */}
      {viewModalOpen && viewingPage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewModalOpen(false);
              setViewingPage(null);
            }
          }}
        >
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingPage.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">/{viewingPage.slug === 'home' ? '' : viewingPage.slug}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingPage(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingPage.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingPage.is_published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {viewingPage.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Search Indexing</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingPage.robots_index ? 'text-emerald-400' : 'text-red-400'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {viewingPage.robots_index ? 'Indexable' : 'NoIndex'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Page Sections</span>
                <span className="text-xs font-bold text-white mt-1 inline-flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#b99750]" />
                  {viewingPage.section_count} Attached
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Last Updated</span>
                <span className="text-xs font-bold text-white mt-1 inline-flex items-center gap-1 truncate">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(viewingPage.updated_at || viewingPage.created_at)}
                </span>
              </div>
            </div>

            {/* SEO Overview Card */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b99750]">
                <Globe className="w-4 h-4" />
                <span>Search Engine Meta Information</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block text-[11px]">Meta Title:</span>
                  <p className="text-white font-medium mt-0.5">{viewingPage.seo_title || viewingPage.title}</p>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block text-[11px]">Meta Description:</span>
                  <p className="text-gray-300 font-normal mt-0.5 leading-relaxed">
                    {viewingPage.seo_description || 'No custom meta description configured (search engines will extract content automatically).'}
                  </p>
                </div>

                {viewingPage.canonical_url && (
                  <div>
                    <span className="text-gray-400 font-semibold block text-[11px]">Canonical URL:</span>
                    <p className="text-[#b99750] font-mono mt-0.5">{viewingPage.canonical_url}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Sharing (OG Image) Preview */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b99750]">
                  <Share2 className="w-4 h-4" />
                  <span>Social Share Preview (Open Graph)</span>
                </div>
                <span className="text-[10px] text-gray-500">Facebook / LinkedIn / Twitter preview</span>
              </div>

              <div className="border border-[#222C3D] rounded-xl overflow-hidden bg-[#0A0D12]">
                <div className="aspect-[1200/630] max-h-48 w-full bg-[#161B22] relative overflow-hidden flex items-center justify-center">
                  {viewingPage.og_image ? (
                    <img
                      src={viewingPage.og_image}
                      alt={viewingPage.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No OG image configured</span>
                  )}
                </div>
                <div className="p-3 border-t border-[#1E2633] space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 block uppercase">acepackaging.ae</span>
                  <span className="font-bold text-white text-xs block truncate">{viewingPage.seo_title || viewingPage.title}</span>
                  <span className="text-[11px] text-gray-400 block truncate">{viewingPage.seo_description || 'Industrial packaging solutions.'}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <Link
                href={`/admin/sections?page=${viewingPage.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#b99750]" />
                <span>Manage Sections ({viewingPage.section_count})</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href={`/${viewingPage.slug === 'home' ? '' : viewingPage.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setActivePage(viewingPage);
                    setViewModalOpen(false);
                    setFormTab('general');
                    setEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit SEO / Metadata Modal - Structured & Decluttered */}
      {editModalOpen && activePage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditModalOpen(false);
          }}
        >
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Edit Page Settings &amp; SEO</h3>
                  <span className="text-[11px] text-gray-400 font-mono">/{activePage.slug === 'home' ? '' : activePage.slug}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#141A24] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#1E2633] gap-2">
              <button
                type="button"
                onClick={() => setFormTab('general')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'general'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. General &amp; Visibility
              </button>
              <button
                type="button"
                onClick={() => setFormTab('seo')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'seo'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                2. SEO &amp; Meta Tags
              </button>
              <button
                type="button"
                onClick={() => setFormTab('social')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'social'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Social OG Image
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {formTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={activePage.title || ''}
                        onChange={(e) => setActivePage({ ...activePage, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        URL Slug (Route)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={activePage.slug || ''}
                        className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-[#1E2633] rounded-xl text-xs text-gray-400 font-mono cursor-not-allowed opacity-80"
                      />
                      <span className="text-[10px] text-gray-500 block mt-1">Route slug is locked for existing pages.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                      Page Publishing Status
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1117] border border-[#222C3D] cursor-pointer hover:border-[#b99750]/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activePage.is_published)}
                          onChange={(e) => setActivePage({ ...activePage, is_published: e.target.checked ? 1 : 0 })}
                          className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Published on Live Site</span>
                          <span className="text-[10px] text-gray-400 block">Make this page publicly accessible</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1117] border border-[#222C3D] cursor-pointer hover:border-[#b99750]/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activePage.robots_index)}
                          onChange={(e) => setActivePage({ ...activePage, robots_index: e.target.checked ? 1 : 0 })}
                          className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Indexable by Google</span>
                          <span className="text-[10px] text-gray-400 block">Allow search robots to index</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {formTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={activePage.seo_title || ''}
                      onChange={(e) => setActivePage({ ...activePage, seo_title: e.target.value })}
                      placeholder="Title tag displayed on search results and browser tab"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                    <span className="text-[10px] text-gray-500 block mt-1">Recommended length: 50-60 characters.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={activePage.seo_description || ''}
                      onChange={(e) => setActivePage({ ...activePage, seo_description: e.target.value })}
                      placeholder="Summary snippet displayed beneath page title on Google search"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                    <span className="text-[10px] text-gray-500 block mt-1">Recommended length: 150-160 characters.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Canonical URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={activePage.canonical_url || ''}
                      onChange={(e) => setActivePage({ ...activePage, canonical_url: e.target.value })}
                      placeholder="https://acepackaging.ae/your-page"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                </div>
              )}

              {formTab === 'social' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Social Sharing Image (OG Image)"
                    value={activePage.og_image || ''}
                    onChange={(url) => setActivePage({ ...activePage, og_image: url })}
                    placeholder="/images/hero-bg-image.jpg"
                    category="pages"
                    helpText="Image displayed when this page link is shared across WhatsApp, LinkedIn, and Facebook."
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'social' ? 'seo' : 'general')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'social' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'general' ? 'seo' : 'social')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#b99750] hover:underline"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Page Modal - Structured & Decluttered */}
      {createModalOpen && activePage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateModalOpen(false);
          }}
        >
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Create New Page Route</h3>
                  <span className="text-[11px] text-gray-400">Add a custom route with full SEO controls</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#141A24] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#1E2633] gap-2">
              <button
                type="button"
                onClick={() => setFormTab('general')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'general'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Route &amp; Name
              </button>
              <button
                type="button"
                onClick={() => setFormTab('seo')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'seo'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                2. SEO &amp; Meta
              </button>
              <button
                type="button"
                onClick={() => setFormTab('social')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  formTab === 'social'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Social OG Image
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {formTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Quality Assurance"
                        value={activePage.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setActivePage({
                            ...activePage,
                            title,
                            slug: activePage.slug ? activePage.slug : generatedSlug,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="quality-assurance"
                        value={activePage.slug || ''}
                        onChange={(e) => setActivePage({ ...activePage, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                      />
                      <span className="text-[10px] text-gray-500 block mt-1">Route will be: /{activePage.slug || 'slug'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                      Initial Visibility
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1117] border border-[#222C3D] cursor-pointer hover:border-[#b99750]/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activePage.is_published)}
                          onChange={(e) => setActivePage({ ...activePage, is_published: e.target.checked ? 1 : 0 })}
                          className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Published</span>
                          <span className="text-[10px] text-gray-400 block">Available immediately</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1117] border border-[#222C3D] cursor-pointer hover:border-[#b99750]/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={Boolean(activePage.robots_index)}
                          onChange={(e) => setActivePage({ ...activePage, robots_index: e.target.checked ? 1 : 0 })}
                          className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Search Indexable</span>
                          <span className="text-[10px] text-gray-400 block">Allow Google to crawl</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {formTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={activePage.seo_title || ''}
                      onChange={(e) => setActivePage({ ...activePage, seo_title: e.target.value })}
                      placeholder="Title displayed in browser tab and search engines"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={activePage.seo_description || ''}
                      onChange={(e) => setActivePage({ ...activePage, seo_description: e.target.value })}
                      placeholder="Concise overview snippet for search results"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                </div>
              )}

              {formTab === 'social' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Social Sharing Image (OG Image)"
                    value={activePage.og_image || ''}
                    onChange={(url) => setActivePage({ ...activePage, og_image: url })}
                    placeholder="/images/hero-bg-image.jpg"
                    category="pages"
                    helpText="Image shown when link is shared on social media."
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'social' ? 'seo' : 'general')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'social' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'general' ? 'seo' : 'social')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#b99750] hover:underline"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
