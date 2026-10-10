// Flat-File Content Management Engine (100% Free - No External Database)
import { useState, useEffect } from 'react';
import {
  FLAVORS,
  SERVICES,
  PROCESS_STEPS,
  CASE_STUDIES,
  COMPARISON_ITEMS,
  PRICING_TIERS,
  TESTIMONIALS,
  BLOG_POSTS,
  TECH_SPRINKLES,
} from '../data/content';

export const DEFAULT_CONTENT: Record<string, any> = {
  global: {
    companyName: 'Kulfi Studio',
    tagline: 'We Serve Software, Cold & Fresh.',
    contactEmail: 'orders@kulfistudio.dev',
    phone: '+1 (555) 019-KULFI',
    whatsapp: '+15550192834',
    address: 'San Francisco · London · Mumbai',
    workingHours: 'Mon – Fri · 9:00 AM – 7:00 PM EST',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'LinkedIn', url: 'https://linkedin.com' },
    ],
  },
  hero: {
    kicker: 'Artisanal Engineering · Web & Cloud Systems · 99.4% Client Satisfaction',
    headline: 'We Serve Software, Cold & Fresh.',
    subheadline:
      'We engineer custom web platforms, mobile applications, cloud architectures, and AI automation systems. Every project is crafted, chilled, and served with sub-400ms speed and zero template bloat.',
    primaryCtaText: 'Order a Project',
    secondaryCtaText: 'Explore Flavour Menu',
    scrollText: 'Scroll To Digest',
    flavors: FLAVORS,
    threeSettings: {
      autoRotateSpeed: 0.35,
      tiltIntensity: 0.6,
      sprinklesCount: 75,
      floatingParticles: 90,
      enableMouseReaction: true,
    },
  },
  about: {
    kicker: 'Artisanal Engineering Philosophy',
    heading: 'Slice Open Our Code. Here is What You Taste Inside.',
    description:
      'Just like authentic slow-churned kulfi, high-performance software requires patience, uncompromising ingredients, and seasoned technique. Explore the 4 layers that make our builds unmeltable.',
    metrics: [
      { value: '140+', label: 'Projects Served Fresh' },
      { value: '99.4%', label: 'Client Satisfaction Score' },
      { value: '8+ Yrs', label: 'Engineering Expertise' },
      { value: '18', label: 'Countries Worldwide' },
    ],
  },
  services: {
    kicker: 'The Artisanal Flavour Menu',
    heading: 'Hand-Churned Digital Capabilities.',
    description:
      'Every service is whipped from raw ingredients: zero pre-packaged templates, zero technical debt. Choose a flavor that matches your next high-impact initiative.',
    items: SERVICES,
  },
  process: {
    kicker: 'The Culinary Engineering Pipeline',
    heading: 'How We Serve: From Batter to Ice-Cold Launch.',
    description:
      'No chaotic sprints, no guesswork, no forgotten edge-cases. Every project follows our 5-stage artisanal process to guarantee zero defects and blistering performance.',
    steps: PROCESS_STEPS,
  },
  projects: {
    kicker: 'Proven Confectionery Case Studies',
    heading: 'Recent Cold Scoops Served to Market.',
    description:
      'Real projects, audited metrics, and transformative business outcomes. We do not build digital toys; we engineer revenue-generating systems.',
    items: CASE_STUDIES,
  },
  technologies: {
    kicker: 'Modern Stack & Ingredients',
    heading: 'The Sprinkles on Top: Cutting-Edge Tech.',
    description:
      'We build strictly with battle-tested, modern technologies. No legacy baggage, no deprecated libraries. Move cursor over ingredients or scatter the sprinkles.',
    items: TECH_SPRINKLES,
  },
  comparison: {
    kicker: 'Side-by-Side Reality Check',
    heading: 'Stale Melted Code vs. Chilled Artisanal Perfection.',
    description:
      'Most digital agencies sell pre-packaged WordPress themes and bill you for bloated hours. Here is why high-growth brands choose our fresh culinary approach.',
    items: COMPARISON_ITEMS,
  },
  pricing: {
    kicker: 'Transparent Scoop Pricing',
    heading: 'Simple Scoops. No Hidden Calories.',
    description:
      'Clear deliverables, fixed quotes, and guaranteed delivery timelines. Choose between flat project milestones or dedicated monthly continuous development.',
    tiers: PRICING_TIERS,
  },
  testimonials: {
    kicker: 'Verified Confectionery Receipts',
    heading: 'Customer Receipts from the Kulfi Counter.',
    description:
      'Every card below is a real order receipt from founders and CTOs who trusted us to build their flagship digital products.',
    items: TESTIMONIALS,
  },
  blog: {
    kicker: 'The Kulfi Journal',
    heading: 'Cold Takes & Engineering Recipes.',
    description:
      'Observations, architectural post-mortems, and design philosophies straight from our production kitchen.',
    posts: BLOG_POSTS,
  },
};

