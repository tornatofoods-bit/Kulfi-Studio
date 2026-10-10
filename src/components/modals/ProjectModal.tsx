import React from 'react';
import { X, CheckCircle2, ArrowUpRight, Clock, Award } from 'lucide-react';
import { ProjectCaseStudy } from '../../types';
import { sound } from '../../lib/audio';

interface ProjectModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
  onSelectForBrief: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectForBrief,
}) => {
  if (!project) return null;

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
      <div className="relative w-full max-w-3xl rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
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
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-2">
            <span className="text-[#F4A300] font-semibold">{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>Client: {project.client}</span>
            <span aria-hidden="true">·</span>
            <span>Flavor: {project.flavorTag}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {project.title}
          </h2>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] mb-8">
          {project.impactMetrics.map((m) => (
            <div key={m.label} className="text-center sm:text-left">
              <div className="font-display text-xl sm:text-2xl font-bold text-[#F4A300] tabular-nums">
                {m.value}
              </div>
              <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                {m.label}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                {m.context}
              </div>
            </div>
          ))}
        </div>

        {/* Problem vs Solution */}
        <div className="space-y-6 mb-8">
          <div>
            <h4 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
              The Challenge
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-[var(--text-primary)] mb-2">
              Our Artisanal Solution
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="pt-6 border-t border-[var(--border-color)] mb-8">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Ingredients & Technologies Used:
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <Clock className="h-3.5 w-3.5" />
            <span>Turnaround Time: {project.duration}</span>
          </div>

          <button
            onClick={() => {
              sound.playChime();
              onClose();
              onSelectForBrief(`Case Study: ${project.title}`);
            }}
            type="button"
            data-cursor="Order Similar"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-sm"
          >
            <span>Order a Similar Solution</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
