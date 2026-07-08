import { Section } from "./Section";

const calls = [
  {
    n: "01",
    title: "Raio X completo",
    body: "Análise da sua estrutura (ou do seu ponto de partida, se está começando): processos, equipe, números, organização. Saída: diagnóstico do que corrigir primeiro.",
  },
  {
    n: "02",
    title: "Plano de execução",
    body: "Transformamos o diagnóstico em plano: prioridades, metas, responsáveis e prazos pro seu ciclo.",
  },
  {
    n: "03",
    title: "Captação e retenção de creators",
    body: "Como encontrar creators com potencial, abordar sem parecer golpe, apresentar proposta, fechar contrato — e estruturar o relacionamento pra creator ficar.",
  },
  {
    n: "04",
    title: "Aquisição e relevância",
    body: "Canais pra gerar atenção e oportunidade, posicionamento da agência e como parar de depender só de indicação.",
  },
  {
    n: "05",
    title: "Chat e conversão",
    body: "A função comercial do chatter: condução de conversa, ofertas, trabalho de compradores, tops e expirados, recorrência e LTV.",
  },
  {
    n: "06",
    title: "Revisão e correção",
    body: "Voltamos ao raio X inicial, medimos o que mudou, corrigimos o que travou e definimos os próximos passos da operação.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona" eyebrow="Como funciona">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-balance text-foreground sm:text-5xl">
        <span className="italic text-gold-gradient">6 calls</span> individuais.
        Até 2 horas cada. Só você e a operação.
      </h2>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {calls.map((c) => (
          <article
            key={c.n}
            className="group relative overflow-hidden rounded-sm border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:border-gold-soft hover:bg-card/70"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-4xl font-normal text-gold-gradient italic">
                {c.n}
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {c.title}
              </h3>
            </div>
            <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-muted-foreground">
              {c.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-10 border-l-2 border-gold-soft pl-5 font-sans text-sm italic leading-relaxed text-muted-foreground">
        As calls são agendadas diretamente com você, conforme sua
        disponibilidade. Todas gravadas — você tem acesso às suas gravações.
      </p>
    </Section>
  );
}
