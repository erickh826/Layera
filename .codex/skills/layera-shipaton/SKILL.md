# Layera Shipaton Project Skill

## Purpose

Use this skill when working on the **Layera** React Native / Expo app for RevenueCat Shipaton 2026.

This skill exists to prevent architecture drift, scope expansion, and repeated rediscovery of project decisions.

---

## Required Reading

Before non-trivial work, read:

1. `/AGENTS.md`
2. `/SHIP_PLAN.md`
3. `/SYSTEM_SPEC.md`
4. `/BUSINESS_PLAN.md`
5. relevant `/docs/adr/*`

Newest explicit project decisions override older planning details, but never silently override safety or deterministic-system invariants.

---

## Product Goal

Ship a small, downloadable skincare app that:

```text
scans a real ingredient label
→ lets the user verify the result
→ canonicalizes confirmed INCI names
→ maps them through a curated KB
→ runs deterministic conflict rules
→ gives calm routine guidance
→ monetizes through RevenueCat
```

---

## Hard Invariants

```text
AI = perception / normalization
Human = verification
KB = source of truth
Conflict Engine = deterministic decision
```

Never use an LLM as the final medical or conflict decision maker.

Never classify an edited ingredient using stale pre-edit categories.

Unknown ingredients remain unknown.

---

## v1 Scope

Build:

* scan;
* Gemini extraction;
* structured validation;
* Review & Edit;
* canonicalization;
* aliases;
* KB;
* deterministic categories;
* Cabinet;
* transient product selection;
* conflict result;
* first free analysis;
* lightweight Pro “Fix my routine” suggestion;
* RevenueCat;
* restore;
* anonymous auth;
* disclaimer;
* Sentry.

Do not build unless explicitly requested:

* persistent routines;
* reaction diary;
* full scheduler;
* social/community;
* barcode lookup;
* Firebase auth;
* ML Kit pipeline;
* custom OCR;
* generalized medical AI;
* elaborate analytics;
* large design-system work.

---

## Stack

Use:

* React Native;
* Expo;
* TypeScript;
* Expo Router;
* Development Builds;
* EAS;
* Supabase;
* Postgres;
* Supabase Edge Functions;
* Gemini primary;
* RevenueCat;
* Sentry;
* npm workspaces;
* Vitest.

Do not replace major stack components without an ADR and approval.

---

## React Native Rules

* Prefer React Native primitives.
* Do not use web/DOM assumptions.
* Screens orchestrate; domain modules decide.
* Keep state local unless truly cross-cutting.
* Avoid unnecessary `useEffect`.
* Avoid speculative memoization.
* Use strict TypeScript.
* Validate all external inputs.
* Preserve user drafts on failure.
* Use list primitives for growing collections.
* Test native integrations in Development Builds.
* Keep native configuration reproducible.

If external React/Vercel skills are available, use them only where compatible with React Native / Expo.

---

## Store Strategy

Primary:

* Samsung Galaxy Store;
* Private Seller Commercial Seller route.

Secondary:

* Apple Individual account;
* same shared React Native v1.

Long-lead hedge:

* Google Play closed test.

Purchase domain must be store-agnostic.

Use `pro_access` as the product-level entitlement.

---

## Ingredient Rules

Canonical identity:

* standard INCI name.

Aliases may include:

* INCI synonym;
* English common name;
* Traditional Chinese common name;
* OCR variant.

Do not let translated display names become domain identity.

Conflict rules should be evidence-backed.

A rule without a credible source does not ship.

---

## Vision

Current v1 direction:

```text
Photo
→ Gemini multimodal
→ structured INCI JSON
→ human review
```

Do not rebuild the old ML Kit A/B experiment unless explicitly requested.

Use a small diverse acceptance set and record limitations.

---

## Safety Language

Do not say:

* safe;
* dangerous;
* toxic;
* guaranteed;
* will cause.

Prefer:

* may;
* caution;
* some users;
* consider alternating;
* patch test;
* informational purposes only.

---

## Agent Workflow

Before editing:

1. inspect repo;
2. inspect git state;
3. read relevant docs;
4. state a short plan;
5. make the smallest coherent change;
6. run relevant checks;
7. report changes and unresolved risks.

Do not:

* reformat unrelated code;
* add unrequested features;
* change architecture silently;
* add dependencies without need;
* mix store SDK types into domain code.

---

## Current Focus

Immediate priority is **developer environment and repository bootstrap**, not feature expansion.

Target healthy baseline:

```text
Mac toolchain
→ Git repo
→ npm workspace
→ Expo app
→ iOS simulator
→ Android build/device
→ Supabase
→ EAS
```

Only then proceed to product vertical slice.

---

## Decision Rule

When uncertain, prefer:

```text
less scope
+ deterministic behavior
+ fewer dependencies
+ React Native conventions
+ testability
+ shipping
```

over:

```text
more features
+ more AI
+ more abstraction
+ more native complexity
```
