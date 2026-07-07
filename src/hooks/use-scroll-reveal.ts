import { useEffect } from "react";

// Grupos cujos filhos animam individualmente, em cascata
const GROUP_SELECTOR = ".grid, ol, ul, [data-reveal-group]";
const STAGGER_MS = 90;
const MAX_STAGGER_MS = 450;

/**
 * Anima os blocos de conteúdo da landing conforme entram na viewport
 * (fade + slide-up, com cascata dentro de grids e listas).
 * Progressive enhancement: sem JS nada fica escondido, e
 * prefers-reduced-motion desativa tudo.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          "main header nav",
          "main header > div:not([aria-hidden]) > *",
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

    // Cascata: atraso proporcional à posição entre irmãos animados
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
      el.classList.add("reveal");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of targets) observer.observe(el);

    return () => {
      observer.disconnect();
      for (const el of targets) {
        el.classList.remove("reveal", "reveal-visible");
        el.style.removeProperty("--reveal-delay");
      }
    };
  }, []);
}
