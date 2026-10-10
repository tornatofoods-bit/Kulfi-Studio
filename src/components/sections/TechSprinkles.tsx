import React, { useState } from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { TECH_SPRINKLES } from '../../data/content';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

export const TechSprinkles: React.FC = () => {
  const content = useContent();
  const techData = content.technologies || {};
  const items = techData.items && techData.items.length > 0 ? techData.items : TECH_SPRINKLES;

  const [scatterSeeds, setScatterSeeds] = useState<number[]>(
    items.map(() => 0)
  );

  const handleScatter = () => {
    sound.playCrunch();
    setScatterSeeds(
      items.map(() => (Math.random() - 0.5) * 28)
    );
  };

  const handleSprinkleHover = (idx: number) => {
    sound.playPop(600 + (idx % 6) * 40);
    setScatterSeeds((prev) => {
      const copy = [...prev];
      copy[idx] = (Math.random() - 0.5) * 35;
      return copy;
    });
  };

  return (
    <section className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Cpu className="h-3.5 w-3.5" />
              <span>{techData.kicker || 'Modern Stack & Ingredients'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
              {techData.heading || 'The Sprinkles on Top: Cutting-Edge Tech.'}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {techData.description ||
                'We build strictly with battle-tested, modern technologies. No legacy baggage, no deprecated libraries. Move cursor over ingredients or scatter the sprinkles.'}
            </p>
          </div>

          <button
            onClick={handleScatter}
            type="button"
            data-cursor="Scatter"
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#F4A300] rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#F4A300]" />
            <span>Scatter Sprinkles</span>
          </button>
        </div>

        {/* Interactive Floating Sprinkles Cloud */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] relative overflow-hidden flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[280px]">
          {items.map((tech: any, idx: number) => {
            const offset = scatterSeeds[idx];
            return (
              <div
                key={tech.name}
                onMouseEnter={() => handleSprinkleHover(idx)}
                style={{
                  transform: `translateY(${offset}px) rotate(${offset * 0.4}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group relative cursor-pointer"
                data-cursor={tech.category}
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xs hover:border-[#F4A300] hover:shadow-md transition-all">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="font-display text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                    {tech.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                    {tech.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architectural Commitments */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[var(--border-color)]">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase text-[#F4A300] mb-1">01 · Strict Types</span>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
              End-to-End TypeScript
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every request payload, API interface, and UI component is strictly typed to eliminate runtime errors before they reach clients.
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase text-[#84C57E] mb-1">02 · Edge Networks</span>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
              Sub-50ms Global Routing
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Static assets and dynamic routes are cached at edge locations worldwide for instant response regardless of user geography.
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase text-[#F7A8B8] mb-1">03 · Automated CI/CD</span>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
              Preview Branches on Every PR
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every feature passes automated linting, test suites, and generates live staging preview links before merging to main.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
