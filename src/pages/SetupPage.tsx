import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../lib/audio';

export const SetupPage: React.FC = () => {
  const { setupCompleted, checkSetupStatus } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Add noindex meta tag
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    const check = async () => {
      try {
        const res = await fetch('/api/setup.php');
        if (res.ok) {
          const data = await res.json();
          if (data.setupCompleted) {
            setIsLocked(true);
          }
        }
      } catch {}
      setChecking(false);
    };

    check();

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Admin password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    sound.playPop();

    try {
      const res = await fetch('/api/setup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || 'Master Confectioner',
          password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sound.playChime();
        await checkSetupStatus();
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg(data.error || 'Setup failed.');
      }
    } catch {
      setErrorMsg('Connection error during setup execution.');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] dark:bg-[#140D09]">
        <div className="text-xs font-mono text-[var(--text-secondary)]">Checking setup security state...</div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFFDF8] dark:bg-[#140D09] text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#84C57E]/10 border border-[#84C57E]/30 flex items-center justify-center text-[#84C57E] mb-6">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Initial Setup is Permanently Locked
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
          The master administrator credentials have already been configured. This setup endpoint is deactivated for security.
        </p>
        <Link
          to="/login"
          onClick={() => sound.playPop()}
          className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors inline-flex items-center gap-2"
        >
          <span>Go to Login Portal</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 bg-[#FFFDF8] dark:bg-[#140D09] text-[var(--text-primary)]">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] hover:text-[#F4A300] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Studio</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] shadow-md mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            One-Time Admin Setup
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-sm mx-auto">
            Configure your master administrator password. Once submitted, this wizard will permanently lock.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl relative backdrop-blur-xs">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Owner / Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kulfistudio.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Administrator Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Master Confectioner"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                New Master Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Confirm Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#F4A300] hover:bg-[#e09400] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <span>Locking & Initializing...</span>
              ) : (
                <>
                  <span>Save Password & Lock Setup</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
