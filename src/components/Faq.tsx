const FAQS = [
  {
    q: 'Serve pra quem não sabe nada do mercado?',
    a: 'Sim. A Call 1 vira o desenho do seu ponto de partida e a Call 2 vira seu plano de entrada. Você constrói certo desde o início em vez de corrigir depois.',
  },
  {
    q: 'E se eu já tenho agência rodando?',
    a: 'Melhor ainda — a análise parte dos seus números e processos reais. O raio X identifica exatamente onde a operação perde dinheiro hoje.',
  },
  {
    q: 'Por que individual e não em grupo?',
    a: 'Porque correção genérica não resolve problema específico. No individual, 100% do tempo de call é sobre a SUA operação.',
  },
  {
    q: 'As calls são gravadas?',
    a: 'Sim, todas. Você recebe as gravações das suas 6 calls.',
  },
  {
    q: 'Como funciona a visita ao escritório?',
    a: 'Agendada em data combinada, mediante termo de confidencialidade. Deslocamento e hospedagem por conta do mentorado.',
  },
  {
    q: 'Existe parcelamento?',
    a: 'Sim. As condições são apresentadas na call de aplicação.',
  },
  {
    q: 'O que justifica o valor?',
    a: '12 horas de call individual com quem opera o mercado, plano de execução personalizado, contrato da operação, gravações e acesso presencial a uma agência real. Você paga pra pular meses de tentativa e erro.',
  },
  {
    q: 'Vocês garantem resultado?',
    a: 'Não — e desconfie de quem garante. Entregamos processo, direção e correção. O resultado depende da sua execução.',
  },
];

export function Faq() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-center text-3xl leading-tight font-semibold sm:text-4xl">
          Perguntas <span className="gold-text">frequentes</span>
        </h2>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group border-noir-600 bg-noir-800/60 open:border-gold-500/50 rounded-sm border transition"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-semibold sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="gold-text shrink-0 transition group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="text-muted px-5 pb-5 text-sm leading-relaxed sm:text-base">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
