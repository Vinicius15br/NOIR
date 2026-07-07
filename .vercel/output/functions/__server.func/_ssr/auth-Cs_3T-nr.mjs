import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Cs_3T-nr.js
var $$splitComponentImporter = () => import("./auth-BFEEyIZC.mjs");
var Route = createFileRoute("/auth")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (s) => ({ next: typeof s.next === "string" ? s.next : "" }),
	head: () => ({ meta: [{ title: "Acesso — Noir Sessions" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] })
});
//#endregion
export { Route as t };
