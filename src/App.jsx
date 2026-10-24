import { useState, useEffect } from "react";

/* ─── TOKENS ─────────────────────────────────────────────────── */
const T = {
  ink:"#0B1E2D", navy:"#0D3B6E", teal:"#0A7B6C", teal2:"#0DA090",
  gold:"#C4922A", gold2:"#E8B84B", fog:"#F8FAFB", mist:"#DDE6EE",
  sage:"#E4F0EA", sky:"#E4EEF8", amber:"#FBF2E4", white:"#FFFFFF",
  red:"#DC2626", orange:"#EA580C", green:"#16A34A", blue:"#2563EB",
  purple:"#7C3AED", slate:"#64748B", code:"#0F172A",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const SPRINTS = [
  {
    id:"S0", label:"Sprint 0 — Correções Urgentes", periodo:"01–05/Ago/2026",
    cor:T.red, horas:"6–8h", status:"🔴 URGENTE",
    descricao:"Correções de conteúdo que eliminam risco institucional com o MGI. Sem desenvolvimento novo — apenas edições de texto e remoção de afirmações incorretas.",
    tasks:[
      { id:"S0-T1", tipo:"COPY", prio:"🔴", titulo:"Remover '15 APIs integradas' sem qualificação",
        onde:"Homepage, /features, /sobre, README, pitch docs",
        como:"Substituir por: 'Dados ambientais abertos já ativos + integrações B2G em credenciamento'",
        horas:"1h", entrega:"05/Ago/2026" },
      { id:"S0-T2", tipo:"COPY", prio:"🔴", titulo:"Corrigir todas as menções a ConectaGov.br",
        onde:"Todas as páginas do site + materiais de venda",
        como:"Novo texto padrão (ver Tab Copy): frase 1 explica G2G, frase 2 explica modelo B2G da OCEANO",
        horas:"1h", entrega:"05/Ago/2026" },
      { id:"S0-T3", tipo:"COPY", prio:"🔴", titulo:"Corrigir 'SISNAMA' — não é uma API",
        onde:"Homepage, /integracoes (se existir), qualquer material",
        como:"Substituir por 'órgãos do SISNAMA (IBAMA, MMA, órgãos estaduais)'",
        horas:"30min", entrega:"05/Ago/2026" },
      { id:"S0-T4", tipo:"COPY", prio:"🟠", titulo:"Remover PTD-MGI da lista de integrações",
        onde:"Qualquer menção a '15 APIs' ou lista de sistemas integrados",
        como:"PTD é ferramenta interna do gov. Não é uma API consumível pelo produto.",
        horas:"30min", entrega:"05/Ago/2026" },
      { id:"S0-T5", tipo:"COPY", prio:"🟠", titulo:"Adicionar nota de transparência no rodapé",
        onde:"Footer do site",
        como:"'As integrações Gov.br estão em processo formal de credenciamento. Status em tempo real: oceanoambiental.eco.br/integracoes'",
        horas:"30min", entrega:"05/Ago/2026" },
    ]
  },
  {
    id:"S1", label:"Sprint 1 — Caminho A + Página Status", periodo:"05–21/Ago/2026",
    cor:T.green, horas:"32–40h", status:"🟢 Alta prioridade",
    descricao:"Ativar as 3 APIs de dados abertos (sem nenhuma barreira) e publicar a página /integracoes com status dinâmico. Gera valor real e demonstra transparência.",
    tasks:[
      { id:"S1-T1", tipo:"DEV", prio:"🔴", titulo:"Ativar MapBiomas — API REST pública",
        onde:"OCEANO GIS (backend)",
        como:"GET https://api.mapbiomas.org/v1/coverage?year=2024&cell={bbox} — cachear 24h Redis. Exibir no mapa como camada 'Uso do Solo 2024'. Sem credenciamento necessário.",
        horas:"8h", entrega:"10/Ago/2026" },
      { id:"S1-T2", tipo:"DEV", prio:"🔴", titulo:"Ativar INPE/DETER — alertas desmatamento",
        onde:"OCEANO GIS + OCEANO Monitor",
        como:"GET http://terrabrasilis.dpi.inpe.br/geoserver/deter-amz/wfs?service=WFS&request=GetFeature — GeoJSON público. Mostrar alertas em camada vermelha no mapa.",
        horas:"6h", entrega:"10/Ago/2026" },
      { id:"S1-T3", tipo:"DEV", prio:"🟠", titulo:"Ativar Compras.gov.br — licitações ambientais",
        onde:"Painel municipal OCEANO",
        como:"GET https://pncp.gov.br/api/pncp/v1/contratos?dataInicial={}&dataFinal={}&codigoMunicipio={} — filtrar por natureza ambiental. Tabela com contratos do município.",
        horas:"6h", entrega:"14/Ago/2026" },
      { id:"S1-T4", tipo:"DEV", prio:"🔴", titulo:"Criar endpoint /api/integracoes (JSON de status)",
        onde:"Backend — novo endpoint",
        como:"JSON com campos: id, nome, status, caminho, eta, ultima_atualizacao, fundamento_legal. CEO edita o JSON, site reflete automaticamente. Ver spec completo na Tab API.",
        horas:"4h", entrega:"12/Ago/2026" },
      { id:"S1-T5", tipo:"DEV", prio:"🔴", titulo:"Criar página /integracoes no site",
        onde:"oceanoambiental.eco.br/integracoes",
        como:"Tabela visual com badges 🟢🟡🔵🔴⚪, seção '3 Caminhos (A/B/C)', cards de status por caminho. Design: fundo branco, tipografia Inter, paleta OCEANO. Ver wireframe na Tab Site.",
        horas:"12h", entrega:"21/Ago/2026" },
      { id:"S1-T6", tipo:"DEV", prio:"🟠", titulo:"Adicionar selos dinâmicos na homepage",
        onde:"oceanoambiental.eco.br — seção de integrações existente",
        como:"Consumir /api/integracoes. Mostrar contadores: '3 🟢 ativas | 4 🟡 credenciamento | 3 🔵 parceria'. Link → /integracoes.",
        horas:"4h", entrega:"21/Ago/2026" },
    ]
  },
  {
    id:"S2", label:"Sprint 2 — Modo Degradado + SERPRO", periodo:"21/Ago–15/Set/2026",
    cor:T.gold, horas:"40–56h", status:"🟡 Alta prioridade",
    descricao:"Produto não pode quebrar enquanto integrações estão pendentes. Implementar modo degradado (upload manual) e, quando SERPRO aprovado, integrar CNPJ/CPF/CNAE.",
    tasks:[
      { id:"S2-T1", tipo:"DEV", prio:"🔴", titulo:"Implementar modo degradado nas integrações pendentes",
        onde:"OCEANO Check, OCEANO Docs, OCEANO Lex (frontend + backend)",
        como:"Se status = 'credenciamento' ou 'parceria': módulo desativa call automática → habilita upload manual. Badge amarelo: 'Integração em credenciamento — carregue o documento manualmente'. UX: não quebra, não mente.",
        horas:"16h", entrega:"28/Ago/2026" },
      { id:"S2-T2", tipo:"DEV", prio:"🟠", titulo:"Implementar SERPRO Gateway (quando contratado)",
        onde:"Backend — OCEANO Check",
        como:"POST https://gateway.apis.serpro.gov.br/consulta-cpf-df/v2/{cpf} (Bearer token SERPRO). Cache 1h Redis. Rate limit: 1.000/dia. Campos: situação_cadastral, nome, data_nascimento. Exibir badge 🟢 'Dado Receita Federal via SERPRO'.",
        horas:"12h", entrega:"15/Set/2026" },
      { id:"S2-T3", tipo:"DEV", prio:"🟠", titulo:"SERPRO CNPJ — diagnóstico automático",
        onde:"OCEANO Check",
        como:"POST https://gateway.apis.serpro.gov.br/consulta-cnpj/v2/{cnpj} — campos: cnae_principal, situacao, socios[], atividades_secundarias[]. Alimentar diagnóstico automático da OCEANO Check em 60s.",
        horas:"8h", entrega:"15/Set/2026" },
      { id:"S2-T4", tipo:"INFRA", prio:"🟡", titulo:"Config table integrações no banco de dados",
        onde:"Backend — TiDB Cloud",
        como:"Tabela integracoes: id, nome, status, caminho, eta, fundamento_legal, ativo, ultima_atualizacao. Admin panel simples para CEO atualizar sem deploy.",
        horas:"8h", entrega:"28/Ago/2026" },
      { id:"S2-T5", tipo:"DEV", prio:"🟡", titulo:"Painel admin de integrações (CEO)",
        onde:"oceanoambiental.eco.br/admin/integracoes",
        como:"Formulário simples: dropdown status + campo eta + campo nota. Salva na tabela. Reflete em /api/integracoes imediatamente. Autenticação: só CEO (role = admin).",
        horas:"6h", entrega:"05/Set/2026" },
    ]
  },
  {
    id:"S3", label:"Sprint 3 — Conteúdo Hub + Plataforma B2G", periodo:"15/Set–15/Out/2026",
    cor:T.blue, horas:"48–64h", status:"🔵 Médio-alto",
    descricao:"Implementar o Hub Estratégico no site e construir o módulo B2G (Prefeituras), com painel de conformidade municipal baseado nos dados abertos já ativos.",
    tasks:[
      { id:"S3-T1", tipo:"DEV", prio:"🟠", titulo:"Seção 'Como a OCEANO acessa dados públicos' no site",
        onde:"oceanoambiental.eco.br/integracoes — nova seção acima da tabela",
        como:"3 cards visuais: Caminho A (verde), B (dourado), C (azul). Cada card: ícone, título, 2 frases explicativas, exemplos, base legal. Design limpo, sem jargão técnico — linguagem para prefeito.",
        horas:"10h (design + dev)", entrega:"25/Set/2026" },
      { id:"S3-T2", tipo:"DEV", prio:"🟠", titulo:"Painel de conformidade municipal (prefeituras)",
        onde:"Plataforma — módulo Prefeituras",
        como:"Dashboard com: (1) Mapa INPE/MapBiomas do município, (2) Lista de empresas licenciadas (upload manual + IBAMA quando ACT ativo), (3) Alertas de vencimento, (4) Checklist Lei 15.190/2025. Dados: Caminho A ativo + uploads.",
        horas:"24h", entrega:"10/Out/2026" },
      { id:"S3-T3", tipo:"DEV", prio:"🟡", titulo:"Widget de status de integrações na plataforma",
        onde:"Dashboard da plataforma — sidebar direito",
        como:"Mini-painel consumindo /api/integracoes. Mostra status de cada módulo. Se 🟡: tooltip explica 'em credenciamento — usando modo manual'. Se 🟢: badge ativo. Atualiza a cada 5min.",
        horas:"6h", entrega:"01/Out/2026" },
      { id:"S3-T4", tipo:"DEV", prio:"🟡", titulo:"Página /prefeituras atualizada no site",
        onde:"oceanoambiental.eco.br/prefeituras",
        como:"Remover promessa de 'integração total ConectaGov'. Adicionar: (1) modelo B2G explicado, (2) base legal Lei 14.133/2021 art.75, (3) CTA: 'Agendar demonstração'. Linguagem: 'Conformidade com Lei 15.190/2025 garantida'.",
        horas:"8h", entrega:"20/Set/2026" },
      { id:"S3-T5", tipo:"INFRA", prio:"🟡", titulo:"Monitoramento de uptime das APIs Caminho A",
        onde:"Backend — OCEANO Monitor",
        como:"Ping a cada 15min: MapBiomas, INPE, Compras.gov.br. Se down: badge vermelho no painel admin. Alertar CEO via WhatsApp (Twilio). SLA interno: 99% uptime APIs públicas.",
        horas:"6h", entrega:"25/Set/2026" },
    ]
  },
  {
    id:"S4", label:"Sprint 4 — Launch Prep", periodo:"15/Out–01/Nov/2026",
    cor:T.teal, horas:"24–32h", status:"🎯 Meta",
    descricao:"Polimento final para o lançamento nacional. Auditoria técnica, performance, SEO e experiência para os 50 municípios piloto.",
    tasks:[
      { id:"S4-T1", tipo:"QA", prio:"🔴", titulo:"Auditoria de todas as afirmações do site",
        onde:"Site completo",
        como:"Checar cada frase contra realidade das integrações. Usar checklist da Tab Copy. Qualquer afirmação não suportada por dado real = remover ou qualificar.",
        horas:"8h", entrega:"20/Out/2026" },
      { id:"S4-T2", tipo:"PERF", prio:"🟠", titulo:"Performance: latência < 2s em todas as chamadas",
        onde:"Backend + Frontend",
        como:"Redis cache para APIs Caminho A (TTL: MapBiomas 24h, INPE 1h, Compras 6h). Lazy loading nas páginas pesadas. Lighthouse score > 85.",
        horas:"8h", entrega:"25/Out/2026" },
      { id:"S4-T3", tipo:"DEV", prio:"🟡", titulo:"Landing page dos 50 municípios piloto",
        onde:"oceanoambiental.eco.br/piloto",
        como:"Formulário de adesão. Campos: município, UF, nome do responsável, e-mail prefeitura. Integrar ao WhatsApp do CEO. Badge '1 de 50 vagas disponíveis' com contador.",
        horas:"8h", entrega:"25/Out/2026" },
      { id:"S4-T4", tipo:"INFRA", prio:"🟡", titulo:"Documentação técnica das integrações ativas",
        onde:"/docs (pública) ou Notion interno",
        como:"Para cada integração Caminho A: endpoint usado, tipo de dado, frequência de atualização, limitações. Para Caminho B/C: status atual e próximas etapas. CEO mantém.",
        horas:"4h", entrega:"01/Nov/2026" },
    ]
  },
];

const COPY_GUIDELINES = [
  {
    ctx:"Homepage — hero ou tagline de integrações",
    errado:"Integra 15 APIs governamentais em tempo real",
    certo:"Dados ambientais abertos já ativos. Integrações Gov.br em credenciamento formal.",
    nota:"Nunca cite número de APIs sem qualificar o status de cada grupo."
  },
  {
    ctx:"Qualquer menção ao ConectaGov.br",
    errado:"A OCEANO integra o ConectaGov.br para autenticação unificada",
    certo:"O ConectaGov.br é exclusivo G2G (gov. para gov.). A OCEANO opera em modelo B2G: o órgão público parceiro acessa seus sistemas, a OCEANO fornece a camada de IA.",
    nota:"Sempre explicar os dois pontos: o que é o ConectaGov e como a OCEANO contorna isso legalmente."
  },
  {
    ctx:"Features de dados cadastrais (CNPJ/CPF)",
    errado:"Consulta CNPJ direto na Receita Federal via API",
    certo:"Consulta CNPJ via SERPRO Gateway (em contratação). Disponível ao assinar o plano.",
    nota:"Adicionar badge 🟡 'Em credenciamento' nos módulos que dependem desta integração."
  },
  {
    ctx:"Features de dados de licenças IBAMA",
    errado:"Rastreamento em tempo real de processos no IBAMA",
    certo:"Rastreamento de processos IBAMA via ACT em elaboração. No momento: upload manual de documentos com análise IA automática.",
    nota:"Ser específico sobre o que funciona AGORA vs. o que está em implementação."
  },
  {
    ctx:"Seção de conformidade Lei 15.190/2025",
    errado:"Conformidade total garantida com todos os órgãos ambientais",
    certo:"Conformidade com a Lei 15.190/2025 — licenciamento digital até Fev/2029. Integrações diretas expandindo conforme ACTs firmados.",
    nota:"Esta lei é o gancho principal. Ela é fato — pode usar com força total."
  },
  {
    ctx:"CTA para prefeituras",
    errado:"Integre seu município ao sistema Gov.br via OCEANO",
    certo:"Coloque seu município em conformidade com a Lei 15.190/2025. Contrato direto por dispensa de licitação (Lei 14.133/2021, art. 75).",
    nota:"Trocar linguagem técnica de API por linguagem jurídica de conformidade — é o que o prefeito entende."
  },
];

const API_SPEC = {
  endpoint:"/api/integracoes",
  method:"GET",
  descricao:"Retorna status em tempo real das 15 integrações da plataforma OCEANO. Alimenta a página /integracoes e os badges da plataforma.",
  response: `{
  "ultima_atualizacao": "2026-08-01T00:00:00Z",
  "total": 15,
  "resumo": {
    "ativo": 3,
    "credenciamento": 4,
    "parceria": 3,
    "bloqueado": 1,
    "naplicavel": 4
  },
  "integracoes": [
    {
      "id": 1,
      "nome": "MapBiomas",
      "orgao": "Rede Universitária / ONGs",
      "caminho": "A",
      "status": "ativo",
      "label": "Ativo",
      "eta": null,
      "fundamento_legal": "API pública aberta",
      "endpoint_base": "https://api.mapbiomas.org/v1/",
      "ultima_atualizacao": "2026-08-01T00:00:00Z"
    },
    {
      "id": 4,
      "nome": "Gov.br OAuth 2.0",
      "orgao": "SGD/MGI",
      "caminho": "B",
      "status": "credenciamento",
      "label": "Em credenciamento",
      "eta": "Ago/2026",
      "fundamento_legal": "Portaria SGD 7.076/2024 + Ofício 08/2026",
      "nota_interna": "Aguardando resposta SGD ao Ofício 08",
      "ultima_atualizacao": "2026-08-01T00:00:00Z"
    }
  ]
}`,
  frontend:`// Hook React para consumir status
const { data: integracoes } = useSWR('/api/integracoes', fetcher, {
  refreshInterval: 300000 // 5 minutos
});

// Badge component
const StatusBadge = ({ status }) => {
  const map = {
    ativo:         { emoji: '🟢', label: 'Ativo',            bg: '#DCFCE7', cor: '#16A34A' },
    credenciamento:{ emoji: '🟡', label: 'Em credenciamento', bg: '#FEF9C3', cor: '#CA8A04' },
    parceria:      { emoji: '🔵', label: 'Em parceria',       bg: '#DBEAFE', cor: '#2563EB' },
    bloqueado:     { emoji: '🔴', label: 'G2G exclusivo',     bg: '#FEE2E2', cor: '#DC2626' },
    naplicavel:    { emoji: '⚪', label: 'Não é API',          bg: '#F1F5F9', cor: '#64748B' },
  };
  const s = map[status] || map.naplicavel;
  return (
    <span style={{ background: s.bg, color: s.cor, padding: '2px 8px',
      borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
      {s.emoji} {s.label}
    </span>
  );
};`,
};

const WIREFRAMES = [
  {
    nome:"/integracoes — página de status",
    ascii:`┌─────────────────────────────────────────────────────────────┐
│  OCEANO  [nav]                                  [CTA: Demo] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Transparência de Dados                                     │
│  Status em tempo real das nossas integrações                │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 🟢 3     │  │ 🟡 4         │  │ 🔵 3         │          │
│  │ Ativas   │  │ Credenciando │  │ Em parceria  │          │
│  └──────────┘  └──────────────┘  └──────────────┘          │
│                                                             │
│  ── Como acessamos dados públicos ─────────────────────── ─│
│  [Card A: Dados Abertos][Card B: SERPRO/B2G][Card C: ACTs] │
│                                                             │
│  ── Status detalhado ──────────────────────────────────── ─│
│  [Filtros: Todos | Ativos | Em credenciamento | ...]        │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 01 MapBiomas        Caminho A    🟢 Ativo   [↓]   │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ 02 INPE/Sentinel    Caminho A    🟢 Ativo   [↓]   │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ 04 Gov.br OAuth     Caminho B    🟡 Ago/26  [↓]   │     │
│  └────────────────────────────────────────────────────┘     │
│  Atualizado em: 01/Ago/2026  [Ver histórico]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘`
  },
  {
    nome:"Plataforma — Widget de status (sidebar)",
    ascii:`┌──────────────────────────────┐
│  Integrações ativas          │
│  ─────────────────────────   │
│  🟢 MapBiomas    [ativo]     │
│  🟢 INPE         [ativo]     │
│  🟡 Gov.br       [Ago/26]    │
│  🟡 SERPRO       [Set/26]    │
│  🔵 IBAMA        [ACT]       │
│                               │
│  [Ver status completo →]      │
└──────────────────────────────┘`
  },
  {
    nome:"Modo degradado — OCEANO Check sem SERPRO",
    ascii:`┌─────────────────────────────────────────────────────┐
│  OCEANO Check — Diagnóstico por CNPJ               │
│  ─────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────┐    │
│  │ ⚠️ Integração SERPRO/Receita Federal        │    │
│  │    em credenciamento (previsão: Set/2026)   │    │
│  │    Insira os dados manualmente abaixo        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  CNPJ  [________________]  Buscar dados públicos    │
│  Razão Social  [____________________________]       │
│  CNAE Principal  [______] [selecionar]              │
│  Município / UF  [__________] / [__]                │
│                                                     │
│  [Gerar diagnóstico ambiental →]                    │
│                                                     │
│  * Quando o SERPRO estiver ativo, este formulário   │
│    será preenchido automaticamente pelo CNPJ.       │
└─────────────────────────────────────────────────────┘`
  },
];

/* ─── MICRO ──────────────────────────────────────────────────── */
const Pill = ({ children, cor = T.teal, bg, sm }) => (
  <span style={{ background: bg || cor+"20", color: cor, fontSize: sm?8:9, fontWeight:700,
    padding: sm?"1px 5px":"2px 8px", borderRadius:20, letterSpacing:0.5,
    textTransform:"uppercase", border:`1px solid ${cor}30`, whiteSpace:"nowrap" }}>
    {children}
  </span>
);

const Code = ({ children, lang }) => (
  <div style={{ background:T.code, borderRadius:8, overflow:"hidden", marginTop:8 }}>
    {lang && <div style={{ padding:"4px 12px", background:"rgba(255,255,255,0.05)",
      fontSize:9, color:"rgba(255,255,255,0.4)", fontFamily:"monospace", letterSpacing:1 }}>{lang}</div>}
    <pre style={{ margin:0, padding:"12px 14px", fontFamily:"monospace", fontSize:10,
      color:"#93C5FD", lineHeight:1.7, overflowX:"auto", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
      {children}
    </pre>
  </div>
);

const SH = ({ n, title, sub, cor }) => (
  <div style={{ marginBottom:20, paddingBottom:12, borderBottom:`2px solid ${T.mist}` }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
      {n && <Pill cor={cor||T.teal}>{n}</Pill>}
    </div>
    <div style={{ fontFamily:"serif", fontSize:19, fontWeight:700, color:T.navy }}>{title}</div>
    {sub && <div style={{ fontSize:11, color:T.slate, marginTop:2, lineHeight:1.5 }}>{sub}</div>}
  </div>
);

/* ─── TAB: OVERVIEW ──────────────────────────────────────────── */
function TabOverview() {
  return (
    <div>
      <SH n="Dev Handoff" cor={T.navy}
        title="Plano de Implementação — Hub V2 no Site & Plataforma"
        sub="Para: Manus IA (Dev) · De: Fabiano Pereira Alves (CEO) · Data: 01/Ago/2026 · Baseline: Ofício SEI 94471/2026/MGI" />

      {/* Contexto crítico */}
      <div style={{ background:"#FEF2F2", border:`2px solid ${T.red}`, borderRadius:12,
        padding:16, marginBottom:20 }}>
        <div style={{ fontWeight:700, color:T.red, fontSize:12, marginBottom:8 }}>
          ⚠️ Contexto Crítico — Ler antes de qualquer implementação
        </div>
        <div style={{ fontSize:11, color:"#7F1D1D", lineHeight:1.8 }}>
          O MGI confirmou em <strong>27/Jul/2026</strong> que o <strong>ConectaGov.br é G2G exclusivo</strong> —
          não disponível para cidadãos ou setor privado. Isso muda como comunicamos nossas integrações.<br/>
          <strong>Regra de ouro:</strong> qualquer texto do site ou plataforma que afirme integração
          com Gov.br, ConectaGov ou SISNAMA precisa ser qualificado com o modelo B2G ou removido.<br/>
          O produto NÃO muda. A comunicação sobre o produto é que precisa de ajuste.
        </div>
      </div>

      {/* Sprint overview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:24 }}>
        {SPRINTS.map(s => (
          <div key={s.id} style={{ background:T.white, border:`2px solid ${s.cor}40`,
            borderTop:`4px solid ${s.cor}`, borderRadius:10, padding:12, textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:700, color:s.cor, marginBottom:4 }}>{s.status}</div>
            <div style={{ fontSize:10, fontWeight:700, color:T.ink, lineHeight:1.4, marginBottom:4 }}>{s.id}</div>
            <div style={{ fontSize:9, color:T.slate, lineHeight:1.4, marginBottom:6 }}>
              {s.label.replace(s.id+" — ","")}
            </div>
            <div style={{ fontSize:8, fontFamily:"monospace", color:T.slate }}>{s.periodo}</div>
            <div style={{ marginTop:6 }}>
              <Pill cor={s.cor} sm>{s.horas}</Pill>
            </div>
          </div>
        ))}
      </div>

      {/* Princípios de implementação */}
      <div style={{ fontSize:13, fontWeight:700, color:T.navy, marginBottom:12 }}>
        Princípios de Implementação
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        {[
          { n:"01", t:"Honestidade técnica em primeiro lugar",
            d:"Cada feature mostra seu status real. Integrações pendentes têm badge visível e modo manual. O usuário nunca é enganado sobre o que está ativo." },
          { n:"02", t:"Produto não quebra por integração pendente",
            d:"Modo degradado obrigatório: se a API não está ativa, o módulo volta para upload manual com UX clara. Nunca erro 500 por integração faltando." },
          { n:"03", t:"Caminho A ativa imediatamente",
            d:"MapBiomas, INPE e Compras.gov.br são APIs públicas sem credenciamento. Devem estar ativas antes do Sprint 1 terminar. São a âncora do discurso 'já funciona'." },
          { n:"04", t:"Status dinâmico — CEO atualiza sem deploy",
            d:"Toda mudança de status de integração é feita no painel admin. Nenhum deploy necessário para atualizar /integracoes ou badges da plataforma." },
        ].map(p => (
          <div key={p.n} style={{ display:"flex", gap:10, background:T.white,
            border:`1px solid ${T.mist}`, borderRadius:10, padding:14 }}>
            <div style={{ fontFamily:"monospace", fontSize:20, fontWeight:700,
              color:T.mist, lineHeight:1.2, flexShrink:0 }}>{p.n}</div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink, marginBottom:3 }}>{p.t}</div>
              <div style={{ fontSize:10, color:T.slate, lineHeight:1.5 }}>{p.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div style={{ background:T.code, borderRadius:12, padding:16, color:"#fff" }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.teal2, marginBottom:10 }}>Stack OCEANO (referência)</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { layer:"Frontend", items:["React 19 + Tailwind CSS 4","tRPC End-to-End","SWR (data fetching)","Recharts (gráficos)"] },
            { layer:"Backend", items:["Node.js / NestJS","n8n Enterprise (orquestrador)","TiDB Cloud + Redis","SERPRO Gateway (a contratar)"] },
            { layer:"Infra / APIs", items:["MapBiomas REST (ativo)","INPE/DETER WFS (ativo)","Compras.gov.br PNCP (ativo)","Claude API — claude-sonnet-4-6"] },
          ].map(l => (
            <div key={l.layer}>
              <div style={{ fontSize:9, fontWeight:700, color:T.gold2, marginBottom:5,
                letterSpacing:0.8, textTransform:"uppercase" }}>{l.layer}</div>
              {l.items.map((i,idx) => (
                <div key={idx} style={{ fontSize:10, color:"rgba(255,255,255,0.7)",
                  fontFamily:"monospace", marginBottom:3 }}>· {i}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── TAB: SPRINTS ───────────────────────────────────────────── */
function TabSprints() {
  const [sprint, setSprint] = useState(0);
  const [task, setTask] = useState(null);
  const s = SPRINTS[sprint];
  const tipoCor = { DEV:T.blue, COPY:T.purple, INFRA:T.orange, QA:T.green, PERF:T.teal };

  return (
    <div>
      <SH n="Sprints" cor={T.teal}
        title="4 Sprints · Ago–Nov/2026 · 150–200h total"
        sub="Clique no sprint para ver as tasks · Clique na task para ver a spec completa" />

      {/* Sprint selector */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {SPRINTS.map((sp, i) => (
          <button key={sp.id} onClick={() => { setSprint(i); setTask(null); }} style={{
            flex:1, padding:"10px 6px", borderRadius:8, border:`2px solid ${i===sprint?sp.cor:T.mist}`,
            background: i===sprint ? sp.cor+"15" : T.white,
            cursor:"pointer", transition:"all 0.2s",
          }}>
            <div style={{ fontSize:10, fontWeight:700, color:i===sprint?sp.cor:T.slate }}>{sp.id}</div>
            <div style={{ fontSize:8, color:T.slate, marginTop:2 }}>{sp.periodo}</div>
            <div style={{ fontSize:8, fontWeight:700, color:sp.cor, marginTop:3 }}>{sp.horas}</div>
          </button>
        ))}
      </div>

      {/* Sprint header */}
      <div style={{ background:s.cor+"15", border:`1px solid ${s.cor}40`, borderRadius:10,
        padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:s.cor, marginBottom:4 }}>{s.label}</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.6 }}>{s.descricao}</div>
      </div>

      {/* Tasks */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {s.tasks.map((t, i) => (
          <div key={t.id} onClick={() => setTask(task===i?null:i)} style={{
            background: task===i ? T.white : T.fog,
            border:`1px solid ${task===i ? s.cor : T.mist}`,
            borderLeft:`4px solid ${tipoCor[t.tipo]||T.slate}`,
            borderRadius:8, padding:"10px 14px", cursor:"pointer",
            transition:"all 0.15s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Pill cor={tipoCor[t.tipo]||T.slate} sm>{t.tipo}</Pill>
                <span style={{ fontSize:9, fontFamily:"monospace", color:T.slate }}>{t.id}</span>
                <span style={{ fontSize:11, fontWeight:700, color:T.ink }}>{t.titulo}</span>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <Pill cor={T.slate} sm>{t.horas}</Pill>
                <Pill cor={t.prio==="🔴"?T.red:t.prio==="🟠"?T.orange:T.gold} sm>{t.entrega}</Pill>
              </div>
            </div>
            {task === i && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.mist}`,
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:T.teal, marginBottom:4 }}>📍 ONDE</div>
                  <div style={{ fontSize:10, color:T.ink, lineHeight:1.6, marginBottom:10 }}>{t.onde}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:T.teal, marginBottom:4 }}>🗓 ENTREGA</div>
                  <div style={{ fontSize:10, color:T.ink }}>{t.entrega}</div>
                </div>
                <div style={{ background:T.code, borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:T.teal2, marginBottom:4 }}>⚙️ COMO IMPLEMENTAR</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.8)", lineHeight:1.7, fontFamily:"monospace" }}>
                    {t.como}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── TAB: COPY ──────────────────────────────────────────────── */
function TabCopy() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SH n="Copy Guidelines" cor={T.purple}
        title="Guia de Linguagem — O que dizer e o que evitar"
        sub="6 contextos críticos · Aplicar em todas as páginas e materiais · Atualizar também o pitch deck" />

      <div style={{ background:"#EDE9FE", border:`1px solid ${T.purple}40`, borderRadius:10,
        padding:14, marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.purple, marginBottom:6 }}>
          Regra de Ouro para todo o site
        </div>
        <div style={{ fontSize:11, color:"#4C1D95", lineHeight:1.7 }}>
          <strong>Afirme o que é real AGORA.</strong> Qualifique o que está em credenciamento.
          Explique o modelo B2G para o que é G2G exclusivo.<br/>
          Fórmula: <em>"[Dado real ativo] + [O que vem com SERPRO/ACT, quando disponível]"</em>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {COPY_GUIDELINES.map((g, i) => (
          <div key={i} onClick={() => setOpen(open===i?null:i)} style={{
            background: open===i ? T.white : T.fog,
            border:`1px solid ${open===i?T.purple:T.mist}`,
            borderRadius:10, padding:"10px 14px", cursor:"pointer",
            transition:"all 0.15s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:11, fontWeight:600, color:T.ink }}>{g.ctx}</div>
              <Pill cor={T.purple} sm>ver regra</Pill>
            </div>
            {open===i && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.mist}` }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div style={{ background:"#FEF2F2", borderRadius:8, padding:10 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:T.red, marginBottom:4 }}>❌ EVITAR</div>
                    <div style={{ fontSize:10, color:"#7F1D1D", fontStyle:"italic", lineHeight:1.6 }}>
                      "{g.errado}"
                    </div>
                  </div>
                  <div style={{ background:"#F0FDF4", borderRadius:8, padding:10 }}>
                    <div style={{ fontSize:9, fontWeight:700, color:T.green, marginBottom:4 }}>✅ USAR</div>
                    <div style={{ fontSize:10, color:"#14532D", lineHeight:1.6 }}>"{g.certo}"</div>
                  </div>
                </div>
                <div style={{ background:T.amber, borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:T.gold, marginBottom:2 }}>💡 NOTA</div>
                  <div style={{ fontSize:10, color:T.ink }}>{g.nota}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Texto padrão para ConectaGov */}
      <div style={{ marginTop:20, background:T.code, borderRadius:10, padding:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.gold2, marginBottom:8 }}>
          📋 Bloco de texto padrão — ConectaGov.br (copiar e colar em todos os materiais)
        </div>
        <Code>{`"O ConectaGov.br é uma ferramenta de interoperabilidade
exclusiva entre órgãos do Governo Federal (G2G),
confirmado pelo Ministério da Gestão e da Inovação
em julho de 2026.

A OCEANO opera no modelo B2G: o órgão público parceiro
(município, estado ou autarquia) acessa seus dados via
ConectaGov em sua condição de ente público. A OCEANO
fornece a camada de inteligência artificial, automação
e conformidade sobre esses dados.

Saiba mais: oceanoambiental.eco.br/integracoes"`}</Code>
      </div>
    </div>
  );
}

/* ─── TAB: API SPEC ──────────────────────────────────────────── */
function TabAPISpec() {
  const [wf, setWf] = useState(0);
  return (
    <div>
      <SH n="Especificações Técnicas" cor={T.teal}
        title="API Spec + Wireframes + Componentes"
        sub="Endpoint /api/integracoes · Schemas de resposta · Wireframes das novas páginas" />

      {/* Endpoint spec */}
      <div style={{ background:T.white, border:`1px solid ${T.mist}`, borderRadius:12, padding:18, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <Pill cor={T.teal}>NOVO ENDPOINT</Pill>
            <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:T.ink,
              marginLeft:10 }}>{API_SPEC.method} {API_SPEC.endpoint}</span>
          </div>
          <Pill cor={T.green} sm>Público · sem auth</Pill>
        </div>
        <div style={{ fontSize:10, color:T.slate, lineHeight:1.6, marginBottom:12 }}>
          {API_SPEC.descricao}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:T.navy, marginBottom:6 }}>Response Schema</div>
        <Code lang="json">{API_SPEC.response}</Code>
        <div style={{ fontSize:10, fontWeight:700, color:T.navy, marginTop:16, marginBottom:6 }}>
          Frontend — Hook + Badge Component
        </div>
        <Code lang="jsx">{API_SPEC.frontend}</Code>
      </div>

      {/* APIs Caminho A - endpoints reais */}
      <div style={{ fontSize:12, fontWeight:700, color:T.navy, marginBottom:12 }}>
        Endpoints Caminho A — Ativar Imediatamente
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {[
          { nome:"MapBiomas", endpoint:"https://api.mapbiomas.org/v1/coverage",
            params:"?year=2024&cell={bbox}", auth:"Nenhuma", cache:"Redis 24h TTL",
            uso:"OCEANO GIS — camada uso do solo" },
          { nome:"INPE DETER", endpoint:"http://terrabrasilis.dpi.inpe.br/geoserver/deter-amz/wfs",
            params:"?service=WFS&request=GetFeature&typeName=deter-amz:deter_public&outputFormat=application/json",
            auth:"Nenhuma", cache:"Redis 1h TTL", uso:"OCEANO GIS + Monitor — alertas desmatamento" },
          { nome:"Compras.gov.br PNCP", endpoint:"https://pncp.gov.br/api/pncp/v1/contratos",
            params:"?dataInicial={}&dataFinal={}&codigoMunicipio={ibge}", auth:"Nenhuma",
            cache:"Redis 6h TTL", uso:"Painel municipal — contratos ambientais" },
        ].map(a => (
          <div key={a.nome} style={{ background:T.code, borderRadius:10, padding:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontWeight:700, color:T.teal2, fontSize:11 }}>{a.nome}</span>
              <Pill cor={T.green} sm>🟢 Ativo hoje</Pill>
            </div>
            <Code>{`GET ${a.endpoint}
Params: ${a.params}
Auth: ${a.auth}
Cache: ${a.cache}
Uso: ${a.uso}`}</Code>
          </div>
        ))}
      </div>

      {/* Wireframes */}
      <div style={{ fontSize:12, fontWeight:700, color:T.navy, marginBottom:12 }}>
        Wireframes — Novas Páginas e Componentes
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {WIREFRAMES.map((w, i) => (
          <button key={i} onClick={() => setWf(i)} style={{
            padding:"6px 14px", borderRadius:8, fontSize:10, fontWeight:600,
            border:"none", cursor:"pointer",
            background: wf===i ? T.teal : T.mist,
            color: wf===i ? "#fff" : T.slate,
          }}>{w.nome}</button>
        ))}
      </div>
      <Code lang="ascii">{WIREFRAMES[wf].ascii}</Code>
    </div>
  );
}

/* ─── TAB: CHECKLIST ─────────────────────────────────────────── */
const CHECKLIST_KEY = "oceano-handoff-checklist";

const loadChecklist = () => {
  try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {}; }
  catch { return {}; }
};

function TabChecklist() {
  const [done, setDone] = useState(loadChecklist);
  useEffect(() => {
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(done)); }
    catch { /* armazenamento indisponível — progresso fica só na sessão */ }
  }, [done]);
  const all = [
    { id:"c1", sprint:"S0", prio:"🔴", item:"Remover '15 APIs integradas' da homepage e features" },
    { id:"c2", sprint:"S0", prio:"🔴", item:"Corrigir todas as menções a ConectaGov.br (usar bloco padrão)" },
    { id:"c3", sprint:"S0", prio:"🔴", item:"Corrigir 'SISNAMA' — substituir por 'órgãos do SISNAMA'" },
    { id:"c4", sprint:"S0", prio:"🟠", item:"Remover PTD-MGI da lista de integrações do produto" },
    { id:"c5", sprint:"S0", prio:"🟠", item:"Adicionar nota de transparência no footer" },
    { id:"c6", sprint:"S1", prio:"🔴", item:"Ativar MapBiomas API (dados abertos)" },
    { id:"c7", sprint:"S1", prio:"🔴", item:"Ativar INPE/DETER API (dados abertos)" },
    { id:"c8", sprint:"S1", prio:"🟠", item:"Ativar Compras.gov.br PNCP API (dados abertos)" },
    { id:"c9", sprint:"S1", prio:"🔴", item:"Criar endpoint /api/integracoes com JSON dinâmico" },
    { id:"c10", sprint:"S1", prio:"🔴", item:"Criar página /integracoes com badges de status" },
    { id:"c11", sprint:"S1", prio:"🟠", item:"Adicionar selos dinâmicos na homepage (consumir /api/integracoes)" },
    { id:"c12", sprint:"S2", prio:"🔴", item:"Implementar modo degradado (upload manual) para integrações pendentes" },
    { id:"c13", sprint:"S2", prio:"🟠", item:"Criar tabela de config de integrações no banco (TiDB)" },
    { id:"c14", sprint:"S2", prio:"🟡", item:"Criar painel admin para CEO atualizar status sem deploy" },
    { id:"c15", sprint:"S2", prio:"🟠", item:"Integrar SERPRO Gateway quando contratado (CNPJ/CPF/CNAE)" },
    { id:"c16", sprint:"S3", prio:"🟠", item:"Seção '3 Caminhos A/B/C' na página /integracoes" },
    { id:"c17", sprint:"S3", prio:"🟠", item:"Painel de conformidade municipal com dados abertos" },
    { id:"c18", sprint:"S3", prio:"🟡", item:"Widget de status integrações na sidebar da plataforma" },
    { id:"c19", sprint:"S3", prio:"🟡", item:"Atualizar /prefeituras com linguagem B2G correta" },
    { id:"c20", sprint:"S4", prio:"🔴", item:"Auditoria de texto — varrer todo o site por afirmações não suportadas" },
    { id:"c21", sprint:"S4", prio:"🟠", item:"Performance: latência < 2s (Redis cache + Lighthouse > 85)" },
    { id:"c22", sprint:"S4", prio:"🟡", item:"Landing page /piloto para os 50 municípios" },
  ];
  const completado = Object.values(done).filter(Boolean).length;
  const sprints = ["S0","S1","S2","S3","S4"];

  return (
    <div>
      <SH n="Checklist" cor={T.green}
        title="Master Checklist — 22 Tasks · Ago–Nov/2026"
        sub="Marque conforme concluído · Progresso salvo localmente" />

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20,
        background:T.white, border:`1px solid ${T.mist}`, borderRadius:10, padding:14 }}>
        <div style={{ flex:1, background:T.mist, borderRadius:4, height:8 }}>
          <div style={{ width:`${(completado/all.length)*100}%`, height:"100%",
            background:T.green, borderRadius:4, transition:"width 0.3s" }} />
        </div>
        <div style={{ fontFamily:"serif", fontSize:18, fontWeight:700, color:T.green }}>
          {completado}/{all.length}
        </div>
        <div style={{ fontSize:10, color:T.slate }}>tasks completas</div>
      </div>

      {sprints.map(sp => {
        const tasks = all.filter(t => t.sprint === sp);
        const spData = SPRINTS.find(s => s.id === sp);
        if(!spData || tasks.length===0) return null;
        return (
          <div key={sp} style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8,
              paddingBottom:6, borderBottom:`2px solid ${spData.cor}40` }}>
              <Pill cor={spData.cor}>{sp}</Pill>
              <span style={{ fontSize:11, fontWeight:700, color:T.ink }}>{spData.label}</span>
              <span style={{ fontSize:9, color:T.slate }}>· {spData.periodo}</span>
            </div>
            {tasks.map(t => (
              <div key={t.id} onClick={() => setDone(d => ({...d,[t.id]:!d[t.id]}))} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", marginBottom:4, borderRadius:8,
                background: done[t.id] ? T.sage : T.fog,
                border:`1px solid ${done[t.id]?T.green:T.mist}`,
                cursor:"pointer", transition:"all 0.15s",
              }}>
                <div style={{ width:18, height:18, border:`2px solid ${done[t.id]?T.green:T.mist}`,
                  borderRadius:4, background:done[t.id]?T.green:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {done[t.id] && <span style={{ color:"#fff", fontSize:11 }}>✓</span>}
                </div>
                <span style={{ fontSize:9, fontFamily:"monospace", color:T.slate, minWidth:40 }}>{t.id}</span>
                <span style={{ fontSize:9 }}>{t.prio}</span>
                <span style={{ fontSize:10, color:done[t.id]?T.slate:T.ink,
                  textDecoration:done[t.id]?"line-through":"none" }}>{t.item}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────── */
const TABS = [
  { label:"📋 Overview", comp:TabOverview },
  { label:"🏃 Sprints", comp:TabSprints },
  { label:"✍️ Copy Guide", comp:TabCopy },
  { label:"⚙️ API Spec", comp:TabAPISpec },
  { label:"✅ Checklist", comp:TabChecklist },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const Active = TABS[tab].comp;

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:`linear-gradient(160deg,${T.ink} 0%,${T.navy} 50%,#0A5A78 100%)`, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ padding:"20px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:9, display:"flex", alignItems:"center",
            justifyContent:"center", background:`linear-gradient(135deg,${T.teal2},${T.teal})`,
            fontFamily:"serif", fontSize:18, fontWeight:700, color:"#fff",
            boxShadow:"0 4px 16px rgba(10,123,108,0.4)" }}>O</div>
          <div>
            <div style={{ fontFamily:"serif", fontSize:18, fontWeight:700, color:"#fff", lineHeight:1 }}>
              OCEANO — Dev Handoff
            </div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:1.2,
              textTransform:"uppercase", marginTop:2 }}>
              Para: Manus IA · Hub V2 no Site & Plataforma · Ago–Nov/2026
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["🔴 S0","05/Ago"],["🟢 S1","21/Ago"],["🟡 S2","15/Set"],["🔵 S3","15/Out"],["🎯 Launch","01/Nov"]].map(([l,d]) => (
            <div key={l} style={{ textAlign:"center", background:"rgba(255,255,255,0.07)",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 10px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>{l}</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", fontFamily:"monospace" }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:3, padding:"14px 32px 0" }}>
        {TABS.map((t, i) => (
          <div key={i} onClick={() => setTab(i)} style={{
            padding:"8px 16px", borderRadius:"8px 8px 0 0", fontSize:10, fontWeight:tab===i?700:500,
            cursor:"pointer",
            background:tab===i ? T.fog : "rgba(255,255,255,0.07)",
            color:tab===i ? T.ink : "rgba(255,255,255,0.6)",
            border:tab===i?"none":"1px solid rgba(255,255,255,0.1)",
            borderBottom:"none", transition:"all 0.2s",
          }}>{t.label}</div>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ background:T.fog, margin:"0 22px 22px", borderRadius:"0 14px 14px 14px",
        padding:"24px 28px", minHeight:"72vh", boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
        overflowY:"auto" }}>
        <Active />
      </div>
    </div>
  );
}
