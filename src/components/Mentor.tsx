export function Mentor() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl leading-tight font-semibold sm:text-4xl">
          Quem vai olhar pra <span className="gold-text">sua operação</span>
        </h2>

        <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:text-left">
          {/* Foto do Rafa — substituir o placeholder pela imagem real */}
          <div className="border-gold-500/50 bg-noir-700 flex size-40 shrink-0 items-center justify-center rounded-full border-2 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <span className="gold-text font-serif text-6xl font-semibold">R</span>
          </div>
          <p className="text-muted text-base leading-relaxed sm:text-lg">
            Rafa é fundador da <strong className="text-cream">H!</strong> e
            conduz a mentoria pessoalmente. Todas as 6 calls são com ele — sem
            repassador de conteúdo, sem “time de suporte” respondendo por ele.
            Nas calls que envolvem chat e ferramentas, membros da equipe da
            operação participam junto.
          </p>
        </div>

        {/* Espaço pra prova social: prints de resultado, depoimentos da turma
            anterior, highlights de calls — usar o que já existe do grupo. */}
        <div className="border-noir-600 text-muted/60 mt-10 rounded-sm border border-dashed p-10 text-sm">
          [ Prova social — prints de resultado, depoimentos e highlights ]
        </div>
      </div>
    </section>
  );
}
