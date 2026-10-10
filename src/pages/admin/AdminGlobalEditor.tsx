import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { Settings, Save, ArrowUpRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminGlobalEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.global);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchGlobal() {
      const res = await getSectionContent('global', true);
      if (res) setData(res);
      setLoading(false);
    }
    fetchGlobal();
  }, []);

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('global', data, user.email);
        setStatusMsg('Published Global Settings to Live Site!');
      } else {
        await saveDraftContent('global', data, user.email);
        setStatusMsg('Saved Draft Global Settings!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Settings className="h-3.5 w-3.5" />
            <span>Site-Wide Governance</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Global Settings & Touchpoints
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[#F4A300] text-[var(--text-primary)] transition-colors"
          >
            <Save className="h-3.5 w-3.5 text-[#F4A300]" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] transition-colors shadow-md"
          >
            <span>Publish</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-[#84C57E]/10 border border-[#84C57E]/30 text-xs font-mono text-[#2E7D32] dark:text-[#84C57E] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Brand / Company Name
            </label>
            <input
              type="text"
              value={data.companyName || ''}
              onChange={(e) => setData({ ...data, companyName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Brand Tagline
            </label>
            <input
              type="text"
              value={data.tagline || ''}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Contact Orders Email
            </label>
            <input
              type="email"
              value={data.contactEmail || ''}
              onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Phone Consultation Hotline
            </label>
            <input
              type="text"
              value={data.phone || ''}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              WhatsApp Integration Number
            </label>
            <input
              type="text"
              value={data.whatsapp || ''}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Kitchen Operating Hours
            </label>
            <input
              type="text"
              value={data.workingHours || ''}
              onChange={(e) => setData({ ...data, workingHours: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Global Headquarters Locations
          </label>
          <input
            type="text"
            value={data.address || ''}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
