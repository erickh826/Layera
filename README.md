# Layera

Layera is a skincare ingredient-label scanner and routine companion. It uses AI for extraction and
normalization, requires human verification, and keeps ingredient mapping and conflict evaluation
deterministic.

## Repository

- `apps/mobile` — React Native + Expo application
- `packages/shared` — framework-independent types, schemas, and domain logic
- `supabase` — database migrations, local configuration, seed data, and Edge Functions
- `benchmark/vision-spike` — versioned OCR/Vision benchmark inputs and results
- `docs/adr` — architectural decision records

## Current milestone

- [Phase 1: Scan to Cabinet](docs/phase-1/PLAN.md)
- [Vision/OCR benchmark protocol](benchmark/vision-spike/README.md)

## Mobile development

```bash
cd apps/mobile
npm install
npm start
```

Run `npm run typecheck`, `npm run lint`, and `npm test` before handing off changes.

Read `AGENTS.md`, `SYSTEM_SPEC.md`, and `BUSINESS_PLAN.md` before implementation.
