# Phase 1 plan — Scan to Cabinet

**Milestone:** Phase 1 vertical slice  
**Target window:** August 13–17, 2026  
**Status:** Planned  
**Source of truth:** `AGENTS.md`, then `SYSTEM_SPEC.md`, then `BUSINESS_PLAN.md`

## Outcome

On a real iOS or Android device, a user can photograph a skincare ingredient label that was not
hard-coded, receive a structured draft ingredient list, edit/add/delete entries, confirm it,
canonicalize known names and aliases, map known active categories deterministically, and save the
product to Cabinet without manually changing the database.

Phase 1 is complete only when this works through an Expo Development Build against Supabase.

## Current baseline

- Expo Router, strict TypeScript, Development Build, EAS, lint, and Vitest are initialized.
- Supabase local configuration exists, but there are no migrations or implemented functions.
- Shared types, schemas, and domain directories are placeholders.
- The mobile app has one static starter screen.
- The benchmark dataset and result directories are empty.

## In scope

1. A versioned 20-label Vision/OCR benchmark and a documented comparison method.
2. Selection of Pipeline A or B from measured results:
   - A: ML Kit OCR, then LLM normalization.
   - B: multimodal LLM returning structured extraction.
3. A validated extraction contract containing nullable brand/name and a non-empty INCI list.
4. Minimal Supabase Auth, schema, storage policy if needed by the selected pipeline, and RLS.
5. Ingredient knowledge, aliases, products, and deterministic post-confirmation canonicalization.
6. Mobile capture/import, processing, Review & Edit, confirm/save, and Cabinet display.
7. Recoverable states for permission denial, cancellation, timeout, malformed/empty extraction,
   offline/backend failure, and save failure.
8. Tests for extraction validation, exact/alias/case/unknown matching, deduplication, and stale
   category prevention after edits.
9. Phase 1 analytics call sites for `scan_started`, `scan_completed`, `scan_failed`,
   `review_confirmed`, and `product_saved`.

## Out of scope

- Routine creation, conflict evaluation, and scheduling.
- RevenueCat, quotas, paywalls, and entitlement logic.
- Production analytics and crash-reporting provider setup.
- Full onboarding polish, social login, barcode lookup, recommendations, history, or reminders.
- Automatically extending the ingredient knowledge base from model output.
- Medical conclusions or compatibility guidance.

## Responsibility boundary

The implementation must preserve this order:

```text
Photo
→ selected Vision/OCR pipeline
→ validated draft extraction
→ user review and edits
→ final confirmed INCI list
→ deterministic canonicalization and alias lookup
→ deterministic category mapping
→ product save
→ Cabinet
```

No category may be accepted from an AI response or persisted before confirmation. Unknown
ingredients remain in the saved INCI list and remain uncategorized.

## Spec tensions requiring explicit treatment

Two milestone details conflict with cross-cutting requirements:

1. Onboarding/legal UX is listed in Phase 3, while `SYSTEM_SPEC.md` requires disclaimer
   acknowledgement before the first scan.
   - Smallest safe resolution: include a minimal acknowledgement gate in Phase 1 and defer polished
     onboarding to Phase 3.
2. Analytics provider setup is listed in Phase 3, while `AGENTS.md` requires relevant funnel events
   alongside feature implementation.
   - Smallest resolution: add typed event call sites behind a provider-neutral interface in Phase 1;
     connect PostHog or Firebase in Phase 3.

These resolutions do not change the frozen architecture, but the product owner should confirm them
before their implementation.

## Working decisions

- Use Supabase anonymous authentication for the Phase 1 device flow unless account onboarding is
  explicitly required. This keeps user-owned rows protected by RLS without adding social/email UX.
- Keep provider-specific AI code inside the `normalize-inci` Edge Function and behind an interface.
- Keep canonicalization as pure shared TypeScript logic. The database remains the source of
  canonical ingredients and aliases.
- Save only user-confirmed ingredient text. Recompute categories from that final list in the same
  save operation; never reuse categories from an earlier draft.
- Use the benchmark—not preference or implementation convenience—to select Vision/OCR.

## Execution sequence

### 1. Contracts and local data foundation — August 13

- Add the shared extraction schema, domain types, and benchmark input/result schemas.
- Create the first Supabase migration:
  - `ingredient_knowledge`
  - `ingredient_aliases`
  - `products`
  - required indexes and constraints
  - RLS and owner-only product policies
