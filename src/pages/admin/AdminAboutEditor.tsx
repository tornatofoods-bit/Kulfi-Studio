import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { Layers, Save, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminAboutEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.about);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchAbout() {
      const res = await getSectionContent('about', true);
      if (res) setData(res);
    }
    fetchAbout();
  }, []);

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('about', data, user.email);
        setStatusMsg('Published About Section to Live Site!');
      } else {
        await saveDraftContent('about', data, user.email);
        setStatusMsg('Saved Draft About Section!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update about section.');
    } finally {
      setSaving(false);
    }
  };

  const updateMetric = (idx: number, field: 'value' | 'label', val: string) => {
    const metrics = [...data.metrics];
    metrics[idx] = { ...metrics[idx], [field]: val };
    setData({ ...data, metrics });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>Pillars & Proof</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            About Section & Metrics
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
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Section Kicker
          </label>
          <input
            type="text"
            value={data.kicker || ''}
            onChange={(e) => setData({ ...data, kicker: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Section Main Heading
          </label>
          <input
            type="text"
            value={data.heading || ''}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Philosophy Paragraph
          </label>
          <textarea
            rows={3}
            value={data.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* Quantified Counters */}
        <div className="pt-6 border-t border-[var(--border-color)]">
          <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-4">
            Audited Metric Counters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.metrics?.map((m: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] space-y-2">
                <input
                  type="text"
                  value={m.value}
                  onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold text-[#F4A300]"
                />
                <input
                  type="text"
                  value={m.label}
                  onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
