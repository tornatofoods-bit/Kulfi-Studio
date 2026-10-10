import React from 'react';
import { ArrowUpRight, Sparkles, MessageSquare } from 'lucide-react';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface CtaBannerProps {
  onOpenBrief: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenBrief }) => {
  const content = useContent();
  const global = content.global || {};

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[var(--bg-main)] via-[#FFF6E5]/40 to-[#F4A300]/15 dark:from-[var(--bg-main)] dark:via-[#271A13]/50 dark:to-[#3B2418]/30">
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-20"
      >
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#F4A300] via-[#84C57E] to-[#F7A8B8] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Unboxed Kicker */}
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#F4A300] mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>No Stale Code · Fresh Batch Booking Q2/Q3 2026</span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6 text-balance">
          Ready to Taste Success? Let’s Churn Your Next Project.
        </h2>

        <p className="max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
          Whether you need an MVP web application delivered in 4 weeks, an enterprise AI pipeline, or an
          Awwwards-worthy brand flagship, we serve it cold, stable, and fresh.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playChime();
              onOpenBrief();
            }}
            type="button"
            data-cursor="Order"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] rounded-2xl hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-xl shadow-[#1E1410]/15"
          >
            <span>Order Your Custom Scoop</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <a
            href={`https://wa.me/${(global.whatsapp || '15550192834').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(global.companyName || 'Kulfi Studio')},%20I'd%20like%20to%20discuss%20a%20new%20software%20project.`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="WhatsApp"
            onClick={() => sound.playPop()}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-[var(--text-primary)] rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-[#84C57E]" />
            <span>Chat via WhatsApp</span>
          </a>
        </div>

        {/* Guarantee notes */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--text-muted)]">
          <span>✓ Guaranteed Fixed Pricing</span>
          <span>✓ 30-Day Post-Launch Warranty</span>
          <span>✓ Zero Vendor Lock-in</span>
        </div>
      </div>
    </section>
  );
};
