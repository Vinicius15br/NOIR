ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS contacted boolean NOT NULL DEFAULT false;

CREATE POLICY "Admins can update applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));