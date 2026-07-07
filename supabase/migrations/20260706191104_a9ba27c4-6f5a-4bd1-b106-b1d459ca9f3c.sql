
CREATE OR REPLACE FUNCTION public.applications_validate_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('novo','contatado','fechado','perdido') THEN
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

  NEW.contacted := (NEW.status IN ('contatado','fechado'));

  RETURN NEW;
END;
$$;
