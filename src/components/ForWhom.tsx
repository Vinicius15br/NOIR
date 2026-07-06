const FOR = [
  'Já tem uma operação rodando e travou em captação, retenção, conteúdo ou chat',
  'Está começando do zero e quer estruturar certo desde o primeiro dia, sem meses de tentativa e erro',
  'Quer acesso direto ao expert, sem dividir atenção com uma turma',
  'Está disposto a executar o que for definido nas calls',
];

const NOT_FOR = [
  'Procura fórmula mágica ou renda garantida',
  'Quer só consumir conteúdo sem aplicar',
  'Não pode tratar isso como uma operação profissional',
];

export function ForWhom() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <div className="border-gold-500/40 bg-noir-800/60 rounded-sm border p-7">
          <h3 className="font-serif text-2xl font-semibold">
            <span className="gold-text">É pra você se:</span>
          </h3>
          <ul className="mt-5 space-y-4">
            {FOR.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                <span className="gold-text mt-0.5 shrink-0">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-noir-600 bg-noir-900/60 rounded-sm border p-7">
          <h3 className="text-muted font-serif text-2xl font-semibold">
            NÃO é pra você se:
          </h3>
          <ul className="mt-5 space-y-4">
            {NOT_FOR.map((item) => (
              <li
                key={item}
                className="text-muted flex gap-3 text-sm leading-relaxed sm:text-base"
              >
                <span className="mt-0.5 shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
