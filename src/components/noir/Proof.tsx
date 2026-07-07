// Seção de prova social: prints de vendas reais da operação.
// Os cards abaixo são placeholders no formato de print de celular/chat —
// troque cada bloco tracejado pela imagem real (ver instruções no fim do arquivo).

const prints = [
  { badge: "R$ 2.400", caption: "Venda fechada no chat" },
  { badge: "R$ 890", caption: "Upsell de conteúdo" },
  { badge: "R$ 5.100", caption: "Recompra — top comprador" },
  { badge: "R$ 1.750", caption: "Reativação de expirado" },
  { badge: "R$ 3.200", caption: "Pack + assinatura" },
  { badge: "R$ 640", caption: "Primeira venda do dia" },
];

function PrintCard({ badge, caption, n }: { badge: string; caption: string; n: number }) {
  return (
    <figure className="relative w-[240px] shrink-0 snap-center sm:w-auto">
      <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-gold-soft bg-card/60 shadow-[0_0_40px_-12px_rgba(212,175,55,0.35)]">
        {/* cabeçalho estilo app de chat */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-background/60 px-3 py-2.5">
          <span className="h-6 w-6 rounded-full bg-gold-gradient opacity-80" />
          <span className="h-2 w-20 rounded-full bg-muted-foreground/30" />
          <span className="ml-auto h-2 w-6 rounded-full bg-muted-foreground/20" />
        </div>

        {/* esqueleto de conversa */}
        <div className="flex flex-col gap-2 p-3">
          <span className="h-2.5 w-3/5 rounded-full bg-muted-foreground/15" />
          <span className="h-2.5 w-2/5 self-end rounded-full bg-primary/25" />
          <span className="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
          <span className="h-2.5 w-1/3 self-end rounded-full bg-primary/25" />

          {/* bolha de venda em destaque */}
          <div className="mt-2 self-end rounded-lg rounded-br-none bg-gradient-to-b from-amber-300/90 to-amber-600/90 px-3 py-2 text-right">
            <span className="block font-sans text-[9px] font-medium uppercase tracking-wider text-black/70">
              Pagamento recebido
            </span>
            <span className="block font-serif text-lg font-semibold leading-tight text-black">
              {badge}
            </span>
          </div>
        </div>

        {/* overlay indicando onde entra o print real */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/85 via-transparent to-transparent p-3">
          <span className="rounded-full border border-dashed border-gold-soft bg-background/70 px-3 py-1 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            Print de venda #{n}
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
    <section id="provas" className="relative w-full px-5 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-gold-gradient" />
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-gold-gradient font-semibold">
            Provas reais
          </span>
        </div>
        <h2 className="font-serif text-3xl leading-[1.15] font-normal text-foreground sm:text-5xl">
          Não é teoria. São{" "}
          <span className="italic text-gold-gradient">vendas reais</span>{" "}
          fechadas dentro da operação.
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
          Prints de conversas e vendas reais fechadas no chat da operação que
          conduz essa mentoria. É o mesmo método que você vai aplicar — na
          prática, gerando caixa.
        </p>
      </div>

      {/* galeria: rolagem horizontal no mobile, grade no desktop */}
      <div className="mx-auto mt-12 w-full max-w-5xl">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:gap-6">
          {prints.map((p, i) => (
            <PrintCard key={p.caption} n={i + 1} badge={p.badge} caption={p.caption} />
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-5 text-center font-sans text-xs leading-relaxed text-muted-foreground/70">
          Dados sensíveis das creators e dos compradores são borrados nos prints
          reais. Deslize para ver mais →
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// COMO TROCAR PELOS PRINTS REAIS
// 1. Salve as imagens em /public (ex.: /public/prints/venda-1.jpg).
// 2. No PrintCard, substitua o bloco "esqueleto de conversa" + "overlay"
//    por: <img src="/prints/venda-1.jpg" alt="Print de venda no chat"
//              className="absolute inset-0 h-full w-full object-cover" />
// 3. Ajuste o array `prints` (badge/caption) ou remova se o valor já
//    aparecer no próprio print.
// Dica: borre número de telefone, nome e @ das creators/compradores antes.
// ─────────────────────────────────────────────────────────────
