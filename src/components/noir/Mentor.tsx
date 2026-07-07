import { Section } from "./Section";

export function Mentor() {
  return (
    <Section id="mentor" eyebrow="Quem conduz">
      <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl">
        Quem vai olhar pra{" "}
        <span className="italic text-gold-gradient">sua operação...</span>
      </h2>

      <div className="mt-12 grid gap-8 sm:grid-cols-[180px_1fr] sm:items-start">
        <img
          src="/rafa.jpg"
          alt="Rafael Nepomuceno, fundador da Hottisie"
          width={720}
          height={936}
          loading="lazy"
          className="mx-auto h-56 w-44 shrink-0 rounded-sm border border-gold-soft object-cover object-[center_18%] sm:mx-0"
        />
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

    </Section>
  );
}
