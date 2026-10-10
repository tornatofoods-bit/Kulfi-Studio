import React from 'react';
import { X, CheckCircle2, ArrowUpRight, Clock, DollarSign } from 'lucide-react';
import { ServiceItem } from '../../types';
import { sound } from '../../lib/audio';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectForBrief: (serviceName: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onSelectForBrief,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          sound.playPop();
          onClose();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          type="button"
          data-cursor="Close"
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#F4A300] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: service.badgeColor }}
            />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              {service.flavorTitle}
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {service.name}
          </h2>
        </div>

        <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
          {service.fullDesc}
        </p>

        {/* Deliverables Checklist */}
        <div className="mb-8">
          <h4 className="font-display text-base font-bold text-[var(--text-primary)] mb-3">
            Guaranteed Recipe Deliverables
          </h4>
          <div className="space-y-2.5">
            {service.deliverables.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: service.badgeColor }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8 pt-6 border-t border-[var(--border-color)]">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Primary Technologies:
          </h4>
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-[#F4A300]" />
              <span>Starts at <strong className="text-[var(--text-primary)]">{service.startingPrice}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[var(--text-muted)]" />
              <span>{service.turnaround}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playChime();
              onClose();
              onSelectForBrief(service.name);
            }}
            type="button"
            data-cursor="Order"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-sm"
          >
            <span>Order This Flavour</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
