'use client';

import React, { useEffect, useState } from 'react';
import {
  FileDown,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  FileText,
  Calendar,
  Save,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  format: string;
  file_size: string;
  download_url: string;
  cover_image?: string;
  sort_order: number;
  is_published: number;
  created_at: string;
}

export default function AdminDownloadsPage() {
  const { showToast } = useAdmin();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DownloadItem | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/downloads');
      if (res.ok) {
        const json = await res.json();
        setDownloads(json.downloads || []);
      }
    } catch {
      showToast('Failed to load downloads.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const openCreateModal = () => {
    setActiveDoc({
      title: '',
      description: '',
      category: 'Catalogs & Brochures',
      format: 'Catalog',
      file_size: '4.2 MB',
      download_url: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
      cover_image: '',
      is_published: 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (doc: DownloadItem) => {
    setActiveDoc(doc);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc?.title || !activeDoc?.download_url) return;
    setSubmitting(true);

    const isUpdate = Boolean(activeDoc.id);
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/downloads', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeDoc),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save download item.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isUpdate ? 'Download item updated!' : 'Download item created!');
      setModalOpen(false);
      if (viewingDoc?.id === activeDoc.id) {
        setViewingDoc((prev) => (prev ? { ...prev, ...activeDoc } as DownloadItem : null));
      }
      setActiveDoc(null);
      fetchDownloads();
    } catch {
      showToast('Network error saving download.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/downloads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Document "${title}" deleted.`);
        if (viewingDoc?.id === id) {
          setViewModalOpen(false);
          setViewingDoc(null);
        }
        fetchDownloads();
      } else {
        showToast('Failed to delete download.', 'error');
      }
    } catch {
      showToast('Network error deleting download.', 'error');
    }
  };

  const filteredDownloads = downloads.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.download_url.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalItems = filteredDownloads.length;
  const paginatedDownloads = filteredDownloads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
          <h1 className="text-2xl font-black text-white">Download Center Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage product catalogues, food safety compliance certificates, specs sheets, and brochures.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Document</span>
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
            placeholder="Search documents by title, category, or file path..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {filteredDownloads.length} Documents Total
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading downloads from MySQL...
          </div>
        ) : filteredDownloads.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No downloads found matching search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Document Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Format &amp; Size</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {paginatedDownloads.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#b99750]/15 text-[#b99750] flex items-center justify-center shrink-0">
                          <FileDown className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white text-sm block truncate">
                            {doc.title}
                          </span>
                          {doc.description && (
                            <span className="text-[11px] text-gray-400 block line-clamp-1 mt-0.5">
                              {doc.description}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5 truncate">
                            {doc.download_url}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#141A24] border border-[#222C3D] text-[#b99750]">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gray-300 font-mono font-bold block">{doc.format}</span>
                      <span className="text-[10px] text-gray-500 block">{doc.file_size}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail View Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewingDoc(doc);
                            setViewModalOpen(true);
                          }}
                          title="View Document Details"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct Download / View */}
                        <a
                          href={doc.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open/Download Document"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(doc)}
                          title="Edit document"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Delete document"
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
      {viewModalOpen && viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingDoc.title}</h3>
                  <span className="text-xs text-[#b99750] font-semibold mt-0.5 block">{viewingDoc.category}</span>
                  {viewingDoc.description && (
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed bg-[#141A24] p-3 rounded-xl border border-[#222C3D]">
                      {viewingDoc.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingDoc(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cover image if available */}
            {viewingDoc.cover_image && (
              <div className="relative rounded-2xl overflow-hidden border border-[#222C3D] bg-[#141A24] aspect-[16/9] max-h-48">
                <img
                  src={viewingDoc.cover_image}
                  alt={viewingDoc.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingDoc.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingDoc.is_published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {viewingDoc.is_published ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Format</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono">
                  {viewingDoc.format}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">File Size</span>
                <span className="text-xs font-bold text-white mt-1 block font-mono">
                  {viewingDoc.file_size}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Added On</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {formatDate(viewingDoc.created_at)}
                </span>
              </div>
            </div>

            {/* Download Link Card */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">File Asset URL:</span>
              <p className="font-mono text-xs text-[#b99750] break-all bg-[#0D1117] p-2.5 rounded-xl border border-[#1E2633]">
                {viewingDoc.download_url}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <a
                href={viewingDoc.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Download File</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(viewingDoc);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Decluttered */}
      {modalOpen && activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-black text-white text-base">
                  {activeDoc.id ? 'Edit Document' : 'Add New Document'}
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={activeDoc.title || ''}
                  onChange={(e) => setActiveDoc({ ...activeDoc, title: e.target.value })}
                  placeholder="e.g. Ace Packaging Product Catalog 2026"
                  className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Document Description
                </label>
                <textarea
                  rows={3}
                  value={activeDoc.description || ''}
                  onChange={(e) => setActiveDoc({ ...activeDoc, description: e.target.value })}
                  placeholder="e.g. Comprehensive product catalog — hinge cups to custom IML containers — with complete volume capacities, dimensions and carton quantities."
                  className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                      Category
                    </label>
                  </div>
                  <input
                    type="text"
                    value={activeDoc.category || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, category: e.target.value })}
                    placeholder="Catalogs & Brochures"
                    className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Catalogs & Brochures', 'Certifications & Compliance'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveDoc({ ...activeDoc, category: cat })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                          activeDoc.category === cat
                            ? 'bg-[#b99750]/20 text-[#b99750] border-[#b99750]/40'
                            : 'bg-[#141A24] text-gray-400 border-[#222C3D] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Format (e.g. Catalog, Certificate, PDF)
                  </label>
                  <input
                    type="text"
                    value={activeDoc.format || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, format: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    File Size Display
                  </label>
                  <input
                    type="text"
                    value={activeDoc.file_size || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, file_size: e.target.value })}
                    placeholder="4.2 MB"
                    className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <MediaInput
                label="Downloadable File (PDF or Document) *"
                value={activeDoc.download_url || ''}
                onChange={(url) => setActiveDoc({ ...activeDoc, download_url: url })}
                onUploadDetails={(details) => {
                  setActiveDoc((prev: any) => ({
                    ...prev,
                    download_url: details.url,
                    file_size: prev?.file_size || details.sizeFormatted,
                    format: prev?.format || details.format || 'PDF',
                    title: prev?.title || details.originalName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
                  }));
                }}
                fileType="pdf"
                placeholder="/downloads/... or click Upload PDF"
                category="downloads"
                accept="application/pdf,.pdf,image/*"
                helpText="Directly upload your PDF file from your computer or pick from the document library."
                required
              />

              <MediaInput
                label="Cover Preview Image"
                value={activeDoc.cover_image || ''}
                onChange={(url) => setActiveDoc({ ...activeDoc, cover_image: url })}
                placeholder="/images/hero-bg-image.jpg"
                category="downloads"
                accept="image/*"
                helpText="Thumbnail image for catalogue/certificate previews."
              />

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(activeDoc.is_published)}
                    onChange={(e) =>
                      setActiveDoc({ ...activeDoc, is_published: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                  />
                  <span className="text-xs text-emerald-400 font-bold">Visible on Download Center</span>
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
                    {submitting ? 'Saving...' : 'Save Document'}
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
