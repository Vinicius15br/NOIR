import { o as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-w4A1KCat.mjs";
import { n as listApplicationEvents, r as listApplications } from "./admin.functions-W6pUR3hg.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as listFormStarts } from "./form-tracking.functions-Cxl8jAQ3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.stats-vqlIcAuw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmtDuration(ms) {
	if (ms == null) return "—";
	const mins = Math.round(ms / 6e4);
	if (mins < 60) return `${mins}min`;
	const hrs = mins / 60;
	if (hrs < 24) return `${hrs.toFixed(hrs < 10 ? 1 : 0)}h`;
	const days = hrs / 24;
	return `${days.toFixed(days < 10 ? 1 : 0)}d`;
}
function pct(n, d) {
	if (!d) return "—";
	return `${Math.round(n / d * 100)}%`;
}
function StatsPage() {
	const fetchList = useServerFn(listApplications);
	const { data, isLoading, error } = useQuery({
		queryKey: ["applications"],
		queryFn: () => fetchList()
	});
	const fetchEvents = useServerFn(listApplicationEvents);
	const { data: events } = useQuery({
		queryKey: ["application_events"],
		queryFn: () => fetchEvents()
	});
	const fetchStarts = useServerFn(listFormStarts);
	const { data: formStarts } = useQuery({
		queryKey: ["form_starts"],
		queryFn: () => fetchStarts()
	});
	const [cohortDays, setCohortDays] = (0, import_react.useState)(30);
	const [weeklySource, setWeeklySource] = (0, import_react.useState)("all");
	const [abandonDays, setAbandonDays] = (0, import_react.useState)(30);
	const totalCount = data?.length ?? 0;
	const closedCount = (data ?? []).filter((a) => (a.status ?? "novo") === "fechado").length;
	const funnelAttempted = (data ?? []).filter((a) => (a.attempts ?? 0) > 0).length;
	const funnelTalked = (data ?? []).filter((a) => {
		const st = a.status ?? "novo";
		return st === "contatado" || st === "fechado";
	}).length;
	const funnelClosed = closedCount;
	const TICKET_BRL = 1e4;
	const pipelineActive = (data ?? []).filter((a) => (a.status ?? "novo") === "contatado").length;
	const pipelineClosedHist = (data ?? []).filter((a) => (a.status ?? "novo") === "fechado").length;
	const pipelineDecidedHist = pipelineClosedHist + (data ?? []).filter((a) => (a.status ?? "novo") === "perdido").length;
	const pipelineHistRate = pipelineDecidedHist > 0 ? pipelineClosedHist / pipelineDecidedHist : null;
	const pipelineProjectedBRL = pipelineHistRate != null ? pipelineActive * pipelineHistRate * TICKET_BRL : null;
	const pipelineWorstBRL = pipelineActive * .1 * TICKET_BRL;
	const pipelineBestBRL = pipelineActive * TICKET_BRL;
	function fmtBRL(v) {
		return v.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			maximumFractionDigits: 0
		});
	}
	const ttfcMsList = (data ?? []).filter((a) => a.first_contacted_at).map((a) => new Date(a.first_contacted_at).getTime() - new Date(a.created_at).getTime()).filter((ms) => ms >= 0);
	const ttfcAvgMs = ttfcMsList.length ? ttfcMsList.reduce((s, v) => s + v, 0) / ttfcMsList.length : null;
	const ttfcMedianMs = (() => {
		if (!ttfcMsList.length) return null;
		const s = [...ttfcMsList].sort((a, b) => a - b);
		const mid = Math.floor(s.length / 2);
		return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
	})();
	const speedRows = [
		{
			key: "lt1h",
			label: "< 1h",
			from: 0,
			to: 3600 * 1e3
		},
		{
			key: "1to4h",
			label: "1–4h",
			from: 3600 * 1e3,
			to: 14400 * 1e3
		},
		{
			key: "4to24h",
			label: "4–24h",
			from: 14400 * 1e3,
			to: 1440 * 60 * 1e3
		},
		{
			key: "gt24h",
			label: "> 24h",
			from: 1440 * 60 * 1e3,
			to: Infinity
		}
	].map((b) => ({
		...b,
		total: 0,
		closed: 0
	}));
	const closedIdsForSpeed = /* @__PURE__ */ new Set();
	for (const e of events ?? []) if (e.event_type === "status_changed" && e.to_status === "fechado") closedIdsForSpeed.add(e.application_id);
	for (const a of data ?? []) if ((a.status ?? "novo") === "fechado") closedIdsForSpeed.add(a.id);
	let neverContactedTotal = 0;
	let neverContactedClosed = 0;
	for (const a of data ?? []) {
		if (!a.first_contacted_at) {
			neverContactedTotal++;
			if (closedIdsForSpeed.has(a.id)) neverContactedClosed++;
			continue;
		}
		const ms = new Date(a.first_contacted_at).getTime() - new Date(a.created_at).getTime();
		if (ms < 0) continue;
		const bucket = speedRows.find((b) => ms >= b.from && ms < b.to);
		if (!bucket) continue;
		bucket.total++;
		if (closedIdsForSpeed.has(a.id)) bucket.closed++;
	}
	const speedContactedTotal = speedRows.reduce((s, r) => s + r.total, 0);
	const speedContactedClosed = speedRows.reduce((s, r) => s + r.closed, 0);
	const fastBucket = speedRows[0];
	const slowBucket = speedRows[3];
	const fastRate = fastBucket.total ? fastBucket.closed / fastBucket.total : null;
	const slowRate = slowBucket.total ? slowBucket.closed / slowBucket.total : null;
	const speedLiftPct = fastRate != null && slowRate != null && slowRate > 0 ? Math.round((fastRate - slowRate) / slowRate * 100) : null;
	const atcList = (data ?? []).map((a) => a.attempts_to_contact).filter((n) => typeof n === "number" && n > 0);
	const atcAvg = atcList.length ? atcList.reduce((s, v) => s + v, 0) / atcList.length : null;
	const atcBuckets = {
		one: 0,
		two: 0,
		three: 0,
		more: 0
	};
	for (const n of atcList) if (n === 1) atcBuckets.one++;
	else if (n === 2) atcBuckets.two++;
	else if (n === 3) atcBuckets.three++;
	else atcBuckets.more++;
	const atcPct = (n) => atcList.length ? Math.round(n / atcList.length * 100) : 0;
	const rodandoCount = (data ?? []).filter((a) => a.moment === "rodando").length;
	const zeroCount = (data ?? []).filter((a) => a.moment === "zero").length;
	const rodandoPct = totalCount ? Math.round(rodandoCount / totalCount * 100) : 0;
	const zeroPct = totalCount ? 100 - rodandoPct : 0;
	const revenueCounts = [
		{
			key: "acima-50k",
			label: "Acima 50k",
			color: "bg-[color:var(--gold)]/80"
		},
		{
			key: "20-50k",
			label: "20–50k",
			color: "bg-[color:var(--gold)]/60"
		},
		{
			key: "5-20k",
			label: "5–20k",
			color: "bg-[color:var(--gold)]/40"
		},
		{
			key: "ate-5k",
			label: "Até 5k",
			color: "bg-[color:var(--gold)]/25"
		}
	].map((b) => ({
		...b,
		count: (data ?? []).filter((a) => a.revenue_band === b.key).length
	}));
	const revenueFilled = revenueCounts.reduce((s, r) => s + r.count, 0);
	const revenueFillPct = totalCount ? Math.round(revenueFilled / totalCount * 100) : 0;
	const revenueEmptyCount = totalCount - revenueFilled;
	const cohortSinceMs = Date.now() - cohortDays * 24 * 60 * 60 * 1e3;
	const cohortLeads = (data ?? []).filter((a) => new Date(a.created_at).getTime() >= cohortSinceMs);
	const cohortIds = new Set(cohortLeads.map((a) => a.id));
	const cohortEvents = (events ?? []).filter((e) => cohortIds.has(e.application_id));
	const cohortByLead = /* @__PURE__ */ new Map();
	for (const e of cohortEvents) {
		const arr = cohortByLead.get(e.application_id) ?? [];
		arr.push(e);
		cohortByLead.set(e.application_id, arr);
	}
	let cohortContacted = 0;
	let cohortClosed = 0;
	let cohortLost = 0;
	let cohortReopened = 0;
	const terminalOrder = {
		novo: 0,
		contatado: 1,
		fechado: 2,
		perdido: 2
	};
	for (const lead of cohortLeads) {
		const evs = (cohortByLead.get(lead.id) ?? []).filter((e) => e.event_type === "status_changed");
		const reached = new Set(evs.map((e) => e.to_status));
		if (reached.has("contatado") || reached.has("fechado")) cohortContacted++;
		if (reached.has("fechado")) cohortClosed++;
		if (reached.has("perdido")) cohortLost++;
		let maxSoFar = 0;
		for (const e of evs) {
			const rank = terminalOrder[e.to_status ?? "novo"] ?? 0;
			if (rank < maxSoFar) {
				cohortReopened++;
				break;
			}
			if (rank > maxSoFar) maxSoFar = rank;
		}
	}
	const cohortTotal = cohortLeads.length;
	const leadCreatedAt = new Map((data ?? []).map((a) => [a.id, a.created_at]));
	const firstClosedAt = /* @__PURE__ */ new Map();
	for (const e of events ?? []) {
		if (e.event_type !== "status_changed" || e.to_status !== "fechado") continue;
		const prev = firstClosedAt.get(e.application_id);
		if (!prev || new Date(e.created_at).getTime() < new Date(prev).getTime()) firstClosedAt.set(e.application_id, e.created_at);
	}
	const cycleMsList = [];
	for (const [id, closedAt] of firstClosedAt) {
		const created = leadCreatedAt.get(id);
		if (!created) continue;
		const ms = new Date(closedAt).getTime() - new Date(created).getTime();
		if (ms >= 0) cycleMsList.push(ms);
	}
	const cycleAvgMs = cycleMsList.length ? cycleMsList.reduce((s, v) => s + v, 0) / cycleMsList.length : null;
	const cycleMedianMs = (() => {
		if (!cycleMsList.length) return null;
		const s = [...cycleMsList].sort((a, b) => a - b);
		const mid = Math.floor(s.length / 2);
		return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
	})();
	const cycleMinMs = cycleMsList.length ? Math.min(...cycleMsList) : null;
	const cycleMaxMs = cycleMsList.length ? Math.max(...cycleMsList) : null;
	const uniqueSourcesStats = Array.from(new Set((data ?? []).map((a) => a.utm_source).filter((s) => Boolean(s && s.trim())))).sort((a, b) => a.localeCompare(b));
	function startOfWeek(date) {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		const day = d.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		d.setDate(d.getDate() + diff);
		return d;
	}
	function weekKey(d) {
		return startOfWeek(d).toISOString().slice(0, 10);
	}
	const weeklyLeads = (data ?? []).filter((a) => {
		if (weeklySource === "all") return true;
		const src = a.utm_source ?? "";
		if (weeklySource === "none") return !src;
		return src === weeklySource;
	});
	const eventsById = /* @__PURE__ */ new Map();
	for (const e of events ?? []) {
		const arr = eventsById.get(e.application_id) ?? [];
		arr.push(e);
		eventsById.set(e.application_id, arr);
	}
	const weeklyMap = /* @__PURE__ */ new Map();
	for (const lead of weeklyLeads) {
		const k = weekKey(new Date(lead.created_at));
		const row = weeklyMap.get(k) ?? {
			total: 0,
			contacted: 0,
			closed: 0,
			lost: 0
		};
		row.total++;
		const evs = (eventsById.get(lead.id) ?? []).filter((e) => e.event_type === "status_changed");
		const reached = new Set(evs.map((e) => e.to_status));
		const st = lead.status ?? "novo";
		if (st === "contatado" || st === "fechado" || reached.has("contatado") || reached.has("fechado")) row.contacted++;
		if (st === "fechado" || reached.has("fechado")) row.closed++;
		if (st === "perdido" || reached.has("perdido")) row.lost++;
		weeklyMap.set(k, row);
	}
	const weeklyRows = Array.from(weeklyMap.entries()).map(([k, v]) => ({
		weekStart: k,
		...v
	})).sort((a, b) => a.weekStart < b.weekStart ? 1 : -1).slice(0, 12);
	function fmtWeekLabel(iso) {
		const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
		const end = new Date(d);
		end.setDate(end.getDate() + 6);
		const fmt = (x) => x.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short"
		});
		return `${fmt(d)} – ${fmt(end)}`;
	}
	const closedIds = /* @__PURE__ */ new Set();
	for (const e of events ?? []) if (e.event_type === "status_changed" && e.to_status === "fechado") closedIds.add(e.application_id);
	for (const a of data ?? []) if ((a.status ?? "novo") === "fechado") closedIds.add(a.id);
	const dowLabels = [
		"Dom",
		"Seg",
		"Ter",
		"Qua",
		"Qui",
		"Sex",
		"Sáb"
	];
	const hourBuckets = [
		{
			key: "madrugada",
			label: "Madrugada",
			range: "0–6h",
			from: 0,
			to: 6
		},
		{
			key: "manha",
			label: "Manhã",
			range: "6–12h",
			from: 6,
			to: 12
		},
		{
			key: "tarde",
			label: "Tarde",
			range: "12–18h",
			from: 12,
			to: 18
		},
		{
			key: "noite",
			label: "Noite",
			range: "18–24h",
			from: 18,
			to: 24
		}
	];
	function bucketIndex(h) {
		if (h < 6) return 0;
		if (h < 12) return 1;
		if (h < 18) return 2;
		return 3;
	}
	const byDow = Array.from({ length: 7 }, () => ({
		total: 0,
		closed: 0
	}));
	const byHour = hourBuckets.map(() => ({
		total: 0,
		closed: 0
	}));
	const grid = Array.from({ length: 7 }, () => hourBuckets.map(() => ({
		total: 0,
		closed: 0
	})));
	for (const a of data ?? []) {
		const d = new Date(a.created_at);
		const dow = d.getDay();
		const bi = bucketIndex(d.getHours());
		const isClosed = closedIds.has(a.id);
		byDow[dow].total++;
		byHour[bi].total++;
		grid[dow][bi].total++;
		if (isClosed) {
			byDow[dow].closed++;
			byHour[bi].closed++;
			grid[dow][bi].closed++;
		}
	}
	const agingStages = [
		"novo",
		"contatado",
		"fechado",
		"perdido"
	];
	const completedByStage = new Map(agingStages.map((s) => [s, []]));
	const currentByStage = new Map(agingStages.map((s) => [s, []]));
	const eventsByLead = /* @__PURE__ */ new Map();
	for (const e of events ?? []) {
		if (e.event_type !== "status_changed") continue;
		const arr = eventsByLead.get(e.application_id) ?? [];
		arr.push(e);
		eventsByLead.set(e.application_id, arr);
	}
	const nowMs = Date.now();
	for (const lead of data ?? []) {
		const evs = (eventsByLead.get(lead.id) ?? []).slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
		let currentStatus = "novo";
		let enteredAt = new Date(lead.created_at).getTime();
		for (const e of evs) {
			const exitAt = new Date(e.created_at).getTime();
			const dur = exitAt - enteredAt;
			if (dur >= 0) completedByStage.get(currentStatus)?.push(dur);
			currentStatus = e.to_status ?? "novo";
			enteredAt = exitAt;
		}
		const ageInCurrent = nowMs - enteredAt;
		if (ageInCurrent >= 0) currentByStage.get(currentStatus)?.push(ageInCurrent);
	}
	const avg = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
	const median = (arr) => {
		if (!arr.length) return null;
		const s = [...arr].sort((a, b) => a - b);
		const m = Math.floor(s.length / 2);
		return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
	};
	const agingRows = ["novo", "contatado"].map((stage) => {
		const completed = completedByStage.get(stage) ?? [];
		const current = currentByStage.get(stage) ?? [];
		return {
			stage,
			label: stage === "novo" ? "Novo (aguardando 1º contato)" : "Contatado (aguardando fechamento)",
			completedAvg: avg(completed),
			completedMedian: median(completed),
			completedCount: completed.length,
			currentCount: current.length,
			currentAvgAge: avg(current),
			currentMaxAge: current.length ? Math.max(...current) : null
		};
	});
	const callsDays = 14;
	const callsToday = /* @__PURE__ */ new Date();
	callsToday.setHours(0, 0, 0, 0);
	const callsStartMs = callsToday.getTime() - (callsDays - 1) * 24 * 60 * 60 * 1e3;
	const callsByDay = /* @__PURE__ */ new Map();
	for (let i = 0; i < callsDays; i++) {
		const d = new Date(callsStartMs + i * 24 * 60 * 60 * 1e3);
		callsByDay.set(d.toISOString().slice(0, 10), 0);
	}
	for (const e of events ?? []) {
		if (e.event_type !== "attempt_registered") continue;
		const t = new Date(e.created_at);
		if (t.getTime() < callsStartMs) continue;
		const key = new Date(t.getFullYear(), t.getMonth(), t.getDate()).toISOString().slice(0, 10);
		if (callsByDay.has(key)) callsByDay.set(key, (callsByDay.get(key) ?? 0) + 1);
	}
	const callsRows = Array.from(callsByDay.entries()).map(([day, count]) => ({
		day,
		count
	})).sort((a, b) => a.day < b.day ? -1 : 1);
	const callsTotal = callsRows.reduce((s, r) => s + r.count, 0);
	const callsMax = callsRows.reduce((m, r) => Math.max(m, r.count), 0);
	const callsAvg = callsTotal / callsDays;
	const callsBusinessDays = callsRows.filter((r) => {
		const dow = (/* @__PURE__ */ new Date(r.day + "T00:00:00")).getDay();
		return dow !== 0 && dow !== 6;
	});
	const callsBizTotal = callsBusinessDays.reduce((s, r) => s + r.count, 0);
	const callsBizAvg = callsBusinessDays.length ? callsBizTotal / callsBusinessDays.length : 0;
	const callsZeroDays = callsBusinessDays.filter((r) => r.count === 0).length;
	function fmtDayLabel(iso) {
		const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
		return `${[
			"dom",
			"seg",
			"ter",
			"qua",
			"qui",
			"sex",
			"sáb"
		][d.getDay()]} ${d.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit"
		})}`;
	}
	const abandonSinceMs = Date.now() - abandonDays * 24 * 60 * 60 * 1e3;
	const startsInWindow = (formStarts ?? []).filter((s) => new Date(s.created_at).getTime() >= abandonSinceMs);
	const submittedSessionIds = new Set((data ?? []).map((a) => a.session_id).filter((s) => Boolean(s)));
	const abandonTotal = startsInWindow.length;
	const abandonCompleted = startsInWindow.filter((s) => submittedSessionIds.has(s.session_id)).length;
	const abandonAbandoned = abandonTotal - abandonCompleted;
	const abandonRate = abandonTotal ? abandonAbandoned / abandonTotal : null;
	const submissionsInWindow = (data ?? []).filter((a) => new Date(a.created_at).getTime() >= abandonSinceMs);
	const submissionsUntracked = submissionsInWindow.filter((a) => !a.session_id).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-6xl mx-auto px-4 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-xl text-gold-gradient",
					children: "Estatísticas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: data ? `${data.length} aplicações no total` : "Carregando…"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground",
					children: "← Voltar ao painel"
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
				data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border/50 bg-card/40 p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Ainda sem dados para calcular estatísticas."
					})
				}),
				data && data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Funil"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-4 gap-2 sm:gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Aplicações",
											value: totalCount
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Contatados",
											value: funnelAttempted,
											rate: pct(funnelAttempted, totalCount),
											subLabel: "do total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Calls",
											value: funnelTalked,
											rate: pct(funnelTalked, funnelAttempted),
											subLabel: "dos contatados"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Fechados",
											value: funnelClosed,
											rate: pct(funnelClosed, funnelTalked),
											subLabel: "das calls",
											accent: true
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-[10px] text-muted-foreground/70",
									children: [
										"Taxa geral aplicações → fechados:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: pct(funnelClosed, totalCount)
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Abandono do formulário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1 text-[10px]",
										children: [
											7,
											30,
											90
										].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setAbandonDays(d),
											className: `rounded px-2 py-0.5 transition ${abandonDays === d ? "bg-[color:var(--gold)]/20 text-foreground" : "text-muted-foreground/70 hover:text-foreground"}`,
											children: [d, "d"]
										}, d))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Quantos começaram a preencher e não enviaram. Alto = campo demais ou o preço está espantando no momento errado."
								}),
								abandonTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Nenhum início de formulário registrado nesse período ainda.", submissionsInWindow.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 text-muted-foreground/70",
										children: [
											"(",
											submissionsInWindow.length,
											" ",
											submissionsInWindow.length === 1 ? "aplicação" : "aplicações",
											" chegaram — o tracking passa a valer a partir de agora.)"
										]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-baseline gap-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-serif text-3xl text-foreground",
											children: abandonRate != null ? `${Math.round(abandonRate * 100)}%` : "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
											children: "taxa de abandono"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: abandonTotal
												}), " começaram"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: abandonCompleted
												}), " enviaram"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: abandonRate != null && abandonRate >= .7 ? "text-red-300" : abandonRate != null && abandonRate >= .5 ? "text-amber-300" : "text-foreground",
														children: abandonAbandoned
													}),
													" ",
													"abandonaram"
												] })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 w-full overflow-hidden rounded bg-muted/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-emerald-500/60",
											style: { width: `${abandonTotal ? abandonCompleted / abandonTotal * 100 : 0}%` }
										})
									}),
									abandonRate != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-[11px]",
										children: abandonRate >= .7 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-300",
											children: "Acima de 70% — o formulário está espantando. Vale testar remover campos ou tirar o valor da página antes do preenchimento."
										}) : abandonRate >= .5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-300",
											children: "Entre 50–70% — normal para form de qualificação alta, mas dá pra melhorar removendo fricção."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-300",
											children: "Abaixo de 50% — form está enxuto e o interesse tá alto."
										})
									}),
									submissionsUntracked > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-[10px] text-muted-foreground/70",
										children: [
											submissionsUntracked,
											" ",
											submissionsUntracked === 1 ? "aplicação chegou" : "aplicações chegaram",
											" sem tracking (antes desse recurso existir) e não entra na conta."
										]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-[color:var(--gold)]/30 bg-gradient-to-br from-[color:var(--gold)]/[0.06] to-transparent p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Pipeline projetado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
										children: "ticket R$ 10k"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 mb-3 text-[11px] text-muted-foreground/70",
									children: "Leads em contato ativo × taxa histórica de fechamento × ticket. Previsão de receita do ciclo em tempo real."
								}),
								pipelineActive === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Nenhum lead em contato ativo agora — pipeline vazio."
								}) : pipelineHistRate == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										pipelineActive,
										" ",
										pipelineActive === 1 ? "lead ativo" : "leads ativos",
										", mas ainda sem histórico de fechamento pra calcular a projeção. Feche ou perca o 1º pra calibrar."
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-serif text-3xl text-gold-gradient",
											children: fmtBRL(pipelineProjectedBRL ?? 0)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-[10px] text-muted-foreground/70",
											children: [
												pipelineActive,
												" × ",
												Math.round(pipelineHistRate * 100),
												"% × R$ 10k"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2 text-[11px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border border-border/40 bg-background/40 p-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] uppercase tracking-widest text-muted-foreground/70",
														children: "Pior caso"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 text-foreground",
														children: fmtBRL(pipelineWorstBRL)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] text-muted-foreground/60",
														children: "10%"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/[0.08] p-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] uppercase tracking-widest text-muted-foreground/70",
														children: "Esperado"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 text-foreground",
														children: fmtBRL(pipelineProjectedBRL ?? 0)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[9px] text-muted-foreground/60",
														children: [Math.round(pipelineHistRate * 100), "% histórico"]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded border border-border/40 bg-background/40 p-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] uppercase tracking-widest text-muted-foreground/70",
														children: "Teto"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 text-foreground",
														children: fmtBRL(pipelineBestBRL)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] text-muted-foreground/60",
														children: "100%"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-[10px] text-muted-foreground/70",
										children: [
											"Taxa histórica: ",
											pipelineClosedHist,
											" fechados de ",
											pipelineDecidedHist,
											" decididos (fechados + perdidos).",
											pipelineDecidedHist < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-300",
												children: [" ", "Amostra pequena — a projeção fica mais confiável a partir de ~10 leads decididos."]
											})
										]
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-2 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Funil por coorte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: [
											7,
											30,
											90,
											365
										].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setCohortDays(d),
											className: `rounded px-2 py-0.5 normal-case tracking-normal transition ${cohortDays === d ? "bg-[color:var(--gold)]/20 text-foreground" : "text-muted-foreground/70 hover:text-foreground"}`,
											children: d === 365 ? "1 ano" : `${d}d`
										}, d))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground/70",
									children: [
										"Dos leads criados nos últimos ",
										cohortDays === 365 ? "12 meses" : `${cohortDays} dias`,
										" — ",
										cohortTotal,
										" ",
										cohortTotal === 1 ? "lead" : "leads"
									]
								}),
								cohortTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: "Nenhum lead nesse período."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-4 gap-2 sm:gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Criados",
											value: cohortTotal
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Contatados",
											value: cohortContacted,
											rate: pct(cohortContacted, cohortTotal),
											subLabel: "da coorte"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Fechados",
											value: cohortClosed,
											rate: pct(cohortClosed, cohortContacted),
											subLabel: "dos contatados",
											accent: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelStage, {
											label: "Perdidos",
											value: cohortLost,
											rate: pct(cohortLost, cohortTotal),
											subLabel: "da coorte"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-[10px] text-muted-foreground/70",
									children: [
										"Taxa criados → fechados nessa coorte:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: pct(cohortClosed, cohortTotal)
										}),
										cohortReopened > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											" · ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-300",
												children: [
													cohortReopened,
													" ",
													cohortReopened === 1 ? "lead voltou" : "leads voltaram",
													" ",
													"de status"
												]
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground/70",
												children: "(ex: perdido → contatado — vale revisitar)"
											})
										] })
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-widest text-muted-foreground",
										children: "Coortes semanais"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "uppercase tracking-widest text-muted-foreground/70",
											children: "Origem:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: weeklySource,
											onChange: (e) => setWeeklySource(e.target.value),
											className: "rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[11px] text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "all",
													children: "Todas"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "none",
													children: "Sem origem"
												}),
												uniqueSourcesStats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: s
												}, s))
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Compara qualidade de lead entre semanas — % que fechou de cada coorte de aplicação."
								}),
								weeklyRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Sem leads nessa origem."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "overflow-x-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full min-w-[520px] text-left text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-3 font-normal",
													children: "Semana"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-3 text-right font-normal",
													children: "Leads"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-3 text-right font-normal",
													children: "Contatados"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-3 text-right font-normal",
													children: "Fechados"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-0 text-right font-normal",
													children: "Perdidos"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/30",
											children: weeklyRows.map((r) => {
												const closedPct = r.total ? Math.round(r.closed / r.total * 100) : 0;
												const closedTone = r.total >= 3 ? closedPct >= 20 ? "text-emerald-300" : closedPct === 0 ? "text-red-300/80" : "text-foreground" : "text-muted-foreground";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-3 text-foreground",
														children: fmtWeekLabel(r.weekStart)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-3 text-right text-foreground",
														children: r.total
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-1.5 pr-3 text-right text-muted-foreground",
														children: [r.contacted, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-1 text-muted-foreground/60",
															children: [
																"(",
																pct(r.contacted, r.total),
																")"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: `py-1.5 pr-3 text-right ${closedTone}`,
														children: [r.closed, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-1 opacity-70",
															children: [
																"(",
																pct(r.closed, r.total),
																")"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-1.5 pr-0 text-right text-muted-foreground",
														children: [r.lost, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-1 text-muted-foreground/60",
															children: [
																"(",
																pct(r.lost, r.total),
																")"
															]
														})]
													})
												] }, r.weekStart);
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[10px] text-muted-foreground/70",
										children: "Semanas com <3 leads são amostra pequena — ignore % até acumular volume. Últimas 12 semanas com leads."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Quando o lead aplica"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Volume e conversão por dia da semana × horário — orienta quando postar CTA."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70",
										children: "Por dia da semana"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-2 font-normal",
													children: "Dia"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-2 text-right font-normal",
													children: "Leads"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-0 text-right font-normal",
													children: "% fechou"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/30",
											children: byDow.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-1.5 pr-2 text-foreground",
													children: dowLabels[i]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-1.5 pr-2 text-right text-muted-foreground",
													children: r.total
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: `py-1.5 pr-0 text-right ${r.total >= 3 ? "text-foreground" : "text-muted-foreground/60"}`,
													children: r.total ? pct(r.closed, r.total) : "—"
												})
											] }, i))
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70",
										children: "Por horário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-2 font-normal",
													children: "Faixa"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-2 text-right font-normal",
													children: "Leads"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 pr-0 text-right font-normal",
													children: "% fechou"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/30",
											children: hourBuckets.map((b, i) => {
												const r = byHour[i];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "py-1.5 pr-2 text-foreground",
														children: [
															b.label,
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground/60",
																children: b.range
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-1.5 pr-2 text-right text-muted-foreground",
														children: r.total
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: `py-1.5 pr-0 text-right ${r.total >= 3 ? "text-foreground" : "text-muted-foreground/60"}`,
														children: r.total ? pct(r.closed, r.total) : "—"
													})
												] }, b.key);
											})
										})]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70",
										children: "Mapa dia × horário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "overflow-x-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full min-w-[420px] text-left text-[10px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "text-muted-foreground/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-1 pr-2 font-normal" }), hourBuckets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-1 px-1 text-center font-normal",
													children: b.label
												}, b.key))]
											}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: grid.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1 pr-2 text-muted-foreground",
												children: dowLabels[i]
											}), row.map((cell, j) => {
												const rate = cell.total ? cell.closed / cell.total : 0;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-0.5 py-0.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: `rounded px-1.5 py-1 text-center leading-tight ${cell.total === 0 ? "bg-transparent text-muted-foreground/40" : cell.total < 3 ? "bg-muted/20 text-muted-foreground" : rate >= .2 ? "bg-emerald-500/25 text-emerald-100" : rate > 0 ? "bg-[color:var(--gold)]/15 text-foreground" : "bg-red-500/15 text-red-200"}`,
														title: cell.total ? `${cell.total} leads · ${cell.closed} fechados` : "sem leads",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[11px]",
															children: cell.total || "·"
														}), cell.total >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[9px] opacity-80",
															children: pct(cell.closed, cell.total)
														})]
													})
												}, j);
											})] }, i)) })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-[10px] text-muted-foreground/70",
											children: "Célula mostra volume; % de fechamento aparece só quando ≥3 leads. Verde = boa conversão, vermelho = zero fechamento."
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Ligações por dia"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Atividade, não resultado. Se aplicação tem e fechamento não, a 1ª pergunta é: quantas ligações foram feitas?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"últimos 14d",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: callsTotal
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"média/dia",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: callsAvg.toFixed(1)
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"média dias úteis",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground",
													children: callsBizAvg.toFixed(1)
												})
											]
										}),
										callsZeroDays > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-amber-300",
											children: [
												"· ",
												callsZeroDays,
												" ",
												callsZeroDays === 1 ? "dia útil" : "dias úteis",
												" sem nenhuma ligação"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1",
									children: callsRows.map((r) => {
										const width = callsMax ? r.count / callsMax * 100 : 0;
										const dow = (/* @__PURE__ */ new Date(r.day + "T00:00:00")).getDay();
										const isWeekend = dow === 0 || dow === 6;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `w-20 shrink-0 ${isWeekend ? "text-muted-foreground/50" : "text-muted-foreground"}`,
													children: fmtDayLabel(r.day)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative h-4 flex-1 rounded bg-muted/20",
													children: r.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `h-full rounded ${isWeekend ? "bg-muted/40" : "bg-[color:var(--gold)]/50"}`,
														style: { width: `${Math.max(width, 4)}%` }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `w-8 shrink-0 text-right ${r.count === 0 && !isWeekend ? "text-red-300/70" : "text-foreground"}`,
													children: r.count
												})
											]
										}, r.day);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[10px] text-muted-foreground/70",
									children: "Cada ligação = 1 tentativa registrada. Fins de semana em cinza claro."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Tempo até 1º contato"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"média",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: ttfcAvgMs != null && ttfcAvgMs > 1440 * 60 * 1e3 ? "text-red-300" : "text-foreground",
												children: fmtDuration(ttfcAvgMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"mediana",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: fmtDuration(ttfcMedianMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground/70",
										children: [
											"(",
											ttfcMsList.length,
											" ",
											ttfcMsList.length === 1 ? "lead" : "leads",
											")"
										]
									}),
									ttfcAvgMs != null && ttfcAvgMs > 1440 * 60 * 1e3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-300/90",
										children: "· acima de 24h — problema é disciplina de ligar"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Velocidade de contato × conversão"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Quanto mais rápido você liga, mais fecha. O número embaixo é o argumento pra priorizar a ligação sobre qualquer outra tarefa."
								}),
								speedContactedTotal === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Nenhum lead contatado ainda para medir velocidade."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full min-w-[380px] text-left text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "py-1 pr-3 font-normal",
															children: "Tempo até 1º contato"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "py-1 pr-3 text-right font-normal",
															children: "Leads"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "py-1 pr-3 text-right font-normal",
															children: "Fechados"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "py-1 pr-0 text-right font-normal",
															children: "% fechou"
														})
													]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
													className: "divide-y divide-border/30",
													children: [speedRows.map((r) => {
														const rate = r.total ? r.closed / r.total : 0;
														const tone = r.total < 3 ? "text-muted-foreground/70" : rate >= .2 ? "text-emerald-300" : rate === 0 ? "text-red-300/80" : "text-foreground";
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-1.5 pr-3 text-foreground",
																children: r.label
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-1.5 pr-3 text-right text-muted-foreground",
																children: r.total
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "py-1.5 pr-3 text-right text-muted-foreground",
																children: r.closed
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: `py-1.5 pr-0 text-right ${tone}`,
																children: r.total ? pct(r.closed, r.total) : "—"
															})
														] }, r.key);
													}), neverContactedTotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3 text-muted-foreground/80",
															children: "Nunca contatados"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3 text-right text-muted-foreground",
															children: neverContactedTotal
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3 text-right text-muted-foreground",
															children: neverContactedClosed
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-0 text-right text-muted-foreground/70",
															children: pct(neverContactedClosed, neverContactedTotal)
														})
													] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "border-t border-border/40 text-[10px] uppercase tracking-widest text-muted-foreground/70",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3",
															children: "Total contatados"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3 text-right",
															children: speedContactedTotal
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-3 text-right",
															children: speedContactedClosed
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-1.5 pr-0 text-right",
															children: pct(speedContactedClosed, speedContactedTotal)
														})
													]
												}) })
											]
										})
									}),
									speedLiftPct != null && fastBucket.total >= 3 && slowBucket.total >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-[11px]",
										children: speedLiftPct > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-300",
											children: [
												"Ligar em <1h fecha ",
												speedLiftPct,
												"% mais que ligar depois de 24h."
											]
										}) : speedLiftPct < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-300",
											children: "Contra-intuitivo: leads contatados em <1h estão fechando menos que >24h. Vale investigar qualidade da abordagem rápida."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Velocidade não está mexendo no fechamento nessa amostra."
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[10px] text-muted-foreground/70",
										children: "Buckets com <3 leads são amostra pequena — ignore % até acumular volume."
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Ciclo de venda"
							}), cycleMsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Nenhum fechamento registrado ainda."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"média",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: fmtDuration(cycleAvgMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"mediana",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: fmtDuration(cycleMedianMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"mais rápido",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: fmtDuration(cycleMinMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"mais longo",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: fmtDuration(cycleMaxMs)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground/70",
										children: [
											"(",
											cycleMsList.length,
											" ",
											cycleMsList.length === 1 ? "fechamento" : "fechamentos",
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[10px] text-muted-foreground/70",
								children: "Da aplicação ao \"fechado\" — use a mediana pra prever caixa entre abrir divulgação e dinheiro entrar."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Tempo parado em cada etapa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-[11px] text-muted-foreground/70",
									children: "Onde o tempo acumula é onde o funil trava."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: agingRows.map((row) => {
										const stuck = row.currentAvgAge != null && row.currentAvgAge > 4320 * 60 * 1e3;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded border border-border/30 bg-background/30 p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-foreground",
													children: row.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 grid gap-2 sm:grid-cols-2 text-[11px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
														children: "Quem já avançou"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [
																	"média",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-foreground",
																		children: fmtDuration(row.completedAvg)
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [
																	"mediana",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-foreground",
																		children: fmtDuration(row.completedMedian)
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground/60",
																children: [
																	"(",
																	row.completedCount,
																	")"
																]
															})
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] uppercase tracking-widest text-muted-foreground/70",
														children: "Parados agora"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [
																	row.currentCount,
																	" ",
																	row.currentCount === 1 ? "lead" : "leads"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [
																	"idade média",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: stuck ? "text-red-300" : "text-foreground",
																		children: fmtDuration(row.currentAvgAge)
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted-foreground",
																children: [
																	"mais antigo",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-foreground",
																		children: fmtDuration(row.currentMaxAge)
																	})
																]
															})
														]
													})] })]
												}),
												stuck && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-[10px] text-red-300/90",
													children: "· média acima de 3 dias parada — gargalo aqui"
												})
											]
										}, row.stage);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tentativas até contato" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground/70 normal-case tracking-normal",
									children: [
										"média",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: atcAvg != null ? atcAvg.toFixed(1) : "—"
										}),
										atcList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											" ",
											"(",
											atcList.length,
											" ",
											atcList.length === 1 ? "lead" : "leads",
											")"
										] })
									]
								})]
							}), atcList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40",
									children: [
										atcBuckets.one > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-emerald-500/70",
											style: { width: `${atcPct(atcBuckets.one)}%` }
										}),
										atcBuckets.two > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-[color:var(--gold)]/70",
											style: { width: `${atcPct(atcBuckets.two)}%` }
										}),
										atcBuckets.three > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-amber-500/70",
											style: { width: `${atcPct(atcBuckets.three)}%` }
										}),
										atcBuckets.more > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-red-500/70",
											style: { width: `${atcPct(atcBuckets.more)}%` }
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "bg-emerald-500/70",
											label: "1x",
											value: `${atcPct(atcBuckets.one)}%`,
											count: atcBuckets.one
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "bg-[color:var(--gold)]/70",
											label: "2x",
											value: `${atcPct(atcBuckets.two)}%`,
											count: atcBuckets.two
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "bg-amber-500/70",
											label: "3x",
											value: `${atcPct(atcBuckets.three)}%`,
											count: atcBuckets.three
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
											color: "bg-red-500/70",
											label: "4+",
											value: `${atcPct(atcBuckets.more)}%`,
											count: atcBuckets.more
										})
									]
								}),
								atcList.length >= 5 && atcPct(atcBuckets.one) < 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[10px] text-amber-300/90",
									children: [
										"· só ",
										atcPct(atcBuckets.one),
										"% atendem na 1ª — planeje uma cadência de ",
										Math.max(2, Math.round(atcAvg ?? 2)),
										" tentativas antes de esfriar"
									]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Distribuição por momento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground/70 normal-case tracking-normal",
										children: [
											rodandoCount + zeroCount,
											" de ",
											totalCount
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40",
									children: rodandoCount + zeroCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-[color:var(--gold)]/70",
										style: { width: `${rodandoPct}%` }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-muted-foreground/40",
										style: { width: `${zeroPct}%` }
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
										color: "bg-[color:var(--gold)]/70",
										label: "Já roda agência",
										value: `${rodandoPct}%`,
										count: rodandoCount
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
										color: "bg-muted-foreground/40",
										label: "Começando do zero",
										value: `${zeroPct}%`,
										count: zeroCount
									})]
								}),
								totalCount >= 5 && zeroPct >= 70 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[10px] text-amber-300/90",
									children: [
										"· ",
										zeroPct,
										"% iniciantes — copy pode estar atraindo público que fecha menos"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-border/50 bg-card/40 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Distribuição por faturamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground/70 normal-case tracking-normal",
										children: [
											"preenchido",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: revenueFillPct < 40 ? "text-amber-300" : "text-foreground",
												children: [revenueFillPct, "%"]
											}),
											" ",
											"(",
											revenueFilled,
											"/",
											totalCount,
											")"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40",
									children: [totalCount > 0 && revenueCounts.map((r) => {
										const pctVal = r.count / totalCount * 100;
										if (pctVal === 0) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: r.color,
											style: { width: `${pctVal}%` }
										}, r.key);
									}), totalCount > 0 && revenueEmptyCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-muted-foreground/20",
										style: { width: `${revenueEmptyCount / totalCount * 100}%` }
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]",
									children: [revenueCounts.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
										color: r.color,
										label: r.label,
										value: `${totalCount ? Math.round(r.count / totalCount * 100) : 0}%`,
										count: r.count
									}, r.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
										color: "bg-muted-foreground/20",
										label: "Não informado",
										value: `${totalCount ? Math.round(revenueEmptyCount / totalCount * 100) : 0}%`,
										count: revenueEmptyCount
									})]
								}),
								totalCount >= 5 && revenueFillPct < 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[10px] text-amber-300/90",
									children: [
										"· só ",
										revenueFillPct,
										"% preenchem — campo não está servindo pra priorizar, considera torná-lo obrigatório ou trocar as faixas"
									]
								})
							]
						})
					]
				})
			]
		})]
	});
}
function FunnelStage({ label, value, rate, subLabel, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-md border p-3 ${accent ? "border-[color:var(--gold)]/50 bg-[color:var(--gold)]/5" : "border-border/50 bg-background/40"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-widest text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-1 font-serif text-2xl leading-none sm:text-3xl ${accent ? "text-gold-gradient" : "text-foreground"}`,
				children: value
			}),
			rate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: rate
				}), subLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground/70",
					children: [" ", subLabel]
				}) : null]
			})
		]
	});
}
function LegendDot({ color, label, value, count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-2 w-2 rounded-full ${color}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-foreground",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted-foreground/70",
				children: [
					"(",
					count,
					")"
				]
			})
		]
	});
}
//#endregion
export { StatsPage as component };
