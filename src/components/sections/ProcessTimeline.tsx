import React, { useState } from 'react';
import { ChefHat, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/content';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

export const ProcessTimeline: React.FC = () => {
  const content = useContent();
  const processData = content.process || {};
  const steps = processData.steps && processData.steps.length > 0 ? processData.steps : PROCESS_STEPS;
  const [activeStep, setActiveStep] = useState(0);

  const selectStep = (idx: number) => {
    sound.playPop(480 + idx * 50);
    setActiveStep(idx);
  };

  const curr = steps[activeStep] || steps[0];

  return (
    <section id="process" className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
            <ChefHat className="h-3.5 w-3.5" />
            <span>{processData.kicker || 'The Culinary Engineering Pipeline'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
            {processData.heading || 'How We Serve: From Batter to Ice-Cold Launch.'}
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            {processData.description ||
              'No chaotic sprints, no guesswork, no forgotten edge-cases. Every project follows our 5-stage artisanal process to guarantee zero defects and blistering performance.'}
          </p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {steps.map((step: any, idx: number) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.number || idx}
                onClick={() => selectStep(idx)}
                type="button"
                data-cursor={`Step ${step.number || idx + 1}`}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                  isCurrent
                    ? 'bg-[var(--bg-surface)] border-[#F4A300] shadow-md shadow-[#F4A300]/10'
                    : 'bg-[var(--bg-surface-subtle)] border-[var(--border-color)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-xs font-bold ${isCurrent ? 'text-[#F4A300]' : 'text-[var(--text-muted)]'}`}>
                    STEP {step.number || idx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {step.duration}
                  </span>
                </div>
                <div className="font-display text-sm font-bold text-[var(--text-primary)] truncate">
                  {step.title}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                  {step.dessertMetaphor}
                </div>

                {isCurrent && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4A300]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Detail Text */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#F4A300] px-2.5 py-1 rounded-md bg-[#F4A300]/10">
                  Phase {curr.number}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Metaphor: {curr.dessertMetaphor}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                {curr.title}
              </h3>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                {curr.shortDesc}
              </p>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
                {curr.deepDive}
              </p>

              {/* Concrete Deliverable Box */}
              <div className="w-full p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#84C57E] shrink-0" />
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Guaranteed Milestone Deliverable
                    </div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {curr.deliverable}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block text-xs font-mono font-medium text-[var(--text-secondary)]">
                  {curr.duration}
                </div>
              </div>
            </div>

            {/* Right Visual Confectionery Metaphor Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#F4A300] via-[#FFB347] to-[#84C57E] flex items-center justify-center shadow-lg mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <div className="font-display text-xl font-bold text-[var(--text-primary)] text-center mb-2">
                {curr.dessertMetaphor}
              </div>

              <p className="text-xs text-[var(--text-secondary)] text-center max-w-xs leading-relaxed mb-6">
                Every line of code is structured and chilled to protect against technical rot and operational downtime.
              </p>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 w-full justify-between pt-4 border-t border-[var(--border-color)]">
                <button
                  disabled={activeStep === 0}
                  onClick={() => selectStep(activeStep - 1)}
                  type="button"
                  data-cursor="Prev"
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] disabled:opacity-30 disabled:pointer-events-none hover:bg-[var(--bg-surface-hover)] transition-colors"
                >
                  ← Previous
                </button>

                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {activeStep + 1} of {PROCESS_STEPS.length}
                </span>

                <button
                  disabled={activeStep === PROCESS_STEPS.length - 1}
                  onClick={() => selectStep(activeStep + 1)}
                  type="button"
                  data-cursor="Next"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] disabled:opacity-30 disabled:pointer-events-none rounded-xl hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
