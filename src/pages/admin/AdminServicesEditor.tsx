import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getSectionContent,
  saveDraftContent,
  publishSectionContent,
  DEFAULT_CONTENT,
} from '../../lib/contentStore';
import { Briefcase, Save, ArrowUpRight, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { ServiceItem } from '../../types';
import { sound } from '../../lib/audio';

export const AdminServicesEditor: React.FC = () => {
  const { user } = useAdminAuth();
  const [servicesData, setServicesData] = useState<any>(DEFAULT_CONTENT.services);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    async function fetchServices() {
      const res = await getSectionContent('services', true);
      if (res) setServicesData(res);
    }
    fetchServices();
  }, []);

  const currentService: ServiceItem = servicesData.items?.[selectedIndex] || servicesData.items?.[0];

  const updateCurrent = (fields: Partial<ServiceItem>) => {
    const updated = [...servicesData.items];
    updated[selectedIndex] = { ...updated[selectedIndex], ...fields };
    setServicesData({ ...servicesData, items: updated });
  };

  const handleSave = async (publish = false) => {
    if (!user?.email) return;
    setSaving(true);
    sound.playPop();
    try {
      if (publish) {
        await publishSectionContent('services', servicesData, user.email);
        setStatusMsg('Published Services Flavour Menu to Live Site!');
      } else {
        await saveDraftContent('services', servicesData, user.email);
        setStatusMsg('Saved Draft Services!');
      }
      sound.playChime();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update services.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Digital Offerings & Flavour Profiles</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Services Confectionery Editor
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

      {/* Service Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {servicesData.items?.map((srv: ServiceItem, idx: number) => (
          <button
            key={srv.id}
            onClick={() => {
              sound.playPop();
              setSelectedIndex(idx);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedIndex === idx
                ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: srv.badgeColor }}
            />
            <span>{srv.flavorTitle}</span>
          </button>
        ))}
      </div>

      {/* Editor Form for Selected Service */}
      {currentService && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Service Display Name
              </label>
              <input
                type="text"
                value={currentService.name}
                onChange={(e) => updateCurrent({ name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Dessert Flavour Title
              </label>
              <input
                type="text"
                value={currentService.flavorTitle}
                onChange={(e) => updateCurrent({ flavorTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Starting Rate / Price
              </label>
              <input
                type="text"
                value={currentService.startingPrice}
                onChange={(e) => updateCurrent({ startingPrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Turnaround Estimate
              </label>
              <input
                type="text"
                value={currentService.turnaround}
                onChange={(e) => updateCurrent({ turnaround: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Short Card Summary
            </label>
            <textarea
              rows={2}
              value={currentService.shortDesc}
              onChange={(e) => updateCurrent({ shortDesc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Full Recipe Description (Modal View)
            </label>
            <textarea
              rows={3}
              value={currentService.fullDesc}
              onChange={(e) => updateCurrent({ fullDesc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>

          {/* Deliverables editor */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Deliverables List (One per line)
            </label>
            <textarea
              rows={4}
              value={currentService.deliverables.join('\n')}
              onChange={(e) =>
                updateCurrent({
                  deliverables: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-mono focus:border-[#F4A300] focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
