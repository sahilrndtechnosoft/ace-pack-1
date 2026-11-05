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
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<CategoryItem | null>(null);

  // Create / Edit Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Partial<CategoryItem> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [formTab, setFormTab] = useState<'general' | 'content' | 'media' | 'features'>('general');
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
    setFormTab('general');
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setActiveCategory(cat);
    setFeaturesList(cat.features || []);
    setFeatureInput('');
    setFormTab('general');
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
      if (viewingCategory?.id === activeCategory.id) {
        setViewingCategory((prev) => (prev ? { ...prev, ...payload } as CategoryItem : null));
      }
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
      if (viewingCategory?.id === deleteConfirm.id) {
        setViewModalOpen(false);
        setViewingCategory(null);
      }
      setDeleteConfirm(null);
      fetchCategories();
    } catch {
      showToast('Network error deleting category.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.subtitle_name && c.subtitle_name.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalItems = filteredCategories.length;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            Total: <strong className="text-white">{filteredCategories.length}</strong> categories
          </span>
          <span>·</span>
          <span>
            Active: <strong className="text-emerald-400">{filteredCategories.filter((c) => c.is_active).length}</strong>
          </span>
        </div>
      </div>

      {/* Categories Table */}
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
                {paginatedCategories.map((cat) => (
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
                        {/* Detail View Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewingCategory(cat);
                            setViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="View Category Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Live Page Preview */}
                        <Link
                          href={`/categories/${cat.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] transition-colors"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
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
      )}

      {/* Detail View Modal */}
      {viewModalOpen && viewingCategory && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewModalOpen(false);
              setViewingCategory(null);
            }
          }}
        >
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingCategory.name}</h3>
                  <p className="text-xs text-[#b99750] mt-0.5">{viewingCategory.subtitle_name || `/categories/${viewingCategory.slug}`}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingCategory(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hero Image Banner Preview */}
            {viewingCategory.hero_image && (
              <div className="relative rounded-2xl overflow-hidden border border-[#222C3D] bg-[#141A24] aspect-[21/9] max-h-48">
                <img
                  src={viewingCategory.hero_image}
                  alt={viewingCategory.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-300 block">Category Route</span>
                    <span className="font-mono text-xs text-[#b99750] font-bold">/categories/{viewingCategory.slug}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingCategory.is_active ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingCategory.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {viewingCategory.is_active ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Products</span>
                <span className="text-xs font-bold text-white mt-1 inline-flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#b99750]" />
                  {viewingCategory.product_count} Models
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Sort Order</span>
                <span className="text-xs font-bold text-white mt-1 inline-flex items-center gap-1">
                  #{viewingCategory.sort_order}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Last Modified</span>
                <span className="text-xs font-bold text-white mt-1 inline-flex items-center gap-1 truncate">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(viewingCategory.updated_at || viewingCategory.created_at)}
                </span>
              </div>
            </div>

            {/* Descriptions Card */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                Overview &amp; Descriptions
              </span>

              {viewingCategory.short_description && (
                <div>
                  <span className="text-gray-400 font-semibold block text-[11px]">Short Summary:</span>
                  <p className="text-white text-xs mt-0.5 leading-relaxed">{viewingCategory.short_description}</p>
                </div>
              )}

              {viewingCategory.description && (
                <div>
                  <span className="text-gray-400 font-semibold block text-[11px]">Full Banner Description:</span>
                  <p className="text-gray-300 text-xs mt-0.5 leading-relaxed whitespace-pre-line">{viewingCategory.description}</p>
                </div>
              )}
            </div>

            {/* Key Specifications & Features Chips */}
            {viewingCategory.features && viewingCategory.features.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                  Key Specifications &amp; Highlights ({viewingCategory.features.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {viewingCategory.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#0D1117] border border-[#222C3D] text-xs text-gray-300 font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <Link
                href={`/admin/products?category=${viewingCategory.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-[#b99750]" />
                <span>Browse Products ({viewingCategory.product_count})</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/${viewingCategory.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Page</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setViewModalOpen(false);
                    openEditModal(viewingCategory);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal - Structured & Decluttered */}
      {modalOpen && activeCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="bg-[#161B22] border border-[#1E2633] rounded-3xl w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {activeCategory.id ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {activeCategory.slug ? `/categories/${activeCategory.slug}` : 'New series collection'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#0D1117] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#1E2633] gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFormTab('general')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'general'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. General Info
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
                2. Descriptions
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
                3. Hero Banner
              </button>
              <button
                type="button"
                onClick={() => setFormTab('features')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'features'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                4. Specifications ({featuresList.length})
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {formTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
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
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeCategory.slug || ''}
                        onChange={(e) => setActiveCategory({ ...activeCategory, slug: e.target.value })}
                        placeholder="e.g. hinge-cups"
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Subtitle / Series Tagline
                    </label>
                    <input
                      type="text"
                      value={activeCategory.subtitle_name || ''}
                      onChange={(e) => setActiveCategory({ ...activeCategory, subtitle_name: e.target.value })}
                      placeholder="e.g. One-Piece Attached Snap Lids"
                      className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={activeCategory.sort_order ?? 0}
                        onChange={(e) => setActiveCategory({ ...activeCategory, sort_order: Number(e.target.value) })}
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Publish Status
                      </label>
                      <select
                        value={activeCategory.is_active ? 1 : 0}
                        onChange={(e) => setActiveCategory({ ...activeCategory, is_active: Number(e.target.value) })}
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#b99750]"
                      >
                        <option value={1}>Published (Visible on Website)</option>
                        <option value={0}>Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Short Description (Summary cards &amp; previews)
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
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Full Description (Category detail page banner)
                    </label>
                    <textarea
                      rows={4}
                      value={activeCategory.description || ''}
                      onChange={(e) => setActiveCategory({ ...activeCategory, description: e.target.value })}
                      placeholder="Comprehensive packaging specifications and engineering highlights for the category detail page..."
                      className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                </div>
              )}

              {formTab === 'media' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Hero Banner Image"
                    value={activeCategory.hero_image || ''}
                    onChange={(url) => setActiveCategory({ ...activeCategory, hero_image: url })}
                    category="categories"
                    placeholder="/images/products/hinge/hinge-cups-hero.webp"
                    helpText="Large header banner image displayed at the top of the category products page."
                  />
                </div>
              )}

              {formTab === 'features' && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                    Add Key Feature / Technical Specification
                  </label>
                  <div className="flex gap-2">
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
                      placeholder="e.g. 100% Virgin PP 05 Food Grade, Microwave Safe..."
                      className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] min-h-[100px] flex flex-wrap gap-2 content-start">
                    {featuresList.length === 0 ? (
                      <span className="text-xs text-gray-500 italic">No features added yet. Type above and click Add or press Enter.</span>
                    ) : (
                      featuresList.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-[#222C3D] text-gray-200 text-xs"
                        >
                          <span>{f}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(i)}
                            className="text-gray-500 hover:text-red-400 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'general' | 'content' | 'media' | 'features'> = ['general', 'content', 'media', 'features'];
                        const currIdx = tabs.indexOf(formTab);
                        if (currIdx > 0) setFormTab(tabs[currIdx - 1]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'features' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'general' | 'content' | 'media' | 'features'> = ['general', 'content', 'media', 'features'];
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
                    className="px-4 py-2 rounded-xl border border-[#1E2633] text-gray-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{submitting ? 'Saving...' : 'Save Category'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirm(null);
          }}
        >
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
