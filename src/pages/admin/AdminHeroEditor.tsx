import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { Sparkles, Save, CheckCircle2, RotateCcw, Eye, ArrowUpRight } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminHeroEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.hero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchHero() {
      const res = await getSectionContent('hero', true);
      if (res) {
        setData(res);
      }
      setLoading(false);
    }
    fetchHero();
  }, []);

  const handleSaveDraft = async () => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      await saveDraftContent('hero', data, user.email);
      sound.playChime();
      setStatusMsg('Draft saved successfully to Firestore!');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      await publishSectionContent('hero', data, user.email);
      sound.playChime();
      setStatusMsg('Published to Live Public Site!');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to publish.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset Hero parameters to original default confection values?')) {
      setData(DEFAULT_CONTENT.hero);
      sound.playPop();
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
        Loading Hero & 3D Parameters...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hero & 3D WebGL Config</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Hero Section Editor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[#F4A300] text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5 text-[#F4A300]" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            type="button"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-md disabled:opacity-50"
          >
            <span>Publish to Live</span>
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

      {/* Hero Copy Settings */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
          Editorial Typography & Content
        </h2>

        {/* Kicker */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Top Unboxed Kicker
          </label>
          <input
            type="text"
            value={data.kicker || ''}
            onChange={(e) => setData({ ...data, kicker: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Hero Main Headline
          </label>
          <input
            type="text"
            value={data.headline || ''}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* Subheadline */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Value Proposition Sub-paragraph
          </label>
          <textarea
            rows={3}
            value={data.subheadline || ''}
            onChange={(e) => setData({ ...data, subheadline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
          />
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Primary Button Text
            </label>
            <input
              type="text"
              value={data.primaryCtaText || ''}
              onChange={(e) => setData({ ...data, primaryCtaText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={data.secondaryCtaText || ''}
              onChange={(e) => setData({ ...data, secondaryCtaText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3D WebGL Scene Controls */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
          Three.js WebGL Scene Parameters
        </h2>

        <div className="space-y-5">
          {/* Rotation Speed */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[var(--text-secondary)] uppercase">Continuous Rotation Speed</span>
              <span className="text-[#F4A300] font-bold">{data.threeSettings?.autoRotateSpeed || 0.35}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.5"
              step="0.05"
              value={data.threeSettings?.autoRotateSpeed || 0.35}
              onChange={(e) =>
                setData({
                  ...data,
                  threeSettings: {
                    ...data.threeSettings,
                    autoRotateSpeed: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-[#F4A300]"
            />
          </div>

          {/* Mouse Parallax Tilt Intensity */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[var(--text-secondary)] uppercase">Mouse Tilt Sensitivity</span>
              <span className="text-[#F4A300] font-bold">{data.threeSettings?.tiltIntensity || 0.6}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={data.threeSettings?.tiltIntensity || 0.6}
              onChange={(e) =>
                setData({
                  ...data,
                  threeSettings: {
                    ...data.threeSettings,
                    tiltIntensity: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-[#F4A300]"
            />
          </div>

          {/* Sprinkles Count */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[var(--text-secondary)] uppercase">Surface Sprinkle Density</span>
              <span className="text-[#F4A300] font-bold">{data.threeSettings?.sprinklesCount || 75} items</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={data.threeSettings?.sprinklesCount || 75}
              onChange={(e) =>
                setData({
                  ...data,
                  threeSettings: {
                    ...data.threeSettings,
                    sprinklesCount: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-[#F4A300]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
