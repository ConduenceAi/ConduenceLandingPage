import Link from "next/link";

const links = [
  {
    href: "/talk-to-founder",
    label: "Talk to the founder",
    description: "Book a 30-minute call about agent orchestration and early access.",
  },
  {
    href: "/#pillars",
    label: "Product features",
    description: "Mind Mesh, Retrace, Agent Studio, and more — on one surface.",
  },
] as const;

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      className={
        isDark
          ? "border-t border-white/10 bg-black px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,4vw,2.75rem)] text-white"
          : "border-t border-black/8 bg-white px-[clamp(1rem,4vw,1.5rem)] py-[clamp(2rem,4vw,2.75rem)] text-black"
      }
    >
      <nav
        aria-label="Site"
        className="mx-auto grid w-full max-w-4xl gap-[clamp(1.5rem,3vw,2rem)] sm:grid-cols-2"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block transition"
          >
            <span
              className={
                isDark
                  ? "text-[clamp(0.9375rem,0.25vw+0.85rem,1.0625rem)] font-medium tracking-[-0.01em] text-white/90 transition group-hover:text-white [font-family:var(--font-ui),system-ui,sans-serif]"
                  : "text-[clamp(0.9375rem,0.25vw+0.85rem,1.0625rem)] font-medium tracking-[-0.01em] text-black/85 transition group-hover:text-black [font-family:var(--font-ui),system-ui,sans-serif]"
              }
            >
              {link.label}
            </span>
            <span
              className={
                isDark
                  ? "mt-1.5 block max-w-sm text-[clamp(0.8125rem,0.2vw+0.75rem,0.875rem)] leading-relaxed text-white/45 [font-family:var(--font-ui),system-ui,sans-serif]"
                  : "mt-1.5 block max-w-sm text-[clamp(0.8125rem,0.2vw+0.75rem,0.875rem)] leading-relaxed text-black/45 [font-family:var(--font-ui),system-ui,sans-serif]"
              }
            >
              {link.description}
            </span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
