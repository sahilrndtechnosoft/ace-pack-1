'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  ShieldAlert,
  Palette,
  Phone,
  Mail,
  MapPin,
  Share2,
  BarChart,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

export default function AdminSettingsPage() {
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings || {});
      }
    } catch {
      showToast('Failed to load global settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to update settings.', 'error');
        setSaving(false);
        return;
      }

      showToast('Global settings updated and live in MySQL!');
    } catch {
      showToast('Network error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateKey = (key: string, val: any) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
        Loading global settings from MySQL...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Global Website Settings</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Configure site-wide branding, corporate contact information, social handles, and maintenance mode.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Maintenance Mode Alert Banner */}
      {settings.maintenance_mode && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            Maintenance mode is currently <strong>ACTIVE</strong>. Public visitors see a maintenance notice.
          </span>
        </div>
      )}

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding & Visual Identity */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <Palette className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Branding &amp; Colors
            </h2>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Website Name</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => updateKey('site_name', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Corporate Tagline</label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => updateKey('site_tagline', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Primary Brand Gold</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primary_color || '#b99750'}
                    onChange={(e) => updateKey('primary_color', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={settings.primary_color || '#b99750'}
                    onChange={(e) => updateKey('primary_color', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Secondary Charcoal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color || '#1A1D20'}
                    onChange={(e) => updateKey('secondary_color', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color || '#1A1D20'}
                    onChange={(e) => updateKey('secondary_color', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#b99750]"
                  />
                </div>
              </div>
            </div>

            <MediaInput
              label="Website Logo"
              value={settings.logo_url || ''}
              onChange={(url) => updateKey('logo_url', url)}
              placeholder="/images/Ace_New_Update_Logo-01.png"
              category="branding"
              helpText="Primary brand logo used across the website."
            />

            <MediaInput
              label="Favicon"
              value={settings.favicon_url || ''}
              onChange={(url) => updateKey('favicon_url', url)}
              placeholder="/favicon.ico"
              category="branding"
              helpText="Browser tab icon (.ico, .png, or .svg)."
            />

            <div className="pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141A24] border border-[#222C3D] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(settings.maintenance_mode)}
                  onChange={(e) => updateKey('maintenance_mode', e.target.checked)}
                  className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] bg-[#0D1117]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Enable Maintenance Mode</span>
                  <span className="text-[10px] text-gray-400 block">
                    Temporarily redirects regular site visitors to a maintenance screen
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Contact & Plant Locations */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <MapPin className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Contact &amp; Factory Address
            </h2>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Domestic Sales Email</label>
                <input
                  type="text"
                  value={settings.contact_email_domestic || ''}
                  onChange={(e) => updateKey('contact_email_domestic', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Export Sales Email</label>
                <input
                  type="text"
                  value={settings.contact_email_export || ''}
                  onChange={(e) => updateKey('contact_email_export', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Domestic Phone</label>
                <input
                  type="text"
                  value={settings.contact_phone_domestic || ''}
                  onChange={(e) => updateKey('contact_phone_domestic', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Export Phone</label>
                <input
                  type="text"
                  value={settings.contact_phone_export || ''}
                  onChange={(e) => updateKey('contact_phone_export', e.target.value)}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">WhatsApp Direct Number (no +)</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => updateKey('whatsapp_number', e.target.value)}
                placeholder="919925015906"
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Unit 1 Manufacturing Address</label>
              <input
                type="text"
                value={settings.factory_address || ''}
                onChange={(e) => updateKey('factory_address', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Unit 2 Manufacturing Address</label>
              <input
                type="text"
                value={settings.unit_2_address || ''}
                onChange={(e) => updateKey('unit_2_address', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Analytics */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <Share2 className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Social Links &amp; Analytics
            </h2>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={settings.social_linkedin || ''}
                onChange={(e) => updateKey('social_linkedin', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.social_instagram || ''}
                onChange={(e) => updateKey('social_instagram', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.social_facebook || ''}
                onChange={(e) => updateKey('social_facebook', e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Google Analytics Measurement ID</label>
              <input
                type="text"
                value={settings.google_analytics_id || ''}
                onChange={(e) => updateKey('google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>
          </div>
        </div>

        {/* Master Catalogues & PDF Documents */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <FileDown className="w-4 h-4 text-red-400" />
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Master Product Catalogues &amp; Compliance PDFs
              </h2>
              <p className="text-[11px] text-gray-400">
                Uploaded PDFs here automatically become available across all &ldquo;Download Catalogue&rdquo; modals and quality sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            <MediaInput
              label="Master Product Catalogue (PDF)"
              value={settings.default_catalog_pdf || '/downloads/Ace_Packaging_Full_Product_Catalog.pdf'}
              onChange={(url) => updateKey('default_catalog_pdf', url)}
              fileType="pdf"
              placeholder="/downloads/... or upload PDF"
              category="downloads"
              accept="application/pdf,.pdf"
              helpText="Primary commercial product catalogue."
            />

            <MediaInput
              label="Technical Product Datasheet (PDF)"
              value={settings.default_datasheet_pdf || '/downloads/datasheets/Ace_Packaging_Technical_Datasheet.pdf'}
              onChange={(url) => updateKey('default_datasheet_pdf', url)}
              fileType="pdf"
              placeholder="/downloads/... or upload PDF"
              category="downloads"
              accept="application/pdf,.pdf"
              helpText="Technical polymer specifications and tolerances."
            />

            <MediaInput
              label="ISO 9001:2015 Certificate (PDF / Image)"
              value={settings.default_iso_certificate || '/downloads/certificates/Ace_Packaging_ISO_9001_2015_Certificate.jpg'}
              onChange={(url) => updateKey('default_iso_certificate', url)}
              fileType="pdf"
              placeholder="/downloads/... or upload PDF/JPG"
              category="downloads"
              accept="application/pdf,.pdf,image/*"
              helpText="Official SGS UKAS certificate file."
            />
          </div>
        </div>
      </div>
    </form>
  );
}
