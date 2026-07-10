import { useEffect, useRef } from "react";

/**
 * Barra de progresso de leitura fixa no topo.
 * Controla a LARGURA (não transform) e escuta scroll no window E em
 * qualquer container rolável, cobrindo layouts onde o body não rola.
 * Uso: <ReadingProgress /> como primeira linha do <main> em index.tsx.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      // tenta o scroll do documento; se não houver, procura um container rolável
      let top = window.scrollY || doc.scrollTop;
      let max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        const sc = document.querySelector<HTMLElement>(
          "[data-scroll-container]",
        );
        if (sc) {
          top = sc.scrollTop;
          max = sc.scrollHeight - sc.clientHeight;
        }
      }
      const p = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
      bar.style.width = `${p * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const sc = document.querySelector<HTMLElement>("[data-scroll-container]");
    sc?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      sc?.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ width: "0%" }}
      className="fixed left-0 top-0 z-[60] h-0.5 bg-gold-gradient shadow-[0_0_12px_rgba(212,175,55,0.5)]"
    />
  );
}
