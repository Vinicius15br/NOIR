import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-BxEh63oY.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$10 } from "../_._lovable.oauth.consent-BYYSkK7u.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { a as createTanStackListToolsHandler, f as string, i as createTanStackInvokeToolHandler, n as defineMcp, o as createTanStackMcpHandler, r as defineTool, s as createTanStackOAuthProtectedResourceMetadataHandler, t as auth, u as number } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as Route$11 } from "./auth-Cs_3T-nr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-KgCNzAV0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BPuS10te.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "theme-color",
				content: "#0a0a0a"
			},
			{ title: "Noir Sessions — Mentoria individual" },
			{
				name: "description",
				content: "Mentoria individual com Rafa: 6 calls + visita presencial ao escritório da agência."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function supabaseForUser$2(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var list_applications_default = defineTool({
	name: "list_applications",
	title: "List applications",
	description: "List all Noir Sessions mentorship applications received via the landing page form, ordered from newest to oldest. Requires admin access.",
	inputSchema: { limit: number().int().min(1).max(200).optional().describe("Maximum rows to return (default 50).") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ limit }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { data, error } = await supabaseForUser$2(ctx).from("applications").select("*").order("created_at", { ascending: false }).limit(limit ?? 50);
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data, null, 2)
			}],
			structuredContent: { applications: data ?? [] }
		};
	}
});
function supabaseForUser$1(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var get_application_default = defineTool({
	name: "get_application",
	title: "Get application",
	description: "Fetch a single Noir Sessions application by its id.",
	inputSchema: { id: string().uuid().describe("Application UUID.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { data, error } = await supabaseForUser$1(ctx).from("applications").select("*").eq("id", id).maybeSingle();
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		if (!data) return {
			content: [{
				type: "text",
				text: "Not found"
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: JSON.stringify(data, null, 2)
			}],
			structuredContent: { application: data }
		};
	}
});
function supabaseForUser(ctx) {
	return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var delete_application_default = defineTool({
	name: "delete_application",
	title: "Delete application",
	description: "Permanently delete a Noir Sessions application by id. Admin only.",
	inputSchema: { id: string().uuid().describe("Application UUID to delete.") },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return {
			content: [{
				type: "text",
				text: "Not authenticated"
			}],
			isError: true
		};
		const { error } = await supabaseForUser(ctx).from("applications").delete().eq("id", id);
		if (error) return {
			content: [{
				type: "text",
				text: error.message
			}],
			isError: true
		};
		return { content: [{
			type: "text",
			text: `Deleted ${id}`
		}] };
	}
});
var mcp_default = defineMcp({
	name: "noir-sessions-mcp",
	title: "Noir Sessions MCP",
	version: "0.1.0",
	instructions: "Tools for the Noir Sessions mentorship landing page. Use `list_applications` to review incoming leads, `get_application` to inspect one, and `delete_application` to remove one. All tools require admin authentication.",
	auth: auth.oauth.issuer({
		issuer: `https://hfztpnycfadmotgzbhiz.supabase.co/auth/v1`,
		acceptedAudiences: "authenticated"
	}),
	tools: [
		list_applications_default,
		get_application_default,
		delete_application_default
	]
});
var Route$8 = createFileRoute("/mcp")({ server: { handlers: { ANY: createTanStackMcpHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitComponentImporter$4 = () => import("./route-Di7iQBCH.mjs");
var Route$7 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./routes-DQkG_eB2.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Noir Sessions — Mentoria individual pra escalar sua agência" },
		{
			name: "description",
			content: "6 encontros individuais de até 2h com Rafa + visita presencial ao escritório da agência. Poucas vagas por ciclo, entrada por aplicação."
		},
		{
			property: "og:title",
			content: "Noir Sessions — Mentoria individual com Rafa"
		},
		{
			property: "og:description",
			content: "Análise completa da sua operação de agência, 6 calls individuais e visita presencial. Entrada por aplicação."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin-C8bzTTbr.mjs");
var Route$5 = createFileRoute("/_authenticated/admin")({
	ssr: false,
	beforeLoad: async () => {
		const { data: userData } = await supabase.auth.getUser();
		if (!userData.user) throw redirect({ to: "/auth" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
		if (!roles) {
			await supabase.auth.signOut();
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$4 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: { ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var Route$3 = createFileRoute("/.mcp/list-tools")({ server: { handlers: { ANY: createTanStackListToolsHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var $$splitErrorComponentImporter = () => import("./admin.index-DbLsLFPB.mjs");
var $$splitComponentImporter$1 = () => import("./admin.index-D1rJp24g.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/")({
	ssr: false,
	beforeLoad: async () => {
		const { data: userData } = await supabase.auth.getUser();
		if (!userData.user) throw redirect({ to: "/auth" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
		if (!roles) {
			await supabase.auth.signOut();
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Painel — Noir Sessions" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
var $$splitComponentImporter = () => import("./admin.stats-vqlIcAuw.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/stats")({
	ssr: false,
	beforeLoad: async () => {
		const { data: userData } = await supabase.auth.getUser();
		if (!userData.user) throw redirect({ to: "/auth" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
		if (!roles) {
			await supabase.auth.signOut();
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Estatísticas — Noir Sessions" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] })
});
var Route = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: { ANY: createTanStackInvokeToolHandler(mcp_default, {
	resourcePath: "/mcp",
	metadataPath: "/.well-known/oauth-protected-resource",
	trustForwardedHost: true
}) } } });
var McpRoute = Route$8.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$7.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AuthenticatedAdminRoute = Route$5.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$4.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$9
});
var Char91DotmcpChar93ListToolsRoute = Route$3.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$9
});
var AuthenticatedAdminIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminStatsRoute = Route$1.update({
	id: "/stats",
	path: "/stats",
	getParentRoute: () => AuthenticatedAdminRoute
});
var Char91DotmcpChar93InvokeToolToolRoute = Route.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$9
});
var DotlovableOauthConsentRoute = Route$10.update({
	id: "/.lovable/oauth/consent",
	path: "/.lovable/oauth/consent",
	getParentRoute: () => Route$9
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminStatsRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = { AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren) };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	McpRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	DotlovableOauthConsentRoute,
	Char91DotmcpChar93InvokeToolToolRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
