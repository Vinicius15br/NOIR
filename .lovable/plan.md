## Problema

Os selects atuais usam o elemento `<select>` nativo. O botão foi estilizado em `src/styles.css` (fundo escuro, seta dourada), mas a lista de opções que abre é renderizada pelo sistema operacional — o navegador ignora quase todo CSS aplicado a `<option>`, então continua aparecendo com fundo branco/cinza claro, tipografia do sistema e borda padrão, fora da identidade noir.

## Solução

Trocar os `<select>` nativos pelo componente `Select` do shadcn (Radix), que renderiza um popover HTML totalmente estilizável. Aplicar a paleta noir/gold em todas as partes: gatilho, painel, itens, item ativo, borda e tipografia.

## Escopo

Selects a substituir:

- `src/components/noir/ApplicationForm.tsx` — "Momento" e "Faturamento mensal"
- `src/routes/_authenticated/admin.tsx` — "Momento", "Faturamento" e "Status" na barra de filtros do painel

## Ajustes visuais no componente Select

Customizar `src/components/ui/select.tsx` (ou aplicar via className nas instâncias) para casar com o tema:

- Trigger: mesmo `bg-card`, borda `border-border/60`, foco em `--gold`, seta em dourado, tipografia `font-sans` do tema.
- Content (painel): `bg-popover` (noir), borda `border-gold-soft`, sombra `--shadow-gold`, cantos `rounded-md`, sem fundo branco padrão.
- Item hover/ativo: fundo `oklch(0.22 0.03 80)`, texto em `--gold-bright`.
- Item selecionado: check dourado à esquerda.
- Tipografia: `font-sans`, tamanho e tracking iguais aos inputs atuais.

## Limpeza

Remover as regras `select { ... }` e `select option { ... }` adicionadas em `src/styles.css`, já que não haverá mais selects nativos e as regras deixam de ter efeito.

## Fora do escopo

- Nenhuma mudança de dados, lógica de filtro, validação ou schema.
- Não mexer em outros componentes shadcn (nenhum outro dropdown/popover está em uso no projeto no momento).
