type IconProps = {
  className?: string;
};

/** Corner arrow: down, then right (↳). */
export function CornerDownRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 2v7.5A1.5 1.5 0 0 0 5.5 11H13m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Corner arrow: down, then left (↲). */
export function CornerDownLeft({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2v7.5A1.5 1.5 0 0 1 10.5 11H3m0 0 3-3M3 11l3 3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
