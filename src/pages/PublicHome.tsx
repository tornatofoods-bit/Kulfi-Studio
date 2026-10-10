import React, { useState, useEffect } from 'react';
import { CustomCursor } from '../components/ui/CustomCursor';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import { Preloader } from '../components/sections/Preloader';
import { Navbar } from '../components/sections/Navbar';
import { Hero3D } from '../components/sections/Hero3D';
import { Marquee } from '../components/sections/Marquee';
import { AboutLayers } from '../components/sections/AboutLayers';
import { ServicesMenu } from '../components/sections/ServicesMenu';
import { ProcessTimeline } from '../components/sections/ProcessTimeline';
import { CaseStudies } from '../components/sections/CaseStudies';
import { TechSprinkles } from '../components/sections/TechSprinkles';
import { ComparisonSection } from '../components/sections/ComparisonSection';
import { PricingScoops } from '../components/sections/PricingScoops';
import { TestimonialsReceipts } from '../components/sections/TestimonialsReceipts';
import { BlogInsights } from '../components/sections/BlogInsights';
import { CtaBanner } from '../components/sections/CtaBanner';
import { ContactBrief } from '../components/sections/ContactBrief';
import { Footer } from '../components/sections/Footer';
import { subscribeToContentChanges, loadFullContent } from '../lib/contentStore';

// Modals
import { ProjectModal } from '../components/modals/ProjectModal';
import { ServiceModal } from '../components/modals/ServiceModal';
import { ArticleModal } from '../components/modals/ArticleModal';
import { LegalModal } from '../components/modals/LegalModal';

import { ProjectCaseStudy, ServiceItem, BlogPost } from '../types';

export const PublicHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [, setRevision] = useState(0);

  useEffect(() => {
    // Initial fetch
    loadFullContent();
    // Re-render when admin publishes or imports changes
    const unsub = subscribeToContentChanges(() => {
      setRevision((r) => r + 1);
    });
    return () => unsub();
  }, []);

  // Modal states
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Pre-selected fields for the contact brief
  const [briefService, setBriefService] = useState<string | undefined>(undefined);
  const [briefPlan, setBriefPlan] = useState<string | undefined>(undefined);

  const scrollToBrief = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBrief = (serviceName: string) => {
    setBriefService(serviceName);
    scrollToBrief();
  };

  const handleSelectPlanForBrief = (planName: string) => {
    setBriefPlan(planName);
    scrollToBrief();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] relative selection:bg-[#F4A300]/30 selection:text-[var(--text-primary)]">
      {/* 1. Tactile Noise Overlay */}
      <NoiseOverlay />

      {/* 2. Custom Dessert Cursor */}
      <CustomCursor />

      {/* 3. Kulfi Filling Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 4. Sticky Glassmorphism Header */}
      <Navbar onOpenBrief={scrollToBrief} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with 3D Kulfi on a Stick & WebGL Liquid Atmosphere */}
        <Hero3D onOpenBrief={scrollToBrief} />

        {/* Client Logos Infinite Marquee */}
        <Marquee />

        {/* About: Kulfi Slice Layers & Quantitative Proof */}
        <AboutLayers />

        {/* Services Menu: Hand-churned Digital Capabilities */}
        <ServicesMenu
          onSelectServiceForBrief={handleSelectServiceForBrief}
          onOpenServiceModal={(service) => setSelectedService(service)}
        />

        {/* Culinary Process: 5-Step Pipeline */}
        <ProcessTimeline />

        {/* Portfolio & Case Studies: Fresh Scoops with Audited Metrics */}
        <CaseStudies
          onOpenProjectModal={(project) => setSelectedProject(project)}
        />

        {/* Technologies: Sprinkles & Modern Stack with Scatter Physics */}
        <TechSprinkles />

        {/* Side-by-Side Reality Check: Stale Melted Code vs Chilled Craft */}
        <ComparisonSection />

        {/* Pricing: Transparent Scoops Menu */}
        <PricingScoops
          onSelectPlanForBrief={handleSelectPlanForBrief}
        />

        {/* Testimonials: Confectionery Receipt Tickets */}
        <TestimonialsReceipts />

        {/* Blog & Thought Leadership: Cold Takes & Recipes */}
        <BlogInsights
          onOpenArticle={(post) => setSelectedArticle(post)}
        />

        {/* CTA Banner: Ready to Taste Success? */}
        <CtaBanner onOpenBrief={scrollToBrief} />

        {/* Interactive Multi-step Project Brief Form */}
        <ContactBrief
          initialService={briefService}
          initialPlan={briefPlan}
        />
      </main>

      {/* Footer with Dripping Wave & Kulfi Back-to-Top Button */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectForBrief={handleSelectServiceForBrief}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelectForBrief={handleSelectServiceForBrief}
      />

      <ArticleModal
        post={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
