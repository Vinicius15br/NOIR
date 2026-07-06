import { PRICE_LABEL, SHOW_PRICE, SPOTS_PER_CYCLE } from '../config';

const STEPS = [
  'Você preenche o formulário abaixo',
  'Nossa equipe te liga pra entender seu momento e sua operação',
  'Se fizer sentido pros dois lados, sua vaga é confirmada na própria call',
];

export function Investment() {
  const spots =
    SPOTS_PER_CYCLE === null ? 'poucos' : String(SPOTS_PER_CYCLE);

  return (
    <section className="glow px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl leading-tight font-semibold sm:text-4xl">
          Como funciona a <span className="gold-text">entrada</span>
        </h2>

        <p className="text-muted mt-6 text-base leading-relaxed sm:text-lg">
          O acompanhamento individual é limitado a {spots} mentorados por ciclo
          — é o Rafa quem conduz cada call, e a agenda da operação comporta
          poucas vagas sem comprometer a qualidade da análise.
        </p>

        {SHOW_PRICE ? (
          <p className="mt-8 text-lg sm:text-xl">
            Investimento:{' '}
            <span className="gold-text font-serif text-3xl font-bold sm:text-4xl">
              {PRICE_LABEL}
            </span>
            <span className="text-muted block text-sm">
              com opção de parcelamento
            </span>
          </p>
        ) : (
          <p className="text-muted mt-8 text-base sm:text-lg">
            O investimento e as condições de parcelamento são apresentados na
            call de aplicação, depois de entendermos seu momento.
          </p>
        )}

        <p className="text-muted mt-8 text-base sm:text-lg">
          Por ser individual e limitado, a entrada é por aplicação:
        </p>

        <ol className="mx-auto mt-6 max-w-md space-y-4 text-left">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-start gap-4">
              <span className="border-gold-500/60 gold-text font-serif flex size-9 shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed sm:text-base">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <p className="text-muted/80 mt-8 text-xs sm:text-sm">
          A aplicação não gera cobrança nem compromisso. É uma conversa pra
          avaliar se a mentoria faz sentido pro seu momento.
        </p>
      </div>
    </section>
  );
}
