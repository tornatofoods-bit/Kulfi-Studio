import React from 'react';

const BRANDS = [
  { name: 'ChaiCart Commerce', sector: 'E-Commerce' },
  { name: 'NeuroFlow Health', sector: 'AI Clinical Systems' },
  { name: 'ZaffronPay Global', sector: 'Fintech Payments' },
  { name: 'Loom & Craft Atelier', sector: 'Luxury DTC' },
  { name: 'CloudMalai Systems', sector: 'Cloud Infrastructure' },
  { name: 'Pistachio BioLabs', sector: 'HealthTech' },
  { name: 'ColdStack Networks', sector: 'Edge Data' },
  { name: 'Saffron Media Group', sector: 'Publishing & Media' },
];

export const Marquee: React.FC = () => {
  return (
    <section id="clients" className="py-12 border-y border-[var(--border-color)] bg-[var(--bg-surface-subtle)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
          <span>Trusted by high-growth startups & global enterprise teams</span>
        </div>
        <div className="text-xs font-mono text-[var(--text-secondary)]">
          <span className="font-semibold text-[#F4A300] tabular-nums">$180M+</span> client transaction volume powered
        </div>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden flex select-none">
        {/* Left and right fade gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-surface-subtle)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-surface-subtle)] to-transparent z-10" />

        {/* Continuous looping ticker */}
        <div className="flex shrink-0 items-center gap-12 sm:gap-16 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
          {BRANDS.concat(BRANDS).map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center gap-3 opacity-75 hover:opacity-100 transition-opacity cursor-default group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#F4A300]/60 group-hover:bg-[#F4A300] transition-colors" />
              <div className="flex flex-col">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  {brand.name}
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {brand.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
