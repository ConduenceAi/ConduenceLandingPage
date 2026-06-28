"use client";

import { ConduenceLogo } from "@/components/ConduenceLogo";

export function Nav() {
  const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex items-center justify-center px-4 sm:px-8 pointer-events-none">
      <a
        href="#top"
        onClick={scrollToTop}
        className="pointer-events-auto relative flex h-11 items-center justify-center px-3 py-1 sm:h-12 sm:px-4 sm:py-1 md:h-14"
        aria-label="Scroll to top"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white/8 backdrop-blur-md supports-[backdrop-filter]:bg-white/6"
        />
        <ConduenceLogo className="relative z-10 h-full scale-110" variant="auto" />
      </a>
    </header>
  );
}
