import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBZdFWpw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-_CQdEckr.js
var listApplications_createServerFn_handler = createServerRpc({
	id: "1b59404f5dd7ebf22a4802040e66ad34f86c454a3111963b9acb931d6cb5f54e",
	name: "listApplications",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listApplications.__executeServer(opts));
var listApplications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listApplications_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (roleError || !isAdmin) throw new Error("Forbidden");
	const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listApplicationEvents_createServerFn_handler = createServerRpc({
	id: "cfd6649aa6e57a224e21c63731a5fc298ab2901c26cf8c94533841d17541f5a9",
	name: "listApplicationEvents",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listApplicationEvents.__executeServer(opts));
var listApplicationEvents = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listApplicationEvents_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (roleError || !isAdmin) throw new Error("Forbidden");
	const { data, error } = await supabase.from("application_events").select("*").order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var deleteApplication_createServerFn_handler = createServerRpc({
	id: "7123a0f1827ab182e080b8ee5731e8656bf3eda9f728947ac3649ee265ee4bda",
	name: "deleteApplication",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteApplication.__executeServer(opts));
var deleteApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(deleteApplication_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { error } = await supabase.from("applications").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setApplicationContacted_createServerFn_handler = createServerRpc({
	id: "b76bc86ce973242d8d91477195f60fa2158683241a5bc366413a8a59530e61d3",
	name: "setApplicationContacted",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setApplicationContacted.__executeServer(opts));
var setApplicationContacted = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(setApplicationContacted_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { data: current } = await supabase.from("applications").select("first_contacted_at, attempts, attempts_to_contact").eq("id", data.id).single();
	const patch = { contacted: data.contacted };
	if (data.contacted && !current?.first_contacted_at) patch.first_contacted_at = (/* @__PURE__ */ new Date()).toISOString();
	if (data.contacted && current?.attempts_to_contact == null) patch.attempts_to_contact = Math.max(1, current?.attempts ?? 0);
	const { error } = await supabase.from("applications").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setApplicationNotes_createServerFn_handler = createServerRpc({
	id: "3820f4b5634fcfaaab2dcf896d2b5cab6e1028b3f72bee8f6ed8382e82bc5d0d",
	name: "setApplicationNotes",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setApplicationNotes.__executeServer(opts));
var setApplicationNotes = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(setApplicationNotes_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const notes = data.notes.slice(0, 5e3);
	const { error } = await supabase.from("applications").update({ notes }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setApplicationStatus_createServerFn_handler = createServerRpc({
	id: "dd2a8c89ce3736258bb458077f853a2565c444665a699be34aede0a82db3cbaf",
	name: "setApplicationStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setApplicationStatus.__executeServer(opts));
var setApplicationStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(setApplicationStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	if (data.status === "perdido" && !data.lost_reason) throw new Error("Motivo de perda obrigatório");
	const { data: current } = await supabase.from("applications").select("first_contacted_at, attempts, attempts_to_contact").eq("id", data.id).single();
	const patch = {
		status: data.status,
		lost_reason: data.status === "perdido" ? data.lost_reason ?? null : null
	};
	const reached = data.status === "contatado" || data.status === "fechado";
	if (reached && !current?.first_contacted_at) patch.first_contacted_at = (/* @__PURE__ */ new Date()).toISOString();
	if (reached && current?.attempts_to_contact == null) patch.attempts_to_contact = Math.max(1, current?.attempts ?? 0);
	const { error } = await supabase.from("applications").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var registerAttempt_createServerFn_handler = createServerRpc({
	id: "3c96020f32bb5a23cd6d658545e0ea926b933471cd02ee52c50366ad56816e42",
	name: "registerAttempt",
	filename: "src/lib/admin.functions.ts"
}, (opts) => registerAttempt.__executeServer(opts));
var registerAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(registerAttempt_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { data: current, error: readErr } = await supabase.from("applications").select("attempts, first_contacted_at").eq("id", data.id).single();
	if (readErr) throw new Error(readErr.message);
	const next = (current?.attempts ?? 0) + 1;
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const patch = {
		attempts: next,
		last_attempt_at: nowIso
	};
	if (!current?.first_contacted_at) patch.first_contacted_at = nowIso;
	const { error } = await supabase.from("applications").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		attempts: next
	};
});
var undoAttempt_createServerFn_handler = createServerRpc({
	id: "f724e9015ae6ee4ac389612a234bf0c8288fa52a204b29c8b3bd5264d5238c95",
	name: "undoAttempt",
	filename: "src/lib/admin.functions.ts"
}, (opts) => undoAttempt.__executeServer(opts));
var undoAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(undoAttempt_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: isAdmin } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (!isAdmin) throw new Error("Forbidden");
	const { data: current, error: readErr } = await supabase.from("applications").select("attempts").eq("id", data.id).single();
	if (readErr) throw new Error(readErr.message);
	const next = Math.max(0, (current?.attempts ?? 0) - 1);
	const { error } = await supabase.from("applications").update({
		attempts: next,
		last_attempt_at: next === 0 ? null : (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		attempts: next
	};
});
//#endregion
export { deleteApplication_createServerFn_handler, listApplicationEvents_createServerFn_handler, listApplications_createServerFn_handler, registerAttempt_createServerFn_handler, setApplicationContacted_createServerFn_handler, setApplicationNotes_createServerFn_handler, setApplicationStatus_createServerFn_handler, undoAttempt_createServerFn_handler };
