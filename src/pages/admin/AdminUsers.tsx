import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Users, UserPlus, Trash2, Shield, CheckCircle2, Key, Globe, Plus, AlertCircle, Info } from 'lucide-react';
import { sound } from '../../lib/audio';

const STORAGE_KEY_ADMINS = 'kulfi_admins_list';

const INITIAL_ADMINS = [
  {
    id: 'admin_1',
    email: 'shaikhrehan921@gmail.com',
    displayName: 'Primary Super Admin',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin_2',
    email: 'admin@kulfistudio.dev',
    displayName: 'Master Confectioner',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
];

export const AdminUsers: React.FC = () => {
  const { user } = useAdminAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'editor'>('editor');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Google OAuth Settings State
  const [googleClientId, setGoogleClientId] = useState('');
  const [allowedGoogleEmails, setAllowedGoogleEmails] = useState<string[]>([]);
  const [newGoogleAdminEmail, setNewGoogleAdminEmail] = useState('');
  const [savingGoogleSettings, setSavingGoogleSettings] = useState(false);

  const fetchAuthConfig = async () => {
    try {
      const res = await fetch('/api/auth-config.php');
      if (res.ok) {
        const data = await res.json();
        if (data.googleClientId) setGoogleClientId(data.googleClientId);
        if (Array.isArray(data.allowedAdminGoogleEmails)) {
          setAllowedGoogleEmails(data.allowedAdminGoogleEmails);
        }
      }
    } catch {}
  };

  const fetchAdmins = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_ADMINS);
      if (stored) {
        try {
          setAdmins(JSON.parse(stored));
          return;
        } catch {}
      }
      setAdmins(INITIAL_ADMINS);
      localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(INITIAL_ADMINS));
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchAuthConfig();
  }, []);

  const handleSaveGoogleSettings = async (updatedClientId?: string, updatedEmails?: string[]) => {
    setSavingGoogleSettings(true);
    sound.playPop();

    const payload = {
      googleClientId: updatedClientId !== undefined ? updatedClientId : googleClientId,
      allowedAdminGoogleEmails: updatedEmails !== undefined ? updatedEmails : allowedGoogleEmails,
    };

    try {
      const res = await fetch('/api/auth-config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sound.playChime();
        setStatusMsg('Google OAuth & security rules updated successfully!');
      } else {
        setStatusMsg('Settings saved locally for this environment.');
      }
    } catch {
      setStatusMsg('Settings updated.');
    }

    setSavingGoogleSettings(false);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleAddAllowedGoogleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newGoogleAdminEmail.trim().toLowerCase();
    if (!clean) return;

    if (allowedGoogleEmails.includes(clean)) {
      setStatusMsg('This Google email is already on the allowed admin list.');
      setTimeout(() => setStatusMsg(''), 3000);
      return;
    }

    const updated = [...allowedGoogleEmails, clean];
    setAllowedGoogleEmails(updated);
    setNewGoogleAdminEmail('');
    handleSaveGoogleSettings(googleClientId, updated);
  };

  const handleRemoveAllowedGoogleEmail = (emailToRemove: string) => {
    const updated = allowedGoogleEmails.filter((em) => em !== emailToRemove);
    setAllowedGoogleEmails(updated);
    handleSaveGoogleSettings(googleClientId, updated);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    sound.playPop();
    const newEntry = {
      id: `admin_${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      displayName: newDisplayName.trim() || newEmail.split('@')[0],
      role: newRole,
      createdAt: new Date().toISOString(),
    };

    const updated = [...admins, newEntry];
    setAdmins(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(updated));
    }

    sound.playChime();
    setStatusMsg(`Added ${newEmail} as ${newRole}!`);
    setNewEmail('');
    setNewDisplayName('');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleRemoveAdmin = (id: string, email: string) => {
    if (email.toLowerCase() === 'shaikhrehan921@gmail.com') {
      alert('The primary owner cannot be removed.');
      return;
    }
    if (!window.confirm(`Revoke operator access for ${email}?`)) return;

    sound.playPop();
    const updated = admins.filter((a) => a.id !== id);
    setAdmins(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(updated));
    }
    sound.playChime();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
          <Users className="h-3.5 w-3.5" />
          <span>Access Control Management</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Administrators & Editors Management
        </h1>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#84C57E]/10 border border-[#84C57E]/30 text-xs font-mono text-[#2E7D32] dark:text-[#84C57E] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Add Admin Form */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-[#F4A300]" />
          <span>Grant New Operator Access</span>
        </h2>

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Work Email / Username *
            </label>
            <input
              type="text"
              required
              placeholder="editor@kulfistudio.dev"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Saffron Chef"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              >
                <option value="editor">Editor (Content only)</option>
                <option value="super_admin">Super Admin (Full access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors self-end shadow-sm"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Admin List */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">
          Whitelisted Operators ({admins.length})
        </h2>

        <div className="divide-y divide-[var(--border-color)]">
          {admins.map((adm) => (
            <div key={adm.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F4A300]/10 flex items-center justify-center text-[#F4A300] shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
                    {adm.displayName || adm.email}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    {adm.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-[var(--bg-surface-subtle)] text-[#F4A300] border border-[var(--border-color)]">
                  {adm.role || 'admin'}
                </span>

                {adm.email?.toLowerCase() !== 'shaikhrehan921@gmail.com' && (
                  <button
                    onClick={() => handleRemoveAdmin(adm.id, adm.email)}
                    className="text-[var(--text-muted)] hover:text-red-500 p-1.5 rounded-lg transition-colors"
                    title="Revoke Admin Access"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Identity Services & OAuth Settings */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300]">
              <Globe className="h-4 w-4" />
              <span>Google Identity Services (GIS)</span>
            </div>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mt-1">
              Google OAuth Client & Role Isolation
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
                googleClientId
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              }`}
            >
              {googleClientId ? '● Active' : '○ Standby / Demo'}
            </span>
          </div>
        </div>

        {/* Security Rule Notice */}
        <div className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-start gap-3 text-xs text-[var(--text-secondary)] leading-relaxed">
          <Info className="h-4 w-4 text-[#F4A300] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[var(--text-primary)] block mb-0.5">Strict Zero-Privilege Escalation:</strong>
            By default, all Google logins create strictly <strong>Client</strong> accounts with access limited to <code className="text-[#F4A300]">/account</code>. Google login never grants administrator permissions unless the Google email is explicitly listed in the whitelist below.
          </div>
        </div>

        {/* Client ID Setting */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Google OAuth 2.0 Client ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-mono text-[var(--text-primary)] focus:border-[#F4A300] focus:outline-hidden"
            />
            <button
              type="button"
              disabled={savingGoogleSettings}
              onClick={() => handleSaveGoogleSettings()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors"
            >
              {savingGoogleSettings ? 'Saving...' : 'Save Client ID'}
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Obtain free from Google Cloud Console &rarr; APIs & Services &rarr; Credentials &rarr; OAuth 2.0 Client IDs.
          </p>
        </div>

        {/* Allowed Admin Google Emails */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-[#F4A300]" />
              <span>Allowed Admin Google Emails</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Admins who sign in using Google must have their email explicitly listed here (empty by default).
            </p>
          </div>

          <form onSubmit={handleAddAllowedGoogleEmail} className="flex gap-2">
            <input
              type="email"
              placeholder="verified.admin@gmail.com"
              value={newGoogleAdminEmail}
              onChange={(e) => setNewGoogleAdminEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs text-[var(--text-primary)] focus:border-[#F4A300] focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#F4A300] hover:bg-[#e09400] transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Allow Admin Email</span>
            </button>
          </form>

          {allowedGoogleEmails.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
              No Google accounts are authorized for admin access. (Admin Google sign-in is disabled).
            </div>
          ) : (
            <div className="space-y-2">
              {allowedGoogleEmails.map((em) => (
                <div
                  key={em}
                  className="p-2.5 px-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-[var(--text-primary)]">{em}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllowedGoogleEmail(em)}
                    className="text-red-500 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
