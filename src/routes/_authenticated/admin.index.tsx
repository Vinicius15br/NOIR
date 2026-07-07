import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  listApplications,
  listApplicationEvents,
  deleteApplication,
  setApplicationContacted,
  setApplicationNotes,
  setApplicationStatus,
  registerAttempt,
  undoAttempt,
  type LeadStatus,
  type LostReason,
} from "@/lib/admin.functions";

import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw redirect({ to: "/auth" });
    }
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
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Painel — Noir Sessions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Sem acesso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message === "Forbidden"
            ? "Sua conta não tem permissão de administrador."
            : "Falha ao carregar o painel."}
        </p>
      </div>
    </div>
  ),
});

const momentLabels: Record<string, string> = {
  rodando: "Já roda agência",
  zero: "Começando do zero",
};

const revenueLabels: Record<string, string> = {
  "ate-5k": "Até R$ 5k",
  "5-20k": "R$ 5k – 20k",
  "20-50k": "R$ 20k – 50k",
  "acima-50k": "Acima de R$ 50k",
};

const statusLabels: Record<LeadStatus, string> = {
  novo: "Novo",
  contatado: "Contatado",
  fechado: "Fechado",
  perdido: "Perdido",
};

const lostReasonLabels: Record<LostReason, string> = {
  preco: "Preço",
  timing: "Timing",
  nao_atendeu: "Não atendeu",
  nao_qualificado: "Não qualificado",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchList = useServerFn(listApplications);
  const doDelete = useServerFn(deleteApplication);
  const doSetContacted = useServerFn(setApplicationContacted);
  const doSetStatus = useServerFn(setApplicationStatus);
  const doRegisterAttempt = useServerFn(registerAttempt);
  const doUndoAttempt = useServerFn(undoAttempt);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [attemptBusy, setAttemptBusy] = useState<string | null>(null);
  const [statusBusy, setStatusBusy] = useState<string | null>(null);
  const [pendingLostId, setPendingLostId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => fetchList(),
  });

  const fetchEvents = useServerFn(listApplicationEvents);
  const { data: events } = useQuery({
    queryKey: ["application_events"],
    queryFn: () => fetchEvents(),
  });


  useEffect(() => {
    const channel = supabase
      .channel("applications-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          qc.invalidateQueries({ queryKey: ["applications"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const [search, setSearch] = useState("");
  const [momentFilter, setMomentFilter] = useState<string>("all");
  const [revenueFilter, setRevenueFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<"priority" | "recent">("priority");
  const [now, setNow] = useState(() => Date.now());

  const HIGHLIGHT_MS = 15_000;
  const STALE_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const hasRecent = (data ?? []).some(
      (app) => Date.now() - new Date(app.created_at).getTime() < HIGHLIGHT_MS,
    );
    const hasPending = (data ?? []).some(
      (app) => (app.status ?? "novo") === "novo",
    );
    if (!hasRecent && !hasPending) return;
    const interval = hasRecent ? 1000 : 60_000;
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [data]);

  // Priority score: quente no topo.
  //  - Perdido sempre por último
  //  - "Já roda agência" acima de "começando do zero"
  //  - Dentro do momento, faturamento alto acima de baixo (null = pior)
  //  - Novo (não contatado) acima de contatado
  //  - Empate: mais recente primeiro
  const revenueRank: Record<string, number> = {
    "acima-50k": 4,
    "20-50k": 3,
    "5-20k": 2,
    "ate-5k": 1,
  };
  function priorityScore(app: {
    moment: string;
    revenue_band: string | null;
    status: string | null;
  }): number {
    const st = (app.status ?? "novo") as LeadStatus;
    if (st === "perdido") return -1000;
    if (st === "fechado") return -500; // já fechou, sai do topo
    let score = 0;
    if (app.moment === "rodando") score += 100;
    score += (app.revenue_band ? revenueRank[app.revenue_band] ?? 0 : 0) * 10;
    if (st === "novo") score += 5;
    return score;
  }

  const filtered = (data ?? [])
    .slice()
    .sort((a, b) => {
      if (sortMode === "priority") {
        const diff = priorityScore(b) - priorityScore(a);
        if (diff !== 0) return diff;
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .filter((app) => {
      const st = (app.status ?? "novo") as LeadStatus;
      if (momentFilter !== "all" && app.moment !== momentFilter) return false;
      if (statusFilter !== "all" && st !== statusFilter) return false;
      if (revenueFilter !== "all") {
        if (revenueFilter === "none") {
          if (app.revenue_band) return false;
        } else if (app.revenue_band !== revenueFilter) {
          return false;
        }
      }
      if (sourceFilter !== "all") {
        const src = app.utm_source ?? "";
        if (sourceFilter === "none" && src) return false;
        if (sourceFilter !== "none" && src !== sourceFilter) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${app.full_name} ${app.instagram} ${app.whatsapp}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

  const totalCount = data?.length ?? 0;
  const novoCount = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "novo",
  ).length;
  const contactedCount = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "contatado",
  ).length;
  const closedCount = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "fechado",
  ).length;
  const lostCount = (data ?? []).filter(
    (a) => (a.status ?? "novo") === "perdido",
  ).length;

  // (Estatísticas moved to /admin/stats)
  function fmtDuration(ms: number | null): string {
    if (ms == null) return "—";
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `${mins}min`;
    const hrs = mins / 60;
    if (hrs < 24) return `${hrs.toFixed(hrs < 10 ? 1 : 0)}h`;
    const days = hrs / 24;
    return `${days.toFixed(days < 10 ? 1 : 0)}d`;
  }

  // Leads travados — no mesmo status há mais de 7 dias (ignora fechado/perdido)
  const STUCK_MS = 7 * 24 * 60 * 60 * 1000;
  const lastStatusChangeByLead = new Map<string, number>();
  for (const e of events ?? []) {
    if (e.event_type !== "status_changed") continue;
    const t = new Date(e.created_at).getTime();
    const prev = lastStatusChangeByLead.get(e.application_id);
    if (prev == null || t > prev) lastStatusChangeByLead.set(e.application_id, t);
  }
  type StuckLead = {
    app: NonNullable<typeof data>[number];
    status: LeadStatus;
    ageMs: number;
  };
  const stuckLeads: StuckLead[] = (data ?? [])
    .map((a): StuckLead | null => {
      const st = (a.status ?? "novo") as LeadStatus;
      if (st === "fechado" || st === "perdido") return null;
      const enteredAt =
        lastStatusChangeByLead.get(a.id) ?? new Date(a.created_at).getTime();
      const ageMs = now - enteredAt;
      if (ageMs < STUCK_MS) return null;
      return { app: a, status: st, ageMs };
    })
    .filter((x): x is StuckLead => x !== null)
    .sort((a, b) => b.ageMs - a.ageMs);





  const uniqueSources = Array.from(
    new Set(
      (data ?? [])
        .map((a) => a.utm_source)
        .filter((s): s is string => Boolean(s && s.trim())),
    ),
  ).sort((a, b) => a.localeCompare(b));

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
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
      "Landing",
    ];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filtered.map((app) => {
      const st = (app.status ?? "novo") as LeadStatus;
      return [
        new Date(app.created_at).toLocaleString("pt-BR"),
        app.full_name,
        app.whatsapp,
        `+55${app.whatsapp.replace(/\D/g, "")}`,
        `@${app.instagram}`,
        momentLabels[app.moment] ?? app.moment,
        app.revenue_band
          ? revenueLabels[app.revenue_band] ?? app.revenue_band
          : "",
        statusLabels[st],
        app.lost_reason
          ? lostReasonLabels[app.lost_reason as LostReason] ?? app.lost_reason
          : "",
        String(app.attempts ?? 0),
        app.last_attempt_at
          ? new Date(app.last_attempt_at).toLocaleString("pt-BR")
          : "",
        app.utm_source ?? "",
        app.utm_medium ?? "",
        app.utm_campaign ?? "",
        app.utm_content ?? "",
        app.utm_term ?? "",
        app.referrer ?? "",
        app.landing_path ?? "",
      ]
        .map((v) => escape(String(v ?? "")))
        .join(",");
    });
    const csv = "\uFEFF" + [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.download = `leads-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta aplicação?")) return;
    setDeletingId(id);
    try {
      await doDelete({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["applications"] });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleContacted(id: string, next: boolean) {
    setTogglingId(id);
    try {
      await doSetContacted({ data: { id, contacted: next } });
      await qc.invalidateQueries({ queryKey: ["applications"] });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleRegisterAttempt(id: string) {
    setAttemptBusy(id);
    try {
      await doRegisterAttempt({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["applications"] });
    } finally {
      setAttemptBusy(null);
    }
  }

  async function handleUndoAttempt(id: string) {
    setAttemptBusy(id);
    try {
      await doUndoAttempt({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["applications"] });
    } finally {
      setAttemptBusy(null);
    }
  }

  async function handleChangeStatus(
    id: string,
    next: LeadStatus,
    lostReason?: LostReason,
  ) {
    if (next === "perdido" && !lostReason) {
      setPendingLostId(id);
      return;
    }
    setStatusBusy(id);
    try {
      await doSetStatus({
        data: { id, status: next, lost_reason: lostReason ?? null },
      });
      setPendingLostId(null);
      await qc.invalidateQueries({ queryKey: ["applications"] });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setStatusBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-gold-gradient">
              Painel de leads
            </h1>
            <p className="text-xs text-muted-foreground">
              {data
                ? `${filtered.length} de ${data.length} aplicações`
                : "Carregando…"}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Sair
          </button>
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

        {data && data.length > 0 && (
          <div className="mb-4">
            <Link
              to="/admin/stats"
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-3 py-2 text-xs uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20"
            >
              Ver estatísticas →
            </Link>
          </div>
        )}

        {stuckLeads.length > 0 && (
          <section className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-amber-300">
                ⚠ Leads travados ({stuckLeads.length})
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                mesmo status há +7 dias
              </p>
            </div>
            <ul className="divide-y divide-amber-400/10">
              {stuckLeads.slice(0, 10).map(({ app, status, ageMs }) => {
                const wa = `+55${app.whatsapp.replace(/\D/g, "")}`;
                return (
                  <li
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2 text-[12px]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-foreground">{app.full_name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {statusLabels[status]} há{" "}
                        <span className="text-amber-200">{fmtDuration(ageMs)}</span>
                        {" · @"}
                        {app.instagram}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <a
                        href={`https://wa.me/${wa.replace("+", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-widest text-emerald-200 hover:bg-emerald-500/20"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
            {stuckLeads.length > 10 && (
              <p className="mt-2 text-[10px] text-muted-foreground/70">
                +{stuckLeads.length - 10} outros travados
              </p>
            )}
          </section>
        )}




        {data && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest">
            <CountChip
              label="Todos"
              value={totalCount}
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            <CountChip
              label="Novos"
              value={novoCount}
              active={statusFilter === "novo"}
              onClick={() => setStatusFilter("novo")}
              tone="warn"
            />
            <CountChip
              label="Contatados"
              value={contactedCount}
              active={statusFilter === "contatado"}
              onClick={() => setStatusFilter("contatado")}
              tone="ok"
            />
            <CountChip
              label="Fechados"
              value={closedCount}
              active={statusFilter === "fechado"}
              onClick={() => setStatusFilter("fechado")}
              tone="ok"
            />
            <CountChip
              label="Perdidos"
              value={lostCount}
              active={statusFilter === "perdido"}
              onClick={() => setStatusFilter("perdido")}
              tone="warn"
            />
          </div>
        )}


        {data && (
          <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>Ordenar:</span>
            <button
              type="button"
              onClick={() => setSortMode("priority")}
              className={`rounded-md border px-2.5 py-1 transition-colors ${
                sortMode === "priority"
                  ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
              title="Já roda agência + faturamento alto no topo, perdidos no fim"
            >
              Prioridade
            </button>
            <button
              type="button"
              onClick={() => setSortMode("recent")}
              className={`rounded-md border px-2.5 py-1 transition-colors ${
                sortMode === "recent"
                  ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              Mais recentes
            </button>
          </div>
        )}


        {data && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, @ ou WhatsApp…"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <Select value={momentFilter} onValueChange={setMomentFilter}>
              <SelectTrigger className="h-auto rounded-md border-border bg-card px-3 py-2 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os momentos</SelectItem>
                <SelectItem value="rodando">Já roda agência</SelectItem>
                <SelectItem value="zero">Começando do zero</SelectItem>
              </SelectContent>
            </Select>
            <Select value={revenueFilter} onValueChange={setRevenueFilter}>
              <SelectTrigger className="h-auto rounded-md border-border bg-card px-3 py-2 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer faturamento</SelectItem>
                <SelectItem value="ate-5k">Até R$ 5k</SelectItem>
                <SelectItem value="5-20k">R$ 5k – 20k</SelectItem>
                <SelectItem value="20-50k">R$ 20k – 50k</SelectItem>
                <SelectItem value="acima-50k">Acima de R$ 50k</SelectItem>
                <SelectItem value="none">Não informado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-auto rounded-md border-border bg-card px-3 py-2 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="novo">Novos</SelectItem>
                <SelectItem value="contatado">Contatados</SelectItem>
                <SelectItem value="fechado">Fechados</SelectItem>
                <SelectItem value="perdido">Perdidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-auto rounded-md border-border bg-card px-3 py-2 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Qualquer origem</SelectItem>
                <SelectItem value="none">Sem origem</SelectItem>
                {uniqueSources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filtered.length === 0}
              className="rounded-md border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-3 py-2 text-xs uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20 disabled:opacity-40 disabled:cursor-not-allowed sm:col-span-2 lg:col-span-5"
            >
              Exportar CSV ({filtered.length})
            </button>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="rounded-lg border border-border/50 bg-card/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma aplicação recebida ainda.
            </p>
          </div>
        )}

        {data && data.length > 0 && filtered.length === 0 && (
          <div className="rounded-lg border border-border/50 bg-card/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma aplicação corresponde aos filtros.
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((app) => {
              const ageMs = now - new Date(app.created_at).getTime();
              const isRecent = ageMs < HIGHLIGHT_MS;
              const currentStatus = (app.status ?? "novo") as LeadStatus;
              const isStale = currentStatus === "novo" && ageMs > STALE_MS;
              const staleHours = Math.floor(ageMs / (60 * 60 * 1000));
              const attempts = app.attempts ?? 0;
              const lastAttempt = app.last_attempt_at
                ? new Date(app.last_attempt_at)
                : null;
              const coldWarn =
                currentStatus === "novo" && attempts >= 3;
              const isLost = currentStatus === "perdido";
              return (
              <div
                key={app.id}
                className={`rounded-lg border p-5 transition-colors duration-1000 ${
                  isRecent
                    ? "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/5 shadow-[0_0_0_1px_var(--gold)]/30 animate-fade-in"
                    : isStale
                    ? "border-red-500/60 bg-red-500/5 shadow-[0_0_0_1px_rgba(239,68,68,0.25)]"
                    : isLost
                    ? "border-border/30 bg-card/10 opacity-60"
                    : currentStatus === "contatado"
                    ? "border-border/40 bg-card/20 opacity-80"
                    : "border-border/50 bg-card/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg text-foreground">
                        {app.full_name}
                      </h3>
                      {currentStatus === "contatado" && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300">
                          Contatado
                        </span>
                      )}
                      {currentStatus === "fechado" && (
                        <span className="rounded-full border border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-gradient">
                          Fechado ✦
                        </span>
                      )}
                      {currentStatus === "perdido" && (
                        <span className="rounded-full border border-zinc-500/50 bg-zinc-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-300">
                          Perdido
                          {app.lost_reason
                            ? ` · ${lostReasonLabels[app.lost_reason as LostReason] ?? app.lost_reason}`
                            : ""}
                        </span>
                      )}
                      {isStale && (
                        <span className="rounded-full border border-red-500/50 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-red-300">
                          Atrasado · {staleHours}h
                        </span>
                      )}
                      {coldWarn && (
                        <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-amber-300">
                          3 tentativas · esfriando
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Entrada: {new Date(app.created_at).toLocaleString("pt-BR")}
                    </p>
                    {app.first_contacted_at && (() => {
                      const ttfc =
                        new Date(app.first_contacted_at).getTime() -
                        new Date(app.created_at).getTime();
                      const slow = ttfc > 24 * 60 * 60 * 1000;
                      return (
                        <p className="text-xs text-muted-foreground">
                          1º contato em{" "}
                          <span
                            className={
                              slow ? "text-red-300" : "text-foreground"
                            }
                          >
                            {fmtDuration(ttfc)}
                          </span>
                        </p>
                      );
                    })()}
                    <p className="text-xs text-muted-foreground">
                      Tentativas: <span className="text-foreground">{attempts}</span>
                      {lastAttempt && (
                        <> · última em {lastAttempt.toLocaleString("pt-BR")}</>
                      )}
                    </p>
                    {(app.utm_source || app.utm_medium || app.utm_campaign || app.referrer) && (
                      <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-sm border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/5 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-gold-gradient">
                          Origem
                        </span>
                        <span className="text-foreground">
                          {app.utm_source ?? "—"}
                        </span>
                        {app.utm_medium && (
                          <span className="text-muted-foreground/70">
                            · {app.utm_medium}
                          </span>
                        )}
                        {app.utm_campaign && (
                          <span className="text-muted-foreground/70">
                            · {app.utm_campaign}
                          </span>
                        )}
                        {!app.utm_source && app.referrer && (
                          <span className="text-muted-foreground/70 truncate max-w-[240px]" title={app.referrer}>
                            ref: {app.referrer}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRegisterAttempt(app.id)}
                        disabled={attemptBusy === app.id || isLost}
                        className="rounded-md border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-2.5 py-1 text-[11px] uppercase tracking-widest text-gold-gradient hover:bg-[color:var(--gold)]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Registrar uma tentativa de ligação"
                      >
                        + Tentativa
                      </button>
                      {attempts > 0 && (
                        <button
                          type="button"
                          onClick={() => handleUndoAttempt(app.id)}
                          disabled={attemptBusy === app.id}
                          className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-40"
                          title="Desfazer última tentativa"
                        >
                          Desfazer
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={currentStatus}
                        onValueChange={(v) =>
                          handleChangeStatus(app.id, v as LeadStatus)
                        }
                        disabled={statusBusy === app.id}
                      >
                        <SelectTrigger className="h-auto rounded-md border-border bg-card px-2.5 py-1 text-xs w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Novo</SelectItem>
                          <SelectItem value="contatado">Contatado</SelectItem>
                          <SelectItem value="fechado">Fechado</SelectItem>
                          <SelectItem value="perdido">Perdido</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === app.id ? "Excluindo…" : "Excluir"}
                      </button>
                    </div>
                    {(pendingLostId === app.id || (isLost && !app.lost_reason)) && (
                      <div className="flex items-center gap-2">
                        <Select
                          onValueChange={(v) =>
                            handleChangeStatus(
                              app.id,
                              "perdido",
                              v as LostReason,
                            )
                          }
                        >
                          <SelectTrigger className="h-auto rounded-md border-red-500/50 bg-red-500/5 px-2.5 py-1 text-xs w-[180px]">
                            <SelectValue placeholder="Motivo da perda…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preco">Preço</SelectItem>
                            <SelectItem value="timing">Timing</SelectItem>
                            <SelectItem value="nao_atendeu">Não atendeu</SelectItem>
                            <SelectItem value="nao_qualificado">Não qualificado</SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => setPendingLostId(null)}
                          className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      WhatsApp
                    </dt>
                    <dd className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/55${app.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold-gradient hover:underline"
                      >
                        {app.whatsapp}
                      </a>
                      <CopyButton
                        label="WhatsApp"
                        value={app.whatsapp}
                      />
                      <CopyButton
                        label="Telefone"
                        value={`+55${app.whatsapp.replace(/\D/g, "")}`}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      Instagram
                    </dt>
                    <dd className="flex flex-wrap items-center gap-2">
                      <a
                        href={`https://instagram.com/${app.instagram.replace(/^@+/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold-gradient hover:underline"
                      >
                        @{app.instagram.replace(/^@+/, "")}
                      </a>
                      <CopyButton
                        label="Instagram"
                        value={`@${app.instagram.replace(/^@+/, "")}`}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      Momento
                    </dt>
                    <dd>{momentLabels[app.moment] ?? app.moment}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                      Faturamento
                    </dt>
                    <dd>
                      {app.revenue_band
                        ? revenueLabels[app.revenue_band] ?? app.revenue_band
                        : "—"}
                    </dd>
                  </div>
                </dl>
                <NotesEditor
                  id={app.id}
                  initialNotes={app.notes ?? ""}
                />
              </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copiar ${label.toLowerCase()}`}
      className={`rounded-md border px-2 py-0.5 text-[11px] uppercase tracking-widest transition-colors ${
        copied
          ? "border-[color:var(--gold)]/70 text-gold-gradient"
          : "border-border/60 text-muted-foreground hover:border-[color:var(--gold)]/60 hover:text-foreground"
      }`}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

function CountChip({
  label,
  value,
  active,
  onClick,
  tone = "neutral",
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  tone?: "neutral" | "warn" | "ok";
}) {
  const toneActive =
    tone === "ok"
      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-200"
      : tone === "warn"
      ? "border-amber-500/60 bg-amber-500/15 text-amber-200"
      : "border-[color:var(--gold)]/60 bg-[color:var(--gold)]/10 text-gold-gradient";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 transition-colors ${
        active
          ? toneActive
          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      <span className="ml-2 rounded-md bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
        {value}
      </span>
    </button>
  );
}


function NotesEditor({
  id,
  initialNotes,
}: {
  id: string;
  initialNotes: string;
}) {
  const saveNotes = useServerFn(setApplicationNotes);
  const qc = useQueryClient();
  const [value, setValue] = useState(initialNotes);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [lastSaved, setLastSaved] = useState(initialNotes);

  useEffect(() => {
    setValue(initialNotes);
    setLastSaved(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    if (value === lastSaved) return;
    setStatus("saving");
    const t = setTimeout(async () => {
      try {
        await saveNotes({ data: { id, notes: value } });
        setLastSaved(value);
        setStatus("saved");
        qc.invalidateQueries({ queryKey: ["applications"] });
        setTimeout(
          () => setStatus((s) => (s === "saved" ? "idle" : s)),
          1500,
        );
      } catch {
        setStatus("error");
      }
    }, 700);
    return () => clearTimeout(t);
  }, [value, lastSaved, id, saveNotes, qc]);

  return (
    <div className="mt-4 border-t border-border/40 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={`notes-${id}`}
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Anotações da ligação
        </label>
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {status === "saving" && "Salvando…"}
          {status === "saved" && (
            <span className="text-emerald-300">Salvo</span>
          )}
          {status === "error" && (
            <span className="text-red-400">Falha ao salvar</span>
          )}
        </span>
      </div>
      <textarea
        id={`notes-${id}`}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, 5000))}
        placeholder="O que ele falou • objeção principal • momento da operação…"
        rows={3}
        className="w-full resize-y rounded-sm border border-border bg-background/60 px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold-soft focus:ring-1 focus:ring-[color:var(--gold)]/40"
      />
    </div>
  );
}
