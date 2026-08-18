# CODEX_HANDOFF.md

# Layera — Codex Project Handoff

## 1. Project

**Name:** Layera
**Competition:** RevenueCat Shipaton 2026
**Product:** AI skincare ingredient scanner + deterministic routine guidance
**Developer model:** Solo developer with coding-agent assistance
**Current date:** 2026-08-18
**Primary objective:** Ship a real downloadable competition entry before the Shipaton deadline, while preserving a small but defensible product differentiator.

---

# 2. Read These Files First

Before changing code, read in this order:

1. `AGENTS.md`
2. `SHIP_PLAN.md`
3. `SYSTEM_SPEC.md`
4. `BUSINESS_PLAN.md`
5. relevant ADRs under `docs/adr/`

Priority:

```text
AGENTS.md
→ engineering behavior

SHIP_PLAN.md
→ current execution plan and latest scope decisions

SYSTEM_SPEC.md
→ architecture and technical invariants

BUSINESS_PLAN.md
→ product positioning and monetization intent
```

When older documents conflict with `SHIP_PLAN.md`, prefer the latest explicit decision in `SHIP_PLAN.md`, unless that would violate an invariant in `AGENTS.md`.

Do not silently resolve major contradictions.

---

# 3. Current Product Strategy

The launch product is intentionally small.

The core experience is:

```text
Photo
→ Gemini Vision extraction
→ validated INCI list
→ Review & Edit
→ Human Confirm
→ Canonicalization
→ Ingredient alias lookup
→ Ingredient Knowledge Base
→ Deterministic category mapping
→ Conflict engine
→ Result
→ Pro routine suggestion
→ RevenueCat entitlement
```

The product is not:

* a medical diagnosis tool;
* a dermatologist replacement;
* a barcode lookup app;
* a toxic/safe scoring app;
* a generalized cosmetic chemistry chatbot.

---

# 4. Core Architecture Invariants

These are frozen.

```text
AI = perception / normalization
Human = verification
Knowledge Base = source of truth
Conflict Engine = deterministic decision
UI = explanation
```

AI may:

* interpret image/OCR input;
* normalize ingredient names;
* return structured JSON.

AI must not:

* determine medical safety;
* invent final ingredient categories;
* override the KB;
* produce diagnoses;
* decide deterministic conflict outcomes.

Unknown data must remain unknown.

---

# 5. Late Category Binding

This is a hard rule.

Correct:

```text
Photo
→ Model extraction
→ Draft ingredient list
→ User edits
→ User confirms
→ Canonicalization
→ Category mapping
→ Save
```

Incorrect:

```text
Photo
→ Model category
→ User edits ingredient
→ Save stale model category
```

Any implementation that can persist stale categories is a bug.

---

# 6. Current v1.0 Scope

## Must ship

* camera scan;
* Gemini multimodal extraction;
* validated structured INCI output;
* Review & Edit;
* canonicalization;
* aliases;
* ingredient KB;
* deterministic category mapping;
* Cabinet;
* Cabinet limit;
* transient product selection;
* deterministic conflict result;
* first analysis free;
* lightweight “Fix my routine” Pro suggestion;
* RevenueCat entitlement;
* restore purchases;
* anonymous Supabase auth;
* legal disclaimer;
* Sentry;
* store-ready production build.

## Deferred

* persistent routines;
* `routines` table;
* `routine_products` table;
* reaction tracking;
* full scheduler;
* email account upgrade;
* PostHog funnel;
* extensive animation polish;
* complete bilingual UX;
* custom OCR model;
* ML Kit comparison pipeline.

---

# 7. Current Store Strategy

Run multiple low-cost store paths in parallel.

## Samsung — Primary

Current route:

```text
Samsung Personal Account
→ Private Seller
→ Commercial Seller Status
→ Galaxy Store
```

Important:

* Commercial Seller Status is required even for free Galaxy Store apps.
* Private Seller does not require company registration or D-U-N-S.
* Identity and financial verification remain external dependencies.

Primary monetization:

```text
Samsung IAP
→ RevenueCat
→ pro_access
```

Billing fallback:

```text
RevenueCat Web Purchase
→ Stripe
```

