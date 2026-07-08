import { useEffect, useRef, useState } from "react";

/**
 * Player de música de fundo.
 * Navegadores bloqueiam autoplay com som até o 1º gesto do usuário, então:
 * tentamos tocar no load e, se bloqueado, iniciamos no primeiro
 * clique/toque/rolagem. Um botão flutuante permite pausar/religar.
 * Se o arquivo não existir, o controle simplesmente não aparece.
 */
export function MusicPlayer({
  src = "/music/theme.mp3",
  volume = 0.35,
}: {
  src?: string;
  volume?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onReady = () => setReady(true);
    const onError = () => setReady(false);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", onError);

    const start = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          /* bloqueado — espera o gesto do usuário */
        });
    };

    // tenta imediatamente; se o navegador bloquear, dispara no 1º gesto
    start();
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const onFirst = () => {
      if (audio.paused) start();
      events.forEach((e) => window.removeEventListener(e, onFirst));
    };
    events.forEach((e) =>
      window.addEventListener(e, onFirst, { passive: true }),
    );

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      events.forEach((e) => window.removeEventListener(e, onFirst));
    };
  }, [volume]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      {ready && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Tocar música"}
          className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--gold)]/50 bg-background/80 shadow-[0_0_25px_-6px_rgba(212,175,55,0.5)] backdrop-blur-sm transition-transform hover:scale-105"
        >
          <span className="flex items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                data-playing={playing}
                className="w-[3px] rounded-full bg-gold-gradient data-[playing=false]:h-1.5"
                style={
                  playing
                    ? {
                        animation: `eq 0.9s ease-in-out ${i * 0.15}s infinite`,
                      }
                    : undefined
                }
              />
            ))}
          </span>
        </button>
      )}
    </>
  );
}
