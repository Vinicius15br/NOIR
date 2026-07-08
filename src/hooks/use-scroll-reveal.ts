import { useEffect } from "react";

// Grupos cujos filhos animam individualmente, em cascata
const GROUP_SELECTOR = ".grid, ol, ul, [data-reveal-group]";
const STAGGER_MS = 100;
const MAX_STAGGER_MS = 520;

const VARIANTS = [
  "rv-up",
  "rv-blur",
  "rv-scale",
  "rv-left",
  "rv-right",
] as const;

// Escolhe a animação conforme o tipo de elemento, pra dar variedade
// coordenada em vez de tudo igual.
function variantFor(el: HTMLElement, indexInGroup: number): string {
  const explicit = el.getAttribute("data-reveal");
  if (explicit) return `rv-${explicit}`;

  const tag = el.tagName;
  if (tag === "IMG" || tag === "FIGURE" || el.querySelector("img")) {
    return "rv-scale";
  }
  if (tag === "H1" || tag === "H2") return "rv-blur";

  // Cards em grade alternam a direção de entrada, dando movimento
  if (el.parentElement?.matches(GROUP_SELECTOR) && el.tagName === "ARTICLE") {
    return indexInGroup % 2 === 0 ? "rv-left" : "rv-right";
  }
  return "rv-up";
}

/**
 * Anima os blocos de conteúdo da landing conforme entram na viewport,
 * com variações por tipo de elemento (título, imagem, texto, cards) e
 * cascata dentro de grids e listas.
 * Progressive enhancement: sem JS nada fica escondido, e
 * prefers-reduced-motion desativa tudo.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          // hero (header) tem sua própria animação de entrada no load
          "main section > div > *",
          "main > footer > *",
        ].join(", "),
      ),
    );

    const targets: HTMLElement[] = [];
    for (const block of blocks) {
      const children = Array.from(block.children) as HTMLElement[];
      if (
        block.matches(GROUP_SELECTOR) &&
        children.length >= 2 &&
        children.length <= 12
      ) {
        targets.push(...children);
      } else {
        targets.push(block);
      }
    }

    // Cascata + variante por elemento
    const siblingCount = new Map<HTMLElement, number>();
    for (const el of targets) {
      const parent = el.parentElement;
      if (!parent) continue;
      const index = siblingCount.get(parent) ?? 0;
      siblingCount.set(parent, index + 1);
      el.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * STAGGER_MS, MAX_STAGGER_MS)}ms`,
      );
      el.classList.add("rv", variantFor(el, index));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rv-in");
            observer.unobserve(entry.target);
          }
        }
      },
      // Sem margem negativa embaixo (travaria o último elemento, ex.: rodapé);
      // revela quando ~12% do elemento entra na viewport.
      { threshold: 0.12 },
    );
    for (const el of targets) observer.observe(el);

    // Rede de segurança para casos que o threshold pode não cobrir
    // (elementos maiores que a viewport, ou o último elemento junto ao rodapé
    // que nunca chega a 12% mesmo no fim da rolagem).
    const reveal = (el: HTMLElement) => {
      el.classList.add("rv-in");
      observer.unobserve(el);
    };
    const safety = () => {
      const vh = window.innerHeight;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      let remaining = 0;
      for (const el of targets) {
        if (el.classList.contains("rv-in")) continue;
        const r = el.getBoundingClientRect();
        // Visível na viewport, ou já rolou até o fim da página
        if (atBottom || (r.top < vh && r.bottom > 0)) {
          reveal(el);
        } else {
          remaining += 1;
        }
      }
      if (remaining === 0) window.removeEventListener("scroll", safety);
    };
    window.addEventListener("scroll", safety, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", safety);
      for (const el of targets) {
        el.classList.remove("rv", "rv-in", ...VARIANTS);
        el.style.removeProperty("--reveal-delay");
      }
    };
  }, []);
}
