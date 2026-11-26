'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { AdminPagination } from '@/components/admin/AdminPagination';

type Status = 'pending' | 'approved' | 'rejected' | 'all';

interface DocumentRequest {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  industry: string | null;
  document_title: string;
  status: Exclude<Status, 'all'>;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;
const TABS: { id: Status; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
];
const STATUS_STYLE: Record<DocumentRequest['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

export default function DownloadRequestsPage() {
  const { showToast } = useAdmin();
  const [status, setStatus] = useState<Status>('pending');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DocumentRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/download-requests?status=${status}&page=${page}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.items);
      setTotal(data.pagination.total);
      setPendingCount(data.pendingCount);
    } catch {
      showToast('Could not load download requests. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
    // showToast is recreated on every layout render; depending on it would refetch in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (item: DocumentRequest, action: 'approve' | 'reject') => {
    if (action === 'reject' && !window.confirm(`Reject the request from ${item.name}? No email is sent.`)) return;
    setBusyId(item.id);
    try {
      const res = await fetch('/api/admin/download-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed.');
      showToast(data.message);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-[#1E2633]">
        <h1 className="text-2xl font-black text-white">Download Requests</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visitors who asked for the catalogue or other documents. Approving emails them a private download link (valid 7 days); rejecting sends nothing.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={status === tab.id}
            onClick={() => {
              setStatus(tab.id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-colors ${
              status === tab.id ? 'bg-[#b99750] text-[#0A0D12] border-[#b99750]' : 'bg-[#0D1117] text-gray-300 border-[#1E2633] hover:border-[#b99750]/50'
            }`}
          >
            {tab.label}
            {tab.id === 'pending' && pendingCount > 0 && <span className="ml-1.5 rounded-full bg-[#0A0D12]/80 px-1.5 text-[10px] text-[#b99750]">{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#1E2633] bg-[#0D1117] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-sm font-bold">
            <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading requests…
          </div>
        ) : items.length === 0 ? (
          <p className="p-12 text-center text-sm text-gray-400">No {status === 'all' ? '' : status} requests.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] uppercase tracking-wider text-gray-500 border-b border-[#1E2633]">
              <tr>
                <th className="px-4 py-3 font-bold">Requested by</th>
                <th className="px-4 py-3 font-bold">Document</th>
                <th className="px-4 py-3 font-bold">Received</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2633]">
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.company || '—'}{item.industry ? ` · ${item.industry}` : ''}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      <a href={`mailto:${item.email}`} className="hover:text-[#b99750]">{item.email}</a> · {item.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-200 max-w-xs">{item.document_title}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${STATUS_STYLE[item.status]}`}>{item.status}</span>
                    {item.decided_by && (
                      <p className="text-[11px] text-gray-500 mt-1">by {item.decided_by}<br />{formatDate(item.decided_at)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => decide(item, 'approve')}
                          disabled={busyId === item.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                          {busyId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve & email
                        </button>
                        <button
                          type="button"
                          onClick={() => decide(item, 'reject')}
                          disabled={busyId === item.id}
                          aria-label={`Reject request from ${item.name}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1E2633] hover:border-red-500/50 text-gray-300 hover:text-red-300 text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <p className="text-right text-xs text-gray-500">—</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > PAGE_SIZE && <AdminPagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />}
    </div>
  );
}
