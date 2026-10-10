import React, { useState } from 'react';
import { ArrowUpRight, Award, ExternalLink, Filter } from 'lucide-react';
import { CASE_STUDIES } from '../../data/content';
import { ProjectCaseStudy } from '../../types';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface CaseStudiesProps {
  onOpenProjectModal: (project: ProjectCaseStudy) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onOpenProjectModal }) => {
  const content = useContent();
  const projectsData = content.projects || {};
  const allProjects: ProjectCaseStudy[] = projectsData.items && projectsData.items.length > 0 ? projectsData.items : CASE_STUDIES;

  const [filter, setFilter] = useState<'all' | 'web' | 'mobile' | 'ai' | 'ecommerce'>('all');

  const filteredProjects =
    filter === 'all'
      ? allProjects
      : allProjects.filter((p) => p.category === filter);

  const filterTabs: { id: 'all' | 'web' | 'mobile' | 'ai' | 'ecommerce'; label: string }[] = [
    { id: 'all', label: 'All Scoops' },
    { id: 'web', label: 'Web Platforms' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Systems' },
    { id: 'ecommerce', label: 'E-Commerce' },
  ];

  return (
    <section id="work" className="py-24 border-b border-[var(--border-color)] bg-[var(--bg-surface-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Award className="h-3.5 w-3.5" />
              <span>{projectsData.kicker || 'Proven Confectionery Case Studies'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
              {projectsData.heading || 'Recent Cold Scoops Served to Market.'}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
              {projectsData.description ||
                'Real projects, audited metrics, and transformative business outcomes. We do not build digital toys; we engineer revenue-generating systems.'}
            </p>
          </div>

          {/* Interactive Filter Controls (Segmented bar allowed per zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-xs self-start md:self-auto">
            <Filter className="h-3.5 w-3.5 text-[var(--text-muted)] ml-2 mr-1 hidden sm:block" />
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setFilter(tab.id);
                }}
                type="button"
                data-cursor={tab.label}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filter === tab.id
                    ? 'bg-[#1E1410] text-white dark:bg-[#FFFDF8] dark:text-[#1E1410] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                sound.playPop(550);
                onOpenProjectModal(project);
              }}
              data-cursor="Inspect"
              className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 sm:p-10 transition-all duration-300 hover:border-[#F4A300] hover:shadow-xl hover:shadow-[#3B2418]/5 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Top Ribbon */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  {/* Clean unboxed metadata with dot separator per design rules */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <span className="text-[#F4A300] font-semibold">{project.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.flavorTag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.duration}</span>
                  </div>

                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#F4A300] transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                  {project.summary}
                </p>

                {/* 3 Impact Proof Metrics */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] mb-8">
                  {project.impactMetrics.map((m) => (
                    <div key={m.label} className="text-center sm:text-left">
                      <div className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] tabular-nums text-[#F4A300]">
                        {m.value}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5 leading-tight">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Tech Ingredients & CTA */}
              <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  {project.technologies.slice(0, 4).map((tech, tIdx) => (
                    <React.Fragment key={tech}>
                      <span>{tech}</span>
                      {tIdx < 3 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] group-hover:text-[#F4A300] transition-colors">
                  <span>View Case Study</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
