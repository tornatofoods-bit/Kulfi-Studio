import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ClientGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF8] dark:bg-[#140D09]">
        <div className="flex items-center gap-3 text-[#F4A300]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-display font-semibold text-lg text-[var(--text-primary)]">
            Loading Client Portal...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
