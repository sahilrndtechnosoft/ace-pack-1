'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Layers,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit,
  Save,
  Send,
  Sliders,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

interface SectionItem {
  id: string;
  page_slug: string;
  section_key: string;
  title: string;
  subtitle: string;
  draft_content: string;
  published_content: string;
  is_enabled: number;
  is_published: number;
  sort_order: number;
  updated_at: string;
  page_title?: string;
}

function AdminSectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useAdmin();

  const selectedPage = searchParams.get('page') || 'home';

  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagesList, setPagesList] = useState<Array<{ slug: string; title: string }>>([]);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionItem | null>(null);
  const [parsedDraft, setParsedDraft] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [submitting, setSubmitting] = useState(false);

  // Create Section Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    page_slug: selectedPage,
    section_key: '',
    title: '',
    subtitle: '',
    content: '{\n  "heading": "",\n  "lead": ""\n}',
  });
  const [creating, setCreating] = useState(false);

  const fetchSections = async (page: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sections?page=${encodeURIComponent(page)}`);
      if (res.ok) {
        const json = await res.json();
        setSections(json.sections || []);
      }
    } catch {
      showToast('Failed to load sections.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPagesList = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      if (res.ok) {
        const json = await res.json();
        setPagesList(json.pages?.map((p: any) => ({ slug: p.slug, title: p.title })) || []);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchPagesList();
  }, []);

  useEffect(() => {
    fetchSections(selectedPage);
  }, [selectedPage]);

  const handleSelectPage = (slug: string) => {
    router.push(`/admin/sections?page=${slug}`);
  };

  const handleToggleEnabled = async (section: SectionItem) => {
    const newStatus = section.is_enabled ? 0 : 1;
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, is_enabled: newStatus }),
      });
      if (res.ok) {
        showToast(`Section "${section.title}" is now ${newStatus ? 'enabled' : 'disabled'}.`);
        fetchSections(selectedPage);
      }
    } catch {
      showToast('Failed to toggle section visibility.', 'error');
    }
  };

  const handleReorder = async (section: SectionItem, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((s) => s.id === section.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sections.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetSection = sections[targetIndex];

    try {
      // Swap sort_orders
      await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, sort_order: targetSection.sort_order }),
      });
      await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: targetSection.id, sort_order: section.sort_order }),
      });

      showToast('Section order updated.');
      fetchSections(selectedPage);
    } catch {
      showToast('Failed to reorder section.', 'error');
    }
  };

  const openEditor = (section: SectionItem) => {
    setActiveSection(section);
    try {
      setParsedDraft(JSON.parse(section.draft_content));
    } catch {
      setParsedDraft({ rawText: section.draft_content });
    }
    setEditModalOpen(true);
  };

  const handleSaveSection = async (publishLive = false) => {
    if (!activeSection) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeSection.id,
          title: activeSection.title,
          subtitle: activeSection.subtitle,
          draft_content: parsedDraft,
          publish: publishLive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save section.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(publishLive ? 'Changes published live to website!' : 'Draft saved successfully.');
      setEditModalOpen(false);
      setActiveSection(null);
      fetchSections(selectedPage);
    } catch {
      showToast('Network error saving section.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishDirect = async (section: SectionItem) => {
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id,
          draft_content: section.draft_content,
          publish: true,
        }),
      });

      if (res.ok) {
        showToast(`Section "${section.title}" published live!`);
        fetchSections(selectedPage);
      }
    } catch {
      showToast('Failed to publish section.', 'error');
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionData.section_key.trim()) {
      showToast('Section key is required.', 'error');
      return;
    }

    setCreating(true);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(newSectionData.content);
      } catch {
        parsed = { text: newSectionData.content };
      }

      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_slug: newSectionData.page_slug || selectedPage,
          section_key: newSectionData.section_key.trim(),
          title: newSectionData.title.trim() || newSectionData.section_key.trim(),
          subtitle: newSectionData.subtitle.trim(),
          content: parsed,
          is_enabled: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to create section.', 'error');
        setCreating(false);
        return;
      }

      showToast('Section created successfully in MySQL!');
      setCreateModalOpen(false);
      setNewSectionData({
        page_slug: selectedPage,
        section_key: '',
        title: '',
        subtitle: '',
        content: '{\n  "heading": "",\n  "lead": ""\n}',
      });
      fetchSections(selectedPage);
    } catch {
      showToast('Network error creating section.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSection = async (section: SectionItem) => {
    if (!confirm(`Are you sure you want to delete section "${section.title || section.section_key}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/sections?id=${encodeURIComponent(section.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to delete section.', 'error');
        return;
      }

      showToast(`Section "${section.title || section.section_key}" deleted.`);
      fetchSections(selectedPage);
    } catch {
      showToast('Network error deleting section.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Section Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Edit text, headings, buttons, images, links and visibility for every section of the live site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setNewSectionData({
                page_slug: selectedPage,
                section_key: '',
                title: '',
                subtitle: '',
                content: '{\n  "heading": "",\n  "lead": ""\n}',
              });
              setCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Section</span>
          </button>

          <a
            href={`/${selectedPage === 'home' ? '' : selectedPage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
          >
            <span>Preview Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Page Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-2">
            Select Page:
          </span>
          {pagesList.map((p) => {
            const isSelected = p.slug === selectedPage;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => handleSelectPage(p.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#b99750] text-[#0A0D12] font-black shadow-sm'
                    : 'bg-[#141A24] text-gray-400 hover:text-white border border-[#222C3D]'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-400 font-mono shrink-0">
          Route: <span className="text-[#b99750]">/{selectedPage === 'home' ? '' : selectedPage}</span>
        </div>
      </div>

      {/* Sections Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse rounded-2xl bg-[#0D1117] border border-[#1E2633]">
            Loading sections from MySQL...
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs rounded-2xl bg-[#0D1117] border border-[#1E2633]">
            No sections found for this page.
          </div>
        ) : (
          sections.map((section, idx) => {
            const hasDraft = section.draft_content !== section.published_content;

            return (
              <div
                key={section.id}
                className={`p-5 rounded-3xl border transition-all ${
                  section.is_enabled
                    ? 'bg-[#0D1117] border-[#1E2633] hover:border-[#b99750]/40'
                    : 'bg-[#090C10] border-[#161C26] opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#141A24] border border-[#222C3D] text-[#b99750] font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm sm:text-base font-extrabold text-white">
                          {section.title || section.section_key}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141A24] border border-[#222C3D] text-gray-400">
                          {section.section_key}
                        </span>

                        {hasDraft ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            <span>Draft Changes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Live</span>
                          </span>
                        )}
                      </div>

                      {section.subtitle && (
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-2xl">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                    {/* Sort controls */}
                    <div className="flex items-center border border-[#222C3D] rounded-xl overflow-hidden bg-[#141A24]">
                      <button
                        type="button"
                        onClick={() => handleReorder(section, 'up')}
                        disabled={idx === 0}
                        title="Move Section Up"
                        className="p-2 hover:bg-[#1E2633] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(section, 'down')}
                        disabled={idx === sections.length - 1}
                        title="Move Section Down"
                        className="p-2 hover:bg-[#1E2633] text-gray-400 hover:text-white disabled:opacity-30 border-l border-[#222C3D] cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(section)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        section.is_enabled
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {section.is_enabled ? 'Active' : 'Disabled'}
                    </button>

                    {/* Publish Live if has draft */}
                    {hasDraft && (
                      <button
                        type="button"
                        onClick={() => handlePublishDirect(section)}
                        title="Promote draft directly to live site"
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Publish Live</span>
                      </button>
                    )}

                    {/* Edit Section Button */}
                    <button
                      type="button"
                      onClick={() => openEditor(section)}
                      className="px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>

                    {/* Delete Section Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section)}
                      title="Delete Section"
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Section Content Modal */}
      {editModalOpen && activeSection && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2633]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                  {activeSection.page_slug} / {activeSection.section_key}
                </span>
                <h3 className="font-black text-white text-lg">
                  Edit Section: {activeSection.title || activeSection.section_key}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#141A24] border border-[#222C3D] rounded-xl p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('visual')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'visual' ? 'bg-[#b99750] text-[#0A0D12]' : 'text-gray-400'
                    }`}
                  >
                    Form Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('json')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === 'json' ? 'bg-[#b99750] text-[#0A0D12]' : 'text-gray-400'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {activeTab === 'visual' ? (
              <div className="space-y-4">
                {/* Meta Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Section Display Title
                    </label>
                    <input
                      type="text"
                      value={activeSection.title || ''}
                      onChange={(e) => setActiveSection({ ...activeSection, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={activeSection.subtitle || ''}
                      onChange={(e) => setActiveSection({ ...activeSection, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>
                </div>

                {/* Dynamic Content Fields from parsedDraft */}
                <div className="p-4 rounded-2xl bg-[#090C10] border border-[#1E2633] space-y-3.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#b99750] border-b border-[#1E2633] pb-2">
                    Section Content Properties
                  </div>

                  {Object.entries(parsedDraft).map(([key, value]) => {
                    if (typeof value === 'string') {
                      const lowerKey = key.toLowerCase();

                      const isPdfField =
                        lowerKey.includes('pdf') ||
                        lowerKey.includes('download') ||
                        lowerKey.includes('brochure') ||
                        lowerKey.includes('catalog') ||
                        lowerKey.includes('catalogue') ||
                        lowerKey.includes('datasheet') ||
                        lowerKey.includes('certificate') ||
                        lowerKey.includes('doc') ||
                        value.toLowerCase().endsWith('.pdf') ||
                        value.startsWith('/downloads/');

                      if (isPdfField) {
                        return (
                          <div key={key} className="pt-1">
                            <MediaInput
                              label={key.replace(/([A-Z])/g, ' $1')}
                              value={value}
                              onChange={(newUrl) => setParsedDraft({ ...parsedDraft, [key]: newUrl })}
                              fileType="pdf"
                              placeholder="/downloads/... or upload PDF"
                              category="downloads"
                              accept="application/pdf,.pdf,image/*"
                              helpText={`Upload or select a PDF document / download file for ${key}`}
                            />
                          </div>
                        );
                      }

                      const isImageField =
                        lowerKey.includes('image') ||
                        lowerKey.includes('img') ||
                        lowerKey.includes('banner') ||
                        lowerKey.includes('photo') ||
                        lowerKey.includes('pic') ||
                        lowerKey.includes('logo') ||
                        lowerKey.includes('portrait') ||
                        lowerKey.includes('thumbnail') ||
                        lowerKey.includes('cover') ||
                        lowerKey.includes('file') ||
                        value.startsWith('/images/') ||
                        value.startsWith('/uploads/');

                      if (isImageField) {
                        return (
                          <div key={key} className="pt-1">
                            <MediaInput
                              label={key.replace(/([A-Z])/g, ' $1')}
                              value={value}
                              onChange={(newUrl) => setParsedDraft({ ...parsedDraft, [key]: newUrl })}
                              placeholder="/images/... or upload"
                              category="pages"
                              helpText={`Upload or select an image for ${key}`}
                            />
                          </div>
                        );
                      }

                      const isLong = value.length > 80 || lowerKey.includes('paragraph') || lowerKey.includes('desc') || lowerKey.includes('body');
                      return (
                        <div key={key}>
                          <label className="block text-xs font-mono font-bold text-gray-300 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          {isLong ? (
                            <textarea
                              rows={3}
                              value={value}
                              onChange={(e) => setParsedDraft({ ...parsedDraft, [key]: e.target.value })}
                              className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setParsedDraft({ ...parsedDraft, [key]: e.target.value })}
                              className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                            />
                          )}
                        </div>
                      );
                    }

                    if (typeof value === 'object' && value !== null) {
                      return (
                        <div key={key} className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D] space-y-2">
                          <label className="block text-xs font-mono font-extrabold text-[#b99750] capitalize">
                            {key.replace(/([A-Z])/g, ' $1')} (Complex Structure)
                          </label>
                          <textarea
                            rows={4}
                            value={JSON.stringify(value, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                setParsedDraft({ ...parsedDraft, [key]: parsed });
                              } catch {
                                // Keep raw text if in-progress editing
                              }
                            }}
                            className="w-full px-3 py-2 bg-[#0D1117] border border-[#1E2633] rounded-xl text-xs font-mono text-gray-200 focus:outline-none focus:border-[#b99750]"
                          />
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 mb-1">
                  Full Draft Content JSON
                </label>
                <textarea
                  rows={14}
                  value={JSON.stringify(parsedDraft, null, 2)}
                  onChange={(e) => {
                    try {
                      setParsedDraft(JSON.parse(e.target.value));
                    } catch {
                      // ignore parse errors while typing
                    }
                  }}
                  className="w-full p-4 bg-[#090C10] border border-[#222C3D] rounded-2xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#b99750]"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <span className="text-xs text-gray-500 font-medium">
                Changes persist immediately to MySQL database
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSaveSection(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-200 text-xs font-bold border border-[#222C3D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSaveSection(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Section Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2633]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b99750] block">
                  New Section
                </span>
                <h3 className="font-black text-white text-lg">Add Section to Website</h3>
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#161D27] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4">
              {/* Target Page */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Target Page *
                </label>
                <select
                  value={newSectionData.page_slug}
                  onChange={(e) => setNewSectionData({ ...newSectionData, page_slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A24] border border-[#222C3D] text-white text-xs font-semibold focus:outline-hidden focus:border-[#b99750]"
                >
                  {pagesList.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Key */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Section Key (unique code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. promo_banner, stats_grid, highlight_card"
                  value={newSectionData.section_key}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      section_key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A24] border border-[#222C3D] text-white text-xs font-mono focus:outline-hidden focus:border-[#b99750]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Unique identifier used by frontend templates. Lowercase letters, numbers, and underscores only.
                </p>
              </div>

              {/* Section Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Display Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Festive Food Container Promo"
                  value={newSectionData.title}
                  onChange={(e) => setNewSectionData({ ...newSectionData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A24] border border-[#222C3D] text-white text-xs font-semibold focus:outline-hidden focus:border-[#b99750]"
                />
              </div>

              {/* Section Subtitle */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Subtitle / Eyebrow (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Limited period bulk export rates"
                  value={newSectionData.subtitle}
                  onChange={(e) => setNewSectionData({ ...newSectionData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A24] border border-[#222C3D] text-white text-xs font-semibold focus:outline-hidden focus:border-[#b99750]"
                />
              </div>

              {/* Initial Content JSON */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Initial Content (JSON format)
                </label>
                <textarea
                  rows={4}
                  value={newSectionData.content}
                  onChange={(e) => setNewSectionData({ ...newSectionData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090C10] border border-[#222C3D] text-[#b99750] font-mono text-xs focus:outline-hidden focus:border-[#b99750]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2633]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creating ? 'Creating...' : 'Create Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSectionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#b99750]">Loading Section Editor...</div>}>
      <AdminSectionsContent />
    </Suspense>
  );
}
