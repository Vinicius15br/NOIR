// Configurações editáveis da página — ajuste aqui antes de publicar.

// Mostrar ou não o valor do investimento na Seção 8.
// false = a página fala apenas "investimento apresentado na call de aplicação".
export const SHOW_PRICE = true;

export const PRICE_LABEL = 'R$ 10.000';

// Número de vagas por ciclo. null = não exibir número exato ("poucas vagas").
export const SPOTS_PER_CYCLE: number | null = null;

// Número da equipe exibido na tela de confirmação, para o lead salvar o contato.
// Trocar pelo número real antes de publicar.
export const TEAM_PHONE = '(00) 00000-0000';

// Destino das aplicações (ver NOTAS TÉCNICAS): webhook que recebe um POST JSON
// a cada envio (Supabase Edge Function, Google Apps Script, Make/Zapier → WhatsApp/Discord…).
// Definir em .env: VITE_FORM_WEBHOOK_URL=https://...
// Sem webhook configurado, o envio só registra no console — o form NÃO serve
// pra captar leads até isso ser definido.
export const FORM_WEBHOOK_URL: string =
  (import.meta.env.VITE_FORM_WEBHOOK_URL as string | undefined) ?? '';
