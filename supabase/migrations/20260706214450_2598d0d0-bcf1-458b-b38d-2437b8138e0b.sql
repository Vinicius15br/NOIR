
-- Nova tabela para registrar quem começou a preencher o formulário
CREATE TABLE public.form_starts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL UNIQUE,
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.form_starts TO authenticated;
GRANT INSERT ON public.form_starts TO anon, authenticated;
GRANT ALL ON public.form_starts TO service_role;

ALTER TABLE public.form_starts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a form start"
  ON public.form_starts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view form starts"
  ON public.form_starts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_form_starts_created_at ON public.form_starts (created_at DESC);

-- Adicionar session_id em applications para linkar submissões com starts
ALTER TABLE public.applications ADD COLUMN session_id text;
CREATE INDEX idx_applications_session_id ON public.applications (session_id);
