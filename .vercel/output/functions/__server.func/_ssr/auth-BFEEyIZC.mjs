import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-BxEh63oY.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./auth-Cs_3T-nr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BFEEyIZC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_EMAIL = "viniciusdiasr2004@gmail.com";
var DEFAULT_PASSWORD = "090904";
function sanitizeNext(next) {
	if (!next.startsWith("/") || next.startsWith("//")) return null;
	return next;
}
function AuthPage() {
	useNavigate();
	const { next } = Route.useSearch();
	const safeNext = sanitizeNext(next);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			if (data.user) window.location.href = safeNext ?? "/admin";
		});
	}, [safeNext]);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const normalizedEmail = email.trim().toLowerCase();
			let { error } = await supabase.auth.signInWithPassword({
				email: normalizedEmail,
				password
			});
			if (error && /invalid.*credentials/i.test(error.message) && normalizedEmail === ADMIN_EMAIL && password === DEFAULT_PASSWORD) {
				const { error: signUpError } = await supabase.auth.signUp({
					email: normalizedEmail,
					password
				});
				if (signUpError) throw signUpError;
				error = (await supabase.auth.signInWithPassword({
					email: normalizedEmail,
					password
				})).error;
			}
			if (error) throw error;
			window.location.href = safeNext ?? "/admin";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao autenticar");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background flex items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl text-center text-gold-gradient mb-2",
					children: "Noir Sessions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground mb-8",
					children: "Painel restrito"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs uppercase tracking-widest text-muted-foreground mb-2",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs uppercase tracking-widest text-muted-foreground mb-2",
							children: "Senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							required: true,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-400",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "w-full rounded-md bg-gradient-to-b from-amber-300 to-amber-600 px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50",
							children: loading ? "Aguarde…" : "Entrar"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
