import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { SlidersHorizontal, Save, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminComparisonEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.comparison);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchComparison() {
      const res = await getSectionContent('comparison', true);
      if (res) setData(res);
    }
    fetchComparison();
  }, []);

  const updateItem = (idx: number, field: string, val: string) => {
    const items = [...data.items];
    items[idx] = { ...items[idx], [field]: val };
    setData({ ...data, items });
  };

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('comparison', data, user.email);
        setStatusMsg('Published Comparison to Live Site!');
      } else {
        await saveDraftContent('comparison', data, user.email);
        setStatusMsg('Saved Draft Comparison!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update comparison.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Reality Check Comparison</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Stale vs Chilled Slider Editor
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
            Section Heading
          </label>
          <input
            type="text"
            value={data.heading || ''}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* 5 Comparison Dimensions */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
            Comparison Dimensions
          </h3>
          {data.items?.map((item: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] space-y-3">
              <input
                type="text"
                value={item.dimension}
                onChange={(e) => updateItem(idx, 'dimension', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-mono font-bold text-[#F4A300]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-red-500 mb-1">
                    The Stale Agency Way
                  </label>
                  <textarea
                    rows={2}
                    value={item.staleWay}
                    onChange={(e) => updateItem(idx, 'staleWay', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-red-200 bg-[var(--bg-surface)] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#84C57E] mb-1">
                    The Kulfi Studio Way
                  </label>
                  <textarea
                    rows={2}
                    value={item.kulfiWay}
                    onChange={(e) => updateItem(idx, 'kulfiWay', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#84C57E]/40 bg-[var(--bg-surface)] text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
