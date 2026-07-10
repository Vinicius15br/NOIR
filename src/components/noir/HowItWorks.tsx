import { useEffect, useRef } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  // Linha dourada que se "desenha" conforme a seção rola.
  // Controla a ALTURA (não transform) pra não conflitar com o Tailwind,
  // e escuta scroll no window E em qualquer container rolável ancestral.
  useEffect(() => {
    const track = trackRef.current;
    const line = lineRef.current;
    if (!track || !line) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.height = "100%";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const prog = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.78 - r.top) / r.height),
      );
      line.style.height = `${prog * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Fallback: se a página rolar dentro de um container (não o window)
    const scroller = track.closest<HTMLElement>("[data-scroll-container]");
    scroller?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      scroller?.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Section id="como-funciona" eyebrow="Como funciona">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-balance text-foreground sm:text-5xl">
        <span className="italic text-gold-gradient">6 calls</span> individuais.
        Até 2 horas cada. Só você e a operação.
      </h2>

      {/* Timeline vertical: trilho + linha que se desenha + cards com nó */}
      <div ref={trackRef} className="relative mt-14 pl-11">
        {/* trilho base (sempre visível) */}
        <span className="pointer-events-none absolute bottom-1.5 left-2.5 top-1.5 w-px bg-border/40" />
        {/* linha dourada — altura controlada via JS (inicia em 0) */}
        <span
          ref={lineRef}
          aria-hidden
          style={{ height: "0%" }}
          className="pointer-events-none absolute left-2.5 top-1.5 w-px bg-gradient-to-b from-[color:var(--gold-deep)] via-[color:var(--gold-bright)] to-[color:var(--gold-deep)] shadow-[0_0_10px_rgba(212,175,55,0.45)]"
        />

        <div className="flex flex-col gap-7">
          {calls.map((c) => (
            <article
              key={c.n}
              className="group relative overflow-hidden rounded-sm border border-border/70 bg-card/40 p-7 transition-all duration-300 hover:translate-x-1 hover:border-gold-soft hover:bg-card/70"
            >
              <span
                aria-hidden
                className="absolute -left-[39px] top-[38px] block h-[9px] w-[9px] rotate-45 bg-gold-gradient shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              />
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
      </div>

      <p className="mt-10 border-l-2 border-gold-soft pl-5 font-sans text-sm italic leading-relaxed text-muted-foreground">
        As calls são agendadas diretamente com você, conforme sua
        disponibilidade. Todas gravadas — você tem acesso às suas gravações.
      </p>
    </Section>
  );
}