- Seed a small curated active/alias set sufficient to validate deterministic mapping.
- Document environment variables, local Supabase startup, and secret boundaries.

Gate: local database reset succeeds; RLS tests prove one user cannot read or mutate another user's
products.

### 2. Vision benchmark and provider selection — August 13–14

- Collect and label 20 real package photos following the benchmark protocol.
- Implement both candidate pipelines with the same validated output contract.
- Run each candidate against the unchanged holdout split.
- Record recall, precision, critical-active recall, exact-product accuracy, median/P95 latency,
  failure rate, estimated cost, and observed failure modes.
- Record the selected pipeline and evidence in the benchmark results. Use an ADR only if selection
  requires changing the frozen stack.

Gate: a winner is selected from reproducible results, or the milestone is explicitly blocked because
neither candidate is reliable enough.

### 3. Normalization and deterministic mapping — August 14–15

- Implement `normalize-inci` with request/response validation, timeout handling, and safe logs.
- Implement pure normalization, exact lookup, alias lookup, unknown handling, and category
  deduplication.
- Add tests for exact match, alias match, case normalization, unknown ingredients, duplicate
  ingredients, duplicate categories, malformed extraction, and empty extraction.

Gate: the model response cannot supply categories, and all domain tests pass without network access.

### 4. Mobile scan and review flow — August 15–16

- Add routes for scan, processing, review, and Cabinet.
- Capture or select an image using Expo-first APIs; resize/compress before remote upload where the
  selected pipeline permits it.
- Preserve the draft across recoverable errors.
- Support edit, add, delete, and confirm with accessible controls and clear verification copy.
- Add loading, empty, cancellation, permission-denied, timeout, and retry states.

Gate: a real Development Build reaches Review & Edit from a real package image.

### 5. Confirm, save, and device acceptance — August 16–17

- Treat the final edited list as authoritative.
- Canonicalize and map only after confirmation, then save through an owner-protected path.
- Show the saved product and confirmed ingredient list in Cabinet.
- Verify save retry does not erase edits or require another scan.
- Run the full acceptance checklist on at least one real iOS or Android device, then repeat the
  critical path on the other platform before release work begins.

Gate: the Phase 1 outcome at the top of this document is demonstrated without manual database edits.

## Expected implementation areas

- `apps/mobile/app/scan/`
- `apps/mobile/app/review/`
- `apps/mobile/app/cabinet/`
- `apps/mobile/src/features/scan/`
- `apps/mobile/src/features/review/`
- `apps/mobile/src/services/`
- `packages/shared/types/`
- `packages/shared/schemas/`
- `packages/shared/domain/ingredients/`
- `supabase/migrations/`
- `supabase/functions/normalize-inci/`
- `supabase/seed.sql`
- `benchmark/vision-spike/`

Exact filenames should follow the smallest coherent implementation and should not introduce a global
state library.

## Verification

Automated:

- strict TypeScript
- ESLint
- shared-domain unit tests
- Edge Function schema and error-path tests
- local database reset and RLS verification
- integration test for extraction → review edits → confirmation → canonicalization → save
- EAS Development Build configuration check

Manual, on device:

- camera permission allowed and denied
- scan cancellation
- curved, reflective, and small-text labels
- edit/add/delete ingredient
- unknown ingredient preserved
- failed save followed by successful retry with draft intact
- confirmed product visible after app restart
- no category created before confirmation
- no secret or sensitive payload exposed in client logs

## Inputs and blockers

- The developer must provide 20 consented real label photos and verified ground truth.
- A Supabase project and public client credentials are required; service-role credentials remain
  server-side only.
- Candidate AI provider keys must be configured as Edge Function secrets, never mobile environment
  variables.
- Pipeline A requires validation in an Expo Development Build because ML Kit is native.
- Provider selection cannot be finalized before benchmark results exist.

## Stop conditions

Stop and ask for a decision if:

- benchmark evidence does not identify an acceptable pipeline;
- implementing the selected pipeline requires replacing a frozen stack component;
- proposed copy makes a medical, diagnosis, treatment, “safe,” or “toxic” claim;
- a save path can bind stale categories or bypass human confirmation;
- RLS cannot guarantee owner-only access.
