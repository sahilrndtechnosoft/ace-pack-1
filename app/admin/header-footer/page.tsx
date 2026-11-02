'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Save, Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';
import { MediaInput } from '@/components/admin/MediaInput';

interface NavLink {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
  hasDropdown?: boolean;
}

interface HeaderSettings {
  logo: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  topbarPhone: string;
  navLinks: NavLink[];
}

interface FooterSettings {
  logo: string;
  description: string;
  copyrightText: string;
  domesticEmail: string;
  exportEmail: string;
  phoneNumbers: string;
  address: string;
}

export default function AdminHeaderFooterPage() {
  const { showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [header, setHeader] = useState<HeaderSettings>({
    logo: '/images/Ace_New_Update_Logo-01.png',
    ctaButtonText: 'Contact Us',
    ctaButtonLink: '/contact',
    topbarPhone: '+91 99250 15906',
    navLinks: [],
  });

  const [footer, setFooter] = useState<FooterSettings>({
    logo: '/images/Ace_New_Update_Logo-01.png',
    description: '',
    copyrightText: '',
    domesticEmail: '',
    exportEmail: '',
    phoneNumbers: '',
    address: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/header-footer');
      if (res.ok) {
        const json = await res.json();
        if (json.headerSettings) setHeader(json.headerSettings);
        if (json.footerSettings) setFooter(json.footerSettings);
      }
    } catch {
      showToast('Failed to load header and footer settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/header-footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headerSettings: header,
          footerSettings: footer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to save settings.', 'error');
        setSaving(false);
        return;
      }

      showToast('Header & Footer settings saved and live in MySQL!');
    } catch {
      showToast('Network error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNavLink = () => {
    setHeader({
      ...header,
      navLinks: [...header.navLinks, { label: 'New Link', href: '/custom' }],
    });
  };

  const handleUpdateNavLink = (idx: number, field: string, val: string) => {
    const updated = [...header.navLinks];
    updated[idx] = { ...updated[idx], [field]: val };
    setHeader({ ...header, navLinks: updated });
  };

  const handleRemoveNavLink = (idx: number) => {
    setHeader({
      ...header,
      navLinks: header.navLinks.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#b99750] text-xs font-bold animate-pulse">
        Loading header and footer settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2633]">
        <div>
          <h1 className="text-2xl font-black text-white">Header &amp; Footer Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Dynamically manage brand logo, primary navigation menus, call-to-action buttons, and footer copyright text.
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E2633] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'header'
              ? 'bg-[#b99750] text-[#0A0D12] shadow-sm'
              : 'bg-[#141A24] text-gray-400 hover:text-white border border-[#222C3D]'
          }`}
        >
          Header Configuration
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-[#b99750] text-[#0A0D12] shadow-sm'
              : 'bg-[#141A24] text-gray-400 hover:text-white border border-[#222C3D]'
          }`}
        >
          Footer Configuration
        </button>
      </div>

      {/* Tab: Header */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-[#1E2633] pb-2">
              Branding &amp; Contact Bar
            </h2>

            <div className="space-y-4">
              <MediaInput
                label="Header Brand Logo"
                value={header.logo || ''}
                onChange={(url) => setHeader({ ...header, logo: url })}
                placeholder="/images/Ace_New_Update_Logo-01.png"
                category="branding"
                helpText="SVG or PNG logo displayed in the top navbar."
              />

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Topbar Phone Display</label>
                <input
                  type="text"
                  value={header.topbarPhone || ''}
                  onChange={(e) => setHeader({ ...header, topbarPhone: e.target.value })}
                  placeholder="+91 99250 15906"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={header.ctaButtonText || ''}
                  onChange={(e) => setHeader({ ...header, ctaButtonText: e.target.value })}
                  placeholder="Contact Us"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">CTA Button Destination</label>
                <input
                  type="text"
                  value={header.ctaButtonLink || ''}
                  onChange={(e) => setHeader({ ...header, ctaButtonLink: e.target.value })}
                  placeholder="/contact"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>
          </div>

          {/* Navigation Links Manager */}
          <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2633] pb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Desktop &amp; Mobile Navigation Links ({header.navLinks.length})
              </h2>
              <button
                type="button"
                onClick={handleAddNavLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141A24] hover:bg-[#b99750] text-gray-300 hover:text-[#0A0D12] text-xs font-bold border border-[#222C3D] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {header.navLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#141A24] border border-[#222C3D] flex flex-col sm:flex-row items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0D1117] text-gray-400 font-mono text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateNavLink(idx, 'label', e.target.value)}
                      placeholder="Link Label"
                      className="px-3 py-1.5 bg-[#0D1117] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => handleUpdateNavLink(idx, 'href', e.target.value)}
                      placeholder="/destination"
                      className="px-3 py-1.5 bg-[#0D1117] border border-[#222C3D] rounded-xl text-xs font-mono text-gray-300 focus:outline-none focus:border-[#b99750]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveNavLink(idx)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Footer */}
      {activeTab === 'footer' && (
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-white border-b border-[#1E2633] pb-2">
            Footer Content &amp; Contact Details
          </h2>

          <div className="space-y-4">
            <MediaInput
              label="Footer Brand Logo"
              value={footer.logo || ''}
              onChange={(url) => setFooter({ ...footer, logo: url })}
              placeholder="/images/Ace_New_Update_Logo-01.png"
              category="branding"
              helpText="Logo displayed in the footer column."
            />

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Company Description</label>
              <textarea
                rows={3}
                value={footer.description || ''}
                onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Domestic Inquiry Email</label>
                <input
                  type="text"
                  value={footer.domesticEmail || ''}
                  onChange={(e) => setFooter({ ...footer, domesticEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Export Sales Email</label>
                <input
                  type="text"
                  value={footer.exportEmail || ''}
                  onChange={(e) => setFooter({ ...footer, exportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Phone Numbers Display</label>
                <input
                  type="text"
                  value={footer.phoneNumbers || ''}
                  onChange={(e) => setFooter({ ...footer, phoneNumbers: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Factory Address</label>
                <input
                  type="text"
                  value={footer.address || ''}
                  onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Copyright Notice</label>
              <input
                type="text"
                value={footer.copyrightText || ''}
                onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
