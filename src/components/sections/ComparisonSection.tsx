import React, { useState } from 'react';
import { SlidersHorizontal, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { COMPARISON_ITEMS } from '../../data/content';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

export const ComparisonSection: React.FC = () => {
  const content = useContent();
  const comparisonData = content.comparison || {};
  const items = comparisonData.items && comparisonData.items.length > 0 ? comparisonData.items : COMPARISON_ITEMS;
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderPos(val);
    if (val % 20 === 0) {
      sound.playPop(440 + val * 2);
    }
  };

  return (
    <section id="comparison" className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{comparisonData.kicker || 'Side-by-Side Reality Check'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
            {comparisonData.heading || 'Stale Melted Code vs. Chilled Artisanal Perfection.'}
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            {comparisonData.description ||
              'Most digital agencies sell pre-packaged WordPress themes and bill you for bloated hours. Here is why high-growth brands choose our fresh culinary approach.'}
          </p>
        </div>

        {/* Interactive Split Comparison Slider */}
        <div className="mb-16 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="font-mono text-xs uppercase font-semibold text-[var(--text-secondary)]">
                The Stale Agency Standard ({100 - sliderPos}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase font-semibold text-[#84C57E]">
                Kulfi Studio Fresh Craft ({sliderPos}%)
              </span>
              <span className="w-3 h-3 rounded-full bg-[#84C57E]" />
            </div>
          </div>

          {/* Slider Input */}
          <div className="mb-8 px-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleSliderChange}
              data-cursor="Slide"
              className="w-full accent-[#F4A300] h-2 bg-[var(--border-color)] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)] mt-2">
              <span>← Drag Left to see Stale Flaws</span>
              <span>Drag Right to see Chilled Precision →</span>
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Stale Way */}
            <div
              className="p-6 sm:p-8 rounded-2xl border border-red-200 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 transition-opacity"
              style={{ opacity: 0.3 + (100 - sliderPos) * 0.007 }}
            >
              <div className="flex items-center gap-2.5 mb-6 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold">The Stale Way (Melted Mess)</h3>
              </div>
              <ul className="space-y-4">
                {items.map((item: any) => (
                  <li key={item.dimension} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[var(--text-primary)] block font-mono text-xs mb-0.5">
                        {item.dimension}:
                      </strong>
                      <span>{item.staleWay}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Kulfi Studio Way */}
            <div
              className="p-6 sm:p-8 rounded-2xl border border-[#84C57E]/40 bg-[#84C57E]/5 transition-opacity"
              style={{ opacity: 0.3 + sliderPos * 0.007 }}
            >
              <div className="flex items-center gap-2.5 mb-6 text-[#2E7D32] dark:text-[#84C57E]">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display text-lg font-bold">The Kulfi Studio Way (Cold & Fresh)</h3>
              </div>
              <ul className="space-y-4">
                {items.map((item: any) => (
                  <li key={item.dimension} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-[#84C57E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[var(--text-primary)] block font-mono text-xs mb-0.5">
                        {item.dimension}:
                      </strong>
                      <span>{item.kulfiWay}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quantified Research Impact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[var(--border-color)]">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="font-display text-3xl font-bold text-[#F4A300] tabular-nums mb-1">
              94%
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
              First Impressions
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Design and interaction quality dictate initial brand credibility within 50 milliseconds of landing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="font-display text-3xl font-bold text-[#84C57E] tabular-nums mb-1">
              88%
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Visitor Churn Risk
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Potential buyers will never return to a website after encountering a sluggish or unresponsive layout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="font-display text-3xl font-bold text-[#F7A8B8] tabular-nums mb-1">
              3.2x
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Pipeline Conversion
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Sub-second page speeds generate triple the qualified sales inquiries compared to standard 3s+ agency builds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
