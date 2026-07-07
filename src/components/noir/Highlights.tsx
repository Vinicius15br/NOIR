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
            className="rounded-sm border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:border-gold-soft hover:bg-card/70"
          >
            <span className="font-serif text-2xl italic text-gold-gradient">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-serif text-xl leading-snug text-foreground">
              {p.title}
            </h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
