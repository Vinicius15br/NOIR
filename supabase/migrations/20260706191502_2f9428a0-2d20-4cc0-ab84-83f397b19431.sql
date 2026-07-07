
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS first_contacted_at timestamptz;

UPDATE public.applications
SET first_contacted_at = COALESCE(last_attempt_at, created_at)
WHERE first_contacted_at IS NULL
  AND (contacted = true OR status IN ('contatado','fechado'));
