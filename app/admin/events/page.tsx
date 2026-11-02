'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

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

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);
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
    setModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setActiveEvent(event);
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
      ev.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Events &amp; Exhibitions Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage global trade fairs, booth locations, and the 3D interactive gallery panels on the live site.
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exhibitions by title or location..."
            className="w-full pl-9 pr-4 py-2 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {filteredEvents.length} Events
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Loading events from MySQL...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No events found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Event &amp; Booth</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.image}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
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
                        <a
                          href={`/events/${ev.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview event"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#1E2633] text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => openEditModal(ev)}
                          title="Edit event"
                          className="p-2 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

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
      </div>

      {/* Editor Modal */}
      {modalOpen && activeEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-black text-white text-base">
                  {activeEvent.id ? 'Edit Exhibition' : 'Add New Exhibition'}
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
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
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
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
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
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeEvent.location || ''}
                    onChange={(e) => setActiveEvent({ ...activeEvent, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Booth / Stall
                  </label>
                  <input
                    type="text"
                    value={activeEvent.booth || ''}
                    onChange={(e) => setActiveEvent({ ...activeEvent, booth: e.target.value })}
                    placeholder="e.g. Hall 4 · Stand D-18"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <MediaInput
                label="Exhibition Banner Image"
                value={activeEvent.image || ''}
                onChange={(url) => setActiveEvent({ ...activeEvent, image: url })}
                placeholder="/images/DSC03993.JPG"
                category="events"
                helpText="Poster image displayed in the 3D exhibition gallery and detail page."
                required
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={activeEvent.short_desc || ''}
                  onChange={(e) => setActiveEvent({ ...activeEvent, short_desc: e.target.value })}
                  placeholder="Overview of the pavilion and presentation"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
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
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(activeEvent.is_featured)}
                      onChange={(e) =>
                        setActiveEvent({ ...activeEvent, is_featured: e.target.checked ? 1 : 0 })
                      }
                      className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                    />
                    <span className="text-xs text-[#b99750] font-bold">Featured on Home</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(activeEvent.is_published)}
                      onChange={(e) =>
                        setActiveEvent({ ...activeEvent, is_published: e.target.checked ? 1 : 0 })
                      }
                      className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#141A24]"
                    />
                    <span className="text-xs text-emerald-400 font-bold">Published</span>
                  </label>
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
