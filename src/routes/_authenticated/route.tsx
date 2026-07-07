import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Sem timeout, um Supabase lento/frio deixa a página presa em branco.
// Falha rápido pro login em vez de travar indefinidamente.
const AUTH_TIMEOUT_MS = 8000;

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const result = await Promise.race([
      supabase.auth
        .getUser()
        .then((r) => r)
        .catch(() => null),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), AUTH_TIMEOUT_MS),
      ),
    ]);
    if (!result || result.error || !result.data.user) {
      throw redirect({ to: "/auth" });
    }
    return { user: result.data.user };
  },
  component: () => <Outlet />,
});
