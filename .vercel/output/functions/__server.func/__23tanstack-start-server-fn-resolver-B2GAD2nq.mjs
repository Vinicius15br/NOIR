//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B2GAD2nq.js
var manifest = {
	"0eb51b4df6b0d88ecdda68f490c97172a3b61b1cca7dcca9590a260f83d004f5": {
		functionName: "submitApplication_createServerFn_handler",
		importer: () => import("./_ssr/applications.functions-BbErkarj.mjs")
	},
	"1b59404f5dd7ebf22a4802040e66ad34f86c454a3111963b9acb931d6cb5f54e": {
		functionName: "listApplications_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"3460c50fc08addea9a7d021b6a9950896f4d200088ceebe5752d5eb7dc41ab9e": {
		functionName: "listFormStarts_createServerFn_handler",
		importer: () => import("./_ssr/form-tracking.functions-C4yi9juu.mjs")
	},
	"3820f4b5634fcfaaab2dcf896d2b5cab6e1028b3f72bee8f6ed8382e82bc5d0d": {
		functionName: "setApplicationNotes_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"3c96020f32bb5a23cd6d658545e0ea926b933471cd02ee52c50366ad56816e42": {
		functionName: "registerAttempt_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"7123a0f1827ab182e080b8ee5731e8656bf3eda9f728947ac3649ee265ee4bda": {
		functionName: "deleteApplication_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"b76bc86ce973242d8d91477195f60fa2158683241a5bc366413a8a59530e61d3": {
		functionName: "setApplicationContacted_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"ba831a37cc30d59aad5b1d855e88ebad9055d8db5e077abc13dcf32ed3502d94": {
		functionName: "logFormStart_createServerFn_handler",
		importer: () => import("./_ssr/form-tracking.functions-C4yi9juu.mjs")
	},
	"cfd6649aa6e57a224e21c63731a5fc298ab2901c26cf8c94533841d17541f5a9": {
		functionName: "listApplicationEvents_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"dd2a8c89ce3736258bb458077f853a2565c444665a699be34aede0a82db3cbaf": {
		functionName: "setApplicationStatus_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	},
	"f724e9015ae6ee4ac389612a234bf0c8288fa52a204b29c8b3bd5264d5238c95": {
		functionName: "undoAttempt_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-_CQdEckr.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
