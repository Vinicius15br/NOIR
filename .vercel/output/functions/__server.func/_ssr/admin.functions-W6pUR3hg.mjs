import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBZdFWpw.mjs";
import { t as createSsrRpc } from "./createSsrRpc-w4A1KCat.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-W6pUR3hg.js
var listApplications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1b59404f5dd7ebf22a4802040e66ad34f86c454a3111963b9acb931d6cb5f54e"));
var listApplicationEvents = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("cfd6649aa6e57a224e21c63731a5fc298ab2901c26cf8c94533841d17541f5a9"));
var deleteApplication = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("7123a0f1827ab182e080b8ee5731e8656bf3eda9f728947ac3649ee265ee4bda"));
var setApplicationContacted = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("b76bc86ce973242d8d91477195f60fa2158683241a5bc366413a8a59530e61d3"));
var setApplicationNotes = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("3820f4b5634fcfaaab2dcf896d2b5cab6e1028b3f72bee8f6ed8382e82bc5d0d"));
var setApplicationStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("dd2a8c89ce3736258bb458077f853a2565c444665a699be34aede0a82db3cbaf"));
var registerAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("3c96020f32bb5a23cd6d658545e0ea926b933471cd02ee52c50366ad56816e42"));
var undoAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("f724e9015ae6ee4ac389612a234bf0c8288fa52a204b29c8b3bd5264d5238c95"));
//#endregion
export { setApplicationContacted as a, undoAttempt as c, registerAttempt as i, listApplicationEvents as n, setApplicationNotes as o, listApplications as r, setApplicationStatus as s, deleteApplication as t };
