import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'editor';
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, requiredRole }) => {
  const { user, isAdmin, role, loading, logout } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF8] dark:bg-[#140D09]">
        <div className="flex items-center gap-3 text-[#F4A300]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-display font-semibold text-lg text-[var(--text-primary)]">
            Authenticating Kulfi Admin...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFFDF8] dark:bg-[#140D09] text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
          The signed-in account (<strong>{user.email}</strong>) is not registered in the Kulfi Studio
          administrator whitelist.
        </p>
        <button
          onClick={() => logout()}
          type="button"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors"
        >
          Sign Out & Return to Login
        </button>
      </div>
    );
  }

  if (requiredRole === 'super_admin' && role !== 'super_admin') {
    return (
      <div className="p-8 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
        <h3 className="font-display text-lg font-bold text-red-600 mb-1">
          Super Admin Privileges Required
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Your account has Editor permissions. Only Super Admins can access user management and global settings.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
