import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitApplication } from "@/lib/applications.functions";
import { logFormStart } from "@/lib/form-tracking.functions";
import { captureAttribution, readAttribution } from "@/lib/attribution";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section } from "./Section";
import { GoldButton } from "./GoldButton";

type Moment = "" | "rodando" | "zero";
type Revenue = "" | "ate-5k" | "5-20k" | "20-50k" | "acima-50k";

function maskWhatsapp(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function ApplicationForm() {
  const submit = useServerFn(submitApplication);
  const logStart = useServerFn(logFormStart);

  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [moment, setMoment] = useState<Moment>("");
  const [revenue, setRevenue] = useState<Revenue>("");
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedDdd, setSubmittedDdd] = useState("");
  const startLoggedRef = useRef(false);

  useEffect(() => {
    captureAttribution();
  }, []);

  function getSessionId(): string {
    try {
      const KEY = "noir_form_session_id";
      let sid = sessionStorage.getItem(KEY);
      if (!sid) {
        sid =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
        sessionStorage.setItem(KEY, sid);
      }
      return sid;
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    }
  }

  function trackStart() {
    if (startLoggedRef.current) return;
    startLoggedRef.current = true;
    try {
      const STARTED_KEY = "noir_form_started";
      if (sessionStorage.getItem(STARTED_KEY)) return;
      sessionStorage.setItem(STARTED_KEY, "1");
    } catch {
      // ignore
    }
    const attribution = readAttribution() ?? captureAttribution();
    logStart({
      data: {
        session_id: getSessionId(),
        landing_path: attribution.landing_path,
        referrer: attribution.referrer,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
      },
    }).catch(() => {
      // best-effort; don't disrupt UX
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(whatsapp)) {
      setError("Informe um WhatsApp válido com DDD.");
      return;
    }
    if (!moment) {
      setError("Selecione seu momento.");
      return;
    }
    if (!consent) {
      setError("É necessário aceitar o termo de contato.");
      return;
    }
    setSubmitting(true);
    try {
      const attribution = readAttribution() ?? captureAttribution();
      await submit({
        data: {
          full_name: fullName,
          whatsapp,
          instagram: instagram.replace(/^@+/, ""),
          moment,
          revenue_band: moment === "rodando" && revenue ? revenue : null,
          lgpd_consent: true,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
          utm_term: attribution.utm_term,
          referrer: attribution.referrer,
          landing_path: attribution.landing_path,
          session_id: getSessionId(),
        },
      });
      const ddd = whatsapp.match(/\((\d{2})\)/)?.[1] ?? "";
      setSubmittedDdd(ddd);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao enviar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Section id="candidatura" eyebrow="Candidatura recebida">
        <div className="relative overflow-hidden rounded-sm border border-gold-soft bg-card/60 p-10 text-center backdrop-blur-sm sm:p-14">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold-gradient" />
            <span className="font-serif text-3xl text-gold-gradient">✦</span>
            <span className="h-px w-10 bg-gold-gradient" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-foreground sm:text-4xl">
            Candidatura recebida
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-[15px] leading-relaxed text-muted-foreground">
            Nossa equipe vai te ligar em até <span className="text-foreground">24h úteis</span>
            {submittedDdd ? (
              <>
                {" "}a partir de um número com DDD{" "}
                <span className="text-foreground font-semibold">{submittedDdd}</span>
              </>
            ) : null}
            .
          </p>
          <p className="mx-auto mt-4 max-w-md font-sans text-[13px] leading-relaxed text-muted-foreground/80">
            Fica de olho no WhatsApp — o primeiro contato pode vir por lá.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="candidatura" eyebrow="Formulário de candidatura" className="pb-32">
      <h2 className="font-serif text-3xl leading-tight font-normal text-foreground sm:text-5xl">
        Candidate-se para uma das{" "}
        <span className="italic text-gold-gradient">vagas</span>
      </h2>
      <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground">
        Preencha os dados abaixo. Nossa equipe entra em contato por ligação em
        até 24h úteis.
      </p>

      <form
        onSubmit={onSubmit}
        onFocusCapture={trackStart}
        onChangeCapture={trackStart}
        className="mt-12 space-y-6 rounded-sm border border-border/70 bg-card/50 p-6 backdrop-blur-sm sm:p-10"
      >
        <Field label="Nome completo" htmlFor="full_name" required>
          <input
            id="full_name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="WhatsApp (com DDD)" htmlFor="whatsapp" required>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            required
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
            className={inputCls}
          />
        </Field>

        <Field label="@ do Instagram" htmlFor="instagram" required>
          <div className="flex items-stretch overflow-hidden rounded-sm border border-border bg-background focus-within:border-gold-soft focus-within:ring-1 focus-within:ring-[color:var(--gold)]/40">
            <span className="flex select-none items-center border-r border-border bg-secondary/60 px-3 font-serif text-lg text-gold-gradient">
              @
            </span>
            <input
              id="instagram"
              type="text"
              required
              maxLength={60}
              autoComplete="off"
              value={instagram}
              onChange={(e) =>
                setInstagram(e.target.value.replace(/^@+/, "").trim())
              }
              className="w-full bg-transparent px-4 py-3 font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground/50"
              placeholder="seuinsta"
            />
          </div>
        </Field>

        <Field label="Qual seu momento?" htmlFor="moment" required>
          <Select
            value={moment}
            onValueChange={(v) => setMoment(v as Moment)}
          >
            <SelectTrigger id="moment" className="h-auto py-3">
              <SelectValue placeholder="Selecione…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rodando">Já tenho agência rodando</SelectItem>
              <SelectItem value="zero">Estou começando do zero</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {moment === "rodando" ? (
          <Field
            label="Faturamento mensal aproximado"
            htmlFor="revenue"
            required
          >
            <Select
              value={revenue}
              onValueChange={(v) => setRevenue(v as Revenue)}
            >
              <SelectTrigger id="revenue" className="h-auto py-3">
                <SelectValue placeholder="Selecione…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ate-5k">Até R$ 5 mil</SelectItem>
                <SelectItem value="5-20k">R$ 5–20 mil</SelectItem>
                <SelectItem value="20-50k">R$ 20–50 mil</SelectItem>
                <SelectItem value="acima-50k">Acima de R$ 50 mil</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 pt-2">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => {
              e.target.setCustomValidity("");
              setConsent(e.target.checked);
            }}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(
                "É necessário marcar esta caixa para enviar a candidatura.",
              )
            }
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[color:var(--gold)]"
          />
          <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
            Autorizo o contato por telefone e WhatsApp e o uso dos meus dados
            para essa finalidade.{" "}
            <span className="text-gold-gradient">*</span>
          </span>
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive-foreground"
          >
            {error}
          </p>
        ) : null}

        <div className="pt-2">
          <GoldButton type="submit" disabled={submitting}>
            {submitting ? "Enviando…" : "Enviar candidatura"}
          </GoldButton>
        </div>
      </form>
    </Section>
  );
}

const inputCls =
  "w-full rounded-sm border border-border bg-background px-4 py-3 font-sans text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-gold-soft focus:ring-1 focus:ring-[color:var(--gold)]/40";

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline justify-between font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
      >
        <span>
          {label}
          {required ? <span className="text-gold-gradient"> *</span> : null}
        </span>
        {hint ? <span className="text-[10px] normal-case tracking-normal text-muted-foreground/70">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}
