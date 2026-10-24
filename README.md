# OCEANO Ambiental Inteligente — Dev Handoff (Hub V2)

Base de dados do projeto desde o início, construída com a Manus IA: plano de
implementação do **Hub V2 no Site & Plataforma** (Ago–Nov/2026).

- **Para:** Manus IA (Dev)
- **De:** Fabiano Pereira Alves (CEO)
- **Baseline:** Ofício SEI 94471/2026/MGI — ConectaGov.br confirmado como G2G exclusivo (27/Jul/2026)

## Conteúdo

O app (`src/App.jsx`) reúne, em abas:

| Aba | O que contém |
| --- | --- |
| 📋 Overview | Contexto crítico, visão dos sprints, princípios de implementação e stack |
| 🏃 Sprints | S0–S4 com tasks, onde/como implementar, horas e datas de entrega |
| ✍️ Copy Guide | O que dizer e o que evitar (ConectaGov, SISNAMA, SERPRO, IBAMA, Lei 15.190/2025) |
| ⚙️ API Spec | Spec do endpoint `GET /api/integracoes`, endpoints do Caminho A e wireframes |
| ✅ Checklist | 22 tasks, com progresso salvo no navegador (localStorage) |

## Sprints

| Sprint | Período | Horas | Foco |
| --- | --- | --- | --- |
| S0 | 01–05/Ago/2026 | 6–8h | Correções urgentes de texto |
| S1 | 05–21/Ago/2026 | 32–40h | Caminho A (MapBiomas, INPE/DETER, PNCP) + página `/integracoes` |
| S2 | 21/Ago–15/Set/2026 | 40–56h | Modo degradado + SERPRO Gateway |
| S3 | 15/Set–15/Out/2026 | 48–64h | Hub de conteúdo + plataforma B2G (prefeituras) |
| S4 | 15/Out–01/Nov/2026 | 24–32h | Preparação do lançamento (50 municípios piloto) |

## Executar localmente

```bash
npm install
npm run dev     # servidor de desenvolvimento
npm run build   # build de produção em dist/
```