Web Purchase is a **billing fallback**, not a publishing fallback.

Galaxy Store publication still requires Samsung seller approval.

---

## Apple — Active Secondary Hedge

Apple Developer **Individual** enrollment is now treated as realistic.

Important:

* Individual enrollment does not require D-U-N-S.
* Do not let iOS-specific polish delay Samsung.
* Reuse the same React Native / Expo v1.
* If enrollment clears in time, submit early enough to preserve review/rejection buffer.

App Store category direction:

```text
Health & Fitness
```

Avoid Medical positioning.

---

## Google Play — Long-Lead Hedge

Current new personal account may be subject to:

* identity verification;
* 12 genuine testers;
* continuous 14-day closed test;
* production access review.

Do not block v1 engineering on Google Play, but start the external clock as early as practical.

---

# 8. Purchase Architecture

Store-specific behavior must stay behind the purchases layer.

Shared domain code must contain no Samsung, Apple, Stripe, or RevenueCat-specific types.

Suggested boundary:

```ts
interface PurchaseService {
  getEntitlement(): Promise<'free' | 'pro'>
  purchasePro(): Promise<void>
  restorePurchases(): Promise<void>
}
```

Domain and UI should care about:

```text
pro_access
```

not the purchase source.

---

# 9. Current Technical Stack

Use:

* React Native
* Expo
* TypeScript
* Expo Router
* Expo Development Build
* EAS
* Reanimated
* NativeWind and/or StyleSheet
* Supabase
* Postgres
* Supabase Auth
* Supabase Edge Functions
* Gemini primary AI provider
* Azure OpenAI fallback if needed
* RevenueCat
* Sentry
* npm workspaces
* Vitest for domain logic

Do not change major stack components without an ADR and explicit approval.

---

# 10. Repository Direction

Expected high-level structure:

```text
/
├── AGENTS.md
├── SHIP_PLAN.md
├── SYSTEM_SPEC.md
├── BUSINESS_PLAN.md
├── apps/
│   └── mobile/
├── packages/
│   └── shared/
├── supabase/
├── benchmark/
│   └── vision-acceptance/
├── docs/
│   └── adr/
└── skills/
    └── layera-shipaton/
```

Use a lightweight monorepo.

Do not introduce a large monorepo framework unless clearly needed.

---

# 11. React Native Engineering Principles

Prefer React Native / Expo conventions.

Do not blindly apply Web / Next.js practices.

Important rules:

* use React Native primitives;
* keep business logic outside screens;
* keep state local where possible;
* avoid unnecessary `useEffect`;
* do not mechanically add memoization;
* use `FlatList` / `SectionList` for growing lists;
* validate external data;
* prefer strict TypeScript;
* preserve user-edited drafts on errors;
* keep native config reproducible;
* verify Development Builds, not only Expo Go.

If a Vercel or React best-practice skill is available:

* load it when useful;
* translate web advice to React Native;
* reject DOM/Next.js-specific guidance that does not apply.

---

# 12. Ingredient Data Principles

Canonical ingredient identity must remain language-neutral.

Internal truth:

```text
Canonical INCI
```

Aliases may include:

* INCI synonyms;
* common English names;
* Traditional Chinese names;
* OCR variants.

Suggested alias metadata:

```text
alias_name
alias_type
locale
ingredient_id
```

Examples:

```text
Salicylic Acid
水楊酸        zh-Hant common_name
```

Unknown ingredients stay unknown.

---

# 13. Knowledge Base Strategy

Do not cut the KB under schedule pressure.

It is part of the product differentiator.

Prefer a smaller defensible KB over a large weak KB.

Current rough target:

* ~6–8 useful categories;
* ~25–40 canonical ingredients;
* multilingual aliases where useful;
* ~5–10 defensible conflict/caution rules.

Conflict rules require evidence.

Principle:

> A rule that cannot be sourced should not ship.

Community advice is discovery material, not authoritative evidence.

---

# 14. Vision Strategy

The original 20-image ML Kit vs multimodal benchmark is no longer the current plan.

Current direction:

```text
Photo
→ Gemini multimodal
→ structured INCI JSON
```

