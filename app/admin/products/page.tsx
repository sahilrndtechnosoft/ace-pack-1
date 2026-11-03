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
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Partial<ProductItemAdmin> | null>(null);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [appsList, setAppsList] = useState<string[]>([]);
  const [appInput, setAppInput] = useState('');
  const [specsList, setSpecsList] = useState<{ label: string; value: string }[]>([]);
  const [specLabel, setSpecLabel] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [dimTop, setDimTop] = useState('');
  const [dimHeight, setDimHeight] = useState('');
  const [dimBottom, setDimBottom] = useState('');
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
    setFeaturesList(['01. Premium Quality', '02. Secure Seal', '03. Sturdy bottom']);
    setAppsList(['Takeaway', 'Cloud Kitchens', 'Delivery']);
    setSpecsList([]);
    setDimTop('');
    setDimHeight('');
    setDimBottom('');
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

  const handleAddSpec = () => {
    if (!specLabel.trim() || !specValue.trim()) return;
    setSpecsList([...specsList, { label: specLabel.trim(), value: specValue.trim() }]);
    setSpecLabel('');
    setSpecValue('');
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecsList(specsList.filter((_, i) => i !== idx));
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
                {filteredProducts.map((p) => (
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
                        <Link
                          href={`/categories/${p.category_slug}/${p.product_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2633] transition-colors"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#b99750] hover:bg-[#1E2633] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

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
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-3xl my-8 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-extrabold text-white text-base">
                  {activeProduct.id ? 'Edit Product Model' : 'Add New Product Model'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Parent Category *
                  </label>
                  <select
                    required
                    value={activeProduct.category_slug || ''}
                    onChange={(e) => setActiveProduct({ ...activeProduct, category_slug: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b99750]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
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
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Product Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeProduct.product_slug || ''}
                    onChange={(e) => setActiveProduct({ ...activeProduct, product_slug: e.target.value })}
                    placeholder="e.g. 50ml-hinge-cup"
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={activeProduct.capacity || ''}
                    onChange={(e) => setActiveProduct({ ...activeProduct, capacity: e.target.value })}
                    placeholder="e.g. 50ml or 500ml (16 oz)"
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              {/* Media Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaInput
                  label="Primary Product Image *"
                  value={activeProduct.image || ''}
                  onChange={(url) => setActiveProduct({ ...activeProduct, image: url })}
                  category="products"
                  placeholder="/images/products/hinge/hinge-50ml.webp"
                />

                <MediaInput
                  label="Blank / Clear View Image (Optional)"
                  value={activeProduct.blank_image || ''}
                  onChange={(url) => setActiveProduct({ ...activeProduct, blank_image: url })}
                  category="products"
                  placeholder="/images/products/hinge/hinge-50ml-blank.webp"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0D1117] p-3.5 rounded-xl border border-[#1E2633]">
                <div>
                  <label className="block text-[10px] font-bold text-[#b99750] uppercase tracking-wider mb-1">
                    Material Polymer
                  </label>
                  <input
                    type="text"
                    value={activeProduct.material || ''}
                    onChange={(e) => setActiveProduct({ ...activeProduct, material: e.target.value })}
                    placeholder="Virgin PP 05 Food Grade"
                    className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
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
                    className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
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
                    className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="bg-[#0D1117] p-3.5 rounded-xl border border-[#1E2633] space-y-2">
                <span className="text-[11px] font-bold text-[#b99750] uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Dimensions (Millimeters)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Top Diameter / Rim</label>
                    <input
                      type="text"
                      value={dimTop}
                      onChange={(e) => setDimTop(e.target.value)}
                      placeholder="e.g. 61 mm"
                      className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Height</label>
                    <input
                      type="text"
                      value={dimHeight}
                      onChange={(e) => setDimHeight(e.target.value)}
                      placeholder="e.g. 25 mm"
                      className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Bottom Diameter</label>
                    <input
                      type="text"
                      value={dimBottom}
                      onChange={(e) => setDimBottom(e.target.value)}
                      placeholder="e.g. 52 mm"
                      className="w-full bg-[#161B22] border border-[#1E2633] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={activeProduct.description || ''}
                  onChange={(e) => setActiveProduct({ ...activeProduct, description: e.target.value })}
                  placeholder="Engineered container characteristics and application details..."
                  className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>

              {/* Features Tags */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Product Features
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
                    placeholder="e.g. Microwave Safe, Leak-Proof Seal..."
                    className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-[#1E2633] hover:bg-[#2A3447] text-white text-xs font-bold rounded-xl"
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

              {/* Applications Tags */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Applications / Food Pairing Suggestions
                </label>
                <div className="flex gap-2 mb-2">
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
                    placeholder="e.g. Chutneys, Gravies, Ice Cream, Salads..."
                    className="flex-1 bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                  <button
                    type="button"
                    onClick={handleAddApp}
                    className="px-3 py-1.5 bg-[#1E2633] hover:bg-[#2A3447] text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {appsList.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D1117] border border-[#1E2633] text-emerald-400 text-[11px]"
                    >
                      <span>{a}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveApp(i)}
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
                    value={activeProduct.sort_order ?? 0}
                    onChange={(e) => setActiveProduct({ ...activeProduct, sort_order: Number(e.target.value) })}
                    className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Publish Status
                  </label>
                  <select
                    value={activeProduct.is_active ? 1 : 0}
                    onChange={(e) => setActiveProduct({ ...activeProduct, is_active: Number(e.target.value) })}
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
                  <span>{submitting ? 'Saving...' : 'Save Product'}</span>
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
