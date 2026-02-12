# Kinvo vs VANTPRO - Comparacao e Melhorias (Solo Dev, Custo Zero)

> **Contexto:** Dev solo, sem investimento, tudo gratuito. Todas as sugestoes abaixo usam APIs gratuitas, bibliotecas open-source e logica local (sem backend pago).

---

## 1. Comparacao Funcionalidade por Funcionalidade

| Funcionalidade | Kinvo | VANTPRO | Vencedor |
|---|---|---|---|
| **Consolidacao Multi-Corretora** | Conexao automatica B3, BTG, XP | Cadastro manual + brapi.dev | Kinvo |
| **Rentabilidade Real (desconta inflacao)** | Sim, por ativo e carteira | Nao implementado (mas tem os dados!) | Kinvo |
| **Calendario de Proventos** | Completo, com notificacoes | Nao possui | Kinvo |
| **Cobertura FGC** | Mostra protecao por instituicao | Nao possui | Kinvo |
| **IR / Declaracao** | Resumo de Posicoes para IR | Placeholder (case 'tax') | Kinvo |
| **Renda Fixa na carteira** | CDB, LCI, LCA, Debentures | Apenas Tesouro Direto (pagina separada) | Kinvo |
| **App Mobile** | iOS + Android nativos | Apenas web | Kinvo |
| **Analise com IA** | Nao possui | Gemini AI gratis (advisor, analise, news) | **VANTPRO** |
| **Valuation Quantitativo** | Nao possui | Graham, Bazin, Gordon, Shiller CAPE | **VANTPRO** |
| **Metricas de Risco** | Risco vs Retorno basico | VaR, CVaR, Sharpe, Beta, Vol | **VANTPRO** |
| **Analise On-Chain Crypto** | Basico | MVRV, Whale, Supply Shock | **VANTPRO** |
| **Robo-Advisor** | Nao possui | Alocacao por perfil + projecao | **VANTPRO** |
| **Educacao Gamificada** | Nao possui | Academy com XP e etapas | **VANTPRO** |
| **Saude Financeira** | Nao possui | Score, burn rate, runway, dividas | **VANTPRO** |
| **Plano Personalizado** | Nao possui | 3 fases com diagnostico | **VANTPRO** |
| **Simulador de Aportes** | Projecao basica | Simulador contextual por perfil | **VANTPRO** |

**Placar: Kinvo 6 x 9 VANTPRO** - Voce ja ganha em profundidade tecnica. O gap e em dados automaticos e praticidade.

---

## 2. Melhorias Realistas (100% Gratuitas, Dev Solo)

### PRIORIDADE 1 - Rentabilidade Real (Custo: R$0 | Esforco: Baixo)

**O que o Kinvo faz:** Mostra retorno descontando inflacao.

**Por que e facil:** Voce JA TEM `MACRO_2026.INFLATION_EXPECTED: 0.0397` em `utils/math.ts`. So precisa usar.

**O que fazer:**
- Na `WalletPage.tsx`, adicionar 1 MetricCard nova: "Retorno Real"
- Formula: `retornoReal = ((1 + retornoNominal) / (1 + 0.0397)) - 1`
- Opcional: toggle "Nominal / Real" na tabela de ativos
- **Nenhuma API nova necessaria** - e pura matematica local

---

### PRIORIDADE 2 - Renda Fixa na Carteira (Custo: R$0 | Esforco: Medio)

**O que o Kinvo faz:** Cadastra CDB, LCI, LCA com taxa, vencimento, emissor.

**O que fazer:**
- Expandir `Asset` em `types.ts` com campos opcionais:
  ```
  maturityDate?, indexador? ('CDI'|'IPCA'|'PRE'), taxa?, emissor?, fgcCoberto?
  ```
- Na `AddAssetModal.tsx`, adicionar tipo "Renda Fixa" no formulario
- Calcular rendimento projetado com formula de juros compostos (local)
- Para pegar CDI/Selic atual: API gratuita do Banco Central (`https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json`)
- **API do BCB e 100% gratuita, sem token, sem limite**

---

### PRIORIDADE 3 - Proventos dos Ativos na Carteira (Custo: R$0 | Esforco: Medio)

**O que o Kinvo faz:** Calendario completo de dividendos.

**O que fazer (versao simples e gratuita):**
- Voce ja usa `brapi.dev` com token `demo`. O endpoint de dividendos e:
  `https://brapi.dev/api/quote/{TICKER}?modules=dividends&token=demo`
- Criar uma secao "Proventos Recebidos" dentro da `WalletPage` (nao precisa de pagina nova)
- Mostrar: ultimo dividendo, DY 12 meses, proximo pagamento estimado
- Somar proventos totais da carteira por mes
- **Tudo na brapi.dev gratis** (mesmo token demo que voce ja usa)

**Alternativa se brapi limitar:** Manter tabela local hardcoded com DY dos ativos em `constants.tsx` (voce ja tem algo parecido la)

---

### PRIORIDADE 4 - Cobertura FGC (Custo: R$0 | Esforco: Baixo)

**O que fazer:**
- Se implementar Renda Fixa na carteira (Prioridade 2), basta:
- Agrupar ativos RF por `emissor`
- Mostrar barra de progresso ate R$250.000 por instituicao
- Alerta se passar de R$200k (margem de seguranca)
- **Zero API** - e so logica local sobre os dados que o usuario ja cadastrou

---

### PRIORIDADE 5 - Contribuicao Individual dos Ativos (Custo: R$0 | Esforco: Baixo)

