import { Section } from "./Section";

const pillars = [
  {
    title: "6 encontros individuais",
    body: "Calls de até 2 horas cada — só você, o Rafa e toda a equipe da operação.",
  },
  {
    title: "Análise completa",
    body: "Da sua agência ponta a ponta: processos, números, captação, conteúdo e chat.",
  },
  {
    title: "Visita presencial",
    body: "Ao escritório da agência, pra ver a operação real por dentro.",
  },
];

export function Highlights() {
  return (
    <Section id="acompanhamento" eyebrow="O acompanhamento">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-4xl">
        O que o ciclo{" "}
        <span className="italic text-gold-gradient">inclui</span>
      </h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {pillars.map((p, i) => (
          <article
            key={p.title}
            className="group relative overflow-hidden rounded-lg border border-border/60 bg-gradient-to-b from-card/70 to-card/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-soft hover:shadow-[0_16px_40px_-20px_rgba(212,175,55,0.45)]"
          >
            {/* fio dourado no topo, acende no hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gold-gradient opacity-40 transition-opacity duration-300 group-hover:opacity-90"
            />
            {/* número fantasma grande ao fundo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-3 font-serif text-7xl italic leading-none text-[color:var(--gold)]/[0.06] transition-colors duration-300 group-hover:text-[color:var(--gold)]/10"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative font-serif text-2xl italic text-gold-gradient">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative mt-4 font-serif text-xl leading-snug text-foreground">
              {p.title}
            </h3>
            <p className="relative mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
