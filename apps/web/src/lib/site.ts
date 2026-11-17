/**
 * Public facts about Amplivid used by the homepage and legal pages. The
 * social networks' app reviewers compare these against the OAuth consent
 * screens and developer consoles, so change them here, in one place.
 */
export const site = {
  name: "Amplivid",
  url: "https://amplivid.com",
  tagline: "Plan the week. Post everywhere.",
  description:
    "Amplivid helps solo creators plan, create, schedule and publish content to TikTok, YouTube, Instagram, Facebook and LinkedIn from one place.",
  company: {
    legalName: "HyperVivid Studios LLC",
    kind: "a Michigan limited liability company",
    street: "10724 Nadine Ave",
    city: "Huntington Woods",
    region: "MI",
    postalCode: "48070",
    country: "United States",
    website: "https://www.hypervividstudios.com",
  },
  /** One inbox for privacy, deletion, legal and support requests. */
  contactEmail: "privacy@hypervividstudios.com",
  /** Date shown as "Effective" and "Last updated" on every legal page. */
  legalEffectiveDate: "November 17, 2026",
} as const;

export const routes = {
  home: "/",
  privacy: "/privacy",
  terms: "/terms",
  dataDeletion: "/data-deletion",
} as const;

export function mailto(subject: string): string {
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}`;
}

export function postalAddress(): string {
  const c = site.company;
  return `${c.legalName}, ${c.street}, ${c.city}, ${c.region} ${c.postalCode}, ${c.country}`;
}
