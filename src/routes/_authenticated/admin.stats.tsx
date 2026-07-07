import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  listApplications,
  listApplicationEvents,
  type LeadStatus,
} from "@/lib/admin.functions";
import { listFormStarts } from "@/lib/form-tracking.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/stats")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
  },
  component: StatsPage,
  head: () => ({
    meta: [
      { title: "Estatísticas — Noir Sessions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function fmtDuration(ms: number | null): string {
  if (ms == null) return "—";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}min`;
  const hrs = mins / 60;
  if (hrs < 24) return `${hrs.toFixed(hrs < 10 ? 1 : 0)}h`;
  const days = hrs / 24;
  return `${days.toFixed(days < 10 ? 1 : 0)}d`;
}

function pct(n: number, d: number) {
  if (!d) return "—";
  return `${Math.round((n / d) * 100)}%`;
}

function StatsPage() {
  const fetchList = useServerFn(listApplications);
  const { data, isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => fetchList(),
  });

  const fetchEvents = useServerFn(listApplicationEvents);
  const { data: events } = useQuery({
    queryKey: ["application_events"],
    queryFn: () => fetchEvents(),
  });

  const fetchStarts = useServerFn(listFormStarts);
  const { data: formStarts } = useQuery({
    queryKey: ["form_starts"],
    queryFn: () => fetchStarts(),
  });

  const [cohortDays, setCohortDays] = useState<7 | 30 | 90 | 365>(30);
  const [weeklySource, setWeeklySource] = useState<string>("all");
  const [abandonDays, setAbandonDays] = useState<7 | 30 | 90>(30);


  const totalCount = data?.length ?? 0;
  const closedCount = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "fechado",
  ).length;

  // Funil
  const funnelAttempted = (data ?? []).filter(
    (a) => (a.attempts ?? 0) > 0,
  ).length;
  const funnelTalked = (data ?? []).filter((a) => {
    const st = (a.status ?? "novo") as LeadStatus;
    return st === "contatado" || st === "fechado";
  }).length;
  const funnelClosed = closedCount;

  // Pipeline projetado — leads ativos em "contatado" × taxa histórica × R$10k
  const TICKET_BRL = 10000;
  const pipelineActive = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "contatado",
  ).length;
  // Base histórica: leads que já saíram de "contatado" (fechado ou perdido)
  const pipelineClosedHist = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "fechado",
  ).length;
  const pipelineLostHist = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "perdido",
  ).length;
  const pipelineDecidedHist = pipelineClosedHist + pipelineLostHist;
  const pipelineHistRate =
    pipelineDecidedHist > 0 ? pipelineClosedHist / pipelineDecidedHist : null;
  const pipelineProjectedBRL =
    pipelineHistRate != null
      ? pipelineActive * pipelineHistRate * TICKET_BRL
      : null;
  const pipelineWorstBRL = pipelineActive * 0.1 * TICKET_BRL; // piso conservador 10%
  const pipelineBestBRL = pipelineActive * TICKET_BRL; // teto 100%
  function fmtBRL(v: number): string {
    return v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }

  // TTFC
  const ttfcMsList = (data ?? [])
    .filter((a) => a.first_contacted_at)
    .map(
      (a) =>
        new Date(a.first_contacted_at as string).getTime() -
        new Date(a.created_at).getTime(),
    )
    .filter((ms) => ms >= 0);
  const ttfcAvgMs = ttfcMsList.length
    ? ttfcMsList.reduce((s, v) => s + v, 0) / ttfcMsList.length
    : null;
  const ttfcMedianMs = (() => {
    if (!ttfcMsList.length) return null;
    const s = [...ttfcMsList].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  })();

  // Velocidade de contato × conversão
  // Bucket por tempo entre criação e 1º contato; mede % que fechou em cada bucket.
  const speedBuckets = [
    { key: "lt1h", label: "< 1h", from: 0, to: 60 * 60 * 1000 },
    { key: "1to4h", label: "1–4h", from: 60 * 60 * 1000, to: 4 * 60 * 60 * 1000 },
    { key: "4to24h", label: "4–24h", from: 4 * 60 * 60 * 1000, to: 24 * 60 * 60 * 1000 },
    { key: "gt24h", label: "> 24h", from: 24 * 60 * 60 * 1000, to: Infinity },
  ] as const;
  const speedRows = speedBuckets.map((b) => ({
    ...b,
    total: 0,
    closed: 0,
  }));
  const closedIdsForSpeed = new Set<string>();
  for (const e of events ?? []) {
    if (e.event_type === "status_changed" && e.to_status === "fechado") {
      closedIdsForSpeed.add(e.application_id);
    }
  }
  for (const a of data ?? []) {
    if ((a.status ?? "novo") === "fechado") closedIdsForSpeed.add(a.id);
  }
  let neverContactedTotal = 0;
  let neverContactedClosed = 0;
  for (const a of data ?? []) {
    if (!a.first_contacted_at) {
      neverContactedTotal++;
      if (closedIdsForSpeed.has(a.id)) neverContactedClosed++;
      continue;
    }
    const ms =
      new Date(a.first_contacted_at).getTime() - new Date(a.created_at).getTime();
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
  const speedLiftPct =
    fastRate != null && slowRate != null && slowRate > 0
      ? Math.round(((fastRate - slowRate) / slowRate) * 100)
      : null;

  // Tentativas até contato
  const atcList = (data ?? [])
    .map((a) => a.attempts_to_contact)
    .filter((n): n is number => typeof n === "number" && n > 0);
  const atcAvg = atcList.length
    ? atcList.reduce((s, v) => s + v, 0) / atcList.length
    : null;
  const atcBuckets = { one: 0, two: 0, three: 0, more: 0 };
  for (const n of atcList) {
    if (n === 1) atcBuckets.one++;
    else if (n === 2) atcBuckets.two++;
    else if (n === 3) atcBuckets.three++;
    else atcBuckets.more++;
  }
  const atcPct = (n: number) =>
    atcList.length ? Math.round((n / atcList.length) * 100) : 0;

  // Momento
  const rodandoCount = (data ?? []).filter((a) => a.moment === "rodando").length;
  const zeroCount = (data ?? []).filter((a) => a.moment === "zero").length;
  const rodandoPct = totalCount
    ? Math.round((rodandoCount / totalCount) * 100)
    : 0;
  const zeroPct = totalCount ? 100 - rodandoPct : 0;

  // Faturamento
  const revenueBands: Array<{ key: string; label: string; color: string }> = [
    { key: "acima-50k", label: "Acima 50k", color: "bg-[color:var(--gold)]/80" },
    { key: "20-50k", label: "20–50k", color: "bg-[color:var(--gold)]/60" },
    { key: "5-20k", label: "5–20k", color: "bg-[color:var(--gold)]/40" },
    { key: "ate-5k", label: "Até 5k", color: "bg-[color:var(--gold)]/25" },
  ];
  const revenueCounts = revenueBands.map((b) => ({
    ...b,
    count: (data ?? []).filter((a) => a.revenue_band === b.key).length,
  }));
  const revenueFilled = revenueCounts.reduce((s, r) => s + r.count, 0);
  const revenueFillPct = totalCount
    ? Math.round((revenueFilled / totalCount) * 100)
    : 0;
  const revenueEmptyCount = totalCount - revenueFilled;

  // Coorte por período de criação — usa events para saber o que aconteceu depois
  const cohortSinceMs = Date.now() - cohortDays * 24 * 60 * 60 * 1000;
  const cohortLeads = (data ?? []).filter(
    (a) => new Date(a.created_at).getTime() >= cohortSinceMs,
  );
  const cohortIds = new Set(cohortLeads.map((a) => a.id));
  const cohortEvents = (events ?? []).filter((e) =>
    cohortIds.has(e.application_id),
  );

  // Para cada lead da coorte, ver quais estados ele passou (baseado em events)
  const cohortByLead = new Map<string, typeof cohortEvents>();
  for (const e of cohortEvents) {
    const arr = cohortByLead.get(e.application_id) ?? [];
    arr.push(e);
    cohortByLead.set(e.application_id, arr);
  }

  let cohortContacted = 0;
  let cohortClosed = 0;
  let cohortLost = 0;
  let cohortReopened = 0; // voltou de status (ex: perdido → contatado)
  const terminalOrder: Record<string, number> = {
    novo: 0,
    contatado: 1,
    fechado: 2,
    perdido: 2,
  };
  for (const lead of cohortLeads) {
    const evs = (cohortByLead.get(lead.id) ?? []).filter(
      (e) => e.event_type === "status_changed",
    );
    const reached = new Set(evs.map((e) => e.to_status));
    if (reached.has("contatado") || reached.has("fechado")) cohortContacted++;
    if (reached.has("fechado")) cohortClosed++;
    if (reached.has("perdido")) cohortLost++;

    // Detectar volta de status: alguma transição "para trás"
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

  // Ciclo de venda — created_at → 1º evento fechado
  const leadCreatedAt = new Map<string, string>(
    (data ?? []).map((a) => [a.id, a.created_at]),
  );
  const firstClosedAt = new Map<string, string>();
  for (const e of events ?? []) {
    if (e.event_type !== "status_changed" || e.to_status !== "fechado") continue;
    const prev = firstClosedAt.get(e.application_id);
    if (!prev || new Date(e.created_at).getTime() < new Date(prev).getTime()) {
      firstClosedAt.set(e.application_id, e.created_at);
    }
  }
  const cycleMsList: number[] = [];
  for (const [id, closedAt] of firstClosedAt) {
    const created = leadCreatedAt.get(id);
    if (!created) continue;
    const ms = new Date(closedAt).getTime() - new Date(created).getTime();
    if (ms >= 0) cycleMsList.push(ms);
  }
  const cycleAvgMs = cycleMsList.length
    ? cycleMsList.reduce((s, v) => s + v, 0) / cycleMsList.length
    : null;
  const cycleMedianMs = (() => {
    if (!cycleMsList.length) return null;
    const s = [...cycleMsList].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  })();
  const cycleMinMs = cycleMsList.length ? Math.min(...cycleMsList) : null;
  const cycleMaxMs = cycleMsList.length ? Math.max(...cycleMsList) : null;

  // Coortes semanais — agrupa leads por semana ISO (segunda) de criação
  const uniqueSourcesStats = Array.from(
    new Set(
      (data ?? [])
        .map((a) => a.utm_source)
        .filter((s): s is string => Boolean(s && s.trim())),
    ),
  ).sort((a, b) => a.localeCompare(b));

  function startOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0=Dom
    const diff = day === 0 ? -6 : 1 - day; // segunda-feira
    d.setDate(d.getDate() + diff);
    return d;
  }
  function weekKey(d: Date): string {
    return startOfWeek(d).toISOString().slice(0, 10);
  }

  const weeklyLeads = (data ?? []).filter((a) => {
    if (weeklySource === "all") return true;
    const src = a.utm_source ?? "";
    if (weeklySource === "none") return !src;
    return src === weeklySource;
  });

  const eventsById = new Map<string, typeof events>();
  for (const e of events ?? []) {
    const arr = eventsById.get(e.application_id) ?? [];
    arr.push(e);
    eventsById.set(e.application_id, arr);
  }

  const weeklyMap = new Map<
    string,
    { total: number; contacted: number; closed: number; lost: number }
  >();
  for (const lead of weeklyLeads) {
    const k = weekKey(new Date(lead.created_at));
    const row = weeklyMap.get(k) ?? { total: 0, contacted: 0, closed: 0, lost: 0 };
    row.total++;
    const evs = (eventsById.get(lead.id) ?? []).filter(
      (e) => e.event_type === "status_changed",
    );
    const reached = new Set(evs.map((e) => e.to_status));
    // fallback: status atual conta como "atingido" mesmo sem evento
    const st = (lead.status ?? "novo") as LeadStatus;
    if (st === "contatado" || st === "fechado" || reached.has("contatado") || reached.has("fechado"))
      row.contacted++;
    if (st === "fechado" || reached.has("fechado")) row.closed++;
    if (st === "perdido" || reached.has("perdido")) row.lost++;
    weeklyMap.set(k, row);
  }
  const weeklyRows = Array.from(weeklyMap.entries())
    .map(([k, v]) => ({ weekStart: k, ...v }))
    .sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1))
    .slice(0, 12);

  function fmtWeekLabel(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    const fmt = (x: Date) =>
      x.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    return `${fmt(d)} – ${fmt(end)}`;
  }

  // Conversão por dia da semana × horário da aplicação
  const closedIds = new Set<string>();
  for (const e of events ?? []) {
    if (e.event_type === "status_changed" && e.to_status === "fechado") {
      closedIds.add(e.application_id);
    }
  }
  for (const a of data ?? []) {
    if ((a.status ?? "novo") === "fechado") closedIds.add(a.id);
  }

  const dowLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hourBuckets = [
    { key: "madrugada", label: "Madrugada", range: "0–6h", from: 0, to: 6 },
    { key: "manha", label: "Manhã", range: "6–12h", from: 6, to: 12 },
    { key: "tarde", label: "Tarde", range: "12–18h", from: 12, to: 18 },
    { key: "noite", label: "Noite", range: "18–24h", from: 18, to: 24 },
  ] as const;
  function bucketIndex(h: number): number {
    if (h < 6) return 0;
    if (h < 12) return 1;
    if (h < 18) return 2;
    return 3;
  }

  const byDow = Array.from({ length: 7 }, () => ({ total: 0, closed: 0 }));
  const byHour = hourBuckets.map(() => ({ total: 0, closed: 0 }));
  const grid = Array.from({ length: 7 }, () =>
    hourBuckets.map(() => ({ total: 0, closed: 0 })),
  );
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





  // Aging — tempo médio parado em cada etapa antes de avançar
  const agingStages: LeadStatus[] = ["novo", "contatado", "fechado", "perdido"];
  const completedByStage = new Map<LeadStatus, number[]>(
    agingStages.map((s) => [s, []]),
  );
  const currentByStage = new Map<LeadStatus, number[]>(
    agingStages.map((s) => [s, []]),
  );

  const eventsByLead = new Map<string, typeof events>();
  for (const e of events ?? []) {
    if (e.event_type !== "status_changed") continue;
    const arr = eventsByLead.get(e.application_id) ?? [];
    arr.push(e);
    eventsByLead.set(e.application_id, arr);
  }

  const nowMs = Date.now();
  for (const lead of data ?? []) {
    const evs = (eventsByLead.get(lead.id) ?? [])
      .slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    let currentStatus: LeadStatus = "novo";
    let enteredAt = new Date(lead.created_at).getTime();
    for (const e of evs) {
      const exitAt = new Date(e.created_at).getTime();
      const dur = exitAt - enteredAt;
      if (dur >= 0) {
        completedByStage.get(currentStatus)?.push(dur);
      }
      currentStatus = (e.to_status ?? "novo") as LeadStatus;
      enteredAt = exitAt;
    }
    // stage atual (ainda parado nela)
    const ageInCurrent = nowMs - enteredAt;
    if (ageInCurrent >= 0) {
      currentByStage.get(currentStatus)?.push(ageInCurrent);
    }
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
  const median = (arr: number[]) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  const agingRows = (["novo", "contatado"] as LeadStatus[]).map((stage) => {
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
      currentMaxAge: current.length ? Math.max(...current) : null,
    };
  });

  // Ligações por dia — atividade (attempt_registered) últimos 14 dias
  const callsDays = 14;
  const callsToday = new Date();
  callsToday.setHours(0, 0, 0, 0);
  const callsStartMs = callsToday.getTime() - (callsDays - 1) * 24 * 60 * 60 * 1000;
  const callsByDay = new Map<string, number>();
  for (let i = 0; i < callsDays; i++) {
    const d = new Date(callsStartMs + i * 24 * 60 * 60 * 1000);
    callsByDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const e of events ?? []) {
    if (e.event_type !== "attempt_registered") continue;
    const t = new Date(e.created_at);
    if (t.getTime() < callsStartMs) continue;
    const key = new Date(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
    )
      .toISOString()
      .slice(0, 10);
    if (callsByDay.has(key)) callsByDay.set(key, (callsByDay.get(key) ?? 0) + 1);
  }
  const callsRows = Array.from(callsByDay.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => (a.day < b.day ? -1 : 1));
  const callsTotal = callsRows.reduce((s, r) => s + r.count, 0);
  const callsMax = callsRows.reduce((m, r) => Math.max(m, r.count), 0);
  const callsAvg = callsTotal / callsDays;
  const callsBusinessDays = callsRows.filter((r) => {
    const dow = new Date(r.day + "T00:00:00").getDay();
    return dow !== 0 && dow !== 6;
  });
  const callsBizTotal = callsBusinessDays.reduce((s, r) => s + r.count, 0);
  const callsBizAvg = callsBusinessDays.length
    ? callsBizTotal / callsBusinessDays.length
    : 0;
  const callsZeroDays = callsBusinessDays.filter((r) => r.count === 0).length;
  function fmtDayLabel(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    const dow = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][d.getDay()];
    const dm = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return `${dow} ${dm}`;
  }

  // Abandono do formulário — starts × submissões (linkadas por session_id)
  const abandonSinceMs =
    Date.now() - abandonDays * 24 * 60 * 60 * 1000;
  const startsInWindow = (formStarts ?? []).filter(
    (s) => new Date(s.created_at).getTime() >= abandonSinceMs,
  );
  const submittedSessionIds = new Set(
    (data ?? [])
      .map((a) => a.session_id)
      .filter((s): s is string => Boolean(s)),
  );
  const abandonTotal = startsInWindow.length;
  const abandonCompleted = startsInWindow.filter((s) =>
    submittedSessionIds.has(s.session_id),
  ).length;
  const abandonAbandoned = abandonTotal - abandonCompleted;
  const abandonRate = abandonTotal ? abandonAbandoned / abandonTotal : null;

  // Aplicações sem session_id (feitas antes do tracking existir)
  const submissionsInWindow = (data ?? []).filter(
    (a) => new Date(a.created_at).getTime() >= abandonSinceMs,
  );
  const submissionsUntracked = submissionsInWindow.filter(
    (a) => !a.session_id,
  ).length;









  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-gold-gradient">
              Estatísticas
            </h1>
            <p className="text-xs text-muted-foreground">
              {data ? `${data.length} aplicações no total` : "Carregando…"}
            </p>
          </div>
          <Link
            to="/admin"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← Voltar ao painel
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            {(error as Error).message === "Forbidden"
              ? "Você não é administrador."
              : (error as Error).message}
          </p>
        )}

        {data && data.length === 0 && (
          <div className="rounded-lg border border-border/50 bg-card/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda sem dados para calcular estatísticas.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="space-y-4">
            {/* Funil */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Funil
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <FunnelStage label="Aplicações" value={totalCount} />
                <FunnelStage
                  label="Contatados"
                  value={funnelAttempted}
                  rate={pct(funnelAttempted, totalCount)}
                  subLabel="do total"
                />
                <FunnelStage
                  label="Calls"
                  value={funnelTalked}
                  rate={pct(funnelTalked, funnelAttempted)}
                  subLabel="dos contatados"
                />
                <FunnelStage
                  label="Fechados"
                  value={funnelClosed}
                  rate={pct(funnelClosed, funnelTalked)}
                  subLabel="das calls"
                  accent
                />
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground/70">
                Taxa geral aplicações → fechados:{" "}
                <span className="text-foreground">
                  {pct(funnelClosed, totalCount)}
                </span>
              </p>
            </section>

            {/* Abandono do formulário */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Abandono do formulário
                </p>
                <div className="flex gap-1 text-[10px]">
                  {([7, 30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setAbandonDays(d)}
                      className={`rounded px-2 py-0.5 transition ${
                        abandonDays === d
                          ? "bg-[color:var(--gold)]/20 text-foreground"
                          : "text-muted-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Quantos começaram a preencher e não enviaram. Alto = campo demais ou o preço está espantando no momento errado.
              </p>

              {abandonTotal === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum início de formulário registrado nesse período ainda.
                  {submissionsInWindow.length > 0 && (
                    <span className="ml-1 text-muted-foreground/70">
                      ({submissionsInWindow.length} {submissionsInWindow.length === 1 ? "aplicação" : "aplicações"} chegaram — o tracking passa a valer a partir de agora.)
                    </span>
                  )}
                </p>
              ) : (
                <>
                  <div className="mb-3 flex items-baseline gap-6">
                    <div>
                      <p className="font-serif text-3xl text-foreground">
                        {abandonRate != null ? `${Math.round(abandonRate * 100)}%` : "—"}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        taxa de abandono
                      </p>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      <div>
                        <span className="text-foreground">{abandonTotal}</span> começaram
                      </div>
                      <div>
                        <span className="text-foreground">{abandonCompleted}</span> enviaram
                      </div>
                      <div>
                        <span
                          className={
                            abandonRate != null && abandonRate >= 0.7
                              ? "text-red-300"
                              : abandonRate != null && abandonRate >= 0.5
                                ? "text-amber-300"
                                : "text-foreground"
                          }
                        >
                          {abandonAbandoned}
                        </span>{" "}
                        abandonaram
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded bg-muted/20">
                    <div
                      className="h-full bg-emerald-500/60"
                      style={{
                        width: `${
                          abandonTotal
                            ? (abandonCompleted / abandonTotal) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  {abandonRate != null && (
                    <p className="mt-3 text-[11px]">
                      {abandonRate >= 0.7 ? (
                        <span className="text-red-300">
                          Acima de 70% — o formulário está espantando. Vale testar remover campos ou tirar o valor da página antes do preenchimento.
                        </span>
                      ) : abandonRate >= 0.5 ? (
                        <span className="text-amber-300">
                          Entre 50–70% — normal para form de qualificação alta, mas dá pra melhorar removendo fricção.
                        </span>
                      ) : (
                        <span className="text-emerald-300">
                          Abaixo de 50% — form está enxuto e o interesse tá alto.
                        </span>
                      )}
                    </p>
                  )}

                  {submissionsUntracked > 0 && (
                    <p className="mt-2 text-[10px] text-muted-foreground/70">
                      {submissionsUntracked} {submissionsUntracked === 1 ? "aplicação chegou" : "aplicações chegaram"} sem tracking (antes desse recurso existir) e não entra na conta.
                    </p>
                  )}
                </>
              )}
            </section>

            {/* Pipeline projetado */}

            <section className="rounded-lg border border-[color:var(--gold)]/30 bg-gradient-to-br from-[color:var(--gold)]/[0.06] to-transparent p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Pipeline projetado
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  ticket R$ 10k
                </p>
              </div>
              <p className="mt-1 mb-3 text-[11px] text-muted-foreground/70">
                Leads em contato ativo × taxa histórica de fechamento × ticket. Previsão de receita do ciclo em tempo real.
              </p>

              {pipelineActive === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum lead em contato ativo agora — pipeline vazio.
                </p>
              ) : pipelineHistRate == null ? (
                <p className="text-xs text-muted-foreground">
                  {pipelineActive} {pipelineActive === 1 ? "lead ativo" : "leads ativos"}, mas ainda sem histórico de fechamento pra calcular a projeção. Feche ou perca o 1º pra calibrar.
                </p>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="font-serif text-3xl text-gold-gradient">
                      {fmtBRL(pipelineProjectedBRL ?? 0)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {pipelineActive} × {Math.round(pipelineHistRate * 100)}% × R$ 10k
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded border border-border/40 bg-background/40 p-2">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/70">
                        Pior caso
                      </p>
                      <p className="mt-0.5 text-foreground">{fmtBRL(pipelineWorstBRL)}</p>
                      <p className="text-[9px] text-muted-foreground/60">10%</p>
                    </div>
                    <div className="rounded border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/[0.08] p-2">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/70">
                        Esperado
                      </p>
                      <p className="mt-0.5 text-foreground">
                        {fmtBRL(pipelineProjectedBRL ?? 0)}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60">
                        {Math.round(pipelineHistRate * 100)}% histórico
                      </p>
                    </div>
                    <div className="rounded border border-border/40 bg-background/40 p-2">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/70">
                        Teto
                      </p>
                      <p className="mt-0.5 text-foreground">{fmtBRL(pipelineBestBRL)}</p>
                      <p className="text-[9px] text-muted-foreground/60">100%</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground/70">
                    Taxa histórica: {pipelineClosedHist} fechados de {pipelineDecidedHist} decididos (fechados + perdidos).
                    {pipelineDecidedHist < 5 && (
                      <span className="text-amber-300">
                        {" "}Amostra pequena — a projeção fica mais confiável a partir de ~10 leads decididos.
                      </span>
                    )}
                  </p>
                </>
              )}
            </section>



            {/* Coorte por período */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="flex items-baseline justify-between gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Funil por coorte</span>
                <div className="flex gap-1">
                  {([7, 30, 90, 365] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setCohortDays(d)}
                      className={`rounded px-2 py-0.5 normal-case tracking-normal transition ${
                        cohortDays === d
                          ? "bg-[color:var(--gold)]/20 text-foreground"
                          : "text-muted-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {d === 365 ? "1 ano" : `${d}d`}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground/70">
                Dos leads criados nos últimos {cohortDays === 365 ? "12 meses" : `${cohortDays} dias`}
                {" — "}
                {cohortTotal} {cohortTotal === 1 ? "lead" : "leads"}
              </p>

              {cohortTotal === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Nenhum lead nesse período.
                </p>
              ) : (
                <>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                    <FunnelStage label="Criados" value={cohortTotal} />
                    <FunnelStage
                      label="Contatados"
                      value={cohortContacted}
                      rate={pct(cohortContacted, cohortTotal)}
                      subLabel="da coorte"
                    />
                    <FunnelStage
                      label="Fechados"
                      value={cohortClosed}
                      rate={pct(cohortClosed, cohortContacted)}
                      subLabel="dos contatados"
                      accent
                    />
                    <FunnelStage
                      label="Perdidos"
                      value={cohortLost}
                      rate={pct(cohortLost, cohortTotal)}
                      subLabel="da coorte"
                    />
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground/70">
                    Taxa criados → fechados nessa coorte:{" "}
                    <span className="text-foreground">
                      {pct(cohortClosed, cohortTotal)}
                    </span>
                    {cohortReopened > 0 && (
                      <>
                        {" · "}
                        <span className="text-amber-300">
                          {cohortReopened}{" "}
                          {cohortReopened === 1
                            ? "lead voltou"
                            : "leads voltaram"}{" "}
                          de status
                        </span>{" "}
                        <span className="text-muted-foreground/70">
                          (ex: perdido → contatado — vale revisitar)
                        </span>
                      </>
                    )}
                  </p>
                </>
              )}
            </section>

            {/* Coortes semanais */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Coortes semanais
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="uppercase tracking-widest text-muted-foreground/70">
                    Origem:
                  </span>
                  <select
                    value={weeklySource}
                    onChange={(e) => setWeeklySource(e.target.value)}
                    className="rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[11px] text-foreground"
                  >
                    <option value="all">Todas</option>
                    <option value="none">Sem origem</option>
                    {uniqueSourcesStats.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Compara qualidade de lead entre semanas — % que fechou de cada coorte de aplicação.
              </p>
              {weeklyRows.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem leads nessa origem.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-[11px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        <th className="py-1 pr-3 font-normal">Semana</th>
                        <th className="py-1 pr-3 text-right font-normal">Leads</th>
                        <th className="py-1 pr-3 text-right font-normal">Contatados</th>
                        <th className="py-1 pr-3 text-right font-normal">Fechados</th>
                        <th className="py-1 pr-0 text-right font-normal">Perdidos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {weeklyRows.map((r) => {
                        const closedPct = r.total ? Math.round((r.closed / r.total) * 100) : 0;
                        const closedTone =
                          r.total >= 3
                            ? closedPct >= 20
                              ? "text-emerald-300"
                              : closedPct === 0
                                ? "text-red-300/80"
                                : "text-foreground"
                            : "text-muted-foreground";
                        return (
                          <tr key={r.weekStart}>
                            <td className="py-1.5 pr-3 text-foreground">
                              {fmtWeekLabel(r.weekStart)}
                            </td>
                            <td className="py-1.5 pr-3 text-right text-foreground">{r.total}</td>
                            <td className="py-1.5 pr-3 text-right text-muted-foreground">
                              {r.contacted}
                              <span className="ml-1 text-muted-foreground/60">
                                ({pct(r.contacted, r.total)})
                              </span>
                            </td>
                            <td className={`py-1.5 pr-3 text-right ${closedTone}`}>
                              {r.closed}
                              <span className="ml-1 opacity-70">({pct(r.closed, r.total)})</span>
                            </td>
                            <td className="py-1.5 pr-0 text-right text-muted-foreground">
                              {r.lost}
                              <span className="ml-1 text-muted-foreground/60">
                                ({pct(r.lost, r.total)})
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p className="mt-2 text-[10px] text-muted-foreground/70">
                    Semanas com &lt;3 leads são amostra pequena — ignore % até acumular volume. Últimas 12 semanas com leads.
                  </p>
                </div>
              )}
            </section>

            {/* Quando o lead aplica */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Quando o lead aplica
              </p>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Volume e conversão por dia da semana × horário — orienta quando postar CTA.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    Por dia da semana
                  </p>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        <th className="py-1 pr-2 font-normal">Dia</th>
                        <th className="py-1 pr-2 text-right font-normal">Leads</th>
                        <th className="py-1 pr-0 text-right font-normal">% fechou</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {byDow.map((r, i) => (
                        <tr key={i}>
                          <td className="py-1.5 pr-2 text-foreground">{dowLabels[i]}</td>
                          <td className="py-1.5 pr-2 text-right text-muted-foreground">
                            {r.total}
                          </td>
                          <td
                            className={`py-1.5 pr-0 text-right ${
                              r.total >= 3 ? "text-foreground" : "text-muted-foreground/60"
                            }`}
                          >
                            {r.total ? pct(r.closed, r.total) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    Por horário
                  </p>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        <th className="py-1 pr-2 font-normal">Faixa</th>
                        <th className="py-1 pr-2 text-right font-normal">Leads</th>
                        <th className="py-1 pr-0 text-right font-normal">% fechou</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {hourBuckets.map((b, i) => {
                        const r = byHour[i];
                        return (
                          <tr key={b.key}>
                            <td className="py-1.5 pr-2 text-foreground">
                              {b.label}{" "}
                              <span className="text-muted-foreground/60">{b.range}</span>
                            </td>
                            <td className="py-1.5 pr-2 text-right text-muted-foreground">
                              {r.total}
                            </td>
                            <td
                              className={`py-1.5 pr-0 text-right ${
                                r.total >= 3 ? "text-foreground" : "text-muted-foreground/60"
                              }`}
                            >
                              {r.total ? pct(r.closed, r.total) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  Mapa dia × horário
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-[10px]">
                    <thead>
                      <tr className="text-muted-foreground/70">
                        <th className="py-1 pr-2 font-normal"></th>
                        {hourBuckets.map((b) => (
                          <th key={b.key} className="py-1 px-1 text-center font-normal">
                            {b.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grid.map((row, i) => (
                        <tr key={i}>
                          <td className="py-1 pr-2 text-muted-foreground">{dowLabels[i]}</td>
                          {row.map((cell, j) => {
                            const rate = cell.total ? cell.closed / cell.total : 0;
                            const tone =
                              cell.total === 0
                                ? "bg-transparent text-muted-foreground/40"
                                : cell.total < 3
                                  ? "bg-muted/20 text-muted-foreground"
                                  : rate >= 0.2
                                    ? "bg-emerald-500/25 text-emerald-100"
                                    : rate > 0
                                      ? "bg-[color:var(--gold)]/15 text-foreground"
                                      : "bg-red-500/15 text-red-200";
                            return (
                              <td key={j} className="px-0.5 py-0.5">
                                <div
                                  className={`rounded px-1.5 py-1 text-center leading-tight ${tone}`}
                                  title={
                                    cell.total
                                      ? `${cell.total} leads · ${cell.closed} fechados`
                                      : "sem leads"
                                  }
                                >
                                  <div className="text-[11px]">{cell.total || "·"}</div>
                                  {cell.total >= 3 && (
                                    <div className="text-[9px] opacity-80">
                                      {pct(cell.closed, cell.total)}
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-[10px] text-muted-foreground/70">
                    Célula mostra volume; % de fechamento aparece só quando ≥3 leads. Verde = boa conversão, vermelho = zero fechamento.
                  </p>
                </div>
              </div>
            </section>






            {/* Ligações por dia */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Ligações por dia
              </p>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Atividade, não resultado. Se aplicação tem e fechamento não, a 1ª pergunta é: quantas ligações foram feitas?
              </p>

              <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
                <span className="text-muted-foreground">
                  últimos 14d{" "}
                  <span className="text-foreground">{callsTotal}</span>
                </span>
                <span className="text-muted-foreground">
                  média/dia{" "}
                  <span className="text-foreground">{callsAvg.toFixed(1)}</span>
                </span>
                <span className="text-muted-foreground">
                  média dias úteis{" "}
                  <span className="text-foreground">{callsBizAvg.toFixed(1)}</span>
                </span>
                {callsZeroDays > 0 && (
                  <span className="text-amber-300">
                    · {callsZeroDays} {callsZeroDays === 1 ? "dia útil" : "dias úteis"} sem nenhuma ligação
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {callsRows.map((r) => {
                  const width = callsMax ? (r.count / callsMax) * 100 : 0;
                  const dow = new Date(r.day + "T00:00:00").getDay();
                  const isWeekend = dow === 0 || dow === 6;
                  return (
                    <div key={r.day} className="flex items-center gap-2 text-[11px]">
                      <span
                        className={`w-20 shrink-0 ${
                          isWeekend ? "text-muted-foreground/50" : "text-muted-foreground"
                        }`}
                      >
                        {fmtDayLabel(r.day)}
                      </span>
                      <div className="relative h-4 flex-1 rounded bg-muted/20">
                        {r.count > 0 && (
                          <div
                            className={`h-full rounded ${
                              isWeekend
                                ? "bg-muted/40"
                                : "bg-[color:var(--gold)]/50"
                            }`}
                            style={{ width: `${Math.max(width, 4)}%` }}
                          />
                        )}
                      </div>
                      <span
                        className={`w-8 shrink-0 text-right ${
                          r.count === 0 && !isWeekend
                            ? "text-red-300/70"
                            : "text-foreground"
                        }`}
                      >
                        {r.count}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground/70">
                Cada ligação = 1 tentativa registrada. Fins de semana em cinza claro.
              </p>
            </section>

            {/* TTFC */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Tempo até 1º contato
              </p>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
                <span className="text-muted-foreground">
                  média{" "}
                  <span
                    className={
                      ttfcAvgMs != null && ttfcAvgMs > 24 * 60 * 60 * 1000
                        ? "text-red-300"
                        : "text-foreground"
                    }
                  >
                    {fmtDuration(ttfcAvgMs)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  mediana{" "}
                  <span className="text-foreground">
                    {fmtDuration(ttfcMedianMs)}
                  </span>
                </span>
                <span className="text-muted-foreground/70">
                  ({ttfcMsList.length}{" "}
                  {ttfcMsList.length === 1 ? "lead" : "leads"})
                </span>
                {ttfcAvgMs != null && ttfcAvgMs > 24 * 60 * 60 * 1000 && (
                  <span className="text-red-300/90">
                    · acima de 24h — problema é disciplina de ligar
                  </span>
                )}
              </div>
            </section>

            {/* Velocidade de contato × conversão */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Velocidade de contato × conversão
              </p>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Quanto mais rápido você liga, mais fecha. O número embaixo é o argumento pra priorizar a ligação sobre qualquer outra tarefa.
              </p>
              {speedContactedTotal === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum lead contatado ainda para medir velocidade.
                </p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[380px] text-left text-[11px]">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                          <th className="py-1 pr-3 font-normal">Tempo até 1º contato</th>
                          <th className="py-1 pr-3 text-right font-normal">Leads</th>
                          <th className="py-1 pr-3 text-right font-normal">Fechados</th>
                          <th className="py-1 pr-0 text-right font-normal">% fechou</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {speedRows.map((r) => {
                          const rate = r.total ? r.closed / r.total : 0;
                          const tone =
                            r.total < 3
                              ? "text-muted-foreground/70"
                              : rate >= 0.2
                                ? "text-emerald-300"
                                : rate === 0
                                  ? "text-red-300/80"
                                  : "text-foreground";
                          return (
                            <tr key={r.key}>
                              <td className="py-1.5 pr-3 text-foreground">{r.label}</td>
                              <td className="py-1.5 pr-3 text-right text-muted-foreground">
                                {r.total}
                              </td>
                              <td className="py-1.5 pr-3 text-right text-muted-foreground">
                                {r.closed}
                              </td>
                              <td className={`py-1.5 pr-0 text-right ${tone}`}>
                                {r.total ? pct(r.closed, r.total) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                        {neverContactedTotal > 0 && (
                          <tr>
                            <td className="py-1.5 pr-3 text-muted-foreground/80">
                              Nunca contatados
                            </td>
                            <td className="py-1.5 pr-3 text-right text-muted-foreground">
                              {neverContactedTotal}
                            </td>
                            <td className="py-1.5 pr-3 text-right text-muted-foreground">
                              {neverContactedClosed}
                            </td>
                            <td className="py-1.5 pr-0 text-right text-muted-foreground/70">
                              {pct(neverContactedClosed, neverContactedTotal)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-border/40 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                          <td className="py-1.5 pr-3">Total contatados</td>
                          <td className="py-1.5 pr-3 text-right">{speedContactedTotal}</td>
                          <td className="py-1.5 pr-3 text-right">{speedContactedClosed}</td>
                          <td className="py-1.5 pr-0 text-right">
                            {pct(speedContactedClosed, speedContactedTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {speedLiftPct != null &&
                    fastBucket.total >= 3 &&
                    slowBucket.total >= 3 && (
                      <p className="mt-3 text-[11px]">
                        {speedLiftPct > 0 ? (
                          <span className="text-emerald-300">
                            Ligar em &lt;1h fecha {speedLiftPct}% mais que ligar depois de 24h.
                          </span>
                        ) : speedLiftPct < 0 ? (
                          <span className="text-amber-300">
                            Contra-intuitivo: leads contatados em &lt;1h estão fechando menos que &gt;24h. Vale investigar qualidade da abordagem rápida.
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Velocidade não está mexendo no fechamento nessa amostra.
                          </span>
                        )}
                      </p>
                    )}
                  <p className="mt-2 text-[10px] text-muted-foreground/70">
                    Buckets com &lt;3 leads são amostra pequena — ignore % até acumular volume.
                  </p>
                </>
              )}
            </section>



            {/* Ciclo de venda */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Ciclo de venda
              </p>
              {cycleMsList.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum fechamento registrado ainda.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
                    <span className="text-muted-foreground">
                      média{" "}
                      <span className="text-foreground">{fmtDuration(cycleAvgMs)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      mediana{" "}
                      <span className="text-foreground">{fmtDuration(cycleMedianMs)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      mais rápido{" "}
                      <span className="text-foreground">{fmtDuration(cycleMinMs)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      mais longo{" "}
                      <span className="text-foreground">{fmtDuration(cycleMaxMs)}</span>
                    </span>
                    <span className="text-muted-foreground/70">
                      ({cycleMsList.length}{" "}
                      {cycleMsList.length === 1 ? "fechamento" : "fechamentos"})
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground/70">
                    Da aplicação ao "fechado" — use a mediana pra prever caixa entre abrir divulgação e dinheiro entrar.
                  </p>
                </>
              )}
            </section>

            {/* Aging por etapa */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Tempo parado em cada etapa
              </p>
              <p className="mb-3 text-[11px] text-muted-foreground/70">
                Onde o tempo acumula é onde o funil trava.
              </p>
              <div className="space-y-3">
                {agingRows.map((row) => {
                  const stuck =
                    row.currentAvgAge != null &&
                    row.currentAvgAge > 3 * 24 * 60 * 60 * 1000;
                  return (
                    <div
                      key={row.stage}
                      className="rounded border border-border/30 bg-background/30 p-3"
                    >
                      <p className="text-[11px] text-foreground">{row.label}</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2 text-[11px]">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                            Quem já avançou
                          </p>
                          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                            <span className="text-muted-foreground">
                              média{" "}
                              <span className="text-foreground">
                                {fmtDuration(row.completedAvg)}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              mediana{" "}
                              <span className="text-foreground">
                                {fmtDuration(row.completedMedian)}
                              </span>
                            </span>
                            <span className="text-muted-foreground/60">
                              ({row.completedCount})
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                            Parados agora
                          </p>
                          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                            <span className="text-muted-foreground">
                              {row.currentCount}{" "}
                              {row.currentCount === 1 ? "lead" : "leads"}
                            </span>
                            <span className="text-muted-foreground">
                              idade média{" "}
                              <span
                                className={
                                  stuck ? "text-red-300" : "text-foreground"
                                }
                              >
                                {fmtDuration(row.currentAvgAge)}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              mais antigo{" "}
                              <span className="text-foreground">
                                {fmtDuration(row.currentMaxAge)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {stuck && (
                        <p className="mt-2 text-[10px] text-red-300/90">
                          · média acima de 3 dias parada — gargalo aqui
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tentativas até contato */}



            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Tentativas até contato</span>
                <span className="text-muted-foreground/70 normal-case tracking-normal">
                  média{" "}
                  <span className="text-foreground">
                    {atcAvg != null ? atcAvg.toFixed(1) : "—"}
                  </span>
                  {atcList.length > 0 && (
                    <>
                      {" "}
                      ({atcList.length}{" "}
                      {atcList.length === 1 ? "lead" : "leads"})
                    </>
                  )}
                </span>
              </div>
              {atcList.length > 0 && (
                <>
                  <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40">
                    {atcBuckets.one > 0 && (
                      <div
                        className="bg-emerald-500/70"
                        style={{ width: `${atcPct(atcBuckets.one)}%` }}
                      />
                    )}
                    {atcBuckets.two > 0 && (
                      <div
                        className="bg-[color:var(--gold)]/70"
                        style={{ width: `${atcPct(atcBuckets.two)}%` }}
                      />
                    )}
                    {atcBuckets.three > 0 && (
                      <div
                        className="bg-amber-500/70"
                        style={{ width: `${atcPct(atcBuckets.three)}%` }}
                      />
                    )}
                    {atcBuckets.more > 0 && (
                      <div
                        className="bg-red-500/70"
                        style={{ width: `${atcPct(atcBuckets.more)}%` }}
                      />
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                    <LegendDot color="bg-emerald-500/70" label="1x" value={`${atcPct(atcBuckets.one)}%`} count={atcBuckets.one} />
                    <LegendDot color="bg-[color:var(--gold)]/70" label="2x" value={`${atcPct(atcBuckets.two)}%`} count={atcBuckets.two} />
                    <LegendDot color="bg-amber-500/70" label="3x" value={`${atcPct(atcBuckets.three)}%`} count={atcBuckets.three} />
                    <LegendDot color="bg-red-500/70" label="4+" value={`${atcPct(atcBuckets.more)}%`} count={atcBuckets.more} />
                  </div>
                  {atcList.length >= 5 && atcPct(atcBuckets.one) < 40 && (
                    <p className="mt-2 text-[10px] text-amber-300/90">
                      · só {atcPct(atcBuckets.one)}% atendem na 1ª — planeje uma cadência de {Math.max(2, Math.round(atcAvg ?? 2))} tentativas antes de esfriar
                    </p>
                  )}
                </>
              )}
            </section>

            {/* Momento */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Distribuição por momento</span>
                <span className="text-muted-foreground/70 normal-case tracking-normal">
                  {rodandoCount + zeroCount} de {totalCount}
                </span>
              </div>
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40">
                {rodandoCount + zeroCount > 0 && (
                  <>
                    <div
                      className="bg-[color:var(--gold)]/70"
                      style={{ width: `${rodandoPct}%` }}
                    />
                    <div
                      className="bg-muted-foreground/40"
                      style={{ width: `${zeroPct}%` }}
                    />
                  </>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                <LegendDot color="bg-[color:var(--gold)]/70" label="Já roda agência" value={`${rodandoPct}%`} count={rodandoCount} />
                <LegendDot color="bg-muted-foreground/40" label="Começando do zero" value={`${zeroPct}%`} count={zeroCount} />
              </div>
              {totalCount >= 5 && zeroPct >= 70 && (
                <p className="mt-2 text-[10px] text-amber-300/90">
                  · {zeroPct}% iniciantes — copy pode estar atraindo público que fecha menos
                </p>
              )}
            </section>

            {/* Faturamento */}
            <section className="rounded-lg border border-border/50 bg-card/40 p-4">
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Distribuição por faturamento</span>
                <span className="text-muted-foreground/70 normal-case tracking-normal">
                  preenchido{" "}
                  <span
                    className={
                      revenueFillPct < 40
                        ? "text-amber-300"
                        : "text-foreground"
                    }
                  >
                    {revenueFillPct}%
                  </span>{" "}
                  ({revenueFilled}/{totalCount})
                </span>
              </div>
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-border/40">
                {totalCount > 0 &&
                  revenueCounts.map((r) => {
                    const pctVal = (r.count / totalCount) * 100;
                    if (pctVal === 0) return null;
                    return (
                      <div
                        key={r.key}
                        className={r.color}
                        style={{ width: `${pctVal}%` }}
                      />
                    );
                  })}
                {totalCount > 0 && revenueEmptyCount > 0 && (
                  <div
                    className="bg-muted-foreground/20"
                    style={{
                      width: `${(revenueEmptyCount / totalCount) * 100}%`,
                    }}
                  />
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                {revenueCounts.map((r) => (
                  <LegendDot
                    key={r.key}
                    color={r.color}
                    label={r.label}
                    value={`${totalCount ? Math.round((r.count / totalCount) * 100) : 0}%`}
                    count={r.count}
                  />
                ))}
                <LegendDot
                  color="bg-muted-foreground/20"
                  label="Não informado"
                  value={`${totalCount ? Math.round((revenueEmptyCount / totalCount) * 100) : 0}%`}
                  count={revenueEmptyCount}
                />
              </div>
              {totalCount >= 5 && revenueFillPct < 40 && (
                <p className="mt-2 text-[10px] text-amber-300/90">
                  · só {revenueFillPct}% preenchem — campo não está servindo pra priorizar, considera torná-lo obrigatório ou trocar as faixas
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function FunnelStage({
  label,
  value,
  rate,
  subLabel,
  accent,
}: {
  label: string;
  value: number;
  rate?: string;
  subLabel?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-3 ${
        accent
          ? "border-[color:var(--gold)]/50 bg-[color:var(--gold)]/5"
          : "border-border/50 bg-background/40"
      }`}
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-serif text-2xl leading-none sm:text-3xl ${
          accent ? "text-gold-gradient" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {rate && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          <span className="text-foreground">{rate}</span>
          {subLabel ? (
            <span className="text-muted-foreground/70"> {subLabel}</span>
          ) : null}
        </p>
      )}
    </div>
  );
}

function LegendDot({
  color,
  label,
  value,
  count,
}: {
  color: string;
  label: string;
  value: string;
  count: number;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
      <span className="text-muted-foreground/70">({count})</span>
    </span>
  );
}
