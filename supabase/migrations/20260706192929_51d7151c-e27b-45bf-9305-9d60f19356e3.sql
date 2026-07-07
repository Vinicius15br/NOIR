
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS attempts_to_contact integer;

UPDATE public.applications
SET attempts_to_contact = GREATEST(attempts, 1)
WHERE attempts_to_contact IS NULL
  AND first_contacted_at IS NOT NULL;
