import { Section } from "./Section";

export function Problem() {
  return (
    <Section id="problema" eyebrow="O problema">
      <h2 className="font-serif text-3xl leading-[1.15] font-normal text-balance text-foreground sm:text-5xl">
        Você não precisa de mais conteúdo. Precisa de alguém{" "}
        <span className="italic text-gold-gradient">olhando pra SUA operação.</span>
      </h2>

      <div className="mt-10 space-y-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        <p>
          Curso entrega informação. Grupo entrega direção geral. Mas quando o
          problema é a <span className="text-foreground">SUA</span> captação, o{" "}
          <span className="text-foreground">SEU</span> chat, a{" "}
          <span className="text-foreground">SUA</span> creator que saiu —
          resposta genérica não resolve.
        </p>
        <p>
          A Noir Sessions individual existe pra isso: colocar a sua operação na
          mesa, identificar onde ela perde dinheiro e corrigir com quem opera
          esse mercado todos os dias.
        </p>
        <p className="border-l-2 border-gold-soft pl-5 italic text-foreground/90">
          Sem teoria reciclada. Sem "depende". Análise direta do que precisa ser
          corrigido primeiro — na sua realidade, com os seus números.
        </p>
      </div>
    </Section>
  );
}
