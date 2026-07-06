import { useState } from 'react';
import type { FormEvent } from 'react';
import { FORM_WEBHOOK_URL, TEAM_PHONE } from '../config';

const REVENUE_OPTIONS = [
  'Até R$ 5 mil',
  'R$ 5–20 mil',
  'R$ 20–50 mil',
  'Acima de R$ 50 mil',
];

const MOMENT_RUNNING = 'Já tenho agência rodando';
const MOMENT_STARTING = 'Estou começando do zero';

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [key, value] of params) {
    if (key.startsWith('utm_')) utm[key] = value;
  }
  return utm;
}

const inputClass =
  'w-full rounded-sm border border-noir-600 bg-noir-900 px-4 py-3 text-sm text-cream placeholder:text-muted/50 focus:border-gold-400 focus:outline-none sm:text-base';

export function ApplicationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [moment, setMoment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [submittedDdd, setSubmittedDdd] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Confere o número de WhatsApp — precisa ter DDD + número.');
      return;
    }

    const payload = {
      nome: name.trim(),
      whatsapp: phone,
      instagram: `@${instagram.trim().replace(/^@+/, '')}`,
      momento: moment,
      faturamento: moment === MOMENT_RUNNING ? revenue : '',
      consentimento_lgpd: consent,
      enviado_em: new Date().toISOString(),
      pagina: window.location.href,
      ...getUtmParams(),
    };

    setSending(true);
    try {
      if (FORM_WEBHOOK_URL) {
        const res = await fetch(FORM_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`webhook respondeu ${res.status}`);
      } else {
        // Sem destino configurado (VITE_FORM_WEBHOOK_URL) o lead não é salvo.
        console.warn('VITE_FORM_WEBHOOK_URL não configurado. Payload:', payload);
      }
      setSubmittedDdd(phoneDigits.slice(0, 2));
    } catch {
      setError(
        'Não conseguimos enviar sua aplicação. Tenta de novo em alguns segundos.',
      );
    } finally {
      setSending(false);
    }
  }

  if (submittedDdd) {
    return (
      <section id="aplicacao" className="glow px-6 py-20 sm:py-28">
        <div className="border-gold-500/50 bg-noir-800/80 mx-auto max-w-xl rounded-sm border p-10 text-center">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Aplicação recebida <span className="gold-text">✦</span>
          </h2>
          <p className="text-muted mt-6 text-base leading-relaxed">
            Nossa equipe vai te ligar em até 24h úteis a partir do número (
            {submittedDdd}) que você informou. Salva esse contato pra não
            perder a ligação:{' '}
            <strong className="gold-text whitespace-nowrap">{TEAM_PHONE}</strong>
          </p>
          <p className="text-muted mt-4 text-sm leading-relaxed">
            Enquanto isso, fica de olho no WhatsApp — o primeiro contato pode
            vir por lá.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="aplicacao" className="glow px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="font-serif text-center text-3xl leading-tight font-semibold sm:text-4xl">
          Aplique para <span className="gold-text">uma das vagas</span>
        </h2>
        <p className="text-muted mt-4 text-center text-sm sm:text-base">
          Preencha os dados abaixo. Nossa equipe entra em contato por ligação
          em até 24h úteis.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-medium">
              Nome completo <span className="gold-text">*</span>
            </label>
            <input
              id="nome"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium">
              WhatsApp (com DDD) <span className="gold-text">*</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              className={inputClass}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="mb-1.5 block text-sm font-medium">
              @ do Instagram <span className="gold-text">*</span>
            </label>
            <div className="flex">
              <span className="border-noir-600 bg-noir-700 text-muted flex items-center rounded-l-sm border border-r-0 px-3 text-sm sm:text-base">
                @
              </span>
              <input
                id="instagram"
                type="text"
                required
                value={instagram}
                onChange={(e) =>
                  setInstagram(e.target.value.replace(/^@+/, ''))
                }
                className={`${inputClass} rounded-l-none`}
                placeholder="seuperfil"
              />
            </div>
          </div>

          <div>
            <label htmlFor="momento" className="mb-1.5 block text-sm font-medium">
              Qual seu momento? <span className="gold-text">*</span>
            </label>
            <select
              id="momento"
              required
              value={moment}
              onChange={(e) => setMoment(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Selecione…
              </option>
              <option>{MOMENT_RUNNING}</option>
              <option>{MOMENT_STARTING}</option>
            </select>
          </div>

          {moment === MOMENT_RUNNING && (
            <div>
              <label
                htmlFor="faturamento"
                className="mb-1.5 block text-sm font-medium"
              >
                Faturamento mensal aproximado{' '}
                <span className="text-muted">(opcional)</span>
              </label>
              <select
                id="faturamento"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className={inputClass}
              >
                <option value="">Prefiro não informar</option>
                {REVENUE_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-start gap-3 text-xs leading-relaxed sm:text-sm">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="accent-gold-400 mt-0.5 size-4 shrink-0"
            />
            <span className="text-muted">
              Autorizo o contato por telefone e WhatsApp e o uso dos meus dados
              para essa finalidade.
            </span>
          </label>

          {error && (
            <p className="rounded-sm border border-red-800 bg-red-950/50 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="from-gold-600 via-gold-400 to-gold-600 text-noir-950 w-full rounded-sm bg-gradient-to-r px-8 py-4 text-sm font-bold tracking-widest uppercase shadow-[0_0_35px_rgba(212,175,55,0.35)] transition hover:shadow-[0_0_50px_rgba(212,175,55,0.55)] disabled:opacity-60"
          >
            {sending ? 'Enviando…' : 'Enviar aplicação'}
          </button>
        </form>
      </div>
    </section>
  );
}