**O que o Kinvo faz:** Mostra quanto cada ativo contribuiu pro resultado total.

**O que fazer:**
- Na `WalletPage.tsx`, adicionar um bar chart horizontal (usa Recharts que voce ja tem)
- Calculo: `contribuicao = (peso_na_carteira * retorno_ativo)`
- Ordenar do que mais ajudou ao que mais prejudicou
- **Nenhuma dependencia nova** - Recharts ja esta no package.json

---

### PRIORIDADE 6 - PWA para Mobile (Custo: R$0 | Esforco: Baixo)

**O que fazer:**
- Criar `public/manifest.json` (nome, icone, cores, display: standalone)
- Criar service worker basico para cache offline
- Plugin Vite: `vite-plugin-pwa` (gratuito, open-source)
- Seu design dark ja e responsivo em varias paginas
- **Resultado:** usuario "instala" no celular como app, sem publicar em loja

---

### PRIORIDADE 7 - TaxPage Basica (Custo: R$0 | Esforco: Alto)

**O que fazer (versao simples):**
- Voce ja tem `case 'tax': return <PlaceholderPage>` no `App.tsx`
- Criar formulario onde usuario registra compras e vendas
- Calcular: lucro/prejuizo por operacao, imposto devido (15% swing, 20% day trade)
- Mostrar se tem isencao (vendas < R$20k/mes em acoes)
- Salvar no localStorage (igual ao resto do app)
- **Sem backend, sem API** - tudo local

---

### NAO RECOMENDO AGORA (Caro ou Complexo demais p/ solo dev)

| Feature | Por que NAO agora |
|---|---|
| **Conexao automatica B3/CEI** | CEI exige autenticacao OAuth complexa, precisa de backend + servidor rodando 24h (custa $$$). O Kinvo tem time inteiro so pra isso. |
| **Open Finance** | Exige certificacao no Banco Central, processo burocrático de meses, infraestrutura cara. |
| **App nativo iOS/Android** | Custa ~R$99/ano (Apple) + R$25 (Google). PWA resolve 90% do problema de graca. |
| **Backend com banco de dados** | Vercel/Railway tem tier gratis, mas limita rapido. Fique no localStorage por enquanto. |

---

## 3. APIs Gratuitas que Voce Pode Usar

| API | O que faz | Limite Free | Voce ja usa? |
|---|---|---|---|
| **brapi.dev** | Cotacoes B3, dividendos, fundamentus | Token demo (limitado mas funciona) | Sim |
| **BCB API** | Selic, CDI, IPCA, cambio, indicadores | Ilimitado, sem token | Nao |
| **Gemini API** | IA generativa, analise de mercado | 15 RPM gratis no free tier | Sim |
| **CoinGecko API** | Crypto precos, market cap | 10-30 req/min gratis | Nao |
| **AwesomeAPI** | Cotacao dolar/euro em tempo real | Gratuito, sem token | Nao |

### URLs uteis:
- Selic atual: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json`
- IPCA mensal: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json`
- CDI diario: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json`
- Dolar: `https://economia.awesomeapi.com.br/json/last/USD-BRL`
- Crypto: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl`

---

## 4. Roadmap Realista (Solo Dev, Zero Custo)

### Sprint 1 - Vitoria Rapida (poucos dias)
1. Rentabilidade Real na WalletPage (so math, ja tem os dados)
2. Contribuicao individual dos ativos (Recharts que ja tem)
3. Integrar API BCB para Selic/CDI/IPCA real (gratis, sem token)

### Sprint 2 - Diferenciacao (1-2 semanas)
4. Renda Fixa na carteira (campos novos em Asset + formulario)
5. Cobertura FGC (logica local sobre os ativos RF)
6. Secao de proventos na WalletPage (brapi dividends endpoint)

### Sprint 3 - Mobile + Retencao (2-3 semanas)
7. PWA (manifest + service worker + vite-plugin-pwa)
8. TaxPage basica (calculo IR local)
9. CoinGecko para crypto real-time (substituir dados hardcoded)

---

## 5. Conclusao

Voce, sozinho e sem gastar nada, ja construiu algo **tecnicamente mais avancado que o Kinvo** em analise, IA e educacao. O Kinvo tem uma empresa inteira e R$72M do BTG por tras.

As melhorias mais impactantes (rentabilidade real, proventos, renda fixa) sao **pura logica local + APIs 100% gratuitas**. Nao precisa de backend, nao precisa de servidor, nao precisa gastar um centavo.

Foque no que e **gratis e de alto impacto** primeiro. Quando o app ganhar tracao, ai sim vale pensar em integracao B3 e infraestrutura.

> "O Kinvo teve R$72M pra chegar onde esta. Voce ta chegando la com zero. Isso diz tudo."

---

*Atualizado em 2026-02-12 | Solo dev, custo zero, APIs gratuitas*

### Fontes
- [Kinvo - Site Oficial](https://kinvo.com.br/)
- [Kinvo Premium - Funcionalidades](https://suporte.kinvo.com.br/support/solutions/articles/44002413482)
- [Kinvo - Google Play](https://play.google.com/store/apps/details?id=com.everestti.kinvo)
- [Kinvo Vale a Pena? - iDinheiro](https://www.idinheiro.com.br/investimentos/kinvo-vale-a-pena/)
- [API Banco Central do Brasil](https://dadosabertos.bcb.gov.br/)
- [brapi.dev - API B3 Gratuita](https://brapi.dev/)
- [CoinGecko Free API](https://www.coingecko.com/en/api)
- [AwesomeAPI - Cambio](https://docs.awesomeapi.com.br/)
