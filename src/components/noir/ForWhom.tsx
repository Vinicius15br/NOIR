import { Check, X } from "lucide-react";
import { Section } from "./Section";

const forYou = [
  "Já tem uma operação rodando e travou em captação, retenção, conteúdo ou chat",
  "Está começando do zero e quer estruturar certo desde o primeiro dia, sem meses de tentativa e erro",
  "Quer acesso direto ao expert, sem dividir atenção com uma turma",
  "Está disposto a executar o que for definido nas calls",
];

const notForYou = [
  "Procura fórmula mágica ou renda garantida",
  "Quer só consumir conteúdo sem aplicar",
  "Não pode tratar isso como uma operação profissional",
];

export function ForWhom() {
  return (
    <Section id="para-quem" eyebrow="Para quem é">
      <h2 className="font-serif text-3xl leading-tight font-normal text-balance text-foreground sm:text-4xl">
        Não é pra todo mundo — e essa é a ideia.
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-gold-soft bg-card/60 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--gold)]/60 hover:shadow-[0_16px_40px_-20px_rgba(212,175,55,0.5)]">
          <h3 className="font-serif text-lg font-semibold text-gold-gradient">
            É pra você se
          </h3>
          <ul className="mt-6 space-y-4">
            {forYou.map((item) => (
              <li key={item} className="flex gap-3">
                <Check
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]"
                  strokeWidth={2.5}
                />
                <span className="font-sans text-[15px] leading-relaxed text-foreground/85">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-border/60 bg-card/30 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card/50">
          <h3 className="font-serif text-lg font-semibold text-muted-foreground">
            NÃO é pra você se
          </h3>
          <ul className="mt-6 space-y-4">
            {notForYou.map((item) => (
              <li key={item} className="flex gap-3">
                <X
                  aria-hidden
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  strokeWidth={2.5}
                />
                <span className="font-sans text-[15px] leading-relaxed text-muted-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
