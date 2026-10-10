import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowUp, Github, Twitter, Linkedin, Heart, Sparkles } from 'lucide-react';
import { sound } from '../../lib/audio';
import { useContent } from '../../lib/contentStore';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const content = useContent();
  const global = content.global || {};
  const [easterEggCount, setEasterEggCount] = useState(0);

  const scrollToTop = () => {
    sound.playPop(700);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEasterEggClick = () => {
    sound.playChime();
    setEasterEggCount((c) => c + 1);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.9 },
      colors: ['#F4A300', '#84C57E', '#F7A8B8', '#D4A373'],
    });
  };

  return (
    <footer className="relative bg-[#1E1410] text-[#FFFDF8] pt-16 pb-12 overflow-hidden selection:bg-[#F4A300] selection:text-[#1E1410]">
      {/* Dripping Wave SVG Edge along the top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none -translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-[#1E1410] fill-current"
        >
          <path d="M0,0 C150,90 250,-40 400,60 C550,150 650,20 800,70 C950,120 1050,-10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div
                onClick={handleEasterEggClick}
                data-cursor="Sprinkle Pop!"
                title="Click for surprise sprinkles!"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4A300] via-[#FFB347] to-[#84C57E] flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform shadow-md"
              >
                <div className="w-3 h-5 bg-white/95 rounded-t-full rounded-b-xs" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                {global.companyName || 'Kulfi Studio'}
              </span>
            </div>

            <p className="text-sm text-[#D4C3B7] max-w-sm leading-relaxed mb-6">
              {global.tagline ||
                'We serve software, cold and fresh. Award-winning custom web development, mobile apps, UI/UX design, and AI automation crafted with artisanal precision.'}
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="GitHub"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-[#D4C3B7] hover:text-[#F4A300] hover:border-[#F4A300] transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="Twitter"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-[#D4C3B7] hover:text-[#F4A300] hover:border-[#F4A300] transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="LinkedIn"
                className="w-9 h-9 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-[#D4C3B7] hover:text-[#F4A300] hover:border-[#F4A300] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>

            {easterEggCount > 0 && (
              <div className="mt-4 text-[11px] font-mono text-[#F4A300] flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Sprinkle batches exploded: {easterEggCount}</span>
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F4A300] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4C3B7]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Flavour Menu
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  Culinary Process
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  Stale vs Cold
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Scoop Pricing
                </a>
              </li>
              <li>
                <a href="#insights" className="hover:text-white transition-colors">
                  Cold Takes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Flavours / Services */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#84C57E] mb-4">
              Flavours
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D4C3B7]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Alphonso Web Platforms
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Belgian Cloud Systems
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Pistachio Mobile Apps
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Velvet Rose UI/UX
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Royal Kesar AI Agents
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Cardamom Retainers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F7A8B8] mb-4">
              Headquarters
            </h4>
            <div className="space-y-2 text-xs text-[#D4C3B7]">
              <p>{global.address || 'San Francisco · London · Mumbai'}</p>
              <p className="pt-2 font-mono text-[#F4A300]">
                {global.contactEmail || 'orders@kulfistudio.dev'}
              </p>
              <p className="font-mono">{global.phone || '+1 (555) 019-KULFI'}</p>
              <p className="text-[11px] text-[#A8988D]">{global.workingHours || 'Mon – Fri · 9:00 AM – 7:00 PM EST'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E7A6E]">
          <div>
            © {new Date().getFullYear()} {global.companyName || 'Kulfi Studio'}. All rights reserved. Chilled to perfection.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              type="button"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              type="button"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <a
              href="/admin"
              className="text-[#F4A300] hover:underline transition-colors font-mono"
            >
              Admin Portal
            </a>
          </div>

          {/* Kulfi Stick Shaped Back to Top Button */}
          <button
            onClick={scrollToTop}
            type="button"
            data-cursor="Top"
            aria-label="Scroll back to top"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-[#F4A300] hover:text-[#1E1410] hover:border-[#F4A300] text-[#FFFDF8] font-mono text-xs transition-colors"
          >
            <div className="w-1.5 h-3 bg-[#D4A373] rounded-xs" />
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
