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
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

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

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBlog, setActiveBlog] = useState<any | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [tagsStr, setTagsStr] = useState<string>('');
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
      is_published: 1,
    });
    setParagraphs(['']);
    setTakeaways(['']);
    setTagsStr('Food Packaging, Takeaway, Leak-Proof');
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
      b.category.toLowerCase().includes(search.toLowerCase())
  );

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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {filteredBlogs.length} Articles
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
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.image}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
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
                        <a
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview article"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          title="Edit article"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

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
      </div>

      {/* Editor Modal */}
      {modalOpen && activeBlog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-black text-white text-base">
                  {activeBlog.id ? 'Edit Article' : 'Write New Article'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={activeBlog.slug || ''}
                    onChange={(e) => setActiveBlog({ ...activeBlog, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
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
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={activeBlog.read_time || ''}
                    onChange={(e) => setActiveBlog({ ...activeBlog, read_time: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <MediaInput
                  label="Featured / Banner Image"
                  value={activeBlog.image || ''}
                  onChange={(url) => setActiveBlog({ ...activeBlog, image: url })}
                  placeholder="/images/hero-bg-image.jpg"
                  category="blogs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={activeBlog.summary || ''}
                  onChange={(e) => setActiveBlog({ ...activeBlog, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              {/* Dynamic Paragraphs */}
              <div className="space-y-2 p-4 rounded-2xl bg-[#090C10] border border-[#1E2633]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2633]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b99750]">
                    Article Paragraphs ({paragraphs.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setParagraphs([...paragraphs, ''])}
                    className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#b99750]" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                {paragraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-xs text-gray-500 font-mono mt-2 shrink-0">{idx + 1}.</span>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const updated = [...paragraphs];
                        updated[idx] = e.target.value;
                        setParagraphs(updated);
                      }}
                      className="flex-1 px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setParagraphs(paragraphs.filter((_, i) => i !== idx))}
                        className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer mt-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="Leak-Proof, PP 05, Bulk Orders"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={activeBlog.author_name || ''}
                    onChange={(e) => setActiveBlog({ ...activeBlog, author_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <MediaInput
                label="Author Avatar Image"
                value={activeBlog.author_avatar || ''}
                onChange={(url) => setActiveBlog({ ...activeBlog, author_avatar: url })}
                placeholder="https://... or /images/..."
                category="blogs"
                helpText="Optional profile avatar for the article author."
              />

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(activeBlog.is_published)}
                    onChange={(e) =>
                      setActiveBlog({ ...activeBlog, is_published: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                  />
                  <span className="text-xs text-emerald-400 font-bold">Published Live</span>
                </label>

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
                    className="px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md"
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
