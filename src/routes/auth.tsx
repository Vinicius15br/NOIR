import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "viniciusdiasr2004@gmail.com";
const DEFAULT_PASSWORD = "090904";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Acesso — Noir Sessions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function sanitizeNext(next: string): string | null {
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const safeNext = sanitizeNext(next);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = safeNext ?? "/admin";
      }
    });
  }, [safeNext]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      let { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      // First visit for the admin account: create it silently, then sign in.
      if (
        error &&
        /invalid.*credentials/i.test(error.message) &&
        normalizedEmail === ADMIN_EMAIL &&
        password === DEFAULT_PASSWORD
      ) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });
        if (signUpError) throw signUpError;
        const retry = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        error = retry.error;
      }
      if (error) throw error;
      window.location.href = safeNext ?? "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-center text-gold-gradient mb-2">
          Noir Sessions
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Painel restrito
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-b from-amber-300 to-amber-600 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Aguarde…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
