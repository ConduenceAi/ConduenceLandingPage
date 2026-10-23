"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { logoBlackSrc } from "@/lib/assets";
import { APP_LOGIN_URL, APP_SIGNUP_URL } from "@/lib/login";
import { cn } from "@/lib/utils";

const mobileLinkClass =
  "flex h-14 items-center border-b-[2.5px] border-[#140206] px-5 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors hover:bg-[#f4f1ea] focus-visible:bg-[#f4f1ea] focus-visible:outline-none [font-family:var(--font-ui),system-ui,sans-serif]";

export function Nav() {
  const pathname = usePathname();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const nodes = [
        ...document.querySelectorAll<HTMLElement>("[data-mobile-nav-toggle]"),
        ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ];
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
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
        className="pointer-events-auto relative z-50 inline-flex w-fit items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206] min-[720px]:absolute min-[720px]:left-[calc(100vw/6)] min-[720px]:top-0 min-[720px]:z-auto"
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

      <button
        type="button"
        className="pointer-events-auto relative z-50 inline-flex h-[calc(3rem+5px)] w-[calc(3rem+5px)] items-center justify-center border-[2.5px] border-[#140206] bg-white text-[#140206] min-[720px]:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        data-mobile-nav-toggle=""
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
        inert={open ? undefined : true}
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 min-[720px]:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-[#140206]/30 transition-opacity duration-300 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(19.5rem,88vw)] flex-col border-l-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[-5px_5px_0_0_#140206] outline-none transition-transform duration-300 ease-out motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="mt-[calc(clamp(0.85rem,2vw,1.25rem)+4.5rem)] border-y-[2.5px] border-[#140206]">
            <Link href="/pricing" className={mobileLinkClass} onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <a href={APP_LOGIN_URL} className={mobileLinkClass} onClick={() => setOpen(false)}>
              Login
            </a>
            <a
              href={APP_SIGNUP_URL}
              className={cn(
                mobileLinkClass,
                "bg-[#48A8D0] hover:bg-[#3b96bc] focus-visible:bg-[#3b96bc]",
              )}
              onClick={() => setOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
