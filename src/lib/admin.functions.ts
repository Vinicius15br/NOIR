import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Error("Forbidden");
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export type ApplicationEvent = {
  id: string;
  application_id: string;
  event_type: string;
  from_status: string | null;
  to_status: string | null;
  from_attempts: number | null;
  to_attempts: number | null;
  lost_reason: string | null;
  actor_id: string | null;
  metadata: { moment?: string; revenue_band?: string; backfilled?: boolean } | null;
  created_at: string;
};

export const listApplicationEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("application_events")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ApplicationEvent[];
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await supabase.from("applications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const setApplicationContacted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; contacted: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: current } = await supabase
      .from("applications")
      .select("first_contacted_at, attempts, attempts_to_contact")
      .eq("id", data.id)
      .single();

    const patch: {
      contacted: boolean;
      first_contacted_at?: string;
      attempts_to_contact?: number;
    } = { contacted: data.contacted };
    if (data.contacted && !current?.first_contacted_at) {
      patch.first_contacted_at = new Date().toISOString();
    }
    if (data.contacted && current?.attempts_to_contact == null) {
      patch.attempts_to_contact = Math.max(1, current?.attempts ?? 0);
    }

    const { error } = await supabase
      .from("applications")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const setApplicationNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; notes: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const notes = data.notes.slice(0, 5000);
    const { error } = await supabase
      .from("applications")
      .update({ notes })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export type LeadStatus = "novo" | "contatado" | "fechado" | "perdido";
export type LostReason = "preco" | "timing" | "nao_atendeu" | "nao_qualificado";

export const setApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      id: string;
      status: LeadStatus;
      lost_reason?: LostReason | null;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    if (data.status === "perdido" && !data.lost_reason) {
      throw new Error("Motivo de perda obrigatório");
    }

    const { data: current } = await supabase
      .from("applications")
      .select("first_contacted_at, attempts, attempts_to_contact")
      .eq("id", data.id)
      .single();

    const patch: {
      status: LeadStatus;
      lost_reason: LostReason | null;
      first_contacted_at?: string;
      attempts_to_contact?: number;
    } = {
      status: data.status,
      lost_reason: data.status === "perdido" ? data.lost_reason ?? null : null,
    };
    const reached = data.status === "contatado" || data.status === "fechado";
    if (reached && !current?.first_contacted_at) {
      patch.first_contacted_at = new Date().toISOString();
    }
    if (reached && current?.attempts_to_contact == null) {
      patch.attempts_to_contact = Math.max(1, current?.attempts ?? 0);
    }

    const { error } = await supabase
      .from("applications")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const registerAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: current, error: readErr } = await supabase
      .from("applications")
      .select("attempts, first_contacted_at")
      .eq("id", data.id)
      .single();
    if (readErr) throw new Error(readErr.message);

    const next = (current?.attempts ?? 0) + 1;
    const nowIso = new Date().toISOString();
    const patch: {
      attempts: number;
      last_attempt_at: string;
      first_contacted_at?: string;
    } = { attempts: next, last_attempt_at: nowIso };
    if (!current?.first_contacted_at) patch.first_contacted_at = nowIso;

    const { error } = await supabase
      .from("applications")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, attempts: next };
  });

export const undoAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: current, error: readErr } = await supabase
      .from("applications")
      .select("attempts")
      .eq("id", data.id)
      .single();
    if (readErr) throw new Error(readErr.message);

    const next = Math.max(0, (current?.attempts ?? 0) - 1);
    const { error } = await supabase
      .from("applications")
      .update({
        attempts: next,
        last_attempt_at: next === 0 ? null : new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, attempts: next };
  });
