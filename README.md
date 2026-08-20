# Layera

Layera is a skincare ingredient-label scanner and routine companion. It uses AI for extraction and normalization, requires human verification, and keeps ingredient mapping and conflict evaluation deterministic.

## Repository

- `apps/mobile` — React Native + Expo application
- `packages/shared` — framework-independent types, schemas, and deterministic domain logic
- `supabase` — database migrations, local configuration, seed data, and Edge Functions
- `benchmark/vision-acceptance` — current Gemini multimodal acceptance protocol and results
- `benchmark/vision-spike` — archived ML Kit-versus-multimodal proposal
- `docs/adr` — architectural decision records
- `docs/tasks` — bounded active and archived implementation tasks

## Current execution

- [Ship plan](docs/SHIP_PLAN.md)
- [Active workspace task](docs/tasks/active/TASK-01-workspace-setup.md)
- [Vision acceptance protocol](benchmark/vision-acceptance/README.md)
- [Vision pipeline ADR](docs/adr/ADR-001-gemini-vision-acceptance.md)

The older [Phase 1 plan](docs/phase-1/PLAN.md) and [Vision spike](benchmark/vision-spike/README.md) are retained as historical records and must not override the current ship plan.

## Mobile development during workspace bootstrap

Until TASK-01 establishes the root npm workspace:

```bash
cd apps/mobile
npm install
npm start
```

Available mobile checks:

```bash
npm run typecheck
npm run lint
npm test
```

After TASK-01 is completed, root workspace commands documented by that task become authoritative.

Before non-trivial work, read `AGENTS.md`, `docs/SHIP_PLAN.md`, the relevant specification sections, ADRs, and the active task.
