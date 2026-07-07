import { Section } from "./Section";

const items = [
  {
    title: "Contrato da operação",
    body: "O contrato que usamos com nossas creators, pra você adaptar à sua realidade (recomendamos revisão jurídica antes do uso).",
  },
  {
    title: "Gravações das suas 6 calls",
    body: "Pra revisitar decisões e planos sempre que precisar.",
  },
  {
    title: "Acesso às gravações da turma em grupo anterior",
    body: "Você começa a consumir conteúdo antes mesmo da primeira call.",
  },
];

export function Bonus() {
  return (
    <Section id="bonus" eyebrow="Bônus">
      <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl">
        O que você leva{" "}
        <span className="italic text-gold-gradient">
          {"\n"}além das calls?
        </span>
      </h2>

      <ul className="mt-12 space-y-6">
        {items.map((it) => (
          <li
            key={it.title}
            className="flex gap-5 border-t border-border/60 pt-6 first:border-t-0 first:pt-0"
          >
            <div className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-gradient" />
            <div className="min-w-0">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                {it.title}
              </h3>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
