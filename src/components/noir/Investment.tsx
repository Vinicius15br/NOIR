import { GoldButton } from "./GoldButton";
import { Section } from "./Section";

const steps = [
  "Você preenche o formulário abaixo.",
  "Nossa equipe te liga pra entender seu momento e sua operação.",
  "Se fizer sentido pros dois lados, sua vaga é confirmada na própria call.",
];

export function Investment() {
  return (
    <Section id="investimento" eyebrow="Investimento + Seleção">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl">
        Como funciona a{" "}
        <span className="italic text-gold-gradient">entrada</span>
      </h2>

      <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        O acompanhamento individual é limitado a{" "}
        <span className="text-foreground font-semibold">2 mentorados</span> por
        ciclo — é o Rafa quem conduz cada call, e a agenda da operação
        comporta poucas vagas sem comprometer a qualidade da análise.
      </p>

      <div className="mt-10 grid gap-6 rounded-sm border border-gold-soft bg-card/50 p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Investimento
          </p>
          <p className="mt-2 font-serif text-5xl font-normal text-gold-gradient sm:text-6xl">
            R$ 10.000
          </p>
          <p className="mt-3 font-sans text-sm text-muted-foreground">
            Com opção de parcelamento.
          </p>
        </div>
        <div className="hidden h-24 w-px bg-gradient-to-b from-transparent via-[color:var(--gold)]/40 to-transparent sm:block" />
        <div className="sm:pl-2">
          <p className="font-sans text-[13px] leading-relaxed text-muted-foreground">
            Por ser individual e limitado, a entrada é por candidatura.
          </p>
        </div>
      </div>

      <ol className="mt-12 space-y-5">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-5">
            <span className="font-serif text-2xl italic text-gold-gradient shrink-0 leading-none pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-sans text-[15px] leading-relaxed text-foreground/90">
              {step}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-start gap-4">
        <GoldButton href="#candidatura">GARANTIR MINHA VAGA</GoldButton>
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          {"\n"}
        </p>
      </div>
    </Section>
  );
}
