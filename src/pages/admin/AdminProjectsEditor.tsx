import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { FolderGit2, Save, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ProjectCaseStudy } from '../../types';
import { sound } from '../../lib/audio';

export const AdminProjectsEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.projects);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      const res = await getSectionContent('projects', true);
      if (res) setData(res);
    }
    fetchProjects();
  }, []);

  const currentProject: ProjectCaseStudy = data.items?.[selectedIndex] || data.items?.[0];

  const updateCurrent = (fields: Partial<ProjectCaseStudy>) => {
    const updated = [...data.items];
    updated[selectedIndex] = { ...updated[selectedIndex], ...fields };
    setData({ ...data, items: updated });
  };

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('projects', data, user.email);
        setStatusMsg('Published Case Studies to Live Site!');
      } else {
        await saveDraftContent('projects', data, user.email);
        setStatusMsg('Saved Draft Case Studies!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update case studies.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>Showcase & Proof</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Case Studies Editor
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

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {data.items?.map((p: ProjectCaseStudy, idx: number) => (
          <button
            key={p.id}
            onClick={() => {
              sound.playPop();
              setSelectedIndex(idx);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedIndex === idx
                ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {currentProject && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={currentProject.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Client Organization
              </label>
              <input
                type="text"
                value={currentProject.client}
                onChange={(e) => updateCurrent({ client: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Category Label
              </label>
              <input
                type="text"
                value={currentProject.categoryLabel}
                onChange={(e) => updateCurrent({ categoryLabel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Turnaround Duration
              </label>
              <input
                type="text"
                value={currentProject.duration}
                onChange={(e) => updateCurrent({ duration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Case Summary
            </label>
            <textarea
              rows={2}
              value={currentProject.summary}
              onChange={(e) => updateCurrent({ summary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              The Challenge
            </label>
            <textarea
              rows={3}
              value={currentProject.problem}
              onChange={(e) => updateCurrent({ problem: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Our Artisanal Solution
            </label>
            <textarea
              rows={3}
              value={currentProject.solution}
              onChange={(e) => updateCurrent({ solution: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
