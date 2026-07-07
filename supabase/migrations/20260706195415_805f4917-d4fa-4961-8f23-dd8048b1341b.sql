-- 1) Table
CREATE TABLE public.application_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_status text,
  to_status text,
  from_attempts integer,
  to_attempts integer,
  lost_reason text,
  actor_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX application_events_application_id_idx ON public.application_events(application_id);
CREATE INDEX application_events_created_at_idx ON public.application_events(created_at DESC);
CREATE INDEX application_events_event_type_idx ON public.application_events(event_type);

-- 2) Grants
GRANT SELECT ON public.application_events TO authenticated;
GRANT ALL ON public.application_events TO service_role;

-- 3) RLS
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all application events"
  ON public.application_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- No INSERT/UPDATE/DELETE policies: only service_role (and SECURITY DEFINER trigger) can write.

-- 4) Trigger function on applications
CREATE OR REPLACE FUNCTION public.applications_log_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.application_events (
      application_id, event_type, from_status, to_status,
      from_attempts, to_attempts, lost_reason, actor_id,
      metadata, created_at
    ) VALUES (
      NEW.id, 'created', NULL, NEW.status,
      NULL, NEW.attempts, NEW.lost_reason, v_actor,
      jsonb_build_object('moment', NEW.moment, 'revenue_band', NEW.revenue_band),
      NEW.created_at
    );
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.application_events (
        application_id, event_type, from_status, to_status,
        from_attempts, to_attempts, lost_reason, actor_id
      ) VALUES (
        NEW.id, 'status_changed', OLD.status, NEW.status,
        OLD.attempts, NEW.attempts, NEW.lost_reason, v_actor
      );
    END IF;

    IF NEW.attempts IS DISTINCT FROM OLD.attempts THEN
      INSERT INTO public.application_events (
        application_id, event_type, from_status, to_status,
        from_attempts, to_attempts, actor_id
      ) VALUES (
        NEW.id,
        CASE WHEN NEW.attempts > OLD.attempts THEN 'attempt_registered' ELSE 'attempt_undone' END,
        OLD.status, NEW.status,
        OLD.attempts, NEW.attempts, v_actor
      );
    END IF;

    IF NEW.lost_reason IS DISTINCT FROM OLD.lost_reason
       AND NEW.status = OLD.status THEN
      INSERT INTO public.application_events (
        application_id, event_type, from_status, to_status, lost_reason, actor_id
      ) VALUES (
        NEW.id, 'lost_reason_changed', OLD.status, NEW.status, NEW.lost_reason, v_actor
      );
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER applications_log_event_ins
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.applications_log_event();

CREATE TRIGGER applications_log_event_upd
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.applications_log_event();

-- 5) Backfill from existing data
-- 5a) creation event for every existing lead
INSERT INTO public.application_events (
  application_id, event_type, to_status, to_attempts, lost_reason, metadata, created_at
)
SELECT id, 'created', 'novo', 0, NULL,
       jsonb_build_object('moment', moment, 'revenue_band', revenue_band, 'backfilled', true),
       created_at
FROM public.applications;

-- 5b) first contact event when we know when it happened
INSERT INTO public.application_events (
  application_id, event_type, from_status, to_status, to_attempts, metadata, created_at
)
SELECT id, 'status_changed', 'novo', 'contatado', COALESCE(attempts_to_contact, attempts),
       jsonb_build_object('backfilled', true),
       first_contacted_at
FROM public.applications
WHERE first_contacted_at IS NOT NULL;

-- 5c) current terminal status (fechado / perdido) — approximate timestamp = last_attempt_at or now()
INSERT INTO public.application_events (
  application_id, event_type, from_status, to_status, lost_reason, metadata, created_at
)
SELECT id, 'status_changed',
       CASE WHEN first_contacted_at IS NOT NULL THEN 'contatado' ELSE 'novo' END,
       status, lost_reason,
       jsonb_build_object('backfilled', true),
       COALESCE(last_attempt_at, first_contacted_at, created_at)
FROM public.applications
WHERE status IN ('fechado','perdido');
