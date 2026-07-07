import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const optionalStr = z
  .string()
  .trim()
  .max(200)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null));

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Nome muito curto").max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "WhatsApp inválido")
    .max(20),
  instagram: z
    .string()
    .trim()
    .min(1, "Informe seu @")
    .max(60)
    .regex(/^[A-Za-z0-9._]+$/, "Use apenas letras, números, ponto e underline"),
  moment: z.enum(["rodando", "zero"]),
  revenue_band: z
    .enum(["ate-5k", "5-20k", "20-50k", "acima-50k"])
    .nullable()
    .optional(),
  lgpd_consent: z.literal(true, {
    message: "É necessário aceitar o termo de contato",
  }),
  utm_source: optionalStr,
  utm_medium: optionalStr,
  utm_campaign: optionalStr,
  utm_content: optionalStr,
  utm_term: optionalStr,
  referrer: optionalStr,
  landing_path: optionalStr,
  session_id: optionalStr,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => applicationSchema.parse(data))
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

    const { error } = await supabase.from("applications").insert({
      full_name: data.full_name,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      moment: data.moment,
      revenue_band: data.revenue_band ?? null,
      lgpd_consent: data.lgpd_consent,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      referrer: data.referrer,
      landing_path: data.landing_path,
      session_id: data.session_id,
    });

    if (error) {
      console.error("submitApplication error:", error);
      throw new Error("Não foi possível enviar sua aplicação. Tente novamente.");
    }

    return { ok: true as const };
  });
