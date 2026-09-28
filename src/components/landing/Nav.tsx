"use client";

import { logoBlackSrc } from "@/lib/assets";

const demoLinks = [
  { label: "Docs", href: "#docs", marker: true },
  { label: "Pricing", href: "#pricing", marker: false },
] as const;

export function Nav() {
  const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-[clamp(0.85rem,2vw,1.25rem)] z-50 flex flex-col gap-2 px-4 min-[720px]:block min-[720px]:px-0">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative inline-flex w-fit items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206] min-[720px]:absolute min-[720px]:left-[calc(100vw/6)] min-[720px]:top-0"
      >
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex h-12 items-center px-4 sm:px-5"
          aria-label="CONDUENCE home"
        >
          <span className="relative block h-[13px] w-[147px] overflow-hidden">
            <img
              src={logoBlackSrc}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none select-none"
              style={{ height: 46.7, width: 186.85, left: -20, top: -16.9 }}
            />
          </span>
        </a>

        {demoLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(event) => event.preventDefault()}
            className="flex items-center gap-2.5 border-l-[2.5px] border-[#140206] px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none sm:px-4 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
          >
            {link.marker ? <span aria-hidden className="size-[6px] shrink-0 bg-[#140206]" /> : null}
            {link.label}
          </a>
        ))}
      </nav>

      <div className="pointer-events-auto relative ml-auto inline-flex w-fit items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206] min-[720px]:absolute min-[720px]:right-4 min-[720px]:top-0 min-[720px]:ml-0 min-[960px]:right-[20vw]">
        <a
          href="#login"
          onClick={(event) => event.preventDefault()}
          className="flex h-12 items-center px-4 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none sm:px-5 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Login
        </a>
        <a
          href="#get-started"
          onClick={(event) => event.preventDefault()}
          className="flex h-12 items-center border-l-[2.5px] border-[#140206] bg-[#48A8D0] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#140206] transition-colors hover:bg-[#3b96bc] focus-visible:bg-[#3b96bc] focus-visible:outline-none sm:px-5 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
