'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FolderOpen,
  X,
  Check,
  Loader2,
  ExternalLink,
  FileText,
  FileDown,
  Search,
  Eye,
} from 'lucide-react';

export interface UploadDetails {
  url: string;
  originalName: string;
  sizeBytes: number;
  sizeFormatted: string;
  format: string;
}

export interface MediaInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onUploadDetails?: (details: UploadDetails) => void;
  placeholder?: string;
  helpText?: string;
  category?: 'branding' | 'blogs' | 'events' | 'pages' | 'downloads' | 'general' | 'documents' | 'products' | 'categories' | string;
  accept?: string;
  fileType?: 'image' | 'pdf' | 'any';
  required?: boolean;
}

export function MediaInput({
  label,
  value,
  onChange,
  onUploadDetails,
  placeholder,
  helpText,
  category = 'general',
  accept,
  fileType = 'any',
  required = false,
}: MediaInputProps) {
  const isPdfInput =
    fileType === 'pdf' ||
    (accept && accept.includes('pdf')) ||
    (value && value.toLowerCase().endsWith('.pdf')) ||
    category === 'downloads';

  const defaultAccept = isPdfInput
    ? 'application/pdf,.pdf,image/*'
    : accept || 'image/*';

  const defaultPlaceholder = isPdfInput
    ? '/downloads/... or click Upload PDF'
    : placeholder || '/images/... or /uploads/...';

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [modalTab, setModalTab] = useState<'all' | 'documents' | 'images'>(
    isPdfInput ? 'documents' : 'all'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPdf = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf') || url.includes('/downloads/');
  };

  const isImage = (url: string) => {
    if (!url) return false;
    if (isPdf(url)) return false;
    return (
      url.match(/\.(jpeg|jpg|png|gif|webp|svg|avif)(\?.*)?$/i) !== null ||
      url.startsWith('data:image/') ||
      url.includes('unsplash.com') ||
      url.includes('/images/') ||
      url.includes('/uploads/media_')
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', isPdfInput ? 'documents' : category);
      formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload file.');
      }

      const media = data.media;
      if (media?.url) {
        onChange(media.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);

        if (onUploadDetails) {
          const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
          onUploadDetails({
            url: media.url,
            originalName: media.original_name || file.name,
            sizeBytes: media.size || file.size,
            sizeFormatted: formatFileSize(media.size || file.size),
            format: ext,
          });
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    setLibraryLoading(true);
    setModalTab(isPdfInput ? 'documents' : 'all');
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setLibraryItems(data.media || []);
      }
    } catch {
      // Ignore
    } finally {
      setLibraryLoading(false);
    }
  };

  const filteredLibrary = libraryItems.filter((item) => {
    // Filter by tab
    if (modalTab === 'documents') {
      const isDoc =
        item.category === 'documents' ||
        item.mime_type?.includes('pdf') ||
        item.url?.toLowerCase().endsWith('.pdf');
      if (!isDoc) return false;
    } else if (modalTab === 'images') {
      const isImg =
        item.category === 'images' ||
        item.mime_type?.startsWith('image/') ||
        item.url?.match(/\.(jpeg|jpg|png|webp|svg)/i);
      if (!isImg) return false;
    }

    // Filter by search
    if (!librarySearch) return true;
    const q = librarySearch.toLowerCase();
    return (
      (item.original_name && item.original_name.toLowerCase().includes(q)) ||
      (item.filename && item.filename.toLowerCase().includes(q)) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-300">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          {uploadSuccess && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Check className="w-3 h-3" /> Uploaded to MySQL &amp; Storage!
            </span>
          )}
          {uploadError && (
            <span className="text-[11px] font-bold text-red-400">{uploadError}</span>
          )}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-center gap-2.5">
        {/* Preview / Badge Box */}
        <div className="w-12 h-12 rounded-xl bg-[#141A24] border border-[#222C3D] overflow-hidden flex items-center justify-center shrink-0 relative group">
          {value && isPdf(value) ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open PDF in new tab"
              className="w-full h-full flex flex-col items-center justify-center bg-red-950/40 text-red-400 hover:bg-red-900/50 transition-colors"
            >
              <FileDown className="w-5 h-5 text-red-400" />
              <span className="text-[8px] font-black uppercase tracking-wider text-red-300 mt-0.5">
                PDF
              </span>
            </a>
          ) : value && isImage(value) ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                title="View full image in new tab"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              >
                <Eye className="w-4 h-4" />
              </a>
            </>
          ) : value ? (
            <FileText className="w-5 h-5 text-[#b99750]" />
          ) : isPdfInput ? (
            <FileDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Text Input for Path or URL */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={defaultPlaceholder}
            required={required}
            className="w-full px-3 py-2.5 pr-8 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#b99750] transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={defaultAccept}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50 ${
              isPdfInput
                ? 'bg-red-500/15 hover:bg-red-500/25 border-red-500/40 text-red-200'
                : 'bg-[#b99750]/20 hover:bg-[#b99750]/30 border-[#b99750]/40 text-[#f3ddab]'
            }`}
            title={isPdfInput ? 'Upload PDF document directly from your computer' : 'Upload an image directly from your computer'}
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : isPdfInput ? (
              <>
                <Upload className="w-3.5 h-3.5 text-red-400" />
                <span>Upload PDF</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#b99750]" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>

        {/* Browse Media Library Button */}
        <div>
          <button
            type="button"
            onClick={openLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#141A24] hover:bg-[#1E2633] border border-[#222C3D] text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Choose from uploaded media and PDF documents"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#b99750]" />
            <span className="hidden sm:inline">Browse</span>
          </button>
        </div>
      </div>

      {helpText && <p className="text-[11px] text-gray-500">{helpText}</p>}

      {/* Media Library Selector Modal */}
      {libraryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLibraryOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-[#0D1117] border border-[#1E2633] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1E2633] bg-[#141A24]/60">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#b99750]" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">Select from Media Library</h3>
                  <p className="text-[11px] text-gray-400">
                    Click any document or image to select it for this field
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="p-1.5 rounded-xl bg-[#141A24] border border-[#222C3D] text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Bar & Category Filter Tabs */}
            <div className="p-4 border-b border-[#1E2633] bg-[#0A0D12] flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search files by name..."
                  className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setModalTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    modalTab === 'all'
                      ? 'bg-[#b99750] text-[#0A0D12]'
                      : 'bg-[#141A24] text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    modalTab === 'documents'
                      ? 'bg-red-500/80 text-white'
                      : 'bg-[#141A24] text-gray-400 hover:text-white'
                  }`}
                >
                  PDFs &amp; Documents
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('images')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    modalTab === 'images'
                      ? 'bg-[#b99750] text-[#0A0D12]'
                      : 'bg-[#141A24] text-gray-400 hover:text-white'
                  }`}
                >
                  Images
                </button>
              </div>
            </div>

            {/* Modal Media Grid */}
            <div className="p-5 overflow-y-auto max-h-[55vh]">
              {libraryLoading ? (
                <div className="py-12 text-center text-xs font-bold text-gray-400 animate-pulse">
                  Loading media library...
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-gray-400">No matching files found.</p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Use the &ldquo;Upload&rdquo; button to upload your PDF or image directly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredLibrary.map((item) => {
                    const isDocItem =
                      item.mime_type?.includes('pdf') ||
                      item.category === 'documents' ||
                      item.url?.toLowerCase().endsWith('.pdf');
                    const isImgItem =
                      !isDocItem &&
                      (item.mime_type?.startsWith('image/') ||
                        item.url?.match(/\.(jpeg|jpg|png|webp|svg)/i));
                    const isSelected = value === item.url;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item.url);
                          if (onUploadDetails) {
                            const ext = item.original_name.split('.').pop()?.toUpperCase() || (isDocItem ? 'PDF' : 'IMAGE');
                            onUploadDetails({
                              url: item.url,
                              originalName: item.original_name,
                              sizeBytes: item.size,
                              sizeFormatted: formatFileSize(item.size),
                              format: ext,
                            });
                          }
                          setLibraryOpen(false);
                        }}
                        className={`group relative rounded-2xl border p-2.5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#b99750]/15 border-[#b99750] ring-2 ring-[#b99750]/30'
                            : 'bg-[#141A24] border-[#222C3D] hover:border-[#b99750]/60 hover:bg-[#1A2230]'
                        }`}
                      >
                        <div className="w-full h-24 rounded-xl bg-[#0A0D12] overflow-hidden flex items-center justify-center mb-2 relative">
                          {isDocItem ? (
                            <div className="flex flex-col items-center justify-center text-red-400">
                              <FileDown className="w-8 h-8 text-red-400 mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-wider bg-red-950/60 px-2 py-0.5 rounded text-red-300">
                                PDF
                              </span>
                            </div>
                          ) : isImgItem ? (
                            <img
                              src={item.url}
                              alt={item.original_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <FileText className="w-8 h-8 text-[#b99750]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white truncate" title={item.original_name}>
                            {item.original_name}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {formatFileSize(item.size)} · {item.category}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#b99750] text-[#0A0D12] flex items-center justify-center text-[10px] font-black shadow-md">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1E2633] bg-[#141A24]/60 flex items-center justify-between text-xs text-gray-400">
              <span>{filteredLibrary.length} file(s) displayed</span>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1E2633] hover:bg-[#283244] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
