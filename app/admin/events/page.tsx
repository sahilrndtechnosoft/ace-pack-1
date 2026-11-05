'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Eye,
  X,
  Save,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  full_desc?: string;
  date: string;
  location: string;
  booth?: string;
  image: string;
  category?: string;
  is_featured: number;
  is_published: number;
  created_at: string;
}

export default function AdminEventsPage() {
  const { showToast } = useAdmin();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);
  const [formTab, setFormTab] = useState<'venue' | 'media' | 'desc'>('venue');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const json = await res.json();
        setEvents(json.events || []);
      }
    } catch {
      showToast('Failed to load events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setActiveEvent({
      title: '',
      slug: '',
      short_desc: '',
      full_desc: '',
      date: 'November 10–12, 2026',
      location: 'Dubai World Trade Centre, UAE',
      booth: 'Hall 4 · Stand C-22',
      image: '/images/DSC03993.JPG',
      category: 'expo',
      is_featured: 1,
      is_published: 1,
    });
    setFormTab('venue');
    setModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setActiveEvent(event);
    setFormTab('venue');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent?.title || !activeEvent?.date || !activeEvent?.location) return;
    setSubmitting(true);

    const isUpdate = Boolean(activeEvent.id);
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeEvent),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save event.', 'error');
        setSubmitting(false);
        return;
      }

      showToast(isUpdate ? 'Event updated!' : 'Event created!');
      setModalOpen(false);
      if (viewingEvent?.id === activeEvent.id) {
        setViewingEvent((prev) => (prev ? { ...prev, ...activeEvent } as EventItem : null));
      }
      setActiveEvent(null);
      fetchEvents();
    } catch {
      showToast('Network error saving event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Event "${title}" deleted.`);
        if (viewingEvent?.id === id) {
          setViewModalOpen(false);
          setViewingEvent(null);
        }
        fetchEvents();
      } else {
        showToast('Failed to delete event.', 'error');
      }
    } catch {
      showToast('Network error deleting event.', 'error');
    }
  };

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      (ev.booth && ev.booth.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalItems = filteredEvents.length;
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Events &amp; Exhibitions</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage global trade fairs, industry summits, booth showcases, and pavilion appearances.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exhibition</span>
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
            placeholder="Search exhibitions by title, city, or booth..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {filteredEvents.length} Events Total
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading events from MySQL...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No events found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Event &amp; Booth</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {paginatedEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.image}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm truncate">
                              {ev.title}
                            </span>
                            {ev.is_featured ? (
                              <span className="p-0.5 rounded bg-[#b99750]/20 text-[#b99750]" title="Featured">
                                <Sparkles className="w-3 h-3" />
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-[#b99750] font-mono block mt-0.5">
                            {ev.booth || 'Official Pavilion'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-300 font-medium whitespace-nowrap">
                      {ev.date}
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 max-w-[180px]">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {ev.is_published ? (
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
                        {/* Detail View Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewingEvent(ev);
                            setViewModalOpen(true);
                          }}
                          title="View Event Details"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Live Link */}
                        <a
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview event"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(ev)}
                          title="Edit event"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(ev.id, ev.title)}
                          title="Delete event"
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
      {viewModalOpen && viewingEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2633]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b99750]/20 text-[#b99750] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg leading-tight">{viewingEvent.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#b99750] font-mono">{viewingEvent.booth || 'Official Pavilion'}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-400 font-mono">/events/{viewingEvent.slug}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  setViewingEvent(null);
                }}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#141A24] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poster / Banner Image */}
            {viewingEvent.image && (
              <div className="relative rounded-2xl overflow-hidden border border-[#222C3D] bg-[#141A24] aspect-[21/9] max-h-56">
                <img
                  src={viewingEvent.image}
                  alt={viewingEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingEvent.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {viewingEvent.is_published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {viewingEvent.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Featured</span>
                <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${viewingEvent.is_featured ? 'text-[#b99750]' : 'text-gray-400'}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {viewingEvent.is_featured ? 'Homepage' : 'Standard'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Dates</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingEvent.date}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                <span className="text-xs font-bold text-white mt-1 block truncate">
                  {viewingEvent.location}
                </span>
              </div>
            </div>

            {/* Descriptions */}
            <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] space-y-3">
              {viewingEvent.short_desc && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750] block">Overview</span>
                  <p className="text-xs text-white mt-0.5 leading-relaxed">{viewingEvent.short_desc}</p>
                </div>
              )}

              {viewingEvent.full_desc && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Full Description &amp; Showcase Notes</span>
                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed whitespace-pre-line">{viewingEvent.full_desc}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E2633]">
              <a
                href={`/events/${viewingEvent.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Event</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(viewingEvent);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Exhibition</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal - Decluttered & Tabbed */}
      {modalOpen && activeEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {activeEvent.id ? 'Edit Exhibition' : 'Add New Exhibition'}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {activeEvent.slug ? `/events/${activeEvent.slug}` : 'New global exhibition'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#141A24] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#1E2633] gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFormTab('venue')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  formTab === 'venue'
                    ? 'border-[#b99750] text-[#b99750]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                1. Event &amp; Venue
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
                2. Exhibition Poster
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
                3. Story &amp; Visibility
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab 1: Venue */}
              {formTab === 'venue' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeEvent.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setActiveEvent({
                            ...activeEvent,
                            title,
                            slug: activeEvent.slug ? activeEvent.slug : slug,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={activeEvent.slug || ''}
                        onChange={(e) => setActiveEvent({ ...activeEvent, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Dates *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeEvent.date || ''}
                        onChange={(e) => setActiveEvent({ ...activeEvent, date: e.target.value })}
                        placeholder="e.g. Nov 10–12, 2026"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Location / City *
                      </label>
                      <input
                        type="text"
                        required
                        value={activeEvent.location || ''}
                        onChange={(e) => setActiveEvent({ ...activeEvent, location: e.target.value })}
                        placeholder="e.g. Dubai, UAE"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Booth / Stand
                      </label>
                      <input
                        type="text"
                        value={activeEvent.booth || ''}
                        onChange={(e) => setActiveEvent({ ...activeEvent, booth: e.target.value })}
                        placeholder="e.g. Hall 4 · Stand D-18"
                        className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Media */}
              {formTab === 'media' && (
                <div className="space-y-4">
                  <MediaInput
                    label="Exhibition Banner / Poster Image *"
                    value={activeEvent.image || ''}
                    onChange={(url) => setActiveEvent({ ...activeEvent, image: url })}
                    placeholder="/images/DSC03993.JPG"
                    category="events"
                    helpText="Poster image displayed in the exhibition gallery and detail view."
                    required
                  />
                </div>
              )}

              {/* Tab 3: Story & Status */}
              {formTab === 'desc' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Short Overview
                    </label>
                    <textarea
                      rows={2}
                      value={activeEvent.short_desc || ''}
                      onChange={(e) => setActiveEvent({ ...activeEvent, short_desc: e.target.value })}
                      placeholder="Brief overview of the pavilion and presentation"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Full Story &amp; Details
                    </label>
                    <textarea
                      rows={4}
                      value={activeEvent.full_desc || ''}
                      onChange={(e) => setActiveEvent({ ...activeEvent, full_desc: e.target.value })}
                      placeholder="Detailed exhibition description and showcase notes"
                      className="w-full px-3.5 py-2.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141A24] border border-[#222C3D] flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(activeEvent.is_featured)}
                        onChange={(e) =>
                          setActiveEvent({ ...activeEvent, is_featured: e.target.checked ? 1 : 0 })
                        }
                        className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#0D1117]"
                      />
                      <span className="text-xs text-[#b99750] font-bold">Feature on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(activeEvent.is_published)}
                        onChange={(e) =>
                          setActiveEvent({ ...activeEvent, is_published: e.target.checked ? 1 : 0 })
                        }
                        className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#0D1117]"
                      />
                      <span className="text-xs text-emerald-400 font-bold">Published</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1E2633]">
                <div className="flex items-center gap-2">
                  {formTab !== 'venue' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'desc' ? 'media' : 'venue')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {formTab !== 'desc' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'venue' ? 'media' : 'desc')}
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
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    {submitting ? 'Saving...' : 'Save Event'}
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
