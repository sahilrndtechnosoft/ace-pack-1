'use client';

import React, { useEffect, useState } from 'react';
import { Edit, Loader2, Save, X } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { ContentFields, findInvalidLinks } from '@/components/admin/ContentFields';
import { isPlainObject, withDefaults } from '@/lib/cms/merge';
import { contactDefaults, footerDefaults, headerDefaults, siteTextDefaults } from '@/lib/cms/site-settings';

type Settings = Record<string, unknown>;

// Social links start empty; this gives "Add social link" the right fields.
const FOOTER_TEMPLATE = { ...footerDefaults, socialLinks: [{ label: 'LinkedIn', link: 'https://' }] };

// Each card edits shared content that appears on every page (or on several pages).
const GROUPS = [
  {
    id: 'header',
    label: 'Header',
    description: 'Logo, phone number, button and menu: top-level menu names and the Resources dropdown (names, links, order). The Products dropdown lists your product categories automatically.',
    storageKey: 'header_settings',
    defaults: headerDefaults,
  },
  {
    id: 'footer',
    label: 'Footer',
    description: 'Logo, company description, addresses, contact lines, quick links, social links and copyright at the bottom of every page.',
    storageKey: 'footer_settings',
    defaults: footerDefaults,
  },
  {
    id: 'site-text',
    label: 'Forms, Pop-ups & Page Labels',
    description: 'Wording of the inquiry form, download pop-up, product page labels and sample form, small labels on category, blog, event, downloads and industries pages, home side-menu names, and the "page not found" screen.',
    storageKey: 'site_text',
    defaults: siteTextDefaults,
  },
  {
    id: 'contact',
    label: 'Contact Details',
    description: 'Phone, email and WhatsApp number shown on the Contact page.',
    storageKey: null, // stored as separate settings
    defaults: contactDefaults,
  },
] as const;

type Group = (typeof GROUPS)[number];

function valuesFor(group: Group, settings: Settings): Record<string, unknown> {
  const stored = group.storageKey ? settings[group.storageKey] : settings;
  return withDefaults(group.defaults as Record<string, unknown>, isPlainObject(stored) ? stored : {});
}

export default function SiteSettingsPage() {
  const { showToast } = useAdmin();
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSettings(json.settings || {});
    } catch {
      showToast('Could not load settings. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (group: Group) => {
    setForm(valuesFor(group, settings));
    setEditing(group);
  };

  const save = async () => {
    if (!editing) return;
    if (findInvalidLinks(form).length) {
      showToast('Fix the highlighted links before saving.', 'error');
      return;
    }
    setSaving(true);
    try {
      // Keep any stored keys this form doesn't show, so nothing is silently dropped.
      const previous = editing.storageKey ? settings[editing.storageKey] : null;
      const payload = editing.storageKey
        ? { [editing.storageKey]: { ...(isPlainObject(previous) ? previous : {}), ...form } }
        : form;
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      showToast(`${editing.label} updated on the website.`);
      setEditing(null);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="pb-4 border-b border-[#1E2633]">
        <h1 className="text-2xl font-black text-white">Site-wide Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Content shared across the whole website. Changes appear on every page straight away.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#b99750] text-sm font-bold rounded-2xl bg-[#0D1117] border border-[#1E2633]">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading settings…
        </div>
      ) : (
        <ul className="grid gap-3">
          {GROUPS.map((group) => (
            <li key={group.id} className="rounded-2xl border border-[#1E2633] bg-[#0D1117] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="font-bold text-white">{group.label}</h2>
                <p className="text-xs text-gray-400 mt-1">{group.description}</p>
              </div>
              <button type="button" onClick={() => open(group)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black cursor-pointer self-start sm:self-auto">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="settings-editor-title">
          <div className="w-full max-w-2xl h-full bg-[#0A0D12] border-l border-[#1E2633] flex flex-col">
            <div className="px-5 py-4 border-b border-[#1E2633] flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#b99750]">Site-wide Settings</p>
                <h2 id="settings-editor-title" className="text-lg font-black text-white">{editing.label}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editing.description}</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#161D27] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ContentFields value={form} onChange={setForm} template={(editing.id === 'footer' ? FOOTER_TEMPLATE : editing.defaults) as Record<string, unknown>} />
            </div>
            <div className="px-5 py-4 border-t border-[#1E2633] flex items-center justify-between gap-3 bg-[#0D1117]">
              <p className="text-[11px] text-gray-500">Empty fields show the original website content.</p>
              <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-black disabled:opacity-50 cursor-pointer">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save to website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
