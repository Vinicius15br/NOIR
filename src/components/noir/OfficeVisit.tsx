import { Section } from "./Section";

export function OfficeVisit() {
  return (
    <Section id="visita" eyebrow="Diferencial · Presencial">
      <div className="relative overflow-hidden rounded-sm border border-gold-soft bg-card/50 p-8 backdrop-blur-sm sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.13_85/22%),transparent_70%)] blur-2xl"
        />
        <div className="relative">
          <h2 className="font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl">
            Você vai ver a operação por dentro.{" "}
            <span className="italic text-gold-gradient">Presencialmente.</span>
          </h2>

          <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Além das 6 calls, você tem direito a uma visita ao escritório da
            agência: acompanhar a rotina real, ver como a equipe trabalha
            captação, conteúdo e chat, e entender na prática o que separa uma
            operação profissional de um improviso.
          </p>

          <p className="mt-8 rounded-sm bg-background/50 p-5 font-sans text-[13px] leading-relaxed text-muted-foreground/90">
            <span className="text-gold-gradient font-semibold uppercase tracking-wider">
              Importante ·{" "}
            </span>
            A visita é agendada em data disponível de ambas as partes e
            acontece mediante termo de confidencialidade — protegemos os dados
            das nossas creators e você verá uma operação real, não um cenário
            montado. Deslocamento e hospedagem por conta do mentorado.
          </p>
        </div>
      </div>
    </Section>
  );
}
