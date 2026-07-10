import { useEffect, useRef } from "react";

/**
 * Barra de progresso de leitura fixa no topo.
 * Acompanha o quanto da página já foi rolado. Desativa em prefers-reduced-motion.
 * Uso: colocar <ReadingProgress /> logo dentro do <main> em src/routes/index.tsx.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-gold-gradient shadow-[0_0_12px_rgba(212,175,55,0.5)] will-change-transform"
    />
  );
}
