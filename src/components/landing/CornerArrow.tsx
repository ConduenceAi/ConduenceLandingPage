import { cn } from "@/lib/utils";

type CornerArrowProps = {
  direction?: "right" | "left";
  className?: string;
};

/** Minimal corner arrow (↳ / ↲) matching the Talk to Founder nav treatment. */
export function CornerArrow({ direction = "right", className }: CornerArrowProps) {
  const isLeft = direction === "left";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-[1.1em] shrink-0", className)}
    >
      {isLeft ? (
        <>
          <path
            d="M20 4v7a4 4 0 0 1-4 4H4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m9 10-5 5 5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M4 4v7a4 4 0 0 0 4 4h12"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m15 10 5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
