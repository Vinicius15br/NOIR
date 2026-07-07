import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBZdFWpw.mjs";
import { d as object, f as string } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form-tracking.functions-C4yi9juu.js
var optionalStr = string().trim().max(200).optional().nullable().transform((v) => v && v.length > 0 ? v : null);
var startSchema = object({
	session_id: string().trim().min(8).max(128),
	landing_path: optionalStr,
	referrer: optionalStr,
	utm_source: optionalStr,
	utm_medium: optionalStr,
	utm_campaign: optionalStr,
	utm_content: optionalStr,
	utm_term: optionalStr
});
var logFormStart_createServerFn_handler = createServerRpc({
	id: "ba831a37cc30d59aad5b1d855e88ebad9055d8db5e077abc13dcf32ed3502d94",
	name: "logFormStart",
	filename: "src/lib/form-tracking.functions.ts"
}, (opts) => logFormStart.__executeServer(opts));
var logFormStart = createServerFn({ method: "POST" }).inputValidator((data) => startSchema.parse(data)).handler(logFormStart_createServerFn_handler, async ({ data }) => {
	const { error } = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} }).from("form_starts").insert({
		session_id: data.session_id,
		landing_path: data.landing_path,
		referrer: data.referrer,
		utm_source: data.utm_source,
		utm_medium: data.utm_medium,
		utm_campaign: data.utm_campaign,
		utm_content: data.utm_content,
		utm_term: data.utm_term
	});
	if (error && error.code !== "23505") console.error("logFormStart error:", error);
	return { ok: true };
});
var listFormStarts_createServerFn_handler = createServerRpc({
	id: "3460c50fc08addea9a7d021b6a9950896f4d200088ceebe5752d5eb7dc41ab9e",
	name: "listFormStarts",
	filename: "src/lib/form-tracking.functions.ts"
}, (opts) => listFormStarts.__executeServer(opts));
var listFormStarts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listFormStarts_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { data, error } = await supabase.from("form_starts").select("id, session_id, created_at, utm_source").order("created_at", { ascending: false }).limit(5e3);
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { listFormStarts_createServerFn_handler, logFormStart_createServerFn_handler };
