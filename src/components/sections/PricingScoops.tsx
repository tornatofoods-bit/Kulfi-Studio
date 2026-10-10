import React, { useState } from 'react';
import { Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { PRICING_TIERS } from '../../data/content';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface PricingScoopsProps {
  onSelectPlanForBrief: (planName: string) => void;
}

export const PricingScoops: React.FC<PricingScoopsProps> = ({ onSelectPlanForBrief }) => {
  const content = useContent();
  const pricingData = content.pricing || {};
  const tiers = pricingData.tiers && pricingData.tiers.length > 0 ? pricingData.tiers : PRICING_TIERS;
  const [billingCycle, setBillingCycle] = useState<'project' | 'monthly'>('project');

  const toggleBilling = (mode: 'project' | 'monthly') => {
    sound.playPop();
    setBillingCycle(mode);
  };

  return (
    <section id="pricing" className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{pricingData.kicker || 'Transparent Scoop Pricing'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
              {pricingData.heading || 'Simple Scoops. No Hidden Calories.'}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {pricingData.description ||
                'Clear deliverables, fixed quotes, and guaranteed delivery timelines. Choose between flat project milestones or dedicated monthly continuous development.'}
            </p>
          </div>

          {/* Interactive Billing Mode Switcher (clean segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] rounded-xl self-start md:self-auto shadow-xs">
            <button
              onClick={() => toggleBilling('project')}
              type="button"
              data-cursor="Flat Project"
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                billingCycle === 'project'
                  ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Fixed Project Scope
            </button>
            <button
              onClick={() => toggleBilling('monthly')}
              type="button"
              data-cursor="Monthly Care"
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Monthly Retainer
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier: any) => {
            const price =
              billingCycle === 'project' ? tier.priceProject : tier.priceMonthlyRetainer;
            const period = billingCycle === 'project' ? 'one-time fee' : '/month';

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 sm:p-10 border bg-[var(--bg-surface)] flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? 'border-[#F4A300] shadow-lg shadow-[#F4A300]/10 scale-[1.02]'
                    : 'border-[var(--border-color)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-[#F4A300] text-[#1E1410] text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    Most Popular Scoop
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                      {tier.name}
                    </span>
                    <span className="text-xs font-mono text-[#84C57E]">
                      {tier.deliveryEstimate}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">
                    {tier.scoopTitle}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    {tier.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[var(--border-color)]">
                    <span className="font-display text-4xl sm:text-5xl font-bold text-[var(--text-primary)] tabular-nums">
                      {price}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{period}</span>
                  </div>

                  {/* Ideal For */}
                  <div className="text-xs font-mono text-[var(--text-secondary)] mb-6">
                    <strong className="text-[var(--text-primary)]">Ideal for:</strong> {tier.idealFor}
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Included Ingredients:
                    </div>
                    {tier.features?.map((feat: string) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                        <Check className="h-4 w-4 text-[#84C57E] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => {
                    sound.playChime();
                    onSelectPlanForBrief(tier.scoopTitle);
                  }}
                  type="button"
                  data-cursor="Select"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs ${
                    tier.popular
                      ? 'bg-[#F4A300] text-[#1E1410] hover:bg-[#FFB347]'
                      : 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410]'
                  }`}
                >
                  <span>Select {tier.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom enterprise callout */}
        <div className="mt-12 p-6 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
              Need a completely custom enterprise recipe?
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Custom multi-region microservices, legacy mainframe migration, and dedicated squad retainers.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onSelectPlanForBrief('Enterprise Bespoke');
            }}
            type="button"
            data-cursor="Custom"
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#F4A300] text-[var(--text-primary)] transition-colors shrink-0"
          >
            Request Custom Menu →
          </button>
        </div>
      </div>
    </section>
  );
};
