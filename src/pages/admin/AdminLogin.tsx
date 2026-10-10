import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const { user, isAdmin, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, navigate to /admin
  useEffect(() => {
    if (user && isAdmin) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  // Set noindex meta tag on admin pages
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (failedAttempts >= 5) {
      setErrorMsg('Too many failed attempts. Console locked for 5 minutes.');
      return;
    }

    setLoading(true);
    sound.playPop();

    const res = await login(username, password, rememberMe);

    if (res.success) {
      sound.playChime();
      setFailedAttempts(0);
      navigate('/admin', { replace: true });
    } else {
      setFailedAttempts((prev) => prev + 1);
      setErrorMsg(res.error || 'Invalid credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 bg-[#FFFDF8] dark:bg-[#140D09] text-[var(--text-primary)]">
      {/* Return to Public Website */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[#F4A300] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to public website</span>
      </a>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] shadow-md mb-4">
            <div className="w-3.5 h-6 bg-white/95 rounded-t-full rounded-b-xs" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Kulfi Studio
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#F4A300] mt-1">
            Flat-File Confectionery Console
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  placeholder="admin or shaikhrehan921@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Admin Passcode
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick credentials chip */}
            <div className="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-3 w-3 text-[#F4A300]" />
                <span>Default: <strong>admin</strong> / <strong>kulfi2026!</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('kulfi2026!');
                }}
                className="text-[#F4A300] hover:underline"
              >
                Auto-fill
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#F4A300] rounded-xs"
              />
              <label htmlFor="remember" className="text-xs text-[var(--text-secondary)]">
                Keep session active on this device
              </label>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-md disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Authenticating...' : 'Enter Admin Console'}</span>
            </button>
          </form>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-[11px] font-mono text-[var(--text-muted)]">
          100% Free Flat-File Architecture · Zero Database Required · 30m Inactivity Guard
        </div>
      </div>
    </div>
  );
};
