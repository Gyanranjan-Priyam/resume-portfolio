// Site configuration with domain fallback
// Primary: priyam.tech, Fallback: gyanranjanpriyam.tech

export const DOMAINS = {
  primary: "priyam.tech",
  fallback: "gyanranjanpriyam.tech",
} as const;

export const SITE_URL = `https://www.${DOMAINS.primary}`;
export const FALLBACK_SITE_URL = `https://www.${DOMAINS.fallback}`;

// For use in metadata and SEO
export const SITE_NAME = "Gyanranjan Priyam";
export const SITE_DESCRIPTION = "Full Stack Developer working at the intersection of web development, app development, and AI/ML to build scalable digital products people actually use.";
