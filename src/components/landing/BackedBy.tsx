"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function MicrosoftLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="h-[1em] w-[1em] shrink-0"
    >
      <path d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z" />
    </svg>
  );
}

function AwsLogo() {
  return (
    <svg
      viewBox="0 4 24 15"
      fill="currentColor"
      aria-hidden
      className="h-[1em] w-[1.7em] shrink-0"
    >
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z" />
    </svg>
  );
}

function NvidiaLogo() {
  return (
    <svg
      viewBox="0 0 28 20"
      aria-hidden
      className="h-[1em] w-[1.4em] shrink-0"
    >
      <rect width="20" height="20" fill="#76b900" />
      <path
        d="M4 10c2.7-3.4 6.8-5.2 11.2-5.2 1.5 0 3 .2 4.3.7-2.4.2-4.7 1.2-6.4 2.8 2.2.1 4.2 1.3 5.3 3.2-1.2-1-2.7-1.6-4.3-1.6-2.7 0-5.1 1.5-6.3 3.8 1.9-1.4 4.6-1.8 6.9-.9-2.2 1.7-5.2 2.4-8 1.9-1-.2-1.9-.5-2.7-1 1.5-2.5 4.2-4 7.1-4.1-2.3-.6-4.7-.4-6.8.4L4 10Zm10.3 1.3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="white"
      />
      <text x="22" y="14" fill="currentColor" fontSize="6" fontWeight="700">
        NVIDIA
      </text>
    </svg>
  );
}

const BACKERS = [
  { name: "Microsoft for Startups", Logo: MicrosoftLogo, href: undefined },
  { name: "AWS for Startups", Logo: AwsLogo, href: undefined },
  {
    name: "NVIDIA Inception",
    Logo: NvidiaLogo,
    href: "https://www.nvidia.com/en-in/startups/",
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
        <span className="text-kicker font-mono font-semibold uppercase tracking-[0.34em] text-black/55">
          Supported by
        </span>
        {BACKERS.map(({ name, Logo, href }, index) => {
          const content = (
            <>
              <Logo />
              <span className="text-kicker font-mono uppercase tracking-[0.1em] text-black/70">
                {name}
              </span>
            </>
          );

          const className = "flex items-center gap-x-[clamp(0.4rem,1vw,0.6rem)] text-[clamp(1.1rem,2.4vw,1.4rem)] text-black/80";

          return (
            <span key={name} className="flex items-center gap-x-[clamp(0.75rem,2vw,1.25rem)]">
              {index !== 0 ? <span className="text-black/25" aria-hidden="true">·</span> : null}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Learn about ${name}`}
                  className={`${className} transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black`}
                >
                  {content}
                </a>
              ) : (
                <span className={className}>{content}</span>
              )}
            </span>
          );
        })}
      </div>
    </motion.section>
  );
}
