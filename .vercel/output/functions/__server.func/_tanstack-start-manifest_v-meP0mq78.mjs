//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-meP0mq78.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/home/user/NOIR/src/routes/__root.tsx",
		children: [
			"/",
			"/_authenticated",
			"/auth",
			"/mcp",
			"/.mcp/list-tools",
			"/.well-known/oauth-protected-resource",
			"/.lovable/oauth/consent",
			"/.mcp/invoke-tool/$tool"
		],
		preloads: [
			"/assets/index-B9fcHf2T.js",
			"/assets/jsx-runtime-DGeXAQPT.js",
			"/assets/useRouter-C7eUV283.js",
			"/assets/react-dom-D_f6Y2bG.js",
			"/assets/useStore-Clr1wszQ.js",
			"/assets/matchContext-Blnx1Rjl.js",
			"/assets/link-i8Idotxo.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-B9fcHf2T.js"
		} }]
	},
	"/": {
		filePath: "/home/user/NOIR/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-CAvho1zW.js",
			"/assets/auth-middleware-CrKLRU-_.js",
			"/assets/select-Xe4eJiUk.js",
			"/assets/form-tracking.functions-CDJQ8xVF.js"
		]
	},
	"/_authenticated": {
		filePath: "/home/user/NOIR/src/routes/_authenticated/route.tsx",
		children: ["/_authenticated/admin"],
		preloads: ["/assets/route-B9VIl3j3.js"]
	},
	"/auth": {
		filePath: "/home/user/NOIR/src/routes/auth.tsx",
		children: void 0,
		preloads: ["/assets/auth-B3mznIyQ.js"]
	},
	"/_authenticated/admin": {
		filePath: "/home/user/NOIR/src/routes/_authenticated/admin.tsx",
		children: ["/_authenticated/admin/stats", "/_authenticated/admin/"],
		preloads: ["/assets/admin-B9VIl3j3.js"]
	},
	"/.lovable/oauth/consent": {
		filePath: "/home/user/NOIR/src/routes/[.]lovable.oauth.consent.tsx",
		children: void 0,
		preloads: ["/assets/_._lovable.oauth.consent-BlKejBcb.js", "/assets/_._lovable.oauth.consent-D0IcxvdL.js"]
	},
	"/_authenticated/admin/stats": {
		filePath: "/home/user/NOIR/src/routes/_authenticated/admin.stats.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.stats-Ds5RfCY4.js",
			"/assets/auth-middleware-CrKLRU-_.js",
			"/assets/admin.functions-BxchvBVd.js",
			"/assets/form-tracking.functions-CDJQ8xVF.js"
		]
	},
	"/_authenticated/admin/": {
		filePath: "/home/user/NOIR/src/routes/_authenticated/admin.index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.index-BIFyrVcI.js",
			"/assets/admin.index-WS-avlWc.js",
			"/assets/auth-middleware-CrKLRU-_.js",
			"/assets/admin.functions-BxchvBVd.js",
			"/assets/select-Xe4eJiUk.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
