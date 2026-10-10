import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Layers,
  Briefcase,
  GitCommit,
  FolderGit2,
  Cpu,
  SlidersHorizontal,
  DollarSign,
  Receipt,
  BookOpen,
  Inbox,
  Users,
  Activity,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  FileCode,
} from 'lucide-react';
import {
  downloadContentJson,
  importContentJson,
  resetAllToDefaults,
} from '../../lib/contentStore';
import { sound } from '../../lib/audio';

export const AdminLayout: React.FC = () => {
  const { user, role, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Global & SEO', path: '/admin/global', icon: Settings },
    { label: 'Hero & 3D Scene', path: '/admin/hero', icon: Sparkles },
    { label: 'About & Pillars', path: '/admin/about', icon: Layers },
    { label: 'Services (Flavours)', path: '/admin/services', icon: Briefcase },
    { label: 'Culinary Process', path: '/admin/process', icon: GitCommit },
    { label: 'Case Studies', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Tech Sprinkles', path: '/admin/technologies', icon: Cpu },
    { label: 'Comparison Slider', path: '/admin/comparison', icon: SlidersHorizontal },
    { label: 'Pricing Scoops', path: '/admin/pricing', icon: DollarSign },
    { label: 'Testimonial Receipts', path: '/admin/testimonials', icon: Receipt },
    { label: 'Blog & Recipes', path: '/admin/blog', icon: BookOpen },
    { label: 'Client Leads Inbox', path: '/admin/leads', icon: Inbox },
    { label: 'Activity Log', path: '/admin/activity', icon: Activity },
    ...(role === 'super_admin' ? [{ label: 'Admin Users', path: '/admin/users', icon: Users }] : []),
  ];

  const handleDownloadJson = () => {
    sound.playChime();
    downloadContentJson();
    setAlertMsg('Downloaded updated content.json file!');
    setTimeout(() => setAlertMsg(''), 4000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    sound.playPop();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const success = await importContentJson(text, user.email);
      if (success) {
        sound.playChime();
        setAlertMsg('Successfully imported content.json!');
        setTimeout(() => setAlertMsg(''), 4000);
      } else {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = async () => {
    if (!user?.email) return;
    if (window.confirm('Reset all website sections to factory defaults? Any unsaved edits will be replaced.')) {
      sound.playPop();
      await resetAllToDefaults(user.email);
      sound.playChime();
      setAlertMsg('Reset all sections to factory default values!');
      setTimeout(() => setAlertMsg(''), 4000);
    }
  };

  const handleLogout = () => {
    sound.playPop();
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Hidden file input for importing content.json */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] flex items-center justify-center shadow-xs">
              <div className="w-2.5 h-4 bg-white/95 rounded-t-full rounded-b-xs" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight block">
                Kulfi Studio
              </span>
              <span className="font-mono text-[10px] text-[#F4A300] uppercase tracking-wider block">
                Flat-File Console
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  sound.playPop(460);
                  setSidebarOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Export/Import content.json & User Badge */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-2">
          {/* Download content.json */}
          <button
            onClick={handleDownloadJson}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#F4A300]" />
            <span>Download content.json</span>
          </button>

          {/* Import content.json */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] text-[11px] font-mono transition-colors"
            >
              <Upload className="h-3 w-3" />
              <span>Import</span>
            </button>

            <button
              onClick={handleResetDefaults}
              type="button"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] text-[11px] font-mono transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] mt-2">
            <div className="overflow-hidden pr-2">
              <div className="text-xs font-bold truncate text-[var(--text-primary)]">
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <div className="text-[10px] font-mono text-[#F4A300] uppercase truncate">
                Role: {role || 'admin'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-[var(--text-muted)] hover:text-red-500 p-1.5 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)]"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="font-mono text-xs text-[var(--text-muted)] hidden sm:flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-[#84C57E]" />
              <span>Storage: <strong className="text-[var(--text-primary)]">Flat-File JSON Engine (100% Free)</strong></span>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* View Live Public Site Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-xs"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {alertMsg && (
          <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-[#84C57E]/10 border border-[#84C57E]/30 text-xs font-mono text-[#2E7D32] dark:text-[#84C57E] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
