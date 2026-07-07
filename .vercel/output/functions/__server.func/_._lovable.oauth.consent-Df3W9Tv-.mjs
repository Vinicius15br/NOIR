import { o as __toESM } from "./_runtime.mjs";
import { _ as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { n as oauthApi, t as Route } from "./_._lovable.oauth.consent-BYYSkK7u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-Df3W9Tv-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Consent() {
	const details = Route.useLoaderData();
	const { authorization_id } = Route.useSearch();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function decide(approve) {
		setBusy(true);
		const { data, error } = approve ? await oauthApi().approveAuthorization(authorization_id) : await oauthApi().denyAuthorization(authorization_id);
		if (error) {
			setBusy(false);
			setError(error.message);
			return;
		}
		const target = data?.redirect_url ?? data?.redirect_to;
		if (!target) {
			setBusy(false);
			setError("Nenhum redirect retornado pelo servidor de autorização.");
			return;
		}
		window.location.href = target;
	}
	const clientName = details?.client?.name ?? "um aplicativo";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background text-foreground flex items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-lg border border-border/50 bg-card/40 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-serif text-2xl text-gold-gradient mb-3",
					children: ["Conectar ", clientName]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mb-6",
					children: [
						"Isso permite que ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: clientName
						}),
						" ",
						"acesse o painel de leads do Noir Sessions como você."
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm text-red-400 mb-4",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						onClick: () => decide(true),
						className: "flex-1 rounded-md bg-gradient-to-b from-amber-300 to-amber-600 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50",
						children: busy ? "Aguarde…" : "Aprovar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						onClick: () => decide(false),
						className: "flex-1 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground disabled:opacity-50",
						children: "Recusar"
					})]
				})
			]
		})
	});
}
//#endregion
export { Consent as component };
