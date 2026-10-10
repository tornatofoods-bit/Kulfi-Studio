import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Briefcase,
  LogOut,
  FolderPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { sound } from '../lib/audio';

export const ClientAccount: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Set noindex meta tag on account page
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

  const handleLogout = async () => {
    sound.playPop();
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#140D09] text-[var(--text-primary)] transition-colors">
      {/* Top Header */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              onClick={() => sound.playPop()}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] flex items-center justify-center shadow-xs">
                <div className="w-2.5 h-4 bg-white/90 rounded-t-full rounded-b-xs" />
              </div>
              <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                Kulfi Studio
              </span>
            </Link>
            <span className="text-xs font-mono uppercase text-[#F4A300] hidden sm:inline">
              / Client Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#F4A300]/10 text-[#F4A300] hover:bg-[#F4A300]/20 transition-colors"
              >
                Switch to Admin &rarr;
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F4A300] to-[#FFB347] flex items-center justify-center text-white font-display text-2xl font-bold shadow-md shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  Welcome back, {user?.name || 'Client'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#84C57E]/10 text-[#43793D] dark:text-[#84C57E] border border-[#84C57E]/20">
                  {user?.role === 'client' ? 'Client' : user?.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  {user?.email}
                </span>
                {user?.company && (
                  <span className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    {user?.company}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/#contact"
            onClick={() => sound.playChime()}
            className="px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#F4A300] hover:bg-[#e09400] transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Order a New Project</span>
          </Link>
        </div>

        {/* Phase 2 Preview Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Active Requests</div>
            <div className="font-display text-3xl font-bold text-[var(--text-primary)]">0</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Pending studio confection</div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">In Progress</div>
            <div className="font-display text-3xl font-bold text-[#F4A300]">0</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Under artisanal development</div>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase mb-2">Completed Flavours</div>
            <div className="font-display text-3xl font-bold text-[#84C57E]">0</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Delivered & deployed</div>
          </div>
        </div>

        {/* Project requests listing container */}
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                My Project Requests
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Track status updates and direct notes from our confectioners.
              </p>
            </div>
          </div>

          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
              No project requests yet
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
              Ready to create something delicious? Submit your first brief and we'll prepare a custom timeline.
            </p>
            <div className="pt-2">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#F4A300] hover:bg-[#F4A300]/10 transition-colors"
              >
                <span>Submit a Project Brief &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
