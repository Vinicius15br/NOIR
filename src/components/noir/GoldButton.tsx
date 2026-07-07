import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  as?: "a" | "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function GoldButton({ children, href, className, as, ...rest }: Props) {
  const cls = cn(
    "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-sm px-8 py-4",
    "font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-[color:var(--primary-foreground)]",
    "bg-gold-gradient shadow-[0_10px_40px_-12px_oklch(0.82_0.13_85/45%)]",
    "transition-all duration-300 hover:shadow-[0_18px_60px_-14px_oklch(0.88_0.15_90/65%)] hover:-translate-y-0.5",
    "sm:w-auto",
    className,
  );
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
    </>
  );
  if (as === "a" || href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
