'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Grid,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  subtitle_name?: string;
  short_description?: string;
  description?: string;
  hero_image?: string;
  features: string[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
  sort_order: number;
  is_active: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminCategoriesPage() {
  const { showToast } = useAdmin();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Partial<CategoryItem> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<CategoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const json = await res.json();
        setCategories(json.categories || []);
      }
    } catch {
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setActiveCategory({
      name: '',
      slug: '',
      subtitle_name: '',
      short_description: '',
      description: '',
      hero_image: '/images/hero-bg-image.jpg',
      features: [],
      gallery: [],
      faqs: [],
      sort_order: categories.length + 1,
      is_active: 1,
    });
    setFeaturesList([]);
    setFeatureInput('');
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setActiveCategory(cat);
    setFeaturesList(cat.features || []);
    setFeatureInput('');
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeaturesList([...featuresList, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory?.name?.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    setSubmitting(true);
    const isUpdate = Boolean(activeCategory.id);
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const payload = {
        ...activeCategory,
        features: featuresList,
      };

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save category.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isUpdate ? 'Category updated successfully!' : 'Category created successfully!');
      setModalOpen(false);
      fetchCategories();
    } catch {
      showToast('Network error saving category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(deleteConfirm.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete category.', 'error');
        setDeleting(false);
        return;
      }

      showToast(`Category "${deleteConfirm.name}" and its products deleted.`);
      setDeleteConfirm(null);
      fetchCategories();
    } catch {
      showToast('Network error deleting category.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    (c.subtitle_name && c.subtitle_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Product Categories</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage product collections, series lines, hero imagery, specifications, and live status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E2633] bg-[#161B22] hover:bg-[#1E2633] text-gray-300 hover:text-white text-xs font-bold transition-all"
          >
            <Package className="w-4 h-4 text-[#b99750]" />
            <span>Manage Products</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161B22] p-4 rounded-2xl border border-[#1E2633]">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, slug or subtitle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            Total: <strong className="text-white">{categories.length}</strong> categories
          </span>
          <span>·</span>
          <span>
            Active: <strong className="text-emerald-400">{categories.filter((c) => c.is_active).length}</strong>
          </span>
        </div>
      </div>

      {/* Categories Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
          Loading product categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl p-12 text-center text-gray-400 text-xs">
          No categories found matching your query.
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0A0D12] text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-[#1E2633]">
                <tr>
                  <th className="py-3.5 px-4">Hero</th>
                  <th className="py-3.5 px-4">Category Details</th>
                  <th className="py-3.5 px-4">Slug / Path</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2633]">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#1A212D]/50 transition-colors">
                    {/* Hero Preview */}
                    <td className="py-3.5 px-4">
                      <div className="w-14 h-12 rounded-lg bg-[#0D1117] border border-[#1E2633] overflow-hidden flex items-center justify-center">
                        {cat.hero_image ? (
                          <img
                            src={cat.hero_image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </td>

                    {/* Name & Subtitle */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white text-sm block">{cat.name}</span>
                        {cat.subtitle_name && (
                          <span className="text-[11px] text-[#b99750] block mt-0.5">{cat.subtitle_name}</span>
                        )}
                        {cat.short_description && (
                          <span className="text-[10.5px] text-gray-500 line-clamp-1 mt-0.5 max-w-md">
                            {cat.short_description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      <code>/categories/{cat.slug}</code>
                    </td>

                    {/* Products Count */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/products?category=${cat.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#1E2633] text-gray-300 hover:text-[#b99750] hover:border-[#b99750]/50 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#b99750]" />
                        <span className="font-bold">{cat.product_count}</span> models
                      </Link>
                    </td>

                    {/* Sort Order */}
                    <td className="py-3.5 px-4 font-mono text-gray-400">{cat.sort_order}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-950/60 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/categories/${cat.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] transition-colors"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-2xl my-8 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-extrabold text-white text-base">
                  {activeCategory.id ? 'Edit Product Category' : 'Create New Product Category'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeCategory.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (!activeCategory.id) {
                        const slug = name
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9-]/g, '-')
                          .replace(/-+/g, '-');
                        setActiveCategory({ ...activeCategory, name, slug });
                      } else {
                        setActiveCategory({ ...activeCategory, name });
                      }
                    }}
                    placeholder="e.g. Hinge Cups"
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeCategory.slug || ''}
                    onChange={(e) => setActiveCategory({ ...activeCategory, slug: e.target.value })}
                    placeholder="e.g. hinge-cups"
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Subtitle / Series Name
                </label>
                <input
                  type="text"
                  value={activeCategory.subtitle_name || ''}
                  onChange={(e) => setActiveCategory({ ...activeCategory, subtitle_name: e.target.value })}
                  placeholder="e.g. One-Piece Attached Snap Lids"
                  className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>

              {/* Media Input for Hero Image */}
              <div>
                <MediaInput
                  label="Hero Banner Image"
                  value={activeCategory.hero_image || ''}
                  onChange={(url) => setActiveCategory({ ...activeCategory, hero_image: url })}
                  category="categories"
                  placeholder="/images/products/hinge/hinge-cups-hero.webp"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Short Description (Cards & Highlights)
                </label>
                <textarea
                  rows={2}
                  value={activeCategory.short_description || ''}
                  onChange={(e) => setActiveCategory({ ...activeCategory, short_description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview for catalog summary cards..."
                  className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Full Description (Detail Page Banner)
                </label>
                <textarea
                  rows={3}
                  value={activeCategory.description || ''}
                  onChange={(e) => setActiveCategory({ ...activeCategory, description: e.target.value })}
                  placeholder="Comprehensive technical packaging overview for the category page..."
                  className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>

              {/* Key Features List */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Key Specifications / Highlights
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. 100% Virgin PP 05, Microwave Reheatable..."
                    className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-[#1E2633] hover:bg-[#2A3447] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {featuresList.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#1E2633] text-gray-300 text-[11px]"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={activeCategory.sort_order ?? 0}
                    onChange={(e) => setActiveCategory({ ...activeCategory, sort_order: Number(e.target.value) })}
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Publish Status
                  </label>
                  <select
                    value={activeCategory.is_active ? 1 : 0}
                    onChange={(e) => setActiveCategory({ ...activeCategory, is_active: Number(e.target.value) })}
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b99750]"
                  >
                    <option value={1}>Published (Visible on Website)</option>
                    <option value={0}>Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2633]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E2633] text-gray-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Delete Category?</h4>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#0D1117] p-3 rounded-xl border border-[#1E2633]">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirm.name}"</strong>?
              <br />
              <span className="text-red-400 font-bold">Warning:</span> All {deleteConfirm.product_count} products
              belonging to this category will also be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-[#1E2633] text-gray-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
