'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminLayoutClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshAdmin, showToast } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please check credentials.');
        setLoading(false);
        return;
      }

      showToast(`Welcome back, ${data.admin.name}!`);
      await refreshAdmin();
      router.replace('/admin');
    } catch {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@acepack.com');
    setPassword('AcePackaging2026!');
    setError('');
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: forgotEmail }),
      });

      const data = await res.json();
      if (data.demoResetToken) {
        setResetToken(data.demoResetToken);
      }
      setForgotMessage(data.message || 'Reset token generated.');
      setResetStep('reset');
    } catch {
      setForgotMessage('Failed to request reset token.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', token: resetToken, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Password updated! Please log in.');
        setForgotOpen(false);
        setPassword(newPassword);
        setEmail(forgotEmail || email);
      } else {
        setForgotMessage(data.error || 'Failed to reset password.');
      }
    } catch {
      setForgotMessage('Network error occurred.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b99750]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        {/* Brand Logo & Badge */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#0D1117] border border-[#1E2633] shadow-xl mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b99750] to-[#8d6f2e] text-[#0A0D12] font-black text-xl flex items-center justify-center shadow-md">
            AP
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ace Packaging CMS
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          Administrator Authentication & Content Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-[#0D1117] py-8 px-6 sm:px-10 border border-[#1E2633] rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@acepack.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotOpen(true);
                  }}
                  className="text-xs text-[#b99750] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#141A24] border border-[#222C3D] focus:border-[#b99750] rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#222C3D] text-[#b99750] focus:ring-[#b99750] bg-[#141A24]"
                />
                <span className="text-xs text-gray-400 font-medium">Remember me for 30 days</span>
              </label>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MySQL Secured</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#b99750] hover:bg-[#a68641] text-[#0A0D12] text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0D12] border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="pt-4 border-t border-[#1E2633]">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full p-2.5 rounded-xl bg-[#141A24] hover:bg-[#1A2230] border border-[#222C3D] hover:border-[#b99750]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b99750]" />
                <div>
                  <span className="text-[11px] font-extrabold text-white block">
                    Fill Default Credentials
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono block">
                    admin@acepack.com · AcePackaging2026!
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#b99750] group-hover:underline">
                Use ➔
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#1E2633] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2633]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#b99750]" />
                <h3 className="font-extrabold text-white text-base">
                  {resetStep === 'request' ? 'Reset Password' : 'Enter New Password'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {forgotMessage && (
              <div className="p-3 rounded-xl bg-[#161D27] border border-[#b99750]/40 text-xs text-gray-200">
                {forgotMessage}
              </div>
            )}

            {resetStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <p className="text-xs text-gray-400">
                  Enter your administrator email to generate a secure password reset token.
                </p>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@acepack.com"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-[#b99750] text-[#0A0D12] text-xs font-bold uppercase tracking-wider hover:bg-[#a68641] transition-all cursor-pointer"
                >
                  {forgotLoading ? 'Generating...' : 'Generate Reset Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Reset Token</label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter reset token"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">New Password (8+ characters)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New strong password"
                    className="w-full px-3 py-2 bg-[#141A24] border border-[#222C3D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b99750]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-[#b99750] text-[#0A0D12] text-xs font-bold uppercase tracking-wider hover:bg-[#a68641] transition-all cursor-pointer"
                >
                  {forgotLoading ? 'Updating...' : 'Set New Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
