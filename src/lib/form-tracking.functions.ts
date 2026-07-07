import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const optionalStr = z
  .string()
  .trim()
  .max(200)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null));

const startSchema = z.object({
  session_id: z.string().trim().min(8).max(128),
  landing_path: optionalStr,
  referrer: optionalStr,
  utm_source: optionalStr,
  utm_medium: optionalStr,
  utm_campaign: optionalStr,
  utm_content: optionalStr,
  utm_term: optionalStr,
});

export const logFormStart = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => startSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(
      (process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL)!,
      (process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)!,
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
    // Best-effort — silently ignore duplicate session_id via unique constraint
    const { error } = await supabase.from("form_starts").insert({
      session_id: data.session_id,
      landing_path: data.landing_path,
      referrer: data.referrer,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
    });
    if (error && error.code !== "23505") {
      console.error("logFormStart error:", error);
    }
    return { ok: true as const };
  });

export type FormStartRow = {
  id: string;
  session_id: string;
  created_at: string;
  utm_source: string | null;
};

export const listFormStarts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("form_starts")
      .select("id, session_id, created_at, utm_source")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);
    return (data ?? []) as FormStartRow[];
  });
