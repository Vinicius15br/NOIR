export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0"
      >
        <defs>
          <linearGradient id="wm-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.13 75)" />
            <stop offset="50%" stopColor="oklch(0.92 0.09 92)" />
            <stop offset="100%" stopColor="oklch(0.55 0.11 70)" />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="url(#wm-gold)"
          strokeWidth="1"
        />
        <path
          d="M12 28 L12 12 L28 28 L28 12"
          stroke="url(#wm-gold)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="square"
        />
      </svg>
      <div className={compact ? "leading-tight" : "leading-tight"}>
        <div className="font-serif text-[15px] font-semibold tracking-[0.32em] text-gold-gradient uppercase">
          Noir
        </div>
        <div className="font-sans text-[9px] tracking-[0.42em] text-muted-foreground uppercase">
          Sessions
        </div>
      </div>
    </div>
  );
}
