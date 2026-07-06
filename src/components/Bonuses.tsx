const BONUSES = [
  {
    title: 'Contrato da operação',
    text: 'O contrato que usamos com nossas creators, pra você adaptar à sua realidade (recomendamos revisão jurídica antes do uso).',
  },
  {
    title: 'Gravações das suas 6 calls',
    text: 'Pra revisitar decisões e planos sempre que precisar.',
  },
  {
    title: 'Gravações da turma em grupo anterior',
    text: 'Você começa a consumir conteúdo antes mesmo da primeira call.',
  },
];

export function Bonuses() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-center text-3xl leading-tight font-semibold sm:text-4xl">
          O que você leva <span className="gold-text">além das calls</span>
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {BONUSES.map((bonus) => (
            <div
              key={bonus.title}
              className="border-noir-600 bg-noir-800/60 hover:border-gold-500/50 rounded-sm border p-7 text-center transition"
            >
              <span className="gold-text text-2xl">✦</span>
              <h3 className="font-serif mt-3 text-xl font-semibold">
                {bonus.title}
              </h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                {bonus.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
