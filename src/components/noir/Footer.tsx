import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-5 py-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark />
        <p className="font-sans text-xs leading-relaxed text-muted-foreground">
          © {new Date().getFullYear()} Noir Sessions.
        </p>
      </div>
    </footer>
  );
}
