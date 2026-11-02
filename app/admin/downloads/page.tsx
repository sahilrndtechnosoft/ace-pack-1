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
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

interface DownloadItem {
  id: string;
  title: string;
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

  // Modal
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
      category: 'Catalogues & Brochures',
      format: 'PDF',
      file_size: '4.5 MB',
      download_url: '/downloads/Ace_Packaging_Full_Product_Catalog.pdf',
      cover_image: '/images/hero-bg-image.jpg',
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

      showToast(isUpdate ? 'Document updated!' : 'Document added to downloads!');
      setModalOpen(false);
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
        fetchDownloads();
      } else {
        showToast('Failed to delete download.', 'error');
      }
    } catch {
      showToast('Network error deleting document.', 'error');
    }
  };

  const filteredDownloads = downloads.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Download Center Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage downloadable PDF product catalogues, ISO compliance certificates, and CAD drawings.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
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
            placeholder="Search downloads by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {filteredDownloads.length} Documents
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading downloads from MySQL...
          </div>
        ) : filteredDownloads.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No downloads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Document Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">File Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {filteredDownloads.map((doc) => (
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
                        <a
                          href={doc.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open document"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => openEditModal(doc)}
                          title="Edit document"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

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
      </div>

      {/* Modal */}
      {modalOpen && activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
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
                  placeholder="e.g. Ace Packaging Full Product Catalog 2026"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={activeDoc.category || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, category: e.target.value })}
                    placeholder="Catalogues & Brochures"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Format (e.g. PDF, CAD)
                  </label>
                  <input
                    type="text"
                    value={activeDoc.format || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, format: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    File Size Display
                  </label>
                  <input
                    type="text"
                    value={activeDoc.file_size || ''}
                    onChange={(e) => setActiveDoc({ ...activeDoc, file_size: e.target.value })}
                    placeholder="4.2 MB"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <MediaInput
                label="Downloadable File (PDF or Document)"
                value={activeDoc.download_url || ''}
                onChange={(url) => setActiveDoc({ ...activeDoc, download_url: url })}
                onUploadDetails={(details) => {
                  setActiveDoc((prev) => ({
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
