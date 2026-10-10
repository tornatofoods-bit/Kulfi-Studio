import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { BookOpen, Save, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { sound } from '../../lib/audio';

export const AdminBlogEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [data, setData] = useState<any>(DEFAULT_CONTENT.blog);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchBlog() {
      const res = await getSectionContent('blog', true);
      if (res) setData(res);
    }
    fetchBlog();
  }, []);

  const current: BlogPost = data.posts?.[selectedIndex] || data.posts?.[0];

  const updateCurrent = (fields: Partial<BlogPost>) => {
    const posts = [...data.posts];
    posts[selectedIndex] = { ...posts[selectedIndex], ...fields };
    setData({ ...data, posts });
  };

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('blog', data, user.email);
        setStatusMsg('Published Blog Posts to Live Site!');
      } else {
        await saveDraftContent('blog', data, user.email);
        setStatusMsg('Saved Draft Blog Posts!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update articles.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>The Kulfi Journal</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Cold Takes & Engineering Articles
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
        {data.posts?.map((p: BlogPost, idx: number) => (
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

      {current && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Article Title
              </label>
              <input
                type="text"
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Category
              </label>
              <input
                type="text"
                value={current.category}
                onChange={(e) => updateCurrent({ category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Short Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={current.summary}
              onChange={(e) => updateCurrent({ summary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Full Article Body (Paragraphs separated by empty line)
            </label>
            <textarea
              rows={8}
              value={current.content.join('\n\n')}
              onChange={(e) =>
                updateCurrent({
                  content: e.target.value.split('\n\n').filter((p) => p.trim().length > 0),
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm leading-relaxed focus:border-[#F4A300] focus:outline-hidden font-sans"
            />
          </div>
        </div>
      )}
    </div>
  );
};
