import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  eyebrow,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-5 py-20 sm:px-8 sm:py-28 md:py-32",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-3xl">
        {eyebrow ? (
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-gold-gradient" />
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-gold-gradient font-semibold">
              {eyebrow}
            </span>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function Divider() {
  return (
    <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 sm:px-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent" />
      <div className="h-1.5 w-1.5 rotate-45 bg-gold-gradient" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent" />
    </div>
  );
}
