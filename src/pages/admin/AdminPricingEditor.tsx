import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { DollarSign, Save, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PricingTier } from '../../types';
import { sound } from '../../lib/audio';

export const AdminPricingEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.pricing);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchPricing() {
      const res = await getSectionContent('pricing', true);
      if (res) setData(res);
    }
    fetchPricing();
  }, []);

  const updateTier = (idx: number, fields: Partial<PricingTier>) => {
    const tiers = [...data.tiers];
    tiers[idx] = { ...tiers[idx], ...fields };
    setData({ ...data, tiers });
  };

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('pricing', data, user.email);
        setStatusMsg('Published Pricing to Live Site!');
      } else {
        await saveDraftContent('pricing', data, user.email);
        setStatusMsg('Saved Draft Pricing!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update pricing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Commercial Menu</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Pricing & Scoops Editor
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

      {/* 3 Tier Editors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.tiers?.map((tier: PricingTier, idx: number) => (
          <div
            key={tier.id}
            className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4 shadow-xs"
          >
            <div className="font-mono text-xs text-[#F4A300] uppercase font-bold">
              {tier.name}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                Scoop Title
              </label>
              <input
                type="text"
                value={tier.scoopTitle}
                onChange={(e) => updateTier(idx, { scoopTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                  Project Flat
                </label>
                <input
                  type="text"
                  value={tier.priceProject}
                  onChange={(e) => updateTier(idx, { priceProject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                  Monthly Retainer
                </label>
                <input
                  type="text"
                  value={tier.priceMonthlyRetainer}
                  onChange={(e) => updateTier(idx, { priceMonthlyRetainer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                Turnaround Estimate
              </label>
              <input
                type="text"
                value={tier.deliveryEstimate}
                onChange={(e) => updateTier(idx, { deliveryEstimate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--text-muted)] mb-1">
                Features (One per line)
              </label>
              <textarea
                rows={5}
                value={tier.features.join('\n')}
                onChange={(e) =>
                  updateTier(idx, {
                    features: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
