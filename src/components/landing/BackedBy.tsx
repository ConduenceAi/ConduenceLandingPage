"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function MicrosoftLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[1em] w-[1em] shrink-0"
    >
      <path fill="#f25022" d="M0 0h11.408v11.408H0z" />
      <path fill="#7fba00" d="M12.594 0H24v11.408H12.594z" />
      <path fill="#00a4ef" d="M0 12.594h11.408V24H0z" />
      <path fill="#ffb900" d="M12.594 12.594H24V24H12.594z" />
    </svg>
  );
}

function NvidiaLogo() {
  return (
    <svg
      viewBox="0 0 18.947 20"
      aria-hidden
      className="h-[1em] w-[1em] shrink-0"
    >
      <path
        d="M129.832 124.085v-1.807c.175-.013.353-.022.533-.028 4.941-.155 8.183 4.246 8.183 4.246s-3.5 4.863-7.255 4.863a4.553 4.553 0 0 1-1.461-.234v-5.478c1.924.232 2.31 1.082 3.467 3.01l2.572-2.169a6.81 6.81 0 0 0-5.042-2.462 9.328 9.328 0 0 0-1 .059m0-5.968v2.7c.177-.014.355-.025.533-.032 6.871-.232 11.348 5.635 11.348 5.635s-5.142 6.253-10.5 6.253a7.906 7.906 0 0 1-1.383-.122v1.668a9.1 9.1 0 0 0 1.151.075c4.985 0 8.59-2.546 12.081-5.559.578.463 2.948 1.591 3.435 2.085-3.319 2.778-11.055 5.018-15.44 5.018-.423 0-.829-.026-1.228-.064v2.344h18.947v-20Zm0 13.009v1.424c-4.611-.822-5.89-5.615-5.89-5.615a9.967 9.967 0 0 1 5.89-2.85v1.563h-.007a4.424 4.424 0 0 0-3.437 1.571s.845 3.035 3.444 3.908m-8.189-4.4a11.419 11.419 0 0 1 8.189-4.449v-1.463c-6.043.485-11.277 5.6-11.277 5.6s2.964 8.569 11.277 9.354v-1.555c-6.101-.781-8.189-7.5-8.189-7.5Z"
        transform="translate(-118.555 -118.117)"
        fill="#74b71b"
      />
    </svg>
  );
}

const BACKERS = [
  {
    name: "NVIDIA",
    Logo: NvidiaLogo,
    labelClassName: "text-[0.91em]",
    sizeClassName: "text-[clamp(1.25rem,2.65vw,1.55rem)]",
  },
  {
    name: "Microsoft",
    Logo: MicrosoftLogo,
    labelClassName: "text-[0.91em]",
    sizeClassName: "",
  },
] as const;

export function BackedBy() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <motion.section
      ref={ref}
      aria-label="Backed by"
      className="relative w-full border-y border-black/8 bg-white px-[5%] py-[clamp(0.9rem,2vw,1.25rem)] text-black"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-center gap-x-[clamp(0.75rem,2vw,1.25rem)] gap-y-2 text-center">
        <span className="text-[clamp(0.680625rem,0.1815vw+0.605rem,0.75625rem)] font-mono font-semibold uppercase tracking-[0.34em] text-black">
          Supported by
        </span>
        {BACKERS.map(({ name, Logo, labelClassName, sizeClassName }, index) => (
          <span key={name} className="flex items-center gap-x-[clamp(0.75rem,2vw,1.25rem)]">
            {index !== 0 ? <span className="text-black/25" aria-hidden="true">·</span> : null}
            <span className={`flex items-center gap-x-[clamp(0.4rem,1vw,0.6rem)] text-black/80 ${sizeClassName || "text-[clamp(1.1rem,2.4vw,1.4rem)]"}`}>
              <Logo />
              <span className={`uppercase tracking-[-0.01em] text-black/70 [font-family:var(--font-display),Georgia,serif] ${labelClassName}`}>
                {name}
              </span>
            </span>
          </span>
        ))}
      </div>
    </motion.section>
  );
}
