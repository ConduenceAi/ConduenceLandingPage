const DEFAULT_SITE_URL = "https://conduence.xyz";

/** Primary marketing / SEO tagline used in metadata, JSON-LD, and discovery files. */
export const siteTagline =
  "Personal agent for traders, a second brain to trade when you can’t, from events to execution.";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export const siteUrl = getSiteUrl();

export const socialProfiles = [
  { label: "Telegram", href: "https://t.me/conduencehq" },
  { label: "Discord", href: "https://discord.gg/BK7x57P5r" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/conduenceai" },
] as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${siteUrl}/`).toString();
}
