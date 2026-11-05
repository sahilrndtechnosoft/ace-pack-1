'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Building,
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  X,
  Inbox,
  Filter,
  Check,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  category: string | null;
  subject: string | null;
  message: string;
  source_page: string | null;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_address: string | null;
  user_agent: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StatusCounts {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
  today: number;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
    today: 0,
  });

  // Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        status: statusFilter,
      });

      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      }
      if (categoryFilter.trim()) {
        params.set('category', categoryFilter.trim());
      }

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
        setCurrentPage(data.page || 1);
        if (data.statusCounts) {
          setStatusCounts(data.statusCounts);
        }
      }
    } catch (err) {
      console.error('Error fetching contact inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [statusFilter, categoryFilter, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContacts(1);
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, status: newStatus as any } : c))
        );
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus as any });
        }
        setActionSuccess(`Status updated to "${newStatus}"`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedContact.id, notes: adminNotes }),
      });

      if (res.ok) {
        setSelectedContact({ ...selectedContact, notes: adminNotes });
        setContacts((prev) =>
          prev.map((c) => (c.id === selectedContact.id ? { ...c, notes: adminNotes } : c))
        );
        setActionSuccess('Admin follow-up notes saved.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    try {
      const res = await fetch(`/api/admin/contacts?id=${contactId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
        setDeleteConfirmId(null);
        if (detailModalOpen && selectedContact?.id === contactId) {
          setDetailModalOpen(false);
          setSelectedContact(null);
        }
        setActionSuccess('Inquiry deleted successfully.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const openDetailModal = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setAdminNotes(contact.notes || '');
    setDetailModalOpen(true);

    // Auto mark as read if it was unread
    if (contact.status === 'unread') {
      handleStatusChange(contact.id, 'read');
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Unread
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Check className="w-3 h-3" />
            Read
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Replied
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-800 text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161B22] border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161B22] p-6 rounded-2xl border border-[#1E2633]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b99750]"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b99750]">
              Inquiry Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Contact &amp; Lead Inquiries</h1>
          <p className="text-xs text-gray-400 mt-1">
            View, track, and manage all factory inquiries, sample requests, and customer messages submitted through website forms.
          </p>
        </div>

        <button
          onClick={() => fetchContacts(currentPage)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F2733] hover:bg-[#283344] text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-[#2D3848] shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Total Inquiries</span>
            <Inbox className="w-4 h-4 text-[#b99750]" />
          </div>
          <div className="text-2xl font-black text-white">{statusCounts.total}</div>
          <span className="text-[10px] text-gray-400">All received messages</span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Unread Leads</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </div>
          <div className="text-2xl font-black text-amber-300">{statusCounts.unread}</div>
          <span className="text-[10px] text-amber-400/80">Requires response</span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Replied / Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{statusCounts.replied}</div>
          <span className="text-[10px] text-gray-400">Processed by sales</span>
        </div>

        <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-medium">Received Today</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{statusCounts.today}</div>
          <span className="text-[10px] text-gray-400">Today&apos;s new leads</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161B22] p-4 rounded-xl border border-[#1E2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All', count: statusCounts.total },
            { id: 'unread', label: 'Unread', count: statusCounts.unread },
            { id: 'read', label: 'Read', count: statusCounts.read },
            { id: 'replied', label: 'Replied', count: statusCounts.replied },
            { id: 'archived', label: 'Archived', count: statusCounts.archived },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#b99750] text-[#0A0D12]'
                  : 'bg-[#1F2733] text-gray-300 hover:text-white hover:bg-[#283344]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-[#0A0D12]/20 text-[#0A0D12]' : 'bg-[#0D1117] text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2633] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                  fetchContacts(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#b99750] hover:bg-[#cfa144] text-[#0A0D12] rounded-lg text-xs font-bold transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Contacts Table */}
      <div className="bg-[#161B22] rounded-2xl border border-[#1E2633] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E2633] bg-[#0D1117]/60 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Contact &amp; Company</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Interest / Category</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2633]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#b99750]" />
                    <span>Loading inquiry records...</span>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#b99750]" />
                    <p className="font-semibold text-gray-300">No contact inquiries found.</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try clearing the search or status filter.'
                        : 'New inquiries submitted via the website will automatically appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                contacts.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#1C2330] transition-colors ${
                      item.status === 'unread' ? 'bg-[#18202C]/60' : ''
                    }`}
                  >
                    {/* Contact & Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{item.name}</div>
                      {item.company ? (
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-[#b99750]" />
                          <span>{item.company}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500">Individual Buyer</span>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-gray-300 hover:text-[#b99750] block truncate max-w-[180px] font-mono text-[11px]"
                        title={item.email}
                      >
                        {item.email}
                      </a>
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gray-400 hover:text-emerald-400 flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{item.phone}</span>
                      </a>
                    </td>

                    {/* Interest / Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#1F2733] border border-[#2D3848] text-gray-200 text-[11px] font-medium">
                        {item.category || 'General Factory'}
                      </span>
                      {item.source_page && (
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[120px]">
                          via {item.source_page}
                        </div>
                      )}
                    </td>

                    {/* Message Snippet */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-gray-300 line-clamp-2 text-xs leading-relaxed">
                        {item.message}
                      </p>
                      {item.notes && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/90 mt-1 font-semibold">
                          <FileText className="w-2.5 h-2.5" /> Note attached
                        </span>
                      )}
                    </td>

                    {/* Received */}
                    <td className="py-3.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="px-2.5 py-1.5 bg-[#1F2733] hover:bg-[#b99750] hover:text-[#0A0D12] text-gray-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={15}
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchContacts(page);
          }}
        />
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1E2633] flex items-center justify-between bg-[#0D1117]">
              <div>
                <span className="text-[10px] font-bold text-[#b99750] uppercase tracking-wider block">
                  Inquiry Details
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedContact.name}</span>
                  {selectedContact.company && (
                    <span className="text-xs text-gray-400 font-normal">
                      ({selectedContact.company})
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#1F2733] hover:bg-[#283344] text-gray-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Current Status:</span>
                  {getStatusBadge(selectedContact.status)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400 mr-1">Mark As:</span>
                  {(['unread', 'read', 'replied', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedContact.id, st)}
                      disabled={selectedContact.status === st}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all ${
                        selectedContact.status === st
                          ? 'bg-[#b99750] text-[#0A0D12] opacity-80'
                          : 'bg-[#1F2733] text-gray-300 hover:text-white hover:bg-[#283344]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(
                      'Regarding your Ace Packaging Inquiry'
                    )}`}
                    className="text-xs text-white hover:text-[#b99750] font-semibold flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#b99750]" />
                    <span>{selectedContact.email}</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Phone / WhatsApp
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-xs text-white hover:text-blue-400 font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedContact.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedContact.name}, thank you for contacting Ace Packaging.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Container Category of Interest
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {selectedContact.category || 'Not specified (General Catalog)'}
                  </span>
                </div>

                <div className="p-3 bg-[#0D1117] rounded-xl border border-[#1E2633]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Submission Time &amp; Source
                  </span>
                  <span className="text-xs font-semibold text-gray-300">
                    {formatDate(selectedContact.created_at)}
                  </span>
                  {selectedContact.source_page && (
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Origin page: {selectedContact.source_page}
                    </span>
                  )}
                </div>
              </div>

              {/* Inquiry Message */}
              <div>
                <span className="text-[11px] font-bold uppercase text-gray-400 block mb-2">
                  Customer Message / Specifications
                </span>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-[#1E2633] text-gray-200 text-xs leading-relaxed whitespace-pre-wrap select-text">
                  {selectedContact.message}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <span className="text-[11px] font-bold uppercase text-[#b99750] block mb-2">
                  Internal Sales Notes &amp; Follow-up Log
                </span>
                <textarea
                  rows={3}
                  placeholder="Add internal notes about client meeting, quotation sent, sample kit dispatched, etc..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#1E2633] rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#b99750] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3.5 py-1.5 bg-[#b99750] hover:bg-[#cfa144] text-[#0A0D12] rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {savingNotes ? 'Saving Notes...' : 'Save Notes'}
                  </button>
                </div>
              </div>

              {/* Technical Tracking Info */}
              <div className="p-3 bg-[#0D1117]/60 rounded-xl border border-[#1E2633] text-[10px] text-gray-400 space-y-1">
                <div>
                  <strong className="text-gray-300">IP Address:</strong>{' '}
                  <span className="font-mono text-gray-400">{selectedContact.ip_address || 'N/A'}</span>
                </div>
                {selectedContact.user_agent && (
                  <div className="truncate">
                    <strong className="text-gray-300">User Agent:</strong> {selectedContact.user_agent}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1E2633] flex items-center justify-between bg-[#0D1117]">
              <button
                onClick={() => setDeleteConfirmId(selectedContact.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 py-1.5 px-3 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-[#1F2733] hover:bg-[#283344] text-white rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#161B22] border border-[#1E2633] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Inquiry?</h3>
              <p className="text-xs text-gray-400 mt-1">
                Are you sure you want to delete this contact submission? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#1F2733] hover:bg-[#283344] text-gray-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
