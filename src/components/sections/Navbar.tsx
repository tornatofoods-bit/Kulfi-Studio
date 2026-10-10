import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, User, LogIn, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenBrief: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBrief }) => {
  const content = useContent();
  const global = content.global || {};
  const { user, isAdmin, isClient, logout } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY > 200 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleLogout = async () => {
    sound.playPop();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Insights', href: '#insights' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-8 rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled
              ? 'glass-panel shadow-sm shadow-[#3B2418]/5'
              : 'bg-[var(--bg-main)]/70 backdrop-blur-md border border-[var(--border-color)]'
          }`}
        >
          {/* Zone 1: Single Wordmark */}
          <a
            href="#"
            data-cursor="Home"
            onClick={() => sound.playPop(520)}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300] rounded-lg"
          >
            {/* Artisanal Kulfi Stick Icon */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] shadow-xs group-hover:rotate-6 transition-transform">
              <div className="w-2.5 h-4 bg-white/90 rounded-t-full rounded-b-xs" />
              <div className="absolute -bottom-1 w-1 h-2 bg-[#8D5B4C] rounded-b-xs" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {global.companyName || 'Kulfi Studio'}
            </span>
          </a>

          {/* Zone 2: Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-cursor={link.label}
                onClick={() => sound.playPop(480)}
                className="whitespace-nowrap shrink-0 hover:text-[var(--text-primary)] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F4A300] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions + Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              type="button"
              data-cursor={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
              className="flex items-center justify-center h-9 w-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--kulfi-saffron)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300]"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#F4A300]" />}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Zone: Login Button OR Profile Dropdown */}
            {!user ? (
              <Link
                to="/login"
                onClick={() => sound.playPop()}
                data-cursor="Login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[#F4A300] hover:text-[#F4A300] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300]"
              >
                <LogIn className="h-3.5 w-3.5 text-[#F4A300]" />
                <span>Login</span>
              </Link>
            ) : (
              <div className="relative hidden sm:block" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setProfileMenuOpen(!profileMenuOpen);
                  }}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[#F4A300] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300]"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#F4A300] to-[#FFB347] text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] max-w-[90px] truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[var(--border-color)]">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {user.name || 'Confectioner'}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {user.email}
                      </div>
                      <div className="mt-1 inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md bg-[#F4A300]/10 text-[#F4A300]">
                        {isAdmin ? 'Admin' : 'Client'}
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => {
                            sound.playPop();
                            setProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#F4A300]" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          to="/account"
                          onClick={() => {
                            sound.playPop();
                            setProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#F4A300]" />
                          <span>My Account</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[var(--border-color)]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => {
                sound.playChime();
                onOpenBrief();
              }}
              type="button"
              data-cursor="Order"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] rounded-xl hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-[#1E1410]/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F4A300]"
            >
              <span>Order a Project</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                sound.playPop();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              type="button"
              data-cursor="Menu"
              aria-label="Toggle navigation menu"
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[var(--border-color)] px-6 py-6 mx-4 rounded-2xl shadow-xl transition-all animate-fadeIn">
          {/* User Status in Mobile */}
          {user ? (
            <div className="mb-6 pb-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F4A300] to-[#FFB347] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {isAdmin ? 'Admin' : 'Client'} · {user.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mb-6 pb-4 border-b border-[var(--border-color)]">
              <Link
                to="/login"
                onClick={() => {
                  sound.playPop();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-semibold text-[var(--text-primary)] hover:border-[#F4A300]"
              >
                <LogIn className="h-4 w-4 text-[#F4A300]" />
                <span>Client & Admin Login</span>
              </Link>
            </div>
          )}

          <nav className="flex flex-col gap-4 text-base font-medium text-[var(--text-primary)] mb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playPop();
                  setMobileMenuOpen(false);
                }}
                className="py-2 border-b border-[var(--border-color)] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[var(--text-muted)] font-mono">0{navLinks.indexOf(link) + 1}</span>
              </a>
            ))}

            {user && (
              <Link
                to={isAdmin ? '/admin' : '/account'}
                onClick={() => {
                  sound.playPop();
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-[#F4A300] font-semibold flex items-center justify-between"
              >
                <span>{isAdmin ? 'Admin Console' : 'My Account'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              sound.playChime();
              onOpenBrief();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#F4A300] rounded-xl shadow-md"
          >
            <span>Order a Project</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
};

