---
name: implement-layera-mobile
description: Implement, test, debug, and review Layera React Native, Expo, Supabase, Gemini extraction, deterministic ingredient-domain, RevenueCat, and store-delivery changes. Use for Layera coding tasks and PRs; pair with govern-layera-evidence when a change alters INCI aliases, knowledge-base facts, conflict rules, health-adjacent copy, privacy disclosures, or store claims.
---

# Implement Layera Mobile

## Establish authority

Read before non-trivial work, in this order:

1. `AGENTS.md`
2. `docs/SHIP_PLAN.md`
3. relevant sections of `SYSTEM_SPEC.md`
4. relevant sections of `BUSINESS_PLAN.md`
5. relevant `docs/adr/*`
6. the active task, existing code, and tests

Also load `layera-shipaton`. Treat this skill as an implementation overlay only. Never let it override the repository sources above.

Treat `docs/CODEX_HANDOFF.md` as planning memory, not an execution plan.

## Preserve the decision boundary

Maintain this pipeline:

```text
Photo
→ Supabase Edge Function
→ Gemini multimodal extraction
→ validated draft INCI data
→ human Review & Edit
→ confirmed INCI data
→ canonicalization and alias lookup
→ curated KB categories
→ deterministic conflict engine
→ calm UI explanation
```

Enforce these invariants:

- Use AI only for perception and normalization.
- Treat human-confirmed ingredients as authoritative for that product.
- Bind categories only after confirmation; never reuse stale pre-edit categories.
- Keep unmatched ingredients unknown.
- Keep conflict evaluation deterministic, pure where practical, and independent of network or AI calls.
- Never invent an alias, category, rule, or health conclusion.

## Stay inside v1

Implement only the active slice of scan, extraction, validation, Review & Edit, canonicalization, aliases, KB lookup, Cabinet, transient product selection, conflict results, first-free analysis, lightweight Pro guidance, purchases, restore, anonymous auth, disclaimer, Sentry, or store delivery.

Do not introduce persistent routines, a reaction diary, a full scheduler, barcode lookup, ML Kit, custom OCR, SQLite product storage, Firebase auth, medical AI, elaborate analytics, or a large design system unless a newer approved decision and ADR explicitly authorize it.

## Route evidence-sensitive work

Load `govern-layera-evidence` before changing any of the following:

- canonical INCI identity or aliases;
- ingredient KB facts or categories;
- conflict rules, severity, warning text, or suggestions;
- health-adjacent onboarding, disclaimer, result, or marketing copy;
- image-processing privacy disclosures;
- Samsung, Apple, Google Play, or RevenueCat factual claims.

Implement only an implementation-ready evidence record or an explicit human-approved decision. If neither exists, prepare the technical boundary or schema without inventing content, then report the evidence blocker.

## Execute the task

1. Inspect repository and Git state, including recent merged changes.
2. Read the governing documents and relevant implementation.
3. State the smallest coherent plan, files, non-goals, and material assumptions.
4. Preserve user drafts and recoverable states on failures.
5. Validate every external boundary with strict TypeScript and schemas where appropriate.
6. Keep screens orchestration-focused and domain decisions in testable modules.
7. Prefer React Native and Expo primitives; reject DOM, Next.js, and browser-only assumptions.
8. Add no dependency unless Expo or existing code cannot reasonably provide the capability.
9. Run the narrowest relevant checks, then broader checks only when shared infrastructure changed.
10. Report changes, checks, device-only verification still required, and unresolved risks.

## Apply test effort proportionally

Use test-first development for deterministic domain behavior and bug regressions, especially canonicalization, alias matching, unknown handling, late category binding, conflict symmetry, and entitlement gating.

For Expo configuration and native integrations, combine automated checks with Development Build and physical-device acceptance. Do not claim Samsung IAP, RevenueCat purchase/restore, camera, or store behavior is verified from Expo Go or unit tests alone.

## Protect data and secrets

- Keep provider and service-role secrets server-side.
- Use Supabase anonymous auth and RLS for user-owned records.
- Resize or compress images before upload where quality permits.
- Disclose server-assisted image processing before the first scan.
- Minimize image transfer and retention; do not persist label photos by default without an approved purpose and disclosure.
- Avoid logging images, confirmed ingredient payloads, tokens, authorization headers, or secrets unnecessarily.

## Isolate purchases

Keep Samsung, Apple, Stripe, and RevenueCat SDK types behind the purchase adapter. Expose product-level access through `pro_access` and the store-agnostic purchase domain. Support restore and recoverable offline/network states. Never hard-code store prices.

## Stop for a decision

Stop and request approval before changing frozen architecture, v1 scope, auth model, store strategy, medical/safety behavior, monetization semantics, or evidence-backed production content. Propose the smallest resolution and an ADR when required.

## Handoff

Report:

```text
Scope completed:
Files changed:
Evidence record used (or not applicable):
Checks run and results:
Development Build / device checks still required:
Deliberate non-goals:
Risks or decisions needed:
```

Read `references/NOTICE.md` when redistributing or substantially adapting this skill.
