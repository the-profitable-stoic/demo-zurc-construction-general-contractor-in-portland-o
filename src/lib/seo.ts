import { siteConfig } from "./site-config.js";

export interface SeoProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article";
}

export function getSeoForPage(pageKey: string): SeoProps {
  const seoData = siteConfig.content.seo?.[pageKey];
  const biz = siteConfig.business;
  const cat = biz.category.charAt(0).toUpperCase() + biz.category.slice(1);

  // Smart fallback titles based on page type
  let fallbackTitle = `${biz.name} | ${cat} in ${biz.city}, ${biz.state}`;
  let fallbackDesc = `Professional ${biz.category.toLowerCase()} services in ${biz.city}, ${biz.state}. Call ${biz.phone} for a free estimate.`;

  if (pageKey.startsWith("services/")) {
    const slug = pageKey.replace("services/", "");
    const service = (siteConfig.content.services as any[]).find((s) => s.slug === slug);
    if (service) {
      fallbackTitle = `${service.name} in ${biz.city} | ${biz.name}`;
      fallbackDesc = service.shortDescription
        ? `${service.shortDescription} Call ${biz.phone} for a free estimate.`
        : `Expert ${service.name.toLowerCase()} services in ${biz.city}, ${biz.state}. Call ${biz.phone}.`;
    }
  } else if (pageKey.startsWith("service-areas/")) {
    const slug = pageKey.replace("service-areas/", "");
    const area = (siteConfig.content.serviceAreas as any[]).find((a) => a.slug === slug);
    if (area) {
      fallbackTitle = `${cat} Contractor in ${area.city}, ${area.state} | ${biz.name}`;
      fallbackDesc = `Trusted ${biz.category.toLowerCase()} services in ${area.city}, ${area.state}. Locally owned, fully licensed. Call ${biz.phone}.`;
    }
  }

  return {
    title: seoData?.title || fallbackTitle,
    description: seoData?.description || fallbackDesc,
    ogTitle: seoData?.ogTitle || seoData?.title || fallbackTitle,
    ogDescription: seoData?.ogDescription || seoData?.description || fallbackDesc,
  };
}

export function generateLocalBusinessJsonLd(): string {
  const biz = siteConfig.business;
  const info = siteConfig.content.companyInfo;
  const reviews = siteConfig.content.reviews;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    telephone: biz.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: biz.city,
      addressRegion: biz.state,
      addressCountry: "US",
    },
    areaServed: siteConfig.content.serviceAreas.map((sa) => ({
      "@type": "City",
      name: sa.city,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
      },
      author: { "@type": "Person", name: r.name },
      reviewBody: r.text,
      datePublished: r.date,
    })),
  });
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function generateServiceJsonLd(service: {
  name: string;
  description: string;
}): string {
  const biz = siteConfig.business;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: biz.name,
      telephone: biz.phone,
    },
    areaServed: siteConfig.content.serviceAreas.map((sa) => ({
      "@type": "City",
      name: sa.city,
    })),
  });
}

export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}
