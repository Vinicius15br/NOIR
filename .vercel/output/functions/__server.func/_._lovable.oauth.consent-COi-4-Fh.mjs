import { _ as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-COi-4-Fh.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
	className: "min-h-screen flex items-center justify-center bg-background text-foreground px-4",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted-foreground",
		children: [
			"Não foi possível carregar esta autorização:",
			" ",
			String(error?.message ?? error)
		]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
