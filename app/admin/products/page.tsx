'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Image as ImageIcon,
  Save,
  X,
  Grid,
  Ruler,
  Box,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface ProductItemAdmin {
  id: string;
  category_slug: string;
  category_name?: string;
  product_slug: string;
  name: string;
  capacity?: string;
  material?: string;
  quality?: string;
  packaging?: string;
  image?: string;
  blank_image?: string;
  locking_food_image?: string;
  description?: string;
  features: string[];
  dimensions?: { top?: string; height?: string; bottom?: string };
  applications: string[];
  specs: { label: string; value: string }[];
  varieties: any[];
  default_variety?: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CategoryOption {
  slug: string;
  name: string;
}

export default function AdminProductsPage() {
  const { showToast } = useAdmin();
  const searchParams = useSearchParams();
  const initialCategoryFilter = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<ProductItemAdmin[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<ProductItemAdmin | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Partial<ProductItemAdmin> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [appsList, setAppsList] = useState<string[]>([]);
  const [appInput, setAppInput] = useState('');
  const [specsList, setSpecsList] = useState<{ label: string; value: string }[]>([]);
  const [dimTop, setDimTop] = useState('');
  const [dimHeight, setDimHeight] = useState('');
  const [dimBottom, setDimBottom] = useState('');
  const [formTab, setFormTab] = useState<'basic' | 'media' | 'dimensions' | 'features' | 'desc'>('basic');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<ProductItemAdmin | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products'),
      ]);

      if (catsRes.ok) {
        const cJson = await catsRes.json();
        setCategories(cJson.categories?.map((c: any) => ({ slug: c.slug, name: c.name })) || []);
      }

      if (prodsRes.ok) {
        const pJson = await prodsRes.json();
        setProducts(pJson.products || []);
      }
    } catch {
      showToast('Failed to load products or categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    const defaultCat = selectedCategory !== 'all' ? selectedCategory : categories[0]?.slug || 'hinge-cups';
    setActiveProduct({
      name: '',
      category_slug: defaultCat,
      product_slug: '',
      capacity: '',
      material: 'Virgin PP 05 Food Grade',
      quality: 'Export Grade Food Safe',
      packaging: '2,000 PCS per Master Pack',
      image: '/images/hero-bg-image.jpg',
      blank_image: '',
      locking_food_image: '',
      description: '',
      features: [],
      applications: [],
      specs: [],
      sort_order: products.length + 1,
      is_active: 1,
    });
    setFeaturesList(['Premium Quality', 'Secure Leak-Proof Seal', 'Sturdy Base']);
    setAppsList(['Takeaway', 'Cloud Kitchens', 'Delivery']);
    setSpecsList([]);
    setDimTop('');
    setDimHeight('');
    setDimBottom('');
    setFormTab('basic');
    setModalOpen(true);
  };

  const openEditModal = (prod: ProductItemAdmin) => {
    setActiveProduct(prod);
    setFeaturesList(prod.features || []);
    setAppsList(prod.applications || []);
    setSpecsList(prod.specs || []);
    setDimTop(prod.dimensions?.top || '');
    setDimHeight(prod.dimensions?.height || '');
    setDimBottom(prod.dimensions?.bottom || '');
    setFormTab('basic');
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

  const handleAddApp = () => {
    if (!appInput.trim()) return;
    setAppsList([...appsList, appInput.trim()]);
    setAppInput('');
  };

  const handleRemoveApp = (idx: number) => {
    setAppsList(appsList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct?.name?.trim() || !activeProduct?.category_slug?.trim()) {
      showToast('Product name and category are required.', 'error');
      return;
    }

    setSubmitting(true);
    const isUpdate = Boolean(activeProduct.id);
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const payload = {
        ...activeProduct,
        features: featuresList,
        applications: appsList,
        specs: specsList,
        dimensions: {
          top: dimTop.trim(),
          height: dimHeight.trim(),
          bottom: dimBottom.trim(),
        },
      };

      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save product.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isUpdate ? 'Product updated successfully!' : 'Product created successfully!');
      setModalOpen(false);
      if (viewingProduct?.id === activeProduct.id) {
        setViewingProduct((prev) => (prev ? { ...prev, ...payload } as ProductItemAdmin : null));
      }
      fetchData();
    } catch {
      showToast('Network error saving product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(deleteConfirm.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete product.', 'error');
        setDeleting(false);
        return;
      }

      showToast(`Product "${deleteConfirm.name}" deleted.`);
      if (viewingProduct?.id === deleteConfirm.id) {
        setViewModalOpen(false);
        setViewingProduct(null);
      }
      setDeleteConfirm(null);
      fetchData();
    } catch {
      showToast('Network error deleting product.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category_slug === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.product_slug.toLowerCase().includes(q) ||
        (p.capacity && p.capacity.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          <h1 className="text-2xl font-black text-white">Products Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create, edit, and organize individual container models, capacities, technical specs, and live imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E2633] bg-[#161B22] hover:bg-[#1E2633] text-gray-300 hover:text-white text-xs font-bold transition-all"
          >
            <Grid className="w-4 h-4 text-[#b99750]" />
            <span>Manage Categories</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#161B22] p-4 rounded-2xl border border-[#1E2633]">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product models or capacity..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b99750]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
          <span>
            Showing <strong className="text-white">{filteredProducts.length}</strong> of{' '}
            <strong className="text-white">{products.length}</strong> products
          </span>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
          Loading product models...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl p-12 text-center text-gray-400 text-xs">
          No products found matching the criteria.
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0A0D12] text-gray-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-[#1E2633]">
                <tr>
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Model Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Dimensions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2633]">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A212D]/50 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-lg bg-[#0D1117] border border-[#1E2633] overflow-hidden flex items-center justify-center p-1">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-white text-sm block">{p.name}</span>
                        <code className="text-[10.5px] text-gray-500 font-mono block mt-0.5">
                          {p.product_slug}
                        </code>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#1E2633] text-[11px] text-[#b99750] font-semibold">
                        <Grid className="w-3 h-3" />
                        <span>{p.category_name || p.category_slug}</span>
                      </span>
                    </td>

                    {/* Capacity */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      {p.capacity || <span className="text-gray-600 italic">Standard</span>}
                    </td>

                    {/* Dimensions */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      {p.dimensions?.top || p.dimensions?.height ? (
                        <span>
                          {p.dimensions.top && `Top: ${p.dimensions.top}`}
                          {p.dimensions.height && ` · H: ${p.dimensions.height}`}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {p.is_active ? (
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
                            setViewingProduct(p);
                            setViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="View Product Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Live Page Preview */}
                        <Link
                          href={`/categories/${p.category_slug}/${p.product_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] transition-colors"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirm(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Delete Product"
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
      {viewModalOpen && viewingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewModalOpen(false);
              setViewingProduct(null);
            }
          }}
        >
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#b99750] font-semibold">{viewingProduct.category_name || viewingProduct.category_slug}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400 font-mono">/{viewingProduct.product_slug}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingProduct(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-[#141A24] border border-[#222C3D] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Main Product</span>
                <div className="w-full aspect-square rounded-xl bg-[#0D1117] border border-[#1E2633] flex items-center justify-center p-2 overflow-hidden">
                  {viewingProduct.image ? (
                    <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-500">No Image</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#141A24] border border-[#222C3D] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Clear View / Blank</span>
                <div className="w-full aspect-square rounded-xl bg-[#0D1117] border border-[#1E2633] flex items-center justify-center p-2 overflow-hidden">
                  {viewingProduct.blank_image ? (
                    <img src={viewingProduct.blank_image} alt="Blank view" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-600 italic">Not provided</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#141A24] border border-[#222C3D] flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Locking / Food Pair</span>
                <div className="w-full aspect-square rounded-xl bg-[#0D1117] border border-[#1E2633] flex items-center justify-center p-2 overflow-hidden">
                  {viewingProduct.locking_food_image ? (
                    <img src={viewingProduct.locking_food_image} alt="Food pairing" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-600 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingProduct.is_active ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingProduct.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {viewingProduct.is_active ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Capacity</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingProduct.capacity || 'Standard'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Material Polymer</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingProduct.material || 'PP 05'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Master Packaging</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingProduct.packaging || '2,000 PCS'}
                </span>
              </div>
            </div>

            {/* Dimensions Card */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b99750]">
                <Ruler className="w-4 h-4" />
                <span>Physical Dimensions</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#1E2633]">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Top Diameter</span>
                  <span className="font-mono text-xs text-white font-bold">{viewingProduct.dimensions?.top || '—'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#1E2633]">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Height</span>
                  <span className="font-mono text-xs text-white font-bold">{viewingProduct.dimensions?.height || '—'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#1E2633]">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Bottom Diameter</span>
                  <span className="font-mono text-xs text-white font-bold">{viewingProduct.dimensions?.bottom || '—'}</span>
                </div>
              </div>
            </div>

            {/* Features & Applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                  Product Features
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProduct.features && viewingProduct.features.length > 0 ? (
                    viewingProduct.features.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#222C3D] text-[11px] text-gray-300">
                        ✓ {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No features listed</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                  Recommended Applications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProduct.applications && viewingProduct.applications.length > 0 ? (
                    viewingProduct.applications.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#222C3D] text-[11px] text-emerald-400">
                        • {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No applications listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {viewingProduct.description && (
              <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">Description</span>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{viewingProduct.description}</p>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <div className="text-xs text-gray-500">
                Sort Order: <span className="font-bold text-white">#{viewingProduct.sort_order}</span> · Updated:{' '}
                <span className="text-gray-300">{formatDate(viewingProduct.updated_at || viewingProduct.created_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/${viewingProduct.category_slug}/${viewingProduct.product_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setViewModalOpen(false);
                    openEditModal(viewingProduct);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal - Structured & Decluttered */}
      {modalOpen && activeProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="bg-[#161B22] border border-[#1E2633] rounded-3xl w-full max-w-3xl my-8 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {activeProduct.id ? 'Edit Product Model' : 'Add New Product Model'}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {activeProduct.product_slug ? `/${activeProduct.product_slug}` : 'New packaging SKU'}
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
                onClick={() => setFormTab('basic')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'basic'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Basic Info
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
                2. Imagery
              </button>
              <button
                type="button"
                onClick={() => setFormTab('dimensions')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'dimensions'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                3. Dimensions &amp; Specs
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
                4. Features &amp; Apps
              </button>
              <button
                type="button"
                onClick={() => setFormTab('desc')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'desc'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                5. Description
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Tab 1: Basic Info */}
              {formTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Parent Category *
                      </label>
                      <select
                        required
                        value={activeProduct.category_slug || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, category_slug: e.target.value })}
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#b99750]"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Model / Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeProduct.name || ''}
                        onChange={(e) => {
                          const name = e.target.value;
                          if (!activeProduct.id) {
                            const slug = name
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9-]/g, '-')
                              .replace(/-+/g, '-');
                            setActiveProduct({ ...activeProduct, name, product_slug: slug });
                          } else {
                            setActiveProduct({ ...activeProduct, name });
                          }
                        }}
                        placeholder="e.g. 50ml Hinge Cup"
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Product Slug (URL identifier) *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeProduct.product_slug || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, product_slug: e.target.value })}
                        placeholder="e.g. 50ml-hinge-cup"
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Capacity / Volume
                      </label>
                      <input
                        type="text"
                        value={activeProduct.capacity || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, capacity: e.target.value })}
                        placeholder="e.g. 50ml or 500ml (16 oz)"
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={activeProduct.sort_order ?? 0}
                        onChange={(e) => setActiveProduct({ ...activeProduct, sort_order: Number(e.target.value) })}
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                        Publish Status
                      </label>
                      <select
                        value={activeProduct.is_active ? 1 : 0}
                        onChange={(e) => setActiveProduct({ ...activeProduct, is_active: Number(e.target.value) })}
                        className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#b99750]"
                      >
                        <option value={1}>Published (Visible on Website)</option>
                        <option value={0}>Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Imagery */}
              {formTab === 'media' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Primary Product Image *"
                    value={activeProduct.image || ''}
                    onChange={(url) => setActiveProduct({ ...activeProduct, image: url })}
                    category="products"
                    placeholder="/images/products/hinge/hinge-50ml.webp"
                    helpText="Primary card thumbnail and hero product photo."
                  />

                  <MediaInput
                    label="Blank / Clear Outline Image (Optional)"
                    value={activeProduct.blank_image || ''}
                    onChange={(url) => setActiveProduct({ ...activeProduct, blank_image: url })}
                    category="products"
                    placeholder="/images/products/hinge/hinge-50ml-blank.webp"
                    helpText="Clean transparent view of empty container for technical specs."
                  />

                  <MediaInput
                    label="Locking / Food Pair Image (Optional)"
                    value={activeProduct.locking_food_image || ''}
                    onChange={(url) => setActiveProduct({ ...activeProduct, locking_food_image: url })}
                    category="products"
                    placeholder="/images/products/hinge/hinge-50ml-food.webp"
                    helpText="Image showing container closed with food contents."
                  />
                </div>
              )}

              {/* Tab 3: Dimensions & Specs */}
              {formTab === 'dimensions' && (
                <div className="space-y-4">
                  <div className="bg-[#0D1117] p-4 rounded-2xl border border-[#1E2633] space-y-3">
                    <span className="text-[11px] font-bold text-[#b99750] uppercase tracking-wider flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5" /> Dimensions (Millimeters)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Top Diameter / Rim</label>
                        <input
                          type="text"
                          value={dimTop}
                          onChange={(e) => setDimTop(e.target.value)}
                          placeholder="e.g. 61 mm"
                          className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Height</label>
                        <input
                          type="text"
                          value={dimHeight}
                          onChange={(e) => setDimHeight(e.target.value)}
                          placeholder="e.g. 25 mm"
                          className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Bottom Diameter</label>
                        <input
                          type="text"
                          value={dimBottom}
                          onChange={(e) => setDimBottom(e.target.value)}
                          placeholder="e.g. 52 mm"
                          className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0D1117] p-4 rounded-2xl border border-[#1E2633]">
                    <div>
                      <label className="block text-[10px] font-bold text-[#b99750] uppercase tracking-wider mb-1">
                        Material Polymer
                      </label>
                      <input
                        type="text"
                        value={activeProduct.material || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, material: e.target.value })}
                        placeholder="Virgin PP 05 Food Grade"
                        className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b99750] uppercase tracking-wider mb-1">
                        Quality Standard
                      </label>
                      <input
                        type="text"
                        value={activeProduct.quality || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, quality: e.target.value })}
                        placeholder="Export Grade Food Safe"
                        className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#b99750] uppercase tracking-wider mb-1">
                        Master Packaging
                      </label>
                      <input
                        type="text"
                        value={activeProduct.packaging || ''}
                        onChange={(e) => setActiveProduct({ ...activeProduct, packaging: e.target.value })}
                        placeholder="2,000 PCS per Master Pack"
                        className="w-full bg-[#161B22] border border-[#1E2633] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Features & Apps */}
              {formTab === 'features' && (
                <div className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                      Product Highlights &amp; Features
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
                        placeholder="e.g. Microwave Safe, Leak-Proof Snap..."
                        className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-3.5 py-2 bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] min-h-[60px] content-start">
                      {featuresList.map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-[#222C3D] text-gray-200 text-xs"
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
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                      Recommended Applications / Food Pairings
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={appInput}
                        onChange={(e) => setAppInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddApp();
                          }
                        }}
                        placeholder="e.g. Chutneys, Gravies, Ice Cream, Dips..."
                        className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                      />
                      <button
                        type="button"
                        onClick={handleAddApp}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] min-h-[60px] content-start">
                      {appsList.map((a, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161B22] border border-emerald-500/30 text-emerald-400 text-xs"
                        >
                          <span>{a}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveApp(i)}
                            className="text-gray-500 hover:text-red-400 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Description */}
              {formTab === 'desc' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Container Description &amp; Technical Notes
                    </label>
                    <textarea
                      rows={5}
                      value={activeProduct.description || ''}
                      onChange={(e) => setActiveProduct({ ...activeProduct, description: e.target.value })}
                      placeholder="Engineered container characteristics, stacking strength, rim rigidity, and food delivery safety..."
                      className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'basic' | 'media' | 'dimensions' | 'features' | 'desc'> = ['basic', 'media', 'dimensions', 'features', 'desc'];
                        const currIdx = tabs.indexOf(formTab);
                        if (currIdx > 0) setFormTab(tabs[currIdx - 1]);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'desc' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'basic' | 'media' | 'dimensions' | 'features' | 'desc'> = ['basic', 'media', 'dimensions', 'features', 'desc'];
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
                    <span>{submitting ? 'Saving...' : 'Save Product'}</span>
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
                <h4 className="font-extrabold text-white text-base">Delete Product Model?</h4>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#0D1117] p-3 rounded-xl border border-[#1E2633]">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteConfirm.name}"</strong>?
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
