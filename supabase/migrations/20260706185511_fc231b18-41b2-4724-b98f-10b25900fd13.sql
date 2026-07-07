
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS lost_reason text;

-- Backfill status from legacy contacted flag
UPDATE public.applications SET status = 'contatado' WHERE contacted = true AND status = 'novo';

-- Enforce allowed values and required lost_reason via trigger (CHECKs must be immutable and simple)
CREATE OR REPLACE FUNCTION public.applications_validate_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('novo','contatado','perdido') THEN
    RAISE EXCEPTION 'Status inválido: %', NEW.status;
  END IF;

  IF NEW.status = 'perdido' THEN
    IF NEW.lost_reason IS NULL OR NEW.lost_reason NOT IN ('preco','timing','nao_atendeu','nao_qualificado') THEN
      RAISE EXCEPTION 'Motivo de perda obrigatório e deve ser: preco, timing, nao_atendeu ou nao_qualificado';
    END IF;
  ELSE
    NEW.lost_reason := NULL;
  END IF;

  IF NEW.attempts < 0 THEN
    RAISE EXCEPTION 'attempts não pode ser negativo';
  END IF;

  -- keep legacy contacted in sync
  NEW.contacted := (NEW.status = 'contatado');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS applications_validate_status_trg ON public.applications;
CREATE TRIGGER applications_validate_status_trg
  BEFORE INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.applications_validate_status();
