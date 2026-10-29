"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { logoBlackSrc } from "@/lib/assets";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/login";
import { cn } from "@/lib/utils";

const mobileLinkClass =
  "flex h-11 items-center px-4 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.04] focus-visible:outline-none [font-family:var(--font-ui),system-ui,sans-serif]";

export function Nav() {
  const pathname = usePathname();
  const panelId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const onLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Disclosure dropdown: closes on Escape (returning focus to the toggle) or on any outside press.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 720) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-[clamp(0.85rem,2vw,1.25rem)] z-50 flex items-start justify-between px-4 min-[720px]:block min-[720px]:px-0">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative z-50 inline-flex w-fit items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206] min-[720px]:absolute min-[720px]:left-4 min-[720px]:top-0 min-[720px]:z-auto min-[1100px]:left-[calc(100vw/6)]"
      >
        <Link
          href="/"
          onClick={onLogoClick}
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
        </Link>

        <Link
          href="/docs"
          aria-current={pathname === "/docs" ? "page" : undefined}
          className={cn(
            "hidden items-center border-l-[2.5px] border-[#140206] px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none min-[720px]:flex sm:px-4 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]",
            pathname === "/docs" && "bg-[#f4f1ea]",
          )}
        >
          Docs
        </Link>

        <Link
          href="/pricing"
          className="hidden items-center gap-2.5 border-l-[2.5px] border-[#140206] px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none min-[720px]:flex sm:px-4 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Pricing
        </Link>
      </nav>

      <div className="pointer-events-auto relative hidden w-fit items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206] min-[720px]:absolute min-[720px]:right-4 min-[720px]:top-0 min-[720px]:ml-0 min-[720px]:inline-flex min-[960px]:right-[20vw]">
        <a
          href={APP_LOGIN_URL}
          className="flex h-12 items-center px-4 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none sm:px-5 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Login
        </a>
        <a
          href={APP_SIGNUP_URL}
          className="flex h-12 items-center border-l-[2.5px] border-[#140206] bg-[#48A8D0] px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#140206] transition-colors hover:bg-[#3b96bc] focus-visible:bg-[#3b96bc] focus-visible:outline-none sm:px-5 sm:text-[12px] [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Get Started
        </a>
      </div>

      <div ref={menuRef} className="pointer-events-auto relative z-50 min-[720px]:hidden">
        <button
          ref={toggleRef}
          type="button"
          className="relative inline-flex h-[calc(3rem+5px)] w-[calc(3rem+5px)] items-center justify-center border-[2.5px] border-[#140206] bg-white text-[#140206]"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="relative block h-[17px] w-[20px]" aria-hidden>
            <span
              className={cn(
                "absolute left-0 top-0 h-[2.5px] w-full origin-center bg-[#140206] transition-transform duration-200 ease-out motion-reduce:transition-none",
                open && "translate-y-[7.25px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7.25px] h-[2.5px] w-full bg-[#140206] transition-opacity duration-200 ease-out motion-reduce:transition-none",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[14.5px] h-[2.5px] w-full origin-center bg-[#140206] transition-transform duration-200 ease-out motion-reduce:transition-none",
                open && "-translate-y-[7.25px] -rotate-45",
              )}
            />
          </span>
        </button>

        <div
          id={panelId}
          inert={open ? undefined : true}
          aria-hidden={!open}
          className={cn(
            "absolute right-0 top-[calc(100%+0.5rem)] flex w-max origin-top-right flex-col border border-black/10 bg-white p-1.5 text-[#140206] shadow-[0_16px_40px_-16px_rgba(20,2,6,0.3)] transition duration-150 ease-out motion-reduce:transition-none",
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
          )}
        >
          <Link
            href="/docs"
            aria-current={pathname === "/docs" ? "page" : undefined}
            className={mobileLinkClass}
            onClick={() => setOpen(false)}
          >
            Docs
          </Link>
          <Link href="/pricing" className={mobileLinkClass} onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <a href={APP_LOGIN_URL} className={mobileLinkClass} onClick={() => setOpen(false)}>
            Login
          </a>
          <a href={APP_SIGNUP_URL} className={mobileLinkClass} onClick={() => setOpen(false)}>
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
