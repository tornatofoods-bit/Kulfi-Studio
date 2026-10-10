import React, { useState } from 'react';
import { Star, CheckCircle, Receipt, ArrowLeft, ArrowRight } from 'lucide-react';
import { TESTIMONIALS } from '../../data/content';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

export const TestimonialsReceipts: React.FC = () => {
  const content = useContent();
  const testData = content.testimonials || {};
  const items = testData.items && testData.items.length > 0 ? testData.items : TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    sound.playPop();
    setCurrentIndex((c) => (c === 0 ? items.length - 1 : c - 1));
  };

  const next = () => {
    sound.playPop();
    setCurrentIndex((c) => (c === items.length - 1 ? 0 : c + 1));
  };

  return (
    <section className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Receipt className="h-3.5 w-3.5" />
              <span>{testData.kicker || 'Verified Confectionery Receipts'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
              {testData.heading || 'Customer Receipts from the Kulfi Counter.'}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {testData.description ||
                'Every card below is a real order receipt from founders and CTOs who trusted us to build their flagship digital products.'}
            </p>
          </div>

          {/* Navigation arrows for receipts */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              type="button"
              data-cursor="Prev"
              aria-label="Previous testimonial receipt"
              className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#F4A300] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              type="button"
              data-cursor="Next"
              aria-label="Next testimonial receipt"
              className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#F4A300] transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dessert Receipt Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => {
            const isFeatured = idx === currentIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sound.playPop(520 + idx * 30);
                  setCurrentIndex(idx);
                }}
                data-cursor="Receipt"
                className={`relative rounded-3xl p-6 sm:p-7 border bg-[var(--bg-surface)] flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xs ${
                  isFeatured
                    ? 'border-[#F4A300] shadow-xl shadow-[#3B2418]/6 -translate-y-1'
                    : 'border-[var(--border-color)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Receipt Perforated Top Edge SVG */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-[var(--border-strong)]">
                  <span className="font-mono text-xs font-bold text-[#F4A300]">
                    {item.receiptNumber}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#84C57E]">
                    <CheckCircle className="h-3 w-3" />
                    <span>SERVED & VERIFIED</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#F4A300]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>

                {/* Flavor Ordered */}
                <div className="text-[11px] font-mono text-[var(--text-muted)] mb-3">
                  <strong>Flavour:</strong> {item.flavorOrdered}
                </div>

                {/* Review Text */}
                <blockquote className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic mb-6">
                  "{item.reviewText}"
                </blockquote>

                {/* Receipt Footer: Client Signature Details */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <div className="font-display text-sm font-bold text-[var(--text-primary)]">
                      {item.clientName}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {item.clientRole}, {item.clientCompany}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {item.dateServed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
