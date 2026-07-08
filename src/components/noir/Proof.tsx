// Seção de prova social: prints de vendas reais da operação.
// Para adicionar mais: salve a imagem em /public/prints e acrescente ao array.

const prints = [
  {
    src: "/prints/venda-1.jpg",
    value: "R$ 5.000",
    caption: "Chamada de vídeo fechada no chat",
  },
  {
    src: "/prints/venda-2.jpg",
    value: "R$ 2.000",
    caption: "Solicitação de mídia paga na hora",
  },
];

function PrintCard({
  src,
  value,
  caption,
}: {
  src: string;
  value: string;
  caption: string;
}) {
  return (
    <figure className="group w-[280px] shrink-0 snap-center sm:w-full">
      <div className="relative overflow-hidden rounded-xl border border-gold-soft bg-background shadow-[0_0_50px_-14px_rgba(212,175,55,0.4)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[color:var(--gold)]/70 group-hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.6)]">
        <img
          src={src}
          alt={`Print de venda — ${caption}`}
          loading="lazy"
          className="block w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* selo de valor */}
        <div className="absolute right-3 top-3 rounded-md bg-gradient-to-b from-amber-300 to-amber-600 px-2.5 py-1 shadow-lg">
          <span className="block font-serif text-sm font-semibold leading-none text-black">
            {value}
          </span>
        </div>
        {/* etiqueta "pago" */}
        <div className="absolute left-3 top-3 rounded-full border border-gold-soft bg-background/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-gradient">
            ✓ Pago
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center font-sans text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

export function Proof() {
  return (
    <section
      id="provas"
      className="relative w-full px-5 py-20 sm:px-8 sm:py-28 md:py-32"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-gold-gradient" />
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-gold-gradient font-semibold">
            Provas reais
          </span>
        </div>
        <h2 className="font-serif text-3xl leading-[1.15] font-normal text-balance text-foreground sm:text-5xl">
          Não é teoria. São{" "}
          <span className="italic text-gold-gradient">vendas reais</span>{" "}
          fechadas dentro da operação.
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
          Prints de vendas reais fechadas no chat da operação que conduz essa
          mentoria. É o mesmo método que você vai aplicar — na prática, gerando
          caixa.
        </p>
      </div>

      {/* galeria: rolagem horizontal no mobile, grade no desktop */}
      <div className="mx-auto mt-12 w-full max-w-3xl">
        <div
          data-reveal-group
          className="flex snap-x snap-mandatory justify-start gap-5 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:justify-center sm:overflow-visible sm:pb-0 lg:gap-8"
        >
          {prints.map((p) => (
            <PrintCard key={p.src} src={p.src} value={p.value} caption={p.caption} />
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-5 text-center font-sans text-xs leading-relaxed text-muted-foreground/70">
          Dados sensíveis das creators e dos compradores são preservados.
        </p>
      </div>
    </section>
  );
}
