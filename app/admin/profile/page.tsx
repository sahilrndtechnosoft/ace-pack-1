'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield, Save, CheckCircle2, KeyRound } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';

export default function AdminProfilePage() {
  const { admin, refreshAdmin, showToast } = useAdmin();

  const [name, setName] = useState(admin?.name || 'Ace Administrator');
  const [email, setEmail] = useState(admin?.email || 'admin@acepack.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      if (admin.name) setName(admin.name);
      if (admin.email) setEmail(admin.email);
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update profile.');
        setSaving(false);
        return;
      }

      showToast('Profile credentials updated successfully in MySQL!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refreshAdmin();
    } catch {
      setError('Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E2633]">
        <h1 className="text-2xl font-black text-white">Administrator Profile</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage administrator account information, email address, and secure password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Details */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <User className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Basic Account Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white focus:outline-none focus:border-[#b99750]"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-3xl bg-[#0D1117] border border-[#1E2633] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1E2633]">
            <KeyRound className="w-4 h-4 text-[#b99750]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Change Password
            </h2>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Current Password (required only if setting new password)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  New Password (8+ characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with bcrypt 10 rounds</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Update Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
