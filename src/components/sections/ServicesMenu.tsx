import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, Clock, DollarSign } from 'lucide-react';
import { SERVICES } from '../../data/content';
import { ServiceItem } from '../../types';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface ServicesMenuProps {
  onSelectServiceForBrief: (serviceName: string) => void;
  onOpenServiceModal: (service: ServiceItem) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({
  onSelectServiceForBrief,
  onOpenServiceModal,
}) => {
  const content = useContent();
  const servicesData = content.services || {};
  const activeItems: ServiceItem[] = servicesData.items && servicesData.items.length > 0 ? servicesData.items : SERVICES;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="services" className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{servicesData.kicker || 'The Artisanal Flavour Menu'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
              {servicesData.heading || 'Hand-Churned Digital Capabilities.'}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {servicesData.description ||
                'Every service is whipped from raw ingredients: zero pre-packaged templates, zero technical debt. Choose a flavor that matches your next high-impact initiative.'}
            </p>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] shrink-0">
            {activeItems.length} Specialized Confectioneries Available
          </div>
        </div>

        {/* 6 Flavor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeItems.map((srv, index) => {
            const isHovered = hoveredId === srv.id;
            return (
              <div
                key={srv.id}
                onMouseEnter={() => {
                  sound.playPop(520 + index * 40);
                  setHoveredId(srv.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-3xl p-8 border bg-[var(--bg-surface)] transition-all duration-300 flex flex-col justify-between group shadow-xs ${
                  isHovered
                    ? 'border-[#F4A300] -translate-y-1.5 shadow-xl shadow-[#3B2418]/6'
                    : 'border-[var(--border-color)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Top Flavour Header */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-xs transition-transform group-hover:scale-125"
                        style={{ backgroundColor: srv.badgeColor }}
                      />
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        {srv.flavorTitle}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#F4A300] transition-colors">
                    {srv.name}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {srv.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[var(--border-color)]">
                    {srv.deliverables.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 mt-0.5"
                          style={{ color: srv.badgeColor }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Ingredient Tags (Clean, unboxed text per anti-slop rules) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] mb-8">
                    {srv.techStack.map((tech, tIdx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {tIdx < srv.techStack.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="pt-6 border-t border-[var(--border-color)] flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-[#F4A300]" />
                      <span>Starts at <strong className="text-[var(--text-primary)]">{srv.startingPrice}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span>{srv.turnaround}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        sound.playPop();
                        onOpenServiceModal(srv);
                      }}
                      type="button"
                      data-cursor="Details"
                      className="px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-hover)] rounded-xl border border-[var(--border-color)] transition-colors text-center"
                    >
                      Recipe Details
                    </button>

                    <button
                      onClick={() => {
                        sound.playChime();
                        onSelectServiceForBrief(srv.name);
                      }}
                      type="button"
                      data-cursor="Order"
                      className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] rounded-xl transition-colors shadow-xs"
                    >
                      <span>Order Scoop</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
