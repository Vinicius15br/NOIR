export function Hero() {
  return (
    <header className="glow relative overflow-hidden px-6 pt-16 pb-20 text-center sm:pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className="gold-text text-3xl leading-none">✦</span>
          <span className="font-serif text-2xl font-semibold tracking-[0.35em] uppercase">
            <span className="gold-text">Noir</span>{' '}
            <span className="text-cream">Sessions</span>
          </span>
        </div>

        <h1 className="font-serif text-4xl leading-tight font-semibold text-balance sm:text-5xl md:text-6xl">
          Acompanhamento individual pra{' '}
          <span className="gold-text">estruturar e escalar</span> sua operação
          de agência.
        </h1>

        <p className="text-muted mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
          6 encontros individuais de até 2 horas com o Rafa, análise completa
          da sua operação e uma visita presencial ao escritório da agência.
          Poucas vagas por ciclo — entrada por aplicação.
        </p>

        <div className="mt-10">
          <a
            href="#aplicacao"
            className="from-gold-600 via-gold-400 to-gold-600 text-noir-950 inline-block rounded-sm bg-gradient-to-r px-8 py-4 text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(212,175,55,0.35)] transition hover:shadow-[0_0_50px_rgba(212,175,55,0.55)]"
          >
            Quero aplicar para uma vaga
          </a>
          <p className="text-muted mt-4 text-xs sm:text-sm">
            Preencha a aplicação e nossa equipe entra em contato por ligação.
          </p>
        </div>
      </div>
    </header>
  );
}
