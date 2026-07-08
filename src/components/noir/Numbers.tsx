import { Section } from "./Section";

const stats = [
  {
    value: "R$ 13.616.270,93",
    label: "Faturamento histórico da operação",
  },
  {
    value: "R$ 353.087,58",
    label: "Faturado em um único mês",
  },
];

export function Numbers() {
  return (
    <Section id="numeros" eyebrow="A operação em números">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl">
        Uma operação que já movimentou{" "}
        <span className="italic text-gold-gradient">R$ 13,6 milhões</span>.
      </h2>
      <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        Não é promessa nem projeção. É o histórico real da agência que conduz
        essa mentoria — os mesmos processos que você vai aplicar na sua.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-sm border border-gold-soft bg-card/50 p-8 text-center"
          >
            <p className="font-serif text-3xl font-normal text-gold-gradient sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-3 font-sans text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <figure className="mt-8">
        <div className="overflow-hidden rounded-xl border border-gold-soft shadow-[0_0_50px_-14px_rgba(212,175,55,0.4)]">
          <img
            src="/prints/faturamento.jpg"
            alt="Print real do painel da operação: R$ 353.087,58 no mês e R$ 13.616.270,93 de faturamento histórico"
            loading="lazy"
            className="block w-full"
          />
        </div>
        <figcaption className="mt-3 text-center font-sans text-xs text-muted-foreground">
          Print real do painel de faturamento da operação.
        </figcaption>
      </figure>
    </Section>
  );
}
