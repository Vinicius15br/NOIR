import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBZdFWpw.mjs";
import { t as createSsrRpc } from "./createSsrRpc-w4A1KCat.mjs";
import { d as object, f as string } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/form-tracking.functions-Cxl8jAQ3.js
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
var logFormStart = createServerFn({ method: "POST" }).inputValidator((data) => startSchema.parse(data)).handler(createSsrRpc("ba831a37cc30d59aad5b1d855e88ebad9055d8db5e077abc13dcf32ed3502d94"));
var listFormStarts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3460c50fc08addea9a7d021b6a9950896f4d200088ceebe5752d5eb7dc41ab9e"));
//#endregion
export { logFormStart as n, listFormStarts as t };
