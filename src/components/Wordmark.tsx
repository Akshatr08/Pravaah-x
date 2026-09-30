interface Props {
  className?: string;
}

/**
 * PRAVAAH-X wordmark. The X is drawn as two crossing atmospheric flows
 * with nodes at the intersection points — movement, data, connected regions.
 */
export function Wordmark({ className }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-[0.9375rem] font-medium tracking-[0.18em] text-foreground">
        PRAVAAH
      </span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[1.05rem] w-[1.05rem] text-primary"
      >
        <path
          d="M3 4c6 0 9 5 9 8s3 8 9 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M21 4c-6 0-9 5-9 8s-3 8-9 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="12" cy="12" r="1.9" fill="currentColor" />
      </svg>
      <span className="sr-only">PRAVAAH-X</span>
    </span>
  );
}
