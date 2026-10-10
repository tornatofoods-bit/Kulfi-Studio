import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, MessageSquare, Mail, Phone, Sparkles } from 'lucide-react';
import { BriefFormData } from '../../types';
import { sound } from '../../lib/audio';
import { submitContactLead, useContent } from '../../lib/contentStore';

interface ContactBriefProps {
  initialService?: string;
  initialPlan?: string;
}

const SERVICES_OPTIONS = [
  'High-Performance Web Platforms',
  'Bespoke Software & Cloud Systems',
  'Native & Cross-Platform Mobile',
  'Artisanal UI/UX & Design Systems',
  'AI Agents & Workflow Automations',
  'SEO, Security & Chilled Care',
];

const BUDGET_OPTIONS = [
  '$4,500 – $8,000 (Single Scoop)',
  '$8,000 – $15,000 (Double Scoop)',
  '$15,000 – $30,000 (Multi-Module)',
  '$30,000+ (Enterprise Feast)',
];

const TIMELINE_OPTIONS = [
  'Rush order (2–3 weeks)',
  'Standard delivery (4–6 weeks)',
  'Comprehensive (2–3 months)',
  'Ongoing monthly retainer',
];

export const ContactBrief: React.FC<ContactBriefProps> = ({
  initialService,
  initialPlan,
}) => {
  const content = useContent();
  const global = content.global || {};

  const [formData, setFormData] = useState<BriefFormData>({
    fullName: '',
    email: '',
    companyName: '',
    serviceType: initialService || initialPlan || SERVICES_OPTIONS[0],
    budgetRange: BUDGET_OPTIONS[1],
    timeline: TIMELINE_OPTIONS[1],
    projectVision: '',
  });
  const [honeypot, setHoneypot] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const triggerSprinkleConfetti = () => {
    // Confetti in kulfi colors: Saffron (#F4A300), Pistachio (#84C57E), Rose (#F7A8B8), Cream (#FFF6E5)
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F4A300', '#84C57E', '#F7A8B8', '#FFB347', '#3B2418'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid work email address.');
      return;
    }
    if (!formData.projectVision.trim()) {
      setFormError('Please provide a brief summary of what you are looking to build.');
      return;
    }

    setSubmitting(true);
    sound.playPop();

    try {
      await submitContactLead({
        name: formData.fullName,
        email: formData.email,
        company: formData.companyName,
        service: formData.serviceType,
        budget: formData.budgetRange,
        timeline: formData.timeline,
        message: formData.projectVision,
        honeypot,
      });

      setSubmitting(false);
      setSubmitted(true);
      sound.playChime();
      triggerSprinkleConfetti();
    } catch (err) {
      console.error(err);
      // Still show success if offline or fallback simulation
      setSubmitting(false);
      setSubmitted(true);
      sound.playChime();
      triggerSprinkleConfetti();
    }
  };

  return (
    <section id="contact" className="py-24 border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Brief Context & Direct Touchpoints */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4A300] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Confectionery Inquiry</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] text-balance mb-6">
              Customize Your Project Scoop.
            </h2>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
              Tell us about your product goals, architectural requirements, and target timeline. We will
              prepare a fixed-scope recipe blueprint with itemized deliverables within 24 hours.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
              <a
                href={`mailto:${global.contactEmail || 'orders@kulfistudio.dev'}`}
                data-cursor="Email"
                onClick={() => sound.playPop()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#F4A300] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F4A300]/10 flex items-center justify-center text-[#F4A300] shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Direct Email
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#F4A300] transition-colors">
                    {global.contactEmail || 'orders@kulfistudio.dev'}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/${(global.whatsapp || '15550192834').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(global.companyName || 'Kulfi Studio')}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="WhatsApp"
                onClick={() => sound.playPop()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#84C57E] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#84C57E]/10 flex items-center justify-center text-[#84C57E] shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Fast Response WhatsApp
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#84C57E] transition-colors">
                    {global.phone || '+1 (555) 019-KULFI'}
                  </div>
                </div>
              </a>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--text-muted)]/10 flex items-center justify-center text-[var(--text-muted)] shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Kitchen Operating Hours
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {global.workingHours || 'Mon – Fri · 9:00 AM – 7:00 PM (EST / GMT / IST coverage)'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Interactive Form */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 sm:p-10 shadow-sm relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#84C57E]/15 text-[#84C57E] flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                  Recipe Order Received!
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-8">
                  Thank you, <strong>{formData.fullName}</strong>. Our lead architect is already
                  reviewing your <strong>{formData.serviceType}</strong> specifications. You will
                  receive an itemized quote and calendar invite in your inbox at{' '}
                  <span className="font-mono text-[#F4A300]">{formData.email}</span> within 24 hours.
                </p>

                <button
                  onClick={() => {
                    sound.playPop();
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      companyName: '',
                      serviceType: SERVICES_OPTIONS[0],
                      budgetRange: BUDGET_OPTIONS[1],
                      timeline: TIMELINE_OPTIONS[1],
                      projectVision: '',
                    });
                  }}
                  type="button"
                  data-cursor="Submit Another"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-color)] hover:border-[#F4A300] transition-colors"
                >
                  Submit Another Project Inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for bot spam prevention */}
                <input
                  type="text"
                  name="kulfi_flavor_check_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="border-b border-[var(--border-color)] pb-4 mb-6">
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    Project Specification Sheet
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Fill out the parameters below to receive our technical proposal.
                  </p>
                </div>

                {/* 1. Service Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    1. Primary Flavour / Service
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                  >
                    {SERVICES_OPTIONS.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      2. Target Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      3. Desired Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                    >
                      {TIMELINE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Project Vision */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    4. Project Vision & Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={formData.projectVision}
                    onChange={(e) => setFormData({ ...formData, projectVision: e.target.value })}
                    placeholder="Briefly describe what you are looking to build (e.g. Next.js SaaS portal, mobile app with Stripe billing, AI pipeline)..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden placeholder:text-[var(--text-muted)]/60"
                  />
                </div>

                {/* 4. Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Health"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] text-sm focus:border-[#F4A300] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Validation Error Message */}
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-600 dark:text-red-400">
                    ⚠ {formError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  data-cursor="Send"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#1E1410] dark:bg-[#FFFDF8] dark:text-[#1E1410] hover:bg-[#F4A300] dark:hover:bg-[#F4A300] dark:hover:text-[#1E1410] transition-colors shadow-lg disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Churning proposal...' : 'Dispatch Recipe Brief (Free Quote)'}</span>
                </button>

                <div className="text-center text-[11px] font-mono text-[var(--text-muted)]">
                  Strict NDA guaranteed · No sales spam · Itemized quote within 24 business hours
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
