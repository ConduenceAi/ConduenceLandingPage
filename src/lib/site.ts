const DEFAULT_SITE_URL = "https://conduence.xyz";

/** Primary marketing / SEO tagline used in metadata, JSON-LD, and discovery files. */
export const siteTagline =
  "Orchestrate AI agents on the fastest AI powered trading Operating System, from event to execution.";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export const siteUrl = getSiteUrl();

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${siteUrl}/`).toString();
}
