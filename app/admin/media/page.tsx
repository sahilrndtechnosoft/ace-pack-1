'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  UploadCloud,
  Search,
  Image as ImageIcon,
  FileText,
  Video,
  Copy,
  Trash2,
  ExternalLink,
  Check,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text: string;
  category: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const { showToast } = useAdmin();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/media', window.location.origin);
      if (category !== 'all') url.searchParams.set('category', category);
      if (search) url.searchParams.set('search', search);

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setMedia(json.media || []);
      }
    } catch {
      showToast('Failed to load media items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [category]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category !== 'all' ? category : 'general');

      try {
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          successCount++;
        }
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      showToast(`Uploaded ${successCount} file(s) successfully!`);
      fetchMedia();
    } else {
      showToast('Upload failed.', 'error');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Media relative URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showToast(`File "${name}" deleted.`);
        fetchMedia();
      } else if (res.status === 409 && Array.isArray(data.usedIn)) {
        window.alert(`"${name}" can't be deleted because it is still used here:\n\n• ${data.usedIn.slice(0, 12).join('\n• ')}${data.usedIn.length > 12 ? `\n…and ${data.usedIn.length - 12} more` : ''}\n\nChoose a different image in those places first.`);
      } else {
        showToast(data.error || 'Failed to delete file.', 'error');
      }
    } catch {
      showToast('Network error deleting file.', 'error');
    }
  };

  const saveAltText = async (item: MediaItem, altText: string) => {
    if (altText.trim() === (item.alt_text || '').trim()) return;
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, alt_text: altText }),
      });
      if (!res.ok) throw new Error();
      setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, alt_text: altText.trim() } : m)));
      showToast('Image description saved.');
    } catch {
      showToast('Could not save the description.', 'error');
    }
  };

  const replaceFile = async (item: MediaItem, file: File) => {
    if (!confirm(`Replace "${item.original_name}" everywhere it is used on the website?`)) return;
    const body = new FormData();
    body.append('id', item.id);
    body.append('file', file);
    try {
      const res = await fetch('/api/admin/media', { method: 'PUT', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Replace failed.');
      showToast('File replaced. Pages using it now show the new version.');
      fetchMedia();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Replace failed.', 'error');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredMedia = media.filter(
    (m) =>
      m.original_name.toLowerCase().includes(search.toLowerCase()) ||
      m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Media Library</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Centralized file storage for images, brochures, CAD specs, and promotional videos.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 rounded-3xl border-2 border-dashed border-[#222C3D] hover:border-[#b99750] bg-[#0D1117] hover:bg-[#121720] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#141A24] border border-[#222C3D] text-[#b99750] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-white">
          Drop images, documents, or videos here to upload
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports PNG, WEBP, JPG, SVG, PDF, MP4 up to 50MB. Stored securely and managed in MySQL.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2">
          {['all', 'images', 'documents', 'videos'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#b99750] text-[#0A0D12]'
                  : 'bg-[#141A24] text-gray-400 hover:text-white border border-[#222C3D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
          />
        </div>
      </div>

      {/* Media Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          Loading media library...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-xs rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          No media files found. Upload your first image or PDF above!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const isImage = item.mime_type.startsWith('image/');
            const isVideo = item.mime_type.startsWith('video/');

            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] hover:border-[#b99750]/50 transition-all flex flex-col justify-between group"
              >
                {/* Preview Box */}
                <div className="relative h-32 w-full rounded-xl bg-[#141A24] border border-[#222C3D] overflow-hidden flex items-center justify-center mb-2.5">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center gap-1 text-purple-400">
                      <Video className="w-8 h-8" />
                      <span className="text-[10px] font-bold">Video File</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#b99750]">
                      <FileText className="w-8 h-8" />
                      <span className="text-[10px] font-bold">Document</span>
                    </div>
                  )}
                </div>

                {/* File Details */}
                <div className="space-y-1 mb-2.5">
                  <span className="text-xs font-bold text-white block truncate" title={item.original_name}>
                    {item.original_name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>{formatFileSize(item.size)}</span>
                    <span className="uppercase">{item.category}</span>
                  </div>
                  {isImage && (
                    <input
                      type="text"
                      defaultValue={item.alt_text || ''}
                      onBlur={(e) => saveAltText(item, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                      placeholder="Describe the image (alt text)"
                      aria-label={`Description of ${item.original_name}`}
                      maxLength={255}
                      className="w-full mt-1 px-2 py-1.5 bg-[#141A24] border border-[#222C3D] rounded-lg text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-[#1E2633]">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    title="Copy URL"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                    className="p-1.5 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {item.url.startsWith('/uploads/') && (
                    <label title="Replace file (keeps the same link)" className="p-1.5 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="sr-only">Replace {item.original_name}</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept={item.mime_type}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (file) replaceFile(item, file);
                        }}
                      />
                    </label>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.original_name)}
                    title="Delete media"
                    className="p-1.5 rounded-lg bg-[#141A24] hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
