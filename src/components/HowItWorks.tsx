const CALLS = [
  {
    title: 'Raio X completo',
    text: 'Análise da sua estrutura (ou do seu ponto de partida, se está começando): processos, equipe, números, organização. Saída: diagnóstico do que corrigir primeiro.',
  },
  {
    title: 'Plano de execução',
    text: 'Transformamos o diagnóstico em plano: prioridades, metas, responsáveis e prazos pro seu ciclo.',
  },
  {
    title: 'Captação e retenção de creators',
    text: 'Como encontrar creators com potencial, abordar sem parecer golpe, apresentar proposta, fechar contrato — e estruturar o relacionamento pra creator ficar.',
  },
  {
    title: 'Aquisição e relevância',
    text: 'Canais pra gerar atenção e oportunidade, posicionamento da agência e como parar de depender só de indicação.',
  },
  {
    title: 'Chat e conversão',
    text: 'A função comercial do chatter: condução de conversa, ofertas, trabalho de compradores, tops e expirados, recorrência e LTV.',
  },
  {
    title: 'Revisão e correção',
    text: 'Voltamos ao raio X inicial, medimos o que mudou, corrigimos o que travou e definimos os próximos passos da operação.',
  },
];

export function HowItWorks() {
  return (
    <section className="glow px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-center text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          <span className="gold-text">6 calls individuais.</span> Até 2 horas
          cada. Só você e a operação.
        </h2>

        <ol className="mt-12 space-y-4">
          {CALLS.map((call, i) => (
            <li
              key={call.title}
              className="border-noir-600 bg-noir-800/60 hover:border-gold-500/50 flex gap-5 rounded-sm border p-6 transition"
            >
              <span className="gold-text font-serif shrink-0 text-4xl font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  Call {i + 1} — <span className="gold-text">{call.title}</span>
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed sm:text-base">
                  {call.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-muted mt-8 text-center text-xs sm:text-sm">
          As calls são agendadas diretamente com você, conforme sua
          disponibilidade. Todas gravadas — você tem acesso às suas gravações.
        </p>
      </div>
    </section>
  );
}
