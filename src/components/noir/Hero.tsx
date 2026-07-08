import type { CSSProperties } from "react";
import { Wordmark } from "./Wordmark";

export function Hero() {
  return (
    <header className="noir-grain relative overflow-hidden px-5 pt-8 pb-20 sm:px-8 sm:pt-12 sm:pb-32">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.13_85/18%),transparent_70%)] blur-2xl"
      />
      <nav className="relative mx-auto flex w-full max-w-5xl items-center justify-between">
        <Wordmark />
        <span className="hidden font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">
          Mentoria Individual
        </span>
      </nav>

      <div className="relative mx-auto mt-20 flex w-full max-w-3xl flex-col items-center text-center sm:mt-28">
        <div
          className="hero-enter mb-8 flex items-center gap-3"
          style={{ "--hero-delay": "120ms" } as CSSProperties}
        >
          <span className="h-px w-10 bg-gold-gradient" />
          <span className="font-sans text-[10px] uppercase tracking-[0.36em] text-gold-gradient font-semibold">
            POUCAS VAGAS
          </span>
          <span className="h-px w-10 bg-gold-gradient" />
        </div>

        <h1
          className="hero-enter font-serif text-[34px] leading-[1.08] font-normal text-foreground sm:text-6xl md:text-7xl"
          style={{ "--hero-delay": "260ms" } as CSSProperties}
        >
          Acompanhamento{" "}
          <span className="italic text-gold-gradient">individual</span> pra
          estruturar e escalar sua operação de agência.
        </h1>

        <div
          className="hero-enter mt-16 flex flex-col items-center gap-3"
          style={{ "--hero-delay": "560ms" } as CSSProperties}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Role para descobrir
          </span>
          <span
            aria-hidden
            className="h-10 w-px animate-pulse bg-gradient-to-b from-[color:var(--gold)]/70 to-transparent"
          />
        </div>
      </div>
    </header>
  );
}