const STORAGE_KEY_PUBLISHED = 'kulfi_published_content';
const STORAGE_KEY_DRAFT = 'kulfi_draft_content';
const STORAGE_KEY_LEADS = 'kulfi_leads';
const STORAGE_KEY_LOGS = 'kulfi_activity_logs';

export interface FullContentSchema {
  version: number;
  lastPublished: string;
  publishedBy: string;
  global: Record<string, any>;
  hero: Record<string, any>;
  about: Record<string, any>;
  services: {
    kicker: string;
    heading: string;
    description: string;
    items: any[];
  };
  process: {
    kicker: string;
    heading: string;
    description: string;
    steps: any[];
  };
  projects: {
    kicker: string;
    heading: string;
    description: string;
    items: any[];
  };
  technologies: {
    kicker: string;
    heading: string;
    description: string;
    items: any[];
  };
  comparison: {
    kicker: string;
    heading: string;
    description: string;
    items: any[];
  };
  pricing: {
    kicker: string;
    heading: string;
    description: string;
    tiers: any[];
  };
  testimonials: {
    kicker: string;
    heading: string;
    description: string;
    items: any[];
  };
  blog: {
    kicker: string;
    heading: string;
    description: string;
    posts: any[];
  };
  leads?: any[];
  activity_logs?: any[];
  admins?: any[];
}

let inMemoryCache: FullContentSchema = (DEFAULT_CONTENT as FullContentSchema);
const listeners: Set<() => void> = new Set();

export function subscribeToContentChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn(e);
    }
  });
}