Use a reduced **Vision Acceptance Set** rather than building two full pipelines.

Prefer approximately 8–12 diverse samples if feasible.

Include:

* curved labels;
* reflective packaging;
* small text;
* English;
* Traditional Chinese + English;
* multilingual packaging;
* critical actives.

Human Review & Edit remains mandatory regardless of extraction accuracy.

Document this deviation in an ADR.

---

# 15. Language Strategy

Current architecture should support:

* English;
* Traditional Chinese.

But full bilingual polish is not a Phase 1 blocker.

Priority:

```text
multilingual package input support
>
complete bilingual UI
```

Do not let localization expand the launch scope.

Keep user-facing strings localization-ready.

---

# 16. Safety / Copy Principles

Avoid:

* toxic;
* dangerous;
* guaranteed;
* safe;
* unsafe;
* will cause;
* medically approved.

Prefer:

* may increase irritation;
* known caution;
* some users may prefer to alternate;
* informational purposes only;
* consider patch testing.

No result may imply that absence of a known rule means guaranteed safety.

---

# 17. Current External Account Status

As of the latest handoff:

Ready / created:

* Apple Developer account;
* Samsung Developer account;
* Samsung Seller Portal account.

Samsung Private Seller / Commercial Seller processing is a major external track.

Development environment setup is now the immediate engineering focus.

---

# 18. Immediate Engineering Focus

Do not start by building visual polish.

Current order:

```text
1. Mac development environment
2. Git repository
3. npm workspaces
4. Expo mobile app health check
5. iOS Simulator health check
6. Android device/build health check
7. Supabase project + local/project config
8. anonymous auth
9. core DB migrations + RLS
10. Gemini extraction interface
11. canonicalization / KB domain tests
12. Review & Edit vertical slice
```

---

# 19. Local Development Environment

Primary development machine:

```text
MacBook M3
```

Expected tools:

* Homebrew
* Git
* Node LTS
* npm
* Watchman
* Xcode
* iOS Simulator
* Android Studio
* Android SDK
* adb
* Java 17
* CocoaPods where required
* EAS CLI
* Supabase CLI
* GitHub CLI
* Docker only if local Supabase is used

Do not install global legacy `expo-cli`.

Use:

```bash
npx expo
```

---

# 20. Multi-Agent Rules

Multiple agents may work on this repository.

Before editing:

1. inspect `git status`;
2. read the relevant docs;
3. inspect existing implementation;
4. identify the exact task boundary;
5. avoid unrelated files.

Do not:

* reformat the whole repo;
* reorganize folders without reason;
* upgrade major dependencies opportunistically;
* rewrite another agent’s work unless required;
* invent missing product decisions.

Use narrow branches / commits where practical.

---

# 21. Architecture Changes

Any meaningful deviation should be documented under:

```text
docs/adr/
```

Use an ADR for:

* changing AI provider architecture;
* adding/removing native OCR;
* changing store/purchase strategy;
* changing auth model;
* reintroducing routine persistence;
* replacing Supabase;
* changing routing/navigation;
* introducing major state-management infrastructure.

Do not create ADRs for trivial implementation details.

---

# 22. Current Definition of Success

The launch app does not need many features.

It must prove:

```text
Take photo
→ extract ingredient list
→ user verifies it
→ deterministic canonicalization
→ save product
→ select products
→ defensible conflict result
→ useful Pro suggestion
→ valid RevenueCat entitlement
→ downloadable store release
```

Everything else is secondary.

---

# 23. Working Philosophy

When choosing between two implementations, prefer:

```text
smaller
more deterministic
more testable
less native complexity
less external dependency
more shippable
```

Do not optimize for agent cleverness.

Optimize for shipping a real product.

---

# 24. First Codex Task

Before writing feature code:

1. read all project documents;
2. inspect the repo;
3. inspect the current Mac/toolchain state if shell access is available;
4. compare actual repo state against this handoff;
5. propose only the smallest environment/bootstrap steps required to reach a healthy Expo + iOS + Android + workspace baseline;
6. do not implement product features until the baseline is verified.

Report:

* current state;
* missing tools/config;
* proposed commands;
* risks;
* what you will do next.

Do not change architecture during this task.
