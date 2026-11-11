'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Eye, EyeOff, ExternalLink, Loader2, Send, Save, Trash2, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { ContentFields, findInvalidLinks } from '@/components/admin/ContentFields';
import { getCmsPageDef, MANAGED_ELSEWHERE, type CmsSectionDef } from '@/lib/cms/registry';
import { isPlainObject, parseContent, withDefaults } from '@/lib/cms/merge';

interface SectionRow {
  id: string;
  section_key: string;
  title: string;
  draft_content: string;
  published_content: string;
  is_enabled: number;
  sort_order: number;
  updated_at: string;
  page_title?: string;
}

interface EditorSection {
  key: string;
  label: string;
  description?: string;
  defaults?: Record<string, unknown>;
  row?: SectionRow;
}

function toObject(raw: unknown): Record<string, unknown> {
  const parsed = parseContent(raw);
  return isPlainObject(parsed) ? parsed : {};
}

function formFor(section: EditorSection): Record<string, unknown> {
  const draft = toObject(section.row?.draft_content);
  return section.defaults ? withDefaults(section.defaults, draft) : draft;
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function PageContentEditor({ pageSlug }: { pageSlug: string }) {
  const { showToast } = useAdmin();
  const pageDef = getCmsPageDef(pageSlug);
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditorSection | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/sections?page=${encodeURIComponent(pageSlug)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRows(json.sections || []);
    } catch {
      showToast('Could not load this page’s sections. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Reload only when the page changes; showToast is recreated on every toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSlug]);

  const { sections, unused } = useMemo(() => {
    const byKey = new Map(rows.map((r) => [r.section_key, r]));
    if (!pageDef) {
      // Built-in page with no editable text (e.g. Events): any stored rows are leftovers.
      return { sections: [] as EditorSection[], unused: rows };
    }
    const defs = Object.entries(pageDef.sections as Record<string, CmsSectionDef>);
    return {
      sections: defs.map<EditorSection>(([key, def]) => ({
        key,
        label: def.label,
        description: def.description,
        defaults: def.content,
        row: byKey.get(key),
      })),
      unused: rows.filter((r) => !(r.section_key in pageDef.sections)),
    };
  }, [rows, pageDef]);

  const pageTitle = rows[0]?.page_title || pageDef?.title || pageSlug;
  const livePath = pageDef?.path ?? (pageSlug === 'home' ? '/' : `/${pageSlug}`);

  const openEditor = (section: EditorSection) => {
    setForm(formFor(section));
    setEditing(section);
  };

  const closeEditor = () => {
    if (editing && JSON.stringify(form) !== JSON.stringify(formFor(editing))) {
      if (!window.confirm('Close without saving? Your changes will be lost.')) return;
    }
    setEditing(null);
  };

  const save = async (publish: boolean) => {
    if (!editing?.row) {
      showToast('This section is still being set up. Refresh the page and try again.', 'error');
      return;
    }
    const invalid = findInvalidLinks(form);
    if (invalid.length) {
      showToast(`Fix the highlighted link${invalid.length > 1 ? 's' : ''} before saving.`, 'error');
      return;
    }
    setSaving(publish ? 'publish' : 'draft');
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.row.id, draft_content: form, publish }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      showToast(publish ? `"${editing.label}" is now live on the website.` : `Draft of "${editing.label}" saved. Use Preview to check it.`);
      await load();
      if (publish) setEditing(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(null);
    }
  };

  const toggleVisibility = async (section: EditorSection) => {
    if (!section.row) return;
    const nextEnabled = section.row.is_enabled ? 0 : 1;
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.row.id, is_enabled: nextEnabled }),
      });
      if (!res.ok) throw new Error();
      showToast(nextEnabled ? `"${section.label}" is visible on the website again.` : `"${section.label}" is now hidden on the website.`);
      load();
    } catch {
      showToast('Could not change visibility.', 'error');
    }
  };

  const deleteUnused = async (row: SectionRow) => {
    if (!window.confirm(`Delete old content "${row.title || row.section_key}"? It is not shown anywhere on the website. This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/sections?id=${encodeURIComponent(row.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Old content deleted.');
      load();
    } catch {
      showToast('Could not delete.', 'error');
    }
  };

  const previewHref = `/api/admin/preview?path=${encodeURIComponent(livePath)}`;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-4 border-b border-[#1E2633]">
        <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#b99750]">
          <ArrowLeft className="w-3.5 h-3.5" /> All website pages
        </Link>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">{pageTitle} Page Content</h1>
            <p className="text-sm text-gray-400 mt-1">
              Sections are listed in the order they appear on the page. Edit a section, preview it, then publish.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={previewHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-200 text-xs font-bold border border-[#222C3D]">
              <Eye className="w-3.5 h-3.5" /> Preview drafts
            </a>
            <a href={livePath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161D27] hover:bg-[#1E2633] text-gray-200 text-xs font-bold border border-[#222C3D]">
              <ExternalLink className="w-3.5 h-3.5" /> View live page
            </a>
          </div>
        </div>
      </div>

      {MANAGED_ELSEWHERE[pageSlug] && (
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-sky-100">{MANAGED_ELSEWHERE[pageSlug].text}</p>
          <Link href={MANAGED_ELSEWHERE[pageSlug].href} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-400 text-[#0A0D12] text-xs font-black">
            {MANAGED_ELSEWHERE[pageSlug].linkText}
          </Link>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-sm font-bold rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading sections…
        </div>
      ) : sections.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          This page has no text of its own to edit.
        </div>
      ) : (
        <ol className="space-y-3">
          {sections.map((section, index) => {
            const row = section.row;
            const hidden = row ? !row.is_enabled : false;
            const hasDraft = row ? row.draft_content !== row.published_content : false;
            return (
              <li key={section.key} className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${hidden ? 'bg-[#0A0D12] border-[#1E2633] opacity-70' : 'bg-[#0D1117] border-[#1E2633]'}`}>
                <span className="w-9 h-9 rounded-xl bg-[#b99750]/15 text-[#b99750] font-black text-sm flex items-center justify-center shrink-0">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-white">{section.label}</h2>
                    {hidden ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-300">Hidden on website</span>
                    ) : hasDraft ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300">Unpublished changes</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300">Live</span>
                    )}
                  </div>
                  {section.description && <p className="text-xs text-gray-400 mt-1">{section.description}</p>}
                  {row?.updated_at && <p className="text-[11px] text-gray-500 mt-1">Last updated {formatDate(row.updated_at)}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => toggleVisibility(section)} disabled={!row} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#222C3D] text-gray-300 hover:text-white text-xs font-bold disabled:opacity-40 cursor-pointer" title={hidden ? 'Show this section on the website' : 'Hide this section from the website'}>
                    {hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {hidden ? 'Show' : 'Hide'}
                  </button>
                  <button type="button" onClick={() => openEditor(section)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {unused.length > 0 && (
        <details className="rounded-2xl border border-[#1E2633] bg-[#0A0D12] p-4">
          <summary className="text-xs font-bold text-gray-400 cursor-pointer">
            Old content not shown on the website ({unused.length})
          </summary>
          <p className="text-xs text-gray-500 mt-2 mb-3">
            Left over from an earlier version of the site. Kept so nothing is lost; safe to delete once you have checked it.
          </p>
          <ul className="space-y-2">
            {unused.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 text-xs text-gray-400 rounded-xl border border-[#1E2633] px-3 py-2">
                <span className="truncate">{row.title || row.section_key}</span>
                <button type="button" onClick={() => deleteUnused(row)} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="section-editor-title">
          <div className="w-full max-w-2xl h-full bg-[#0A0D12] border-l border-[#1E2633] flex flex-col">
            <div className="px-5 py-4 border-b border-[#1E2633] flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#b99750]">{pageTitle} page</p>
                <h2 id="section-editor-title" className="text-lg font-black text-white">{editing.label}</h2>
                {editing.description && <p className="text-xs text-gray-400 mt-0.5">{editing.description}</p>}
              </div>
              <button type="button" onClick={closeEditor} aria-label="Close editor" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#161D27] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {Object.keys(form).length === 0 ? (
                <p className="text-sm text-gray-400">This section has no editable fields.</p>
              ) : (
                <ContentFields value={form} onChange={setForm} template={editing.defaults} />
              )}
            </div>

            <div className="px-5 py-4 border-t border-[#1E2633] flex flex-wrap items-center justify-between gap-3 bg-[#0D1117]">
              <p className="text-[11px] text-gray-500 max-w-[14rem]">Empty fields show the original website content.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => save(false)} disabled={saving !== null} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#222C3D] text-gray-200 hover:bg-[#161D27] text-xs font-bold disabled:opacity-50 cursor-pointer">
                  {saving === 'draft' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save draft
                </button>
                <a href={previewHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#222C3D] text-gray-200 hover:bg-[#161D27] text-xs font-bold">
                  <Eye className="w-3.5 h-3.5" /> Preview saved draft
                </a>
                <button type="button" onClick={() => save(true)} disabled={saving !== null} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black disabled:opacity-50 cursor-pointer">
                  {saving === 'publish' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Publish to website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