// React Hook to consume live reactive content from flat-file content.json
export function useContent(): FullContentSchema {
  const [content, setContent] = useState<FullContentSchema>(() => inMemoryCache || (DEFAULT_CONTENT as FullContentSchema));

  useEffect(() => {
    let active = true;
    loadFullContent().then((loaded) => {
      if (active && loaded && loaded.hero) {
        setContent(loaded);
      }
    });

    const unsubscribe = subscribeToContentChanges(() => {
      if (active) {
        loadFullContent().then((updated) => {
          if (active && updated && updated.hero) {
            setContent({ ...updated });
          }
        });
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return content;
}

// Load full content from local storage or /data/content.json
export async function loadFullContent(forceFetch = false): Promise<FullContentSchema> {
  if (inMemoryCache && !forceFetch && inMemoryCache.hero) {
    return inMemoryCache;
  }

  // 1. Check browser LocalStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEY_PUBLISHED);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.hero && parsed.services) {
          inMemoryCache = parsed;
          return parsed;
        }
      } catch (err) {
        console.warn('Could not parse cached content.json:', err);
      }
    }
  }

  // 2. Fetch /data/content.json
  try {
    const res = await fetch('/data/content.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.hero && data.services) {
        inMemoryCache = data;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch /data/content.json:', err);
  }

  // 3. Fallback to default content structure
  inMemoryCache = (DEFAULT_CONTENT as FullContentSchema);
  return inMemoryCache;
}

// Fetch single section content (draft or published)
export async function getSectionContent(sectionId: string, preferDraft = false): Promise<any> {
  if (preferDraft && typeof window !== 'undefined') {
    const draftJson = localStorage.getItem(`${STORAGE_KEY_DRAFT}_${sectionId}`);
    if (draftJson) {
      try {
        return JSON.parse(draftJson);
      } catch {}
    }
  }

  const all = await loadFullContent();
  return (all as any)[sectionId] || null;
}

// Save draft section in local browser storage
export async function saveDraftContent(
  sectionId: string,
  draftData: any,
  userEmail: string
): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_DRAFT}_${sectionId}`, JSON.stringify(draftData));
  }
  await logActivity('saved_draft', userEmail, `Saved draft changes for ${sectionId}`);
  notifyListeners();
}

// Publish section content to live site & try persisting to disk via API
export async function publishSectionContent(
  sectionId: string,
  dataToPublish: any,
  userEmail: string
): Promise<void> {
  const current = await loadFullContent(true);
  const updated: FullContentSchema = {
    ...current,
    [sectionId]: dataToPublish,
    version: (current.version || 1) + 1,
    lastPublished: new Date().toISOString(),
    publishedBy: userEmail,
  };

  inMemoryCache = updated;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(updated));
    localStorage.removeItem(`${STORAGE_KEY_DRAFT}_${sectionId}`);
  }

  // Attempt to write to flat-file PHP or Node endpoint if available
  try {
    await fetch('/api/content.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  } catch (err) {
    // Expected in pure static export mode (Netlify / GitHub Pages)
  }

  await logActivity(
    'published_section',
    userEmail,
    `Published version ${updated.version} of section "${sectionId}"`
  );
  notifyListeners();
}

// Download current content.json directly from browser
export function downloadContentJson(): void {
  const current = inMemoryCache || {};
  const jsonStr = JSON.stringify(current, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import external content.json file
export async function importContentJson(jsonString: string, userEmail: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.hero || !parsed.services) {
      throw new Error('Invalid content.json structure');
    }

    inMemoryCache = parsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(parsed));
    }

    try {
      await fetch('/api/content.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
    } catch {}

    await logActivity('imported_content', userEmail, 'Imported external content.json backup');
    notifyListeners();
    return true;
  } catch (err) {
    console.error('Failed to import JSON content:', err);
    return false;
  }
}

// Reset all sections back to original static content.json
export async function resetAllToDefaults(userEmail: string): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_PUBLISHED);
  }
  inMemoryCache = (DEFAULT_CONTENT as FullContentSchema);
  const fresh = await loadFullContent(true);
  await logActivity('reset_defaults', userEmail, 'Reset all website sections to factory defaults');
  notifyListeners();
}

// Lead Management (Flat-File / Local Storage)
export function getStoredLeads(): any[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_LEADS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return [];
}

export async function fetchStoredLeads(): Promise<any[]> {
  let localLeads = getStoredLeads();
  try {
    const res = await fetch('/api/leads.php');
    if (res.ok) {
      const serverLeads = await res.json();
      if (Array.isArray(serverLeads) && serverLeads.length > 0) {
        // Merge without duplicates by ID
        const map = new Map<string, any>();
        serverLeads.forEach((l) => map.set(l.id, l));
        localLeads.forEach((l) => {
          if (!map.has(l.id)) map.set(l.id, l);
        });
        const merged = Array.from(map.values());
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(merged));
        }
        return merged;
      }
    }
  } catch {}
  return localLeads;
}

export async function submitContactLead(lead: {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  honeypot?: string;
}): Promise<boolean> {
  if (lead.honeypot && lead.honeypot.trim().length > 0) {
    return true; // silently drop spam
  }

  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...lead,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const current = getStoredLeads();
    current.unshift(newLead);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(current));
  }

  // Attempt to submit to PHP endpoint if hosted on Apache/Nginx
  try {
    await fetch('/api/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    });
  } catch {}

  return true;
}

export function updateStoredLeadStatus(leadId: string, status: string): void {
  if (typeof window !== 'undefined') {
    const current = getStoredLeads();
    const updated = current.map((l) => (l.id === leadId ? { ...l, status } : l));
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  }
}

export function deleteStoredLead(leadId: string): void {
  if (typeof window !== 'undefined') {
    const current = getStoredLeads();
    const updated = current.filter((l) => l.id !== leadId);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  }
}

// Activity Logging
export async function logActivity(action: string, userEmail: string, details: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_LOGS);
    let logs = [];
    if (stored) {
      try {
        logs = JSON.parse(stored);
      } catch {}
    }

    logs.unshift({
      id: `log_${Date.now()}`,
      action,
      userEmail,
      details,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 100)));
  }
}

export function getStoredActivityLogs(): any[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_LOGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return [];
}
