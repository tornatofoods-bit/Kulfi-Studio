import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../lib/audio';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';

type AuthTab = 'client' | 'admin' | 'signup';

export const AuthLogin: React.FC = () => {
  const { user, isAdmin, isClient, mode, login, register, setupCompleted } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<AuthTab>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Set noindex meta tag
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

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const fromPath = (location.state as any)?.from?.pathname;
      if (fromPath) {
        navigate(fromPath, { replace: true });
        return;
      }
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isClient) {
        navigate('/account', { replace: true });
      }
    }
  }, [user, isAdmin, isClient, navigate, location]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    sound.playPop();

    const expectedRole = activeTab === 'admin' ? 'admin' : 'client';
    const res = await login(email, password, expectedRole);

    if (res.success && res.user) {
      sound.playChime();
      if (res.user.role === 'super_admin' || res.user.role === 'editor') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please verify your email and password.');
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    sound.playPop();

    const res = await register({
      name,
      email,
      password,
      company,
      hp_field: honeypot,
    });

    if (res.success && res.user) {
      sound.playChime();
      navigate('/account', { replace: true });
    } else {
      setErrorMsg(res.error || 'Failed to create client account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 bg-[#FFFDF8] dark:bg-[#140D09] text-[var(--text-primary)] transition-colors">
      {/* Top back navigation */}
      <a
        href="/"
        onClick={() => sound.playPop()}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] hover:text-[#F4A300] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Studio</span>
      </a>

      {/* Mode Badge (Static vs PHP) */}
      <div className="absolute top-6 right-6">
        {mode === 'static' ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Static Host Mode (Demo Passcode Gate)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#84C57E]/10 text-[#43793D] dark:text-[#84C57E] border border-[#84C57E]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84C57E] animate-pulse" />
            <span>Flat-File PHP Engine Active</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        {/* Brand identity header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] shadow-md mb-4 group hover:rotate-6 transition-transform">
            <div className="w-4 h-7 bg-white/95 rounded-t-full rounded-b-xs" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Kulfi Studio
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#F4A300] mt-1">
            Artisanal Confectionery Portal
          </p>
        </div>

        {/* Tab switch */}
        <div className="mb-6 p-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl grid grid-cols-2 shadow-xs">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('client');
              setErrorMsg('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'client' || activeTab === 'signup'
                ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Client Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('admin');
              setErrorMsg('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* Card Panel */}
        <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl relative overflow-hidden backdrop-blur-xs">
          {/* Static mode notice */}
          {mode === 'static' && activeTab !== 'admin' && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <div className="font-semibold mb-1 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Static Hosting Detected</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                You are viewing a static build. To test full client registration and sessions, deploy with PHP hosting. Switch to the <strong>Admin Console</strong> tab to log into the management console.
              </p>
            </div>
          )}

          {/* Setup reminder if not locked */}
          {!setupCompleted && activeTab === 'admin' && (
            <div className="mb-6 p-3 rounded-xl bg-[#F4A300]/10 border border-[#F4A300]/30 text-xs text-[var(--text-primary)]">
              <span className="font-semibold text-[#F4A300] block mb-0.5">Initial Setup Available</span>
              <span>Need to set your master admin password for the first time? </span>
              <Link to="/setup" className="font-semibold underline text-[#F4A300] hover:text-[#d98200]">
                Launch Setup Wizard &rarr;
              </Link>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Client Sign Up View */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="text-left mb-2">
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Create Client Account
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Track your project requests and collaborate with our confectionery team.
                </p>
              </div>

              {/* Honeypot hidden field */}
              <input
                type="text"
                name="hp_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Company / Brand (Optional)
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Saffron Sweets Ltd."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#F4A300] hover:bg-[#e09400] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Complete Sign Up</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              {/* Sign up with Google */}
              <GoogleAuthButton
                type="signup"
                onSuccess={() => navigate('/account', { replace: true })}
                onError={(err) => setErrorMsg(err)}
              />

              <div className="text-center pt-2 text-xs text-[var(--text-secondary)]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setActiveTab('client');
                    setErrorMsg('');
                  }}
                  className="font-semibold text-[#F4A300] hover:underline"
                >
                  Log in here
                </button>
              </div>
            </form>
          )}

          {/* Client or Admin Login View */}
          {activeTab !== 'signup' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-left mb-2">
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  {activeTab === 'admin' ? 'Administrator Login' : 'Client Login'}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {activeTab === 'admin'
                    ? 'Access content editor, lead pipeline, and studio management.'
                    : 'Manage your studio orders, case reviews, and project requests.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  {activeTab === 'admin' ? 'Username or Email' : 'Client Email'}
                </label>
                <div className="relative">
                  {activeTab === 'admin' ? (
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  ) : (
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  )}
                  <input
                    type={activeTab === 'admin' ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'admin' ? 'admin or your.email@kulfistudio.dev' : 'client@company.com'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-[#F4A300] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[#F4A300] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{activeTab === 'admin' ? 'Enter Admin Console' : 'Sign In as Client'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              {/* Client Login with Google */}
              {activeTab === 'client' && (
                <GoogleAuthButton
                  type="signin"
                  onSuccess={() => navigate('/account', { replace: true })}
                  onError={(err) => setErrorMsg(err)}
                />
              )}

              {/* Client sign up switch */}
              {activeTab === 'client' && (
                <div className="text-center pt-2 text-xs text-[var(--text-secondary)]">
                  Don't have a client account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setActiveTab('signup');
                      setErrorMsg('');
                    }}
                    className="font-semibold text-[#F4A300] hover:underline"
                  >
                    Sign up now
                  </button>
                </div>
              )}

              {/* Quick default credentials help note */}
              <div className="pt-4 border-t border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] leading-relaxed text-center">
                {activeTab === 'admin' ? (
                  <span>Default operator: <strong className="text-[var(--text-secondary)]">admin</strong> / <strong className="text-[var(--text-secondary)]">kulfi2026!</strong></span>
                ) : (
                  <span>Demo client: <strong className="text-[var(--text-secondary)]">client@kulfistudio.dev</strong> / <strong className="text-[var(--text-secondary)]">kulfi2026!</strong></span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#F4A300]">
              <HelpCircle className="h-5 w-5" />
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Reset Password
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              In flat-file architecture, password reset tokens are handled securely without external third-party services.
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-2">
              <p>
                <strong>Clients:</strong> Contact the Kulfi Studio administrator at{' '}
                <span className="text-[#F4A300]">hello@kulfistudio.dev</span> with your registered email.
              </p>
              <p>
                <strong>Admins:</strong> If locked out, administrators can update their hashed password directly inside <code className="text-[#84C57E]">public/data/users.json</code> or run the setup wizard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setShowForgotModal(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
