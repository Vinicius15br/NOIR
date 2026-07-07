import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { c as _enum, d as object, f as string, l as literal } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/applications.functions-BbErkarj.js
var optionalStr = string().trim().max(200).optional().nullable().transform((v) => v && v.length > 0 ? v : null);
var applicationSchema = object({
	full_name: string().trim().min(2, "Nome muito curto").max(120),
	whatsapp: string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "WhatsApp inválido").max(20),
	instagram: string().trim().min(1, "Informe seu @").max(60).regex(/^[A-Za-z0-9._]+$/, "Use apenas letras, números, ponto e underline"),
	moment: _enum(["rodando", "zero"]),
	revenue_band: _enum([
		"ate-5k",
		"5-20k",
		"20-50k",
		"acima-50k"
	]).nullable().optional(),
	lgpd_consent: literal(true, { message: "É necessário aceitar o termo de contato" }),
	utm_source: optionalStr,
	utm_medium: optionalStr,
	utm_campaign: optionalStr,
	utm_content: optionalStr,
	utm_term: optionalStr,
	referrer: optionalStr,
	landing_path: optionalStr,
	session_id: optionalStr
});
var submitApplication_createServerFn_handler = createServerRpc({
	id: "0eb51b4df6b0d88ecdda68f490c97172a3b61b1cca7dcca9590a260f83d004f5",
	name: "submitApplication",
	filename: "src/lib/applications.functions.ts"
}, (opts) => submitApplication.__executeServer(opts));
var submitApplication = createServerFn({ method: "POST" }).inputValidator((data) => applicationSchema.parse(data)).handler(submitApplication_createServerFn_handler, async ({ data }) => {
	const { error } = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} }).from("applications").insert({
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
		session_id: data.session_id
	});
	if (error) {
		console.error("submitApplication error:", error);
		throw new Error("Não foi possível enviar sua aplicação. Tente novamente.");
	}
	return { ok: true };
});
//#endregion
export { submitApplication_createServerFn_handler };
