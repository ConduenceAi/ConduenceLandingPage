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
        className="block h-9 sm:h-11 md:h-12 pointer-events-auto"
        aria-label="Scroll to top"
      >
        <ConduenceLogo className="h-full" variant="auto" />
      </a>
    </header>
  );
}
