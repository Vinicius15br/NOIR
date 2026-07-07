import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as supabase } from "./client-BxEh63oY.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-w4A1KCat.mjs";
import { a as setApplicationContacted, c as undoAttempt, i as registerAttempt, n as listApplicationEvents, o as setApplicationNotes, r as listApplications, s as setApplicationStatus, t as deleteApplication } from "./admin.functions-W6pUR3hg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D53sowPz.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-D1rJp24g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var momentLabels = {
	rodando: "Já roda agência",
	zero: "Começando do zero"
};
var revenueLabels = {
	"ate-5k": "Até R$ 5k",
	"5-20k": "R$ 5k – 20k",
	"20-50k": "R$ 20k – 50k",
	"acima-50k": "Acima de R$ 50k"
};
var statusLabels = {
	novo: "Novo",
	contatado: "Contatado",
	fechado: "Fechado",
	perdido: "Perdido"
};
var lostReasonLabels = {
	preco: "Preço",
	timing: "Timing",
	nao_atendeu: "Não atendeu",
	nao_qualificado: "Não qualificado"
};
function AdminPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fetchList = useServerFn(listApplications);
	const doDelete = useServerFn(deleteApplication);
	useServerFn(setApplicationContacted);
	const doSetStatus = useServerFn(setApplicationStatus);
	const doRegisterAttempt = useServerFn(registerAttempt);
	const doUndoAttempt = useServerFn(undoAttempt);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const [attemptBusy, setAttemptBusy] = (0, import_react.useState)(null);
	const [statusBusy, setStatusBusy] = (0, import_react.useState)(null);
	const [pendingLostId, setPendingLostId] = (0, import_react.useState)(null);
	const { data, isLoading, error } = useQuery({
		queryKey: ["applications"],
		queryFn: () => fetchList()
	});
	const fetchEvents = useServerFn(listApplicationEvents);
	const { data: events } = useQuery({
		queryKey: ["application_events"],
		queryFn: () => fetchEvents()
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("applications-admin").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "applications"
		}, () => {
			qc.invalidateQueries({ queryKey: ["applications"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [momentFilter, setMomentFilter] = (0, import_react.useState)("all");
	const [revenueFilter, setRevenueFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [sourceFilter, setSourceFilter] = (0, import_react.useState)("all");
	const [sortMode, setSortMode] = (0, import_react.useState)("priority");
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const HIGHLIGHT_MS = 15e3;
	const STALE_MS = 1440 * 60 * 1e3;
	(0, import_react.useEffect)(() => {
		const hasRecent = (data ?? []).some((app) => Date.now() - new Date(app.created_at).getTime() < HIGHLIGHT_MS);
		const hasPending = (data ?? []).some((app) => (app.status ?? "novo") === "novo");
		if (!hasRecent && !hasPending) return;
		const id = setInterval(() => setNow(Date.now()), hasRecent ? 1e3 : 6e4);
		return () => clearInterval(id);
	}, [data]);
	const revenueRank = {
		"acima-50k": 4,
		"20-50k": 3,
		"5-20k": 2,
		"ate-5k": 1
	};
	function priorityScore(app) {
		const st = app.status ?? "novo";
		if (st === "perdido") return -1e3;
		if (st === "fechado") return -500;
		let score = 0;
		if (app.moment === "rodando") score += 100;
		score += (app.revenue_band ? revenueRank[app.revenue_band] ?? 0 : 0) * 10;
		if (st === "novo") score += 5;
		return score;
	}
	const filtered = (data ?? []).slice().sort((a, b) => {
		if (sortMode === "priority") {
			const diff = priorityScore(b) - priorityScore(a);
			if (diff !== 0) return diff;
		}
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	}).filter((app) => {
		const st = app.status ?? "novo";
		if (momentFilter !== "all" && app.moment !== momentFilter) return false;
		if (statusFilter !== "all" && st !== statusFilter) return false;
		if (revenueFilter !== "all") {
			if (revenueFilter === "none") {
				if (app.revenue_band) return false;
			} else if (app.revenue_band !== revenueFilter) return false;
		}
		if (sourceFilter !== "all") {
			const src = app.utm_source ?? "";
			if (sourceFilter === "none" && src) return false;
			if (sourceFilter !== "none" && src !== sourceFilter) return false;
		}
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			if (!`${app.full_name} ${app.instagram} ${app.whatsapp}`.toLowerCase().includes(q)) return false;
		}
		return true;
	});
	const totalCount = data?.length ?? 0;
	const novoCount = (data ?? []).filter((a) => (a.status ?? "novo") === "novo").length;
	const contactedCount = (data ?? []).filter((a) => (a.status ?? "novo") === "contatado").length;
	const closedCount = (data ?? []).filter((a) => (a.status ?? "novo") === "fechado").length;
	const lostCount = (data ?? []).filter((a) => (a.status ?? "novo") === "perdido").length;
	function fmtDuration(ms) {
		if (ms == null) return "—";
		const mins = Math.round(ms / 6e4);
		if (mins < 60) return `${mins}min`;
		const hrs = mins / 60;
		if (hrs < 24) return `${hrs.toFixed(hrs < 10 ? 1 : 0)}h`;
		const days = hrs / 24;
		return `${days.toFixed(days < 10 ? 1 : 0)}d`;
	}
	const STUCK_MS = 10080 * 60 * 1e3;
	const lastStatusChangeByLead = /* @__PURE__ */ new Map();
	for (const e of events ?? []) {
		if (e.event_type !== "status_changed") continue;
		const t = new Date(e.created_at).getTime();
		const prev = lastStatusChangeByLead.get(e.application_id);
		if (prev == null || t > prev) lastStatusChangeByLead.set(e.application_id, t);
	}
	const stuckLeads = (data ?? []).map((a) => {
		const st = a.status ?? "novo";
		if (st === "fechado" || st === "perdido") return null;
		const enteredAt = lastStatusChangeByLead.get(a.id) ?? new Date(a.created_at).getTime();
		const ageMs = now - enteredAt;
		if (ageMs < STUCK_MS) return null;
		return {
			app: a,
			status: st,
			ageMs
		};
	}).filter((x) => x !== null).sort((a, b) => b.ageMs - a.ageMs);
	const uniqueSources = Array.from(new Set((data ?? []).map((a) => a.utm_source).filter((s) => Boolean(s && s.trim())))).sort((a, b) => a.localeCompare(b));
	async function handleSignOut() {
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	function handleExportCsv() {
		if (filtered.length === 0) return;
		const headers = [
			"Data",
			"Nome",
			"WhatsApp",
			"Telefone",
			"Instagram",
			"Momento",
			"Faturamento",
			"Status",
			"Motivo perda",
			"Tentativas",
			"Última tentativa",
			"Origem",
			"Mídia",
			"Campanha",
			"Conteúdo",
			"Termo",
			"Referrer",
			"Landing"
		];
		const escape = (v) => `"${v.replace(/"/g, "\"\"")}"`;
		const rows = filtered.map((app) => {
			const st = app.status ?? "novo";
			return [
				new Date(app.created_at).toLocaleString("pt-BR"),
				app.full_name,
				app.whatsapp,
				`+55${app.whatsapp.replace(/\D/g, "")}`,
				`@${app.instagram}`,
				momentLabels[app.moment] ?? app.moment,
				app.revenue_band ? revenueLabels[app.revenue_band] ?? app.revenue_band : "",
				statusLabels[st],
				app.lost_reason ? lostReasonLabels[app.lost_reason] ?? app.lost_reason : "",
				String(app.attempts ?? 0),
				app.last_attempt_at ? new Date(app.last_attempt_at).toLocaleString("pt-BR") : "",
				app.utm_source ?? "",
				app.utm_medium ?? "",
				app.utm_campaign ?? "",
				app.utm_content ?? "",
				app.utm_term ?? "",
				app.referrer ?? "",
				app.landing_path ?? ""
			].map((v) => escape(String(v ?? ""))).join(",");
		});
		const csv = "﻿" + [headers.map(escape).join(","), ...rows].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `leads-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	async function handleDelete(id) {
		if (!confirm("Excluir esta aplicação?")) return;
		setDeletingId(id);
		try {
			await doDelete({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["applications"] });
		} finally {
			setDeletingId(null);
		}
	}
	async function handleRegisterAttempt(id) {
		setAttemptBusy(id);
		try {
			await doRegisterAttempt({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["applications"] });
		} finally {
			setAttemptBusy(null);
		}
	}
	async function handleUndoAttempt(id) {
		setAttemptBusy(id);
		try {
			await doUndoAttempt({ data: { id } });
			await qc.invalidateQueries({ queryKey: ["applications"] });
		} finally {
			setAttemptBusy(null);
		}
	}
	async function handleChangeStatus(id, next, lostReason) {
		if (next === "perdido" && !lostReason) {
			setPendingLostId(id);
			return;
		}
		setStatusBusy(id);
		try {
			await doSetStatus({ data: {
				id,
				status: next,
				lost_reason: lostReason ?? null
			} });
			setPendingLostId(null);
			await qc.invalidateQueries({ queryKey: ["applications"] });
		} catch (e) {
			alert(e.message);
		} finally {
			setStatusBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-6xl mx-auto px-4 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-xl text-gold-gradient",
					children: "Painel de leads"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: data ? `${filtered.length} de ${data.length} aplicações` : "Carregando…"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleSignOut,
					className: "text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground",
					children: "Sair"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-4 py-8",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-red-400",
					children: error.message === "Forbidden" ? "Você não é administrador." : error.message
				}),
				data && data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/stats",
						className: "inline-flex items-center gap-2 rounded-md border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-3 py-2 text-xs uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20",
						children: "Ver estatísticas →"
					})
				}),
				stuckLeads.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] uppercase tracking-widest text-amber-300",
								children: [
									"⚠ Leads travados (",
									stuckLeads.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground/70",
								children: "mesmo status há +7 dias"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-amber-400/10",
							children: stuckLeads.slice(0, 10).map(({ app, status, ageMs }) => {
								const wa = `+55${app.whatsapp.replace(/\D/g, "")}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center justify-between gap-2 py-2 text-[12px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-foreground",
											children: app.full_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground",
											children: [
												statusLabels[status],
												" há",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-200",
													children: fmtDuration(ageMs)
												}),
												" · @",
												app.instagram
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex shrink-0 gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `https://wa.me/${wa.replace("+", "")}`,
											target: "_blank",
											rel: "noreferrer",
											className: "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-widest text-emerald-200 hover:bg-emerald-500/20",
											children: "WhatsApp"
										})
									})]
								}, app.id);
							})
						}),
						stuckLeads.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[10px] text-muted-foreground/70",
							children: [
								"+",
								stuckLeads.length - 10,
								" outros travados"
							]
						})
					]
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountChip, {
							label: "Todos",
							value: totalCount,
							active: statusFilter === "all",
							onClick: () => setStatusFilter("all")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountChip, {
							label: "Novos",
							value: novoCount,
							active: statusFilter === "novo",
							onClick: () => setStatusFilter("novo"),
							tone: "warn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountChip, {
							label: "Contatados",
							value: contactedCount,
							active: statusFilter === "contatado",
							onClick: () => setStatusFilter("contatado"),
							tone: "ok"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountChip, {
							label: "Fechados",
							value: closedCount,
							active: statusFilter === "fechado",
							onClick: () => setStatusFilter("fechado"),
							tone: "ok"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountChip, {
							label: "Perdidos",
							value: lostCount,
							active: statusFilter === "perdido",
							onClick: () => setStatusFilter("perdido"),
							tone: "warn"
						})
					]
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ordenar:" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSortMode("priority"),
							className: `rounded-md border px-2.5 py-1 transition-colors ${sortMode === "priority" ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient" : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"}`,
							title: "Já roda agência + faturamento alto no topo, perdidos no fim",
							children: "Prioridade"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSortMode("recent"),
							className: `rounded-md border px-2.5 py-1 transition-colors ${sortMode === "recent" ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient" : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"}`,
							children: "Mais recentes"
						})
					]
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "search",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Buscar por nome, @ ou WhatsApp…",
							className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: momentFilter,
							onValueChange: setMomentFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-auto rounded-md border-border bg-card px-3 py-2 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todos os momentos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "rodando",
									children: "Já roda agência"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "zero",
									children: "Começando do zero"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: revenueFilter,
							onValueChange: setRevenueFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-auto rounded-md border-border bg-card px-3 py-2 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Qualquer faturamento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ate-5k",
									children: "Até R$ 5k"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "5-20k",
									children: "R$ 5k – 20k"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "20-50k",
									children: "R$ 20k – 50k"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "acima-50k",
									children: "Acima de R$ 50k"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "Não informado"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: setStatusFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-auto rounded-md border-border bg-card px-3 py-2 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todos os status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "novo",
									children: "Novos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "contatado",
									children: "Contatados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "fechado",
									children: "Fechados"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "perdido",
									children: "Perdidos"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: sourceFilter,
							onValueChange: setSourceFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-auto rounded-md border-border bg-card px-3 py-2 text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Qualquer origem"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									children: "Sem origem"
								}),
								uniqueSources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s))
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleExportCsv,
							disabled: filtered.length === 0,
							className: "rounded-md border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-3 py-2 text-xs uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20 disabled:opacity-40 disabled:cursor-not-allowed sm:col-span-2 lg:col-span-5",
							children: [
								"Exportar CSV (",
								filtered.length,
								")"
							]
						})
					]
				}),
				data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border/50 bg-card/40 p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nenhuma aplicação recebida ainda."
					})
				}),
				data && data.length > 0 && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border/50 bg-card/40 p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nenhuma aplicação corresponde aos filtros."
					})
				}),
				filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filtered.map((app) => {
						const ageMs = now - new Date(app.created_at).getTime();
						const isRecent = ageMs < HIGHLIGHT_MS;
						const currentStatus = app.status ?? "novo";
						const isStale = currentStatus === "novo" && ageMs > STALE_MS;
						const staleHours = Math.floor(ageMs / (3600 * 1e3));
						const attempts = app.attempts ?? 0;
						const lastAttempt = app.last_attempt_at ? new Date(app.last_attempt_at) : null;
						const coldWarn = currentStatus === "novo" && attempts >= 3;
						const isLost = currentStatus === "perdido";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-lg border p-5 transition-colors duration-1000 ${isRecent ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/5 shadow-[0_0_0_1px_var(--gold)]/30 animate-fade-in" : isStale ? "border-red-500/60 bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,0.25)]" : isLost ? "border-border/30 bg-card/10 opacity-60" : currentStatus === "contatado" ? "border-border/40 bg-card/20 opacity-80" : "border-border/50 bg-card/40"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-serif text-lg text-foreground",
													children: app.full_name
												}),
												currentStatus === "contatado" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300",
													children: "Contatado"
												}),
												currentStatus === "fechado" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-gradient",
													children: "Fechado ✦"
												}),
												currentStatus === "perdido" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-full border border-zinc-500/50 bg-zinc-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-300",
													children: ["Perdido", app.lost_reason ? ` · ${lostReasonLabels[app.lost_reason] ?? app.lost_reason}` : ""]
												}),
												isStale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-full border border-red-500/50 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-red-300",
													children: [
														"Atrasado · ",
														staleHours,
														"h"
													]
												}),
												coldWarn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber-300",
													children: "3 tentativas · esfriando"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: ["Entrada: ", new Date(app.created_at).toLocaleString("pt-BR")]
										}),
										app.first_contacted_at && (() => {
											const ttfc = new Date(app.first_contacted_at).getTime() - new Date(app.created_at).getTime();
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"1º contato em",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: ttfc > 1440 * 60 * 1e3 ? "text-red-300" : "text-foreground",
														children: fmtDuration(ttfc)
													})
												]
											});
										})(),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Tentativas: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: attempts
												}),
												lastAttempt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · última em ", lastAttempt.toLocaleString("pt-BR")] })
											]
										}),
										(app.utm_source || app.utm_medium || app.utm_campaign || app.referrer) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-sm border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-gold-gradient",
													children: "Origem"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: app.utm_source ?? "—"
												}),
												app.utm_medium && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground/70",
													children: ["· ", app.utm_medium]
												}),
												app.utm_campaign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground/70",
													children: ["· ", app.utm_campaign]
												}),
												!app.utm_source && app.referrer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground/70 truncate max-w-[240px]",
													title: app.referrer,
													children: ["ref: ", app.referrer]
												})
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleRegisterAttempt(app.id),
													disabled: attemptBusy === app.id || isLost,
													className: "rounded-md border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-2.5 py-1 text-[11px] uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20 disabled:opacity-40 disabled:cursor-not-allowed",
													title: "Registrar uma tentativa de ligação",
													children: "+ Tentativa"
												}), attempts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleUndoAttempt(app.id),
													disabled: attemptBusy === app.id,
													className: "text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-40",
													title: "Desfazer última tentativa",
													children: "Desfazer"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: currentStatus,
													onValueChange: (v) => handleChangeStatus(app.id, v),
													disabled: statusBusy === app.id,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-auto rounded-md border-border bg-card px-2.5 py-1 text-xs w-[130px]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "novo",
															children: "Novo"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "contatado",
															children: "Contatado"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "fechado",
															children: "Fechado"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "perdido",
															children: "Perdido"
														})
													] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleDelete(app.id),
													disabled: deletingId === app.id,
													className: "text-xs text-red-400 hover:text-red-300 disabled:opacity-50",
													children: deletingId === app.id ? "Excluindo…" : "Excluir"
												})]
											}),
											(pendingLostId === app.id || isLost && !app.lost_reason) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													onValueChange: (v) => handleChangeStatus(app.id, "perdido", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "h-auto rounded-md border-red-500/50 bg-red-500/5 px-2.5 py-1 text-xs w-[180px]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Motivo da perda…" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "preco",
															children: "Preço"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "timing",
															children: "Timing"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "nao_atendeu",
															children: "Não atendeu"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "nao_qualificado",
															children: "Não qualificado"
														})
													] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setPendingLostId(null),
													className: "text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground",
													children: "Cancelar"
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs uppercase tracking-widest text-muted-foreground",
											children: "WhatsApp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `https://wa.me/55${app.whatsapp.replace(/\D/g, "")}`,
													target: "_blank",
													rel: "noreferrer",
													className: "text-gold-gradient hover:underline",
													children: app.whatsapp
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
													label: "WhatsApp",
													value: app.whatsapp
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
													label: "Telefone",
													value: `+55${app.whatsapp.replace(/\D/g, "")}`
												})
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs uppercase tracking-widest text-muted-foreground",
											children: "Instagram"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `https://instagram.com/${app.instagram.replace(/^@+/, "")}`,
												target: "_blank",
												rel: "noreferrer",
												className: "text-gold-gradient hover:underline",
												children: ["@", app.instagram.replace(/^@+/, "")]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
												label: "Instagram",
												value: `@${app.instagram.replace(/^@+/, "")}`
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs uppercase tracking-widest text-muted-foreground",
											children: "Momento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: momentLabels[app.moment] ?? app.moment })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs uppercase tracking-widest text-muted-foreground",
											children: "Faturamento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: app.revenue_band ? revenueLabels[app.revenue_band] ?? app.revenue_band : "—" })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesEditor, {
									id: app.id,
									initialNotes: app.notes ?? ""
								})
							]
						}, app.id);
					})
				})
			]
		})]
	});
}
function CopyButton({ label, value }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: handleCopy,
		title: `Copiar ${label.toLowerCase()}`,
		className: `rounded-md border px-2 py-0.5 text-[11px] uppercase tracking-widest transition-colors ${copied ? "border-[color:var(--gold)]/70 text-gold-gradient" : "border-border/60 text-muted-foreground hover:border-[color:var(--gold)]/60 hover:text-foreground"}`,
		children: copied ? "Copiado" : label
	});
}
function CountChip({ label, value, active, onClick, tone = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `rounded-full border px-3 py-1 transition-colors ${active ? tone === "ok" ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-200" : tone === "warn" ? "border-amber-500/60 bg-amber-500/15 text-amber-200" : "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient" : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"}`,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-2 rounded-md bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground",
			children: value
		})]
	});
}
function NotesEditor({ id, initialNotes }) {
	const saveNotes = useServerFn(setApplicationNotes);
	const qc = useQueryClient();
	const [value, setValue] = (0, import_react.useState)(initialNotes);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [lastSaved, setLastSaved] = (0, import_react.useState)(initialNotes);
	(0, import_react.useEffect)(() => {
		setValue(initialNotes);
		setLastSaved(initialNotes);
	}, [initialNotes]);
	(0, import_react.useEffect)(() => {
		if (value === lastSaved) return;
		setStatus("saving");
		const t = setTimeout(async () => {
			try {
				await saveNotes({ data: {
					id,
					notes: value
				} });
				setLastSaved(value);
				setStatus("saved");
				qc.invalidateQueries({ queryKey: ["applications"] });
				setTimeout(() => setStatus((s) => s === "saved" ? "idle" : s), 1500);
			} catch {
				setStatus("error");
			}
		}, 700);
		return () => clearTimeout(t);
	}, [
		value,
		lastSaved,
		id,
		saveNotes,
		qc
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 border-t border-border/40 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: `notes-${id}`,
				className: "text-xs uppercase tracking-widest text-muted-foreground",
				children: "Anotações da ligação"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] uppercase tracking-widest text-muted-foreground",
				children: [
					status === "saving" && "Salvando…",
					status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-emerald-300",
						children: "Salvo"
					}),
					status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-red-400",
						children: "Falha ao salvar"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			id: `notes-${id}`,
			value,
			onChange: (e) => setValue(e.target.value.slice(0, 5e3)),
			placeholder: "O que ele falou • objeção principal • momento da operação…",
			rows: 3,
			className: "w-full resize-y rounded-sm border border-border bg-background/60 px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold-soft focus:ring-1 focus:ring-[color:var(--gold)]/40"
		})]
	});
}
//#endregion
export { AdminPage as component };
