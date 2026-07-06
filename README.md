# Noir Sessions — Landing Page (Mentoria Individual)

Landing page mobile-first da mentoria individual Noir Sessions: fundo preto,
dourado metálico e tipografia serifada. Construída com Vite + React +
TypeScript + Tailwind CSS v4.

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção: `npm run build` (saída em `dist/`).

## Configurações antes de publicar

Tudo editável em [`src/config.ts`](src/config.ts):

- **`SHOW_PRICE`** — mostrar ou não o valor de R$ 10.000 na seção de
  investimento (`false` deixa só "apresentado na call de aplicação").
- **`SPOTS_PER_CYCLE`** — número de vagas por ciclo (`null` = "poucos").
- **`TEAM_PHONE`** — número da equipe exibido na tela de confirmação
  (**trocar o placeholder pelo número real**).

## Destino dos dados do formulário (obrigatório)

O formulário envia um POST JSON para o webhook definido em
`VITE_FORM_WEBHOOK_URL` (ver `.env.example`). Sem isso configurado, **os leads
não são salvos em lugar nenhum** — apenas registrados no console do navegador.

Opções: Supabase Edge Function, Google Apps Script (planilha), Make/Zapier com
notificação no WhatsApp/Discord da equipe. Recomendado disparar notificação em
tempo real — lead de aplicação esfria em horas.

Payload enviado:

```json
{
  "nome": "...",
  "whatsapp": "(11) 98765-4321",
  "instagram": "@perfil",
  "momento": "Já tenho agência rodando",
  "faturamento": "R$ 20–50 mil",
  "consentimento_lgpd": true,
  "enviado_em": "2026-07-06T12:00:00.000Z",
  "pagina": "https://...",
  "utm_source": "..."
}
```

Parâmetros `utm_*` presentes na URL da página são incluídos automaticamente no
payload — usar UTMs nos links divulgados pra medir origem (grupo vs. stories).

## Pendências de conteúdo

- Foto real do Rafa na seção "Quem conduz" (`src/components/Mentor.tsx` —
  placeholder circular com "R").
- Prova social (prints, depoimentos, highlights) no bloco tracejado da mesma
  seção.
- Pixel de tráfego (Meta etc.) se for rodar mídia paga — adicionar no
  `index.html`.
