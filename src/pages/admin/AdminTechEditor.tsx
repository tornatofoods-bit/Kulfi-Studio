import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { Cpu, Save, ArrowUpRight, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { sound } from '../../lib/audio';

export const AdminTechEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.technologies);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#F4A300');
  const [newCategory, setNewCategory] = useState('Framework');

  useEffect(() => {
    async function fetchTech() {
      const res = await getSectionContent('technologies', true);
      if (res) setData(res);
    }
    fetchTech();
  }, []);

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('technologies', data, user.email);
        setStatusMsg('Published Tech Sprinkles to Live Site!');
      } else {
        await saveDraftContent('technologies', data, user.email);
        setStatusMsg('Saved Draft Tech Sprinkles!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update sprinkles.');
    } finally {
      setSaving(false);
    }
  };

  const addTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sound.playPop();
    const updated = [...data.items, { name: newName.trim(), color: newColor, category: newCategory }];
    setData({ ...data, items: updated });
    setNewName('');
  };

  const removeTech = (index: number) => {
    sound.playPop();
    const updated = data.items.filter((_: any, idx: number) => idx !== index);
    setData({ ...data, items: updated });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>Modern Stack & Ingredients</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Tech Sprinkles Editor
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

      {/* Add New Sprinkle */}
      <form onSubmit={addTech} className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Technology Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Bun, Vite, Rust"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Hex Color
          </label>
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-10 w-16 p-1 rounded-xl border border-[var(--border-color)] cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Category
          </label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Sprinkle</span>
        </button>
      </form>

      {/* Sprinkles List */}
      <div className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
        <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-4">
          Current Floating Sprinkles ({data.items?.length})
        </h3>
        <div className="flex flex-wrap gap-3">
          {data.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] text-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-[var(--text-primary)]">{item.name}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">({item.category})</span>
              <button
                type="button"
                onClick={() => removeTech(idx)}
                className="text-[var(--text-muted)] hover:text-red-500 ml-1"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
