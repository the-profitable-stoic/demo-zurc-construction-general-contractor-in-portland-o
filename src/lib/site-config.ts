// TypeScript interface for the site configuration JSON
// Written by the worker's site-assembler step before astro build

export interface SiteConfig {
  business: {
    name: string;
    phone: string;
    category: string;
    city: string;
    state: string;
  };
  design: {
    preset: {
      id: string;
      categoryGroup: string;
      name: string;
      recipeFile: string;
      colors: Record<string, string>;
      typography: Record<string, string>;
      shape: Record<string, string>;
      sections: {
        heroStyle: string;
        sectionAlternation: string[];
        animationStyle: string;
        spacingScale: string;
      };
    };
    recipeId: string;
  };
  content: {
    homepage: {
      heroHeadline: string;
      heroSubline: string;
      aboutTitle: string;
      aboutText: string[];
      valueProps: Array<{ title: string; description: string; icon?: string }>;
      ctaHeadline: string;
      ctaSubline: string;
    };
    services: Array<{
      slug: string;
      name: string;
      shortDescription: string;
      description: string;
      process: string[];
      benefits: string[];
      faq: Array<{ question: string; answer: string }>;
    }>;
    serviceAreas: Array<{
      city: string;
      slug: string;
      state: string;
      content: string;
      localContext: string;
      nearbyAreas: string[];
    }>;
    reviews: Array<{
      name: string;
      rating: number;
      service: string;
      text: string;
      date: string;
    }>;
    seo: Record<string, { title: string; description: string; ogTitle?: string; ogDescription?: string }>;
    companyInfo: {
      yearsInBusiness: number;
      projectsCompleted: string;
      satisfaction: string;
      teamSize: string;
    };
  };
  images: {
    hero: string;
    about: string;
    services: Record<string, string>;
    gallery: string[];
  };
}

// Load site config — available at build time
import configData from "../site-config.json";
export const siteConfig = configData as SiteConfig;

// Helper: check if an effect is active for this build


// Helper: get the variant for a section component


// Helper: check if current color strategy matches

