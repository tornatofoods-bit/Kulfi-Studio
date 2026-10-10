import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AuthUser, UserRole, AuthMode } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAdmin: boolean;
  isClient: boolean;
  loading: boolean;
  mode: AuthMode;
  googleClientId: string;
  login: (
    identifier: string,
    password: string,
    expectedRole?: 'admin' | 'client'
  ) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    hp_field?: string;
  }) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  loginWithGoogle: (
    credential: string
  ) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  // Setup state check
  setupCompleted: boolean;
  checkSetupStatus: () => Promise<boolean>;
  refreshAuthConfig: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAdmin: false,
  isClient: false,
  loading: true,
  mode: 'php',
  googleClientId: '',
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: async () => {},
  checkSession: async () => {},
  setupCompleted: true,
  checkSetupStatus: async () => true,
  refreshAuthConfig: async () => {},
});

const STORAGE_KEY_AUTH = 'kulfi_active_session';
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 mins

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>('php');
  const [setupCompleted, setSetupCompleted] = useState<boolean>(true);
  const [googleClientId, setGoogleClientId] = useState<string>(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  );
  const lastActivityRef = useRef<number>(Date.now());

  const refreshAuthConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/auth-config.php');
      if (res.ok) {
        const data = await res.json();
        if (data.googleClientId) {
          setGoogleClientId(data.googleClientId);
        }
      }
    } catch {}
  }, []);

  const checkSetupStatus = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/setup.php');
      if (res.ok) {
        const data = await res.json();
        const completed = !!data.setupCompleted;
        setSetupCompleted(completed);
        return completed;
      }
    } catch {
      // Static mode default
    }
    return true;
  }, []);

  const checkSession = useCallback(async () => {
    try {
      // 1. Try server-side session check
      const res = await fetch('/api/me.php', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMode('php');
        if (data.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(data.user));
          }
          setLoading(false);
          return;
        } else {
          // Explicitly not logged in on server
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY_AUTH);
          }
          setLoading(false);
          return;
        }
      } else {
        // If 404 or not php server, switch to static mode
        setMode('static');
      }
    } catch {
      setMode('static');
    }

    // Static mode fallback: inspect localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        } catch {}
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    checkSetupStatus();
    refreshAuthConfig();
  }, [checkSession, checkSetupStatus, refreshAuthConfig]);

  // Inactivity Auto-Logout Timer (30 minutes for sensitive admin sessions)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      if (user && Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT_MS) {
        logout();
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [user]);

  const login = async (
    identifier: string,
    passwordAttempt: string,
    expectedRole?: 'admin' | 'client'
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    const cleanId = identifier.trim();
    const cleanPass = passwordAttempt.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Please enter both email/username and password.' };
    }

    // In PHP mode, post to /api/login.php
    if (mode === 'php') {
      try {
        const res = await fetch('/api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: cleanId,
            email: cleanId,
            password: cleanPass,
            role: expectedRole,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(data.user));
          }
          return { success: true, user: data.user };
        } else {
          return { success: false, error: data.error || 'Invalid credentials.' };
        }
      } catch {
        // Fallback to static mode if network failed
      }
    }

    // Static Mode Fallback (Client logins disabled in static host, only local admin passcode)
    if (expectedRole === 'admin' || cleanId === 'admin') {
      if (cleanPass.length >= 6) {
        const staticAdmin: AuthUser = {
          id: 'static_admin',
          email: cleanId.includes('@') ? cleanId : 'admin@kulfistudio.dev',
          name: cleanId === 'admin' ? 'Master Confectioner' : cleanId.split('@')[0],
          role: 'super_admin',
          company: 'Kulfi Studio',
        };
        setUser(staticAdmin);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(staticAdmin));
        }
        return { success: true, user: staticAdmin };
      }
    }

    return {
      success: false,
      error: mode === 'static'
        ? 'Client logins require PHP hosting. For static demo, use Admin login.'
        : 'Invalid email or password.',
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    hp_field?: string;
  }): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    if (mode === 'static') {
      return {
        success: false,
        error: 'Client sign up is disabled in Static Mode. Deploy with PHP API to enable client accounts.',
      };
    }

    try {
      const res = await fetch('/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success && json.user) {
        setUser(json.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(json.user));
        }
        return { success: true, user: json.user };
      } else {
        return { success: false, error: json.error || 'Registration failed.' };
      }
    } catch {
      return { success: false, error: 'Network error connecting to auth server.' };
    }
  };

  const loginWithGoogle = async (
    credential: string
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
    if (!credential) {
      return { success: false, error: 'Google credential token missing.' };
    }

    if (mode === 'php') {
      try {
        const res = await fetch('/api/google.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(data.user));
          }
          return { success: true, user: data.user };
        } else {
          return {
            success: false,
            error: data.error || 'Google authentication failed on server.',
          };
        }
      } catch {
        return {
          success: false,
          error: 'Network error connecting to Google auth endpoint.',
        };
      }
    }

    // Static mode fallback simulation
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const raw = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(raw);
        if (payload && payload.email) {
          const staticClient: AuthUser = {
            id: `usr_g_${payload.sub || Date.now()}`,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            role: 'client',
            company: '',
            avatar: payload.picture,
            authProvider: 'google',
            createdAt: new Date().toISOString(),
          };
          setUser(staticClient);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(staticClient));
          }
          return { success: true, user: staticClient };
        }
      }
    } catch {}

    return { success: false, error: 'Failed to process Google login.' };
  };

  const logout = async () => {
    try {
      await fetch('/api/logout.php', { credentials: 'include' });
    } catch {}

    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem('kulfi_admin_session');
    }
  };

  const role = user?.role || null;
  const isAdmin = role === 'super_admin' || role === 'editor';
  const isClient = role === 'client';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isClient,
        loading,
        mode,
        googleClientId,
        login,
        register,
        loginWithGoogle,
        logout,
        checkSession,
        setupCompleted,
        checkSetupStatus,
        refreshAuthConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Backwards-compatible helper for existing admin views
export const useAdminAuth = () => {
  const { user, role, isAdmin, loading, logout, login } = useAuth();
  return {
    user: user ? {
      email: user.email,
      displayName: user.name || user.email.split('@')[0],
      role: (user.role === 'super_admin' || user.role === 'editor' ? user.role : 'editor') as 'super_admin' | 'editor',
    } : null,
    role: (role === 'super_admin' || role === 'editor' ? role : null) as 'super_admin' | 'editor' | null,
    isAdmin,
    loading,
    login: async (usernameOrEmail: string, passwordAttempt: string, _remember?: boolean) => {
      const res = await login(usernameOrEmail, passwordAttempt, 'admin');
      return { success: res.success, error: res.error };
    },
    logout,
  };
};

export const AdminAuthProvider = AuthProvider;
