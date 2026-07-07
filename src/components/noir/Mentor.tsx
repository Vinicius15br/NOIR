import { Section } from "./Section";

export function Mentor() {
  return (
    <Section id="mentor" eyebrow="Quem conduz">
      <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl">
        Quem vai olhar pra{" "}
        <span className="italic text-gold-gradient">sua operação...</span>
      </h2>

      <div className="mt-12 grid gap-8 sm:grid-cols-[180px_1fr] sm:items-start">
        <div className="mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-sm border border-gold-soft bg-card/60 sm:mx-0">
          <span className="text-center font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            [ Foto do Rafa ]
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-2xl font-semibold text-gold-gradient">
            Rafael Nepomuceno
          </h3>
          <p className="mt-4 font-sans text-[15.5px] leading-relaxed text-muted-foreground">
            Rafa é fundador da{" "}
            <span className="text-foreground">Hottisie</span> e conduz a
            mentoria pessoalmente. Todas as 6 calls são com ele — sem
            repassador de conteúdo, sem "time de suporte" respondendo por ele.
            Nas calls que envolvem chat e ferramentas, membros da equipe da
            operação participam junto.
          </p>
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-gold-gradient" />
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Prova social
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-[4/5] items-center justify-center rounded-sm border border-dashed border-border/70 bg-card/30 text-center"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Inserir print /<br />depoimento {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
