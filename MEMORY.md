# MEMORY.md — AgentForger

## Persistent facts

- Workspace root: `<workspace-root>`
- Tooling directory: `agentforger/` (migrated from `agentforger/` on 2026-03-23)
- Validators location: `agentforger/validators/`
- Self-check: `npm --prefix agentforger test`
- Skills root: `skills/`
- Agents root: `agents/`
- Node.js ES modules (`"type": "module"`) — use `.mjs` for validators

## Preferences

- English primary for new files
- Minimal but complete — every section must earn its place
- Always reuse before creating
- Approval gate is mandatory; never skip

## Design decisions

- `validate-audit.mjs` introduced in v1.0.0 for deep section + limits checks
- `warn()` helper added to `common.mjs` (non-fatal, does not set exitCode 1)
- `validate-repo.mjs` now calls `validate-audit.mjs` as part of full sweeps
- Template engine `require()` bug fixed: replaced with `import path from 'node:path'`
- Evaluation scenarios documented in `agentforger/docs/evaluation.md`

## Audit log

<!-- Date | Mode | Artifact | Validator Exit | Score | Notes -->
| 2026-03-23 | create | agentforger (full migration) | 0 | — | Initial AgentForger setup |
| 2026-03-27 | create | mitla-architect (full workspace) | 0 | 16P/0F/0W | Foundation agent with Docker-first verification |
| 2026-03-27 | create | mitla-ventas, mitla-cobranza, mitla-logistica, mitla-facturacion, mitla-proveedores, mitla-pagos (light agents) | 0 | — | Domain owner agents — define requirements, no code |
| 2026-03-27 | create | mitla-pm, mitla-tech-lead (light agents) | 0 | — | Management layer — PM + tech lead |
| 2026-03-27 | create | mitla-frontend, mitla-backend, mitla-db, mitla-qa, mitla-integration (light agents) | 0 | — | Technical team — sequential per module |
| 2026-03-27 | create | cfdi-facturama (skill) | 0 | — | CFDI 4.0 Facturama PAC integration skill |
| 2026-03-31 | create | Mitla ERP módulo Ventas — construcción autorizada | — | — | Decisiones ejecutivas aprobadas. mitla-pm orquestando mitla-db + mitla-backend + mitla-frontend en paralelo. Planning congelado en /home/navas/productos-mitla/docs/ventas-module-planning.md |
| 2026-04-01 | build | Mitla ERP módulo Ventas — COMPLETO | 0 | — | QA PASS, Integration E2E PASS 9/9. Auth real JWT + bcrypt. Flujo: Prospect→Cliente→Oportunidad→Cotización→SalesOrder→Handoff. Routing Cobranza/Logística OK. admin@mitla.local / Mitla2026! |
| 2026-04-01 | build | Mitla ERP sprint Admin — COMPLETO | 0 | — | QA PASS, Integration E2E PASS 9/9. CRUD usuarios+roles+productos. Reset password. Soft delete. passwordHash fix aplicado. Patrón CRUD base en docs/CRUD-PATTERN.md para módulos futuros. Hallazgo menor: roles[] vacío en POST/PATCH /admin/users — pendiente. |
| 2026-04-02 | build | Mitla ERP sprint Cobranza — COMPLETO | 0 | — | QA PASS, Integration E2E PASS (3 iteraciones). 5 modelos + 4 enums. Migración 20260402145114_add_cobranza. 19 endpoints /api/v1/collections. Cron overdue nocturno. 8 pantallas frontend + API client. Fix crítico: DebtRecord se crea en createSalesOrderFromQuote, no en createSalesHandoff. GO para Logística emitido. |
| 2026-04-02 | build | Mitla ERP sprint Logística — COMPLETO | 0 | — | QA PASS, Integration E2E 13/13 pasos. Schema + migración Shipment (repair de cadena pre-existente aplicado). 8 endpoints /api/v1/logistics, 5 pantallas frontend. Flujo completo: Handoff Cobranza → Logística → Shipment RECEIVED → PREPARED → DISPATCHED → DELIVERED → COMPLETED. GO para Facturación emitido. |
| 2026-04-03 | update | agents/mitla-frontend — Playwright E2E | 0 | 16P/0F/0W | TOOLS.md creado. Regla 7 + sección E2E añadidas a AGENTS.md. Specs base creados en packages/frontend/e2e/: auth/login.spec.ts, sales/prospects.spec.ts, collections/debts.spec.ts, admin/users.spec.ts. Logística y Facturación pendientes de GO. |
