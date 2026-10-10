import React, { useState } from 'react';
import { ShieldCheck, Zap, Palette, HeartHandshake, Layers } from 'lucide-react';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

const LAYERS = [
  {
    id: 'layer-1',
    layerName: '01. Pure Ingredients',
    metaphor: 'The Cream & Saffron Base',
    valueName: 'Zero-Bloat Architecture',
    color: '#F4A300',
    description: 'We do not inject 50 unmaintained third-party libraries or fragile WordPress templates into your codebase. Every module is tailored in pure TypeScript, Next.js, and modern CSS for effortless lifetime maintenance.',
    icon: ShieldCheck,
    metric: '0 KB',
    metricLabel: 'Unnecessary template bloat'
  },
  {
    id: 'layer-2',
    layerName: '02. Sub-Zero Chilling',
    metaphor: 'Deep Freezing to -18°C',
    valueName: 'Speed & Edge Performance',
    color: '#84C57E',
    description: 'A slow digital product melts your conversion rate in seconds. We optimize asset payloads, utilize edge server caching, and rigorously enforce 95+ Lighthouse standards across every mobile and desktop viewport.',
    icon: Zap,
    metric: '42ms',
    metricLabel: 'Average edge TTFB latency'
  },
  {
    id: 'layer-3',
    layerName: '03. Artisanal Garnishing',
    metaphor: 'Crushed Nuts & Rose Petals',
    valueName: 'Aesthetic Distinctiveness',
    color: '#F7A8B8',
    description: 'We ban generic AI templates, cloned purple gradient buttons, and sterile UI cliches. Your software deserves bespoke typographic tension, fluid micro-interactions, and visual character that commands authority.',
    icon: Palette,
    metric: '100%',
    metricLabel: 'Custom tailored visual design'
  },
  {
    id: 'layer-4',
    layerName: '04. The Insulated Box',
    metaphor: 'Unmeltable Protection',
    valueName: 'Continuous SLA Care',
    color: '#FFB347',
    description: 'We do not drop code on your lap and disappear into the night. We provide proactive security audits, continuous dependency upgrades, automated database snapshots, and dedicated developer hotlines.',
    icon: HeartHandshake,
    metric: '99.99%',
    metricLabel: 'Guaranteed infrastructure uptime'
  }
];

export const AboutLayers: React.FC = () => {
  const content = useContent();
  const aboutData = content.about || {};
  const metrics = aboutData.metrics || [
    { value: '140+', label: 'Projects Served Fresh' },
    { value: '99.4%', label: 'Client Satisfaction Score' },
    { value: '8+ Yrs', label: 'Engineering Expertise' },
    { value: '18', label: 'Countries Worldwide' },
  ];
  const [activeLayer, setActiveLayer] = useState(0);

  const selectLayer = (idx: number) => {
    sound.playPop(500 + idx * 60);
    setActiveLayer(idx);
  };

  return (
    <section id="about" className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>{aboutData.kicker || 'Artisanal Engineering Philosophy'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance">
            {aboutData.heading || 'Slice Open Our Code. Here is What You Taste Inside.'}
          </h2>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            {aboutData.description ||
              'Just like authentic slow-churned kulfi, high-performance software requires patience, uncompromising ingredients, and seasoned technique. Explore the 4 layers that make our builds unmeltable.'}
          </p>
        </div>

        {/* Interactive Layer Slices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Slices Selector */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {LAYERS.map((layer, idx) => {
              const Icon = layer.icon;
              const isActive = activeLayer === idx;
              return (
                <button
                  key={layer.id}
                  onClick={() => selectLayer(idx)}
                  type="button"
                  data-cursor="Inspect"
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    isActive
                      ? 'bg-[var(--bg-surface)] border-[var(--kulfi-saffron)] shadow-md shadow-[#F4A300]/10 scale-[1.01]'
                      : 'bg-[var(--bg-surface-subtle)] border-[var(--border-color)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0"
                      style={{
                        backgroundColor: isActive ? `${layer.color}25` : 'rgba(0,0,0,0.04)',
                        color: layer.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[var(--text-muted)] block">
                        {layer.layerName}
                      </span>
                      <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                        {layer.valueName}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full transition-transform"
                    style={{
                      backgroundColor: layer.color,
                      transform: isActive ? 'scale(1.2)' : 'scale(0.8)',
                      opacity: isActive ? 1 : 0.4,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Layer Inspection Card */}
          <div className="lg:col-span-7 rounded-3xl p-8 sm:p-10 border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between relative overflow-hidden shadow-xs">
            {/* Visual Accent Glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: LAYERS[activeLayer].color }}
            />

            <div>
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-color)]">
                <span className="font-mono text-xs uppercase tracking-widest text-[#F4A300]">
                  {LAYERS[activeLayer].layerName}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Metaphor: {LAYERS[activeLayer].metaphor}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
                {LAYERS[activeLayer].valueName}
              </h3>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                {LAYERS[activeLayer].description}
              </p>
            </div>

            {/* Quantified Metric Badge */}
            <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
              <div>
                <div
                  className="font-display text-3xl sm:text-4xl font-bold tabular-nums"
                  style={{ color: LAYERS[activeLayer].color }}
                >
                  {LAYERS[activeLayer].metric}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  {LAYERS[activeLayer].metricLabel}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <span>Inspected & verified</span>
                <span className="text-[#84C57E]">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof & Quantitative Proof Counters */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[var(--border-color)]">
          {metrics.map((m: any, idx: number) => {
            const colors = ['text-[var(--text-primary)]', 'text-[#F4A300]', 'text-[#84C57E]', 'text-[var(--text-primary)]'];
            return (
              <div key={idx}>
                <div className={`font-display text-3xl sm:text-4xl font-bold ${colors[idx % colors.length]} tabular-nums`}>
                  {m.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mt-1">
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
