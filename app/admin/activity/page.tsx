'use client';

import React, { useEffect, useState } from 'react';
import { History, Search, RefreshCw, Shield, User, Filter, ArrowRight, Eye, Copy, Check, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { AdminPagination } from '@/components/admin/AdminPagination';

interface LogItem {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}

export default function AdminActivityPage() {
  const { showToast } = useAdmin();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/activity', window.location.origin);
      if (filterAction !== 'all') url.searchParams.set('action', filterAction);
      url.searchParams.set('limit', '200');

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch {
      showToast('Failed to load audit logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    setCurrentPage(1);
  }, [filterAction]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.admin_email.toLowerCase().includes(search.toLowerCase()) ||
      (l.entity_id && l.entity_id.toLowerCase().includes(search.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation
  const totalItems = filteredLogs.length;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopyDetails = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Payload copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Administrator Activity Trail</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Tamper-evident audit logs tracking all logins, content edits, publications, and settings updates in MySQL.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#b99750]' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#1E2633] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['all', 'LOGIN', 'UPDATE_SECTION_DRAFT', 'PUBLISH_SECTION', 'CREATE_BLOG', 'UPDATE_HEADER_FOOTER', 'UPLOAD_MEDIA'].map(
            (act) => (
              <button
                key={act}
                type="button"
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterAction === act
                    ? 'bg-[#b99750] text-[#0A0D12]'
                    : 'bg-[#141A24] text-gray-400 hover:text-white border border-[#222C3D]'
                }`}
              >
                {act === 'all' ? 'All Actions' : act.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-[#1E2633] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
            Querying MySQL audit history...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">No audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2633] bg-[#0A0D12] text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity &amp; Target</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2230]">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141A24]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-[#b99750] block">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium block">
                        {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gray-300 font-mono text-[11px] block">{log.admin_email}</span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {log.details ? (
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] text-[11px] font-bold border border-[#222C3D] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      ) : (
                        <span className="text-gray-600 text-[11px]">—</span>
                      )}
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
          pageSizeOptions={[10, 15, 25, 50]}
        />
      </div>

      {/* Details Popup Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#b99750]/20 text-[#b99750] flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Audit Record: {selectedLog.action}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">{formatDate(selectedLog.created_at)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#141A24] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Administrator</span>
                <span className="text-white font-mono font-semibold block mt-1 truncate">{selectedLog.admin_email}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#141A24] border border-[#222C3D]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Target Entity</span>
                <span className="text-[#b99750] font-mono font-semibold block mt-1 truncate">
                  {selectedLog.entity_type} {selectedLog.entity_id ? `(${selectedLog.entity_id})` : ''}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Metadata Audit Payload:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const formatted = (() => {
                      try {
                        return JSON.stringify(JSON.parse(selectedLog.details || '{}'), null, 2);
                      } catch {
                        return selectedLog.details || '';
                      }
                    })();
                    handleCopyDetails(formatted);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#b99750] hover:underline font-bold cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#090C10] border border-[#1E2633] rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64 leading-relaxed">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(selectedLog.details || '{}'), null, 2);
                  } catch {
                    return selectedLog.details;
                  }
                })()}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#1E2633]">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#141A24] hover:bg-[#1E2633] text-gray-300 text-xs font-bold border border-[#222C3D] transition-colors cursor-pointer"
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
