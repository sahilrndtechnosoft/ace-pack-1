'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Save,
  Tag,
  User,
  Eye,
  Calendar,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string; // JSON
  takeaways?: string; // JSON
  tags?: string; // JSON
  image: string;
  author_name: string;
  author_role: string;
  author_avatar: string;
  read_time: string;
  date: string;
  is_published: number;
}

export default function AdminBlogsPage() {
  const { showToast } = useAdmin();
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<BlogPostItem | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState<any | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [tagsStr, setTagsStr] = useState<string>('');
  const [formTab, setFormTab] = useState<'meta' | 'media' | 'summary' | 'content' | 'tags'>('meta');
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const json = await res.json();
        setBlogs(json.blogs || []);
      }
    } catch {
      showToast('Failed to load blog posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setActiveBlog({
      title: '',
      slug: '',
      category: 'Buying Guide',
      summary: '',
      image: '/images/food-pairings/sauces-dips.webp',
      author_name: 'Ace Packaging Editorial',
      author_role: 'Packaging Systems Team',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      read_time: '4 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      is_published: 1,
    });
    setParagraphs(['']);
    setTakeaways(['']);
    setTagsStr('Food Packaging, Takeaway, Leak-Proof');
    setFormTab('meta');
    setModalOpen(true);
  };

  const openEditModal = (blog: BlogPostItem) => {
    setActiveBlog(blog);
    try {
      setParagraphs(JSON.parse(blog.content) || ['']);
    } catch {
      setParagraphs([blog.content]);
    }
    try {
      setTakeaways(JSON.parse(blog.takeaways || '[]') || ['']);
    } catch {
      setTakeaways([]);
    }
    try {
      const parsedTags = JSON.parse(blog.tags || '[]');
      setTagsStr(Array.isArray(parsedTags) ? parsedTags.join(', ') : '');
    } catch {
      setTagsStr('');
    }
    setFormTab('meta');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBlog?.title || !activeBlog?.summary) return;
    setSubmitting(true);

    const tagsArray = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...activeBlog,
      content: paragraphs.filter((p) => p.trim()),
      takeaways: takeaways.filter((t) => t.trim()),
      tags: tagsArray,
    };

    const isUpdate = Boolean(activeBlog.id);
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save blog post.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isUpdate ? 'Blog post updated!' : 'Blog post created!');
      setModalOpen(false);
      if (viewingBlog?.id === activeBlog.id) {
        setViewingBlog((prev) => (prev ? { ...prev, ...payload, content: JSON.stringify(payload.content), takeaways: JSON.stringify(payload.takeaways), tags: JSON.stringify(payload.tags) } : null));
      }
      setActiveBlog(null);
      fetchBlogs();
    } catch {
      showToast('Network error saving post.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Article "${title}" deleted.`);
        if (viewingBlog?.id === id) {
          setViewModalOpen(false);
          setViewingBlog(null);
        }
        fetchBlogs();
      } else {
        showToast('Failed to delete post.', 'error');
      }
    } catch {
      showToast('Network error deleting post.', 'error');
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.author_name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalItems = filteredBlogs.length;
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const parseJsonArray = (jsonStr?: string): string[] => {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [jsonStr];
    } catch {
      return [jsonStr];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Blog &amp; Article Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create and edit packaging guides, food safety insights, and industry articles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Post</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by title, category, or author..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {filteredBlogs.length} Articles Total
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading articles from MySQL...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No blog articles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {paginatedBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.image}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block text-sm leading-tight truncate">
                            {b.title}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                            /blog/{b.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#141A24] border border-[#222C3D] text-[#b99750]">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gray-300 font-medium block">{b.author_name}</span>
                      <span className="text-[10px] text-gray-500 block">{b.read_time}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail View Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewingBlog(b);
                            setViewModalOpen(true);
                          }}
                          title="View Article Details"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Live Link */}
                        <a
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview live article"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          title="Edit article"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.title)}
                          title="Delete article"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Detail View Modal */}
      {viewModalOpen && viewingBlog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingBlog.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#b99750] font-semibold">{viewingBlog.category}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400 font-mono">/blog/{viewingBlog.slug}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingBlog(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured Image */}
            {viewingBlog.image && (
              <div className="relative rounded-2xl overflow-hidden border border-[#222C3D] bg-[#141A24] aspect-[21/9] max-h-56">
                <img
                  src={viewingBlog.image}
                  alt={viewingBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingBlog.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingBlog.is_published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {viewingBlog.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Read Time</span>
                <span className="text-xs font-bold text-white mt-1 block">
                  {viewingBlog.read_time || '4 min read'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Publication Date</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingBlog.date || 'Recent'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Author</span>
                <span className="text-xs font-bold text-[#b99750] mt-1 block truncate">
                  {viewingBlog.author_name}
                </span>
              </div>
            </div>

            {/* Author Profile Card */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] flex items-center gap-3">
              {viewingBlog.author_avatar ? (
                <img
                  src={viewingBlog.author_avatar}
                  alt={viewingBlog.author_name}
                  className="w-12 h-12 rounded-full object-cover border border-[#222C3D]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1E2633] flex items-center justify-center text-gray-400">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="font-bold text-white text-sm block">{viewingBlog.author_name}</span>
                <span className="text-xs text-gray-400 block">{viewingBlog.author_role}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                Article Summary &amp; Excerpt
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">{viewingBlog.summary}</p>
            </div>

            {/* Takeaways */}
            {viewingBlog.takeaways && (
              <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {parseJsonArray(viewingBlog.takeaways).map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#b99750] font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {viewingBlog.tags && (
              <div className="flex flex-wrap gap-1.5">
                {parseJsonArray(viewingBlog.tags).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-[#141A24] border border-[#222C3D] text-[11px] text-[#b99750] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <a
                href={`/blog/${viewingBlog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Article</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(viewingBlog);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal - Decluttered & Tabbed */}
      {modalOpen && activeBlog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {activeBlog.id ? 'Edit Article' : 'Write New Article'}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {activeBlog.slug ? `/blog/${activeBlog.slug}` : 'New educational guide'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#141A24] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#1E2633] gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFormTab('meta')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'meta'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. General &amp; Slug
              </button>
              <button
                type="button"
                onClick={() => setFormTab('media')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'media'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                2. Media &amp; Author
              </button>
              <button
                type="button"
                onClick={() => setFormTab('summary')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'summary'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Summary &amp; Key Takeaways
              </button>
              <button
                type="button"
                onClick={() => setFormTab('content')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'content'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                4. Article Content ({paragraphs.length})
              </button>
              <button
                type="button"
                onClick={() => setFormTab('tags')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'tags'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                5. Tags
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab 1: Meta */}
              {formTab === 'meta' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeBlog.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setActiveBlog({
                            ...activeBlog,
                            title,
                            slug: activeBlog.slug ? activeBlog.slug : slug,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeBlog.slug || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={activeBlog.category || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, category: e.target.value })}
                        placeholder="e.g. Buying Guide"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        value={activeBlog.read_time || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, read_time: e.target.value })}
                        placeholder="e.g. 4 min read"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Display Date
                      </label>
                      <input
                        type="text"
                        value={activeBlog.date || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, date: e.target.value })}
                        placeholder="e.g. Nov 15, 2026"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(activeBlog.is_published)}
                        onChange={(e) => setActiveBlog({ ...activeBlog, is_published: e.target.checked ? 1 : 0 })}
                        className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#0D1117]"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Published Live</span>
                        <span className="text-[10px] text-gray-400 block">Make this article publicly readable</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 2: Media & Author */}
              {formTab === 'media' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Featured / Hero Banner Image *"
                    value={activeBlog.image || ''}
                    onChange={(url) => setActiveBlog({ ...activeBlog, image: url })}
                    placeholder="/images/hero-bg-image.jpg"
                    category="blogs"
                    required
                    helpText="Banner image displayed at the top of the article."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={activeBlog.author_name || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, author_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Author Role / Team
                      </label>
                      <input
                        type="text"
                        value={activeBlog.author_role || ''}
                        onChange={(e) => setActiveBlog({ ...activeBlog, author_role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <MediaInput
                    label="Author Avatar Image (Optional)"
                    value={activeBlog.author_avatar || ''}
                    onChange={(url) => setActiveBlog({ ...activeBlog, author_avatar: url })}
                    placeholder="https://..."
                    category="team"
                    helpText="Square photo of author."
                  />
                </div>
              )}

              {/* Tab 3: Summary & Takeaways */}
              {formTab === 'summary' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Summary / Lead Paragraph *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={activeBlog.summary || ''}
                      onChange={(e) => setActiveBlog({ ...activeBlog, summary: e.target.value })}
                      placeholder="Brief overview summary displayed on cards and lead header..."
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                        Key Takeaways (Bullet points)
                      </label>
                      <button
                        type="button"
                        onClick={() => setTakeaways([...takeaways, ''])}
                        className="text-xs text-[#b99750] hover:underline font-bold"
                      >
                        + Add Takeaway
                      </button>
                    </div>

                    {takeaways.map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={t}
                          onChange={(e) => {
                            const updated = [...takeaways];
                            updated[idx] = e.target.value;
                            setTakeaways(updated);
                          }}
                          placeholder={`Key point #${idx + 1}`}
                          className="flex-1 px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                        />
                        <button
                          type="button"
                          onClick={() => setTakeaways(takeaways.filter((_, i) => i !== idx))}
                          className="px-2.5 text-gray-500 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Content */}
              {formTab === 'content' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                      Article Paragraphs / Content Blocks
                    </label>
                    <button
                      type="button"
                      onClick={() => setParagraphs([...paragraphs, ''])}
                      className="text-xs text-[#b99750] hover:underline font-bold"
                    >
                      + Add Paragraph
                    </button>
                  </div>

                  {paragraphs.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#b99750] font-bold">
                          Paragraph #{idx + 1}
                        </span>
                        {paragraphs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                            className="text-[11px] text-gray-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...paragraphs];
                          updated[idx] = e.target.value;
                          setParagraphs(updated);
                        }}
                        placeholder="Write article body paragraph content..."
                        className="w-full px-3 py-2 bg-[#0D1117] border border-[#1E2633] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Tags */}
              {formTab === 'tags' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Article Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder="e.g. Food Packaging, Sauces, Export Compliance, Polypropylene"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                      Tags Preview
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tagsStr
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#222C3D] text-xs text-[#b99750]"
                          >
                            #{t}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'meta' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'meta' | 'media' | 'summary' | 'content' | 'tags'> = ['meta', 'media', 'summary', 'content', 'tags'];
                        const currIdx = tabs.indexOf(formTab);
                        if (currIdx > 0) setFormTab(tabs[currIdx - 1]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'tags' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'meta' | 'media' | 'summary' | 'content' | 'tags'> = ['meta', 'media', 'summary', 'content', 'tags'];
                        const currIdx = tabs.indexOf(formTab);
                        if (currIdx < tabs.length - 1) setFormTab(tabs[currIdx + 1]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#b99750] hover:underline cursor-pointer"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {submitting ? 'Saving...' : 'Save Article'}
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
