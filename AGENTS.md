# AGENTS.md

# Shipaton 2026 — AI Skincare Ingredient Scanner & Diary
## Instructions for Codex and Other Coding Agents

This file defines how AI coding agents must work in this repository.

It is intentionally opinionated.

The goal is not to maximize code generation speed. The goal is to ship a small, reliable, polished iOS + Android product for Shipaton 2026 without architecture drift, unnecessary dependencies, or AI-generated product scope.

---

# 1. Source of Truth

Agents must read the repository documentation before making implementation decisions.

Priority order:

1. `AGENTS.md`
2. `docs/SHIP_PLAN.md`
3. `SYSTEM_SPEC.md`
4. `BUSINESS_PLAN.md`
5. Current milestone / task issue
6. Existing code and tests
7. Agent assumptions

If two documents conflict:

- `AGENTS.md` defines engineering behavior and non-negotiable safety, security, and deterministic-system invariants.
- `docs/SHIP_PLAN.md` defines the current execution plan and launch scope. It supersedes the older planning and v1-scope sections identified in that file, but never overrides `AGENTS.md` invariants.
- `SYSTEM_SPEC.md` defines the technical architecture baseline except where `docs/SHIP_PLAN.md` explicitly records a newer execution or v1-scope decision.
- `BUSINESS_PLAN.md` defines business positioning and monetization intent.
- The active task defines the smallest approved implementation slice and must remain consistent with the documents above.

Do not silently resolve contradictions.

If a conflict materially affects implementation:
1. identify it;
2. explain the impact;
3. propose the smallest resolution;
4. wait for a human decision if the change would alter frozen architecture, product scope, medical/safety behavior, or monetization.

---

# 2. Product Constraints

This is a Shipaton 2026 MVP built by a solo developer.

Optimize for:

- shipping;
- reliability;
- clarity;
- testability;
- App Store / Play Store readiness;
- polished core flows;
- fast iteration.

Do **not** optimize for:

- theoretical scalability;
- generalized frameworks;
- premature abstractions;
- speculative future features;
- architecture novelty;
- maximum dependency count.

The core product loop is:

```text
Photo
→ Vision / OCR
→ LLM normalization
→ User Review & Edit
→ Canonicalization
→ Ingredient KB
→ Deterministic category mapping
→ Conflict engine
→ Routine result
→ RevenueCat entitlement
```

Never break this responsibility boundary without an explicit architecture decision.

---

# 3. AI Responsibility Boundary

The product deliberately separates probabilistic AI from deterministic product logic.

## AI may

- extract text from images;
- interpret OCR output;
- normalize ingredient names;
- return structured JSON;
- improve wording where explicitly requested.

## AI must not

- determine whether an ingredient combination is medically safe;
- invent ingredient categories;
- override the curated knowledge base;
- make diagnoses;
- produce treatment recommendations;
- silently convert unknown ingredients into known categories.

The invariant is:

```text
AI = perception / normalization
Human = verification
Knowledge Base = source of truth
Conflict Engine = deterministic decision
UI = explanation
```

If an implementation violates this invariant, stop and redesign it.

---

# 4. Frozen v1 Technical Direction

Use the stack defined in `SYSTEM_SPEC.md`.

Expected baseline:

- React Native
- Expo
- TypeScript
- Expo Router
- Expo Development Build
- EAS
- NativeWind and/or React Native `StyleSheet`
- Reanimated where animation adds real UX value
- Supabase
- Postgres
- Supabase Edge Functions
- RevenueCat
- Sentry
- PostHog or Firebase Analytics
- Vision/OCR provider selected by benchmark
- structured LLM output
- deterministic ingredient knowledge / conflict engine

Do not replace major stack components unless explicitly approved.

Examples of architecture changes requiring approval:

- React Native → Flutter
- Supabase → Firebase
- Expo Router → another navigation framework
- deterministic rules → LLM conflict reasoning
- RevenueCat → custom subscription backend
- managed Expo → fully bare React Native

---

# 5. React Native Principles

These principles are mandatory unless an implementation-specific reason is documented.

## 5.1 Prefer React Native primitives

Prefer:

- `View`
- `Text`
- `Pressable`
- `ScrollView`
- `FlatList`
- `SectionList`
- `TextInput`
- `Image`

Avoid web mental models.

Do not use DOM assumptions, CSS-only browser techniques, or web-specific layout behavior in shared mobile code.

---

## 5.2 Prefer simple component composition

A component should have one clear responsibility.

Prefer:

```text
Screen
├── Feature component
├── Feature component
└── Shared primitive
```

Avoid:

```text
Screen
└── 800-line component containing:
    networking
    business logic
    analytics
    mutation logic
    animations
    validation
    modal state
    navigation
```

Screens should orchestrate.

Business logic belongs in:
- services;
- hooks;
- domain modules;
- pure functions.

---

## 5.3 Keep domain logic outside UI

Never implement ingredient classification or conflict rules directly inside React components.

Good:

```text
src/domain/ingredients/
src/domain/conflicts/
src/services/
src/features/
```

Bad:

```tsx
if (ingredient === "Retinol" && other === "Glycolic Acid") {
  ...
}
```

inside a screen component.

The conflict engine must remain independently unit-testable.

---

## 5.4 TypeScript must be strict

Prefer:
- explicit domain types;
- discriminated unions;
- schema validation at system boundaries;
- `unknown` over `any`.

Avoid `any` unless interacting with an unavoidable third-party API edge, and isolate it.

External inputs are untrusted:
- LLM output;
- Supabase responses;
- RevenueCat payloads;
- deep links;
- route params;
- user edits.

Validate them.

---

## 5.5 Use schema validation at boundaries

Use a validation library such as Zod where appropriate.

Examples:
- LLM structured output;
- Edge Function request/response;
- configuration;
- imported JSON benchmark data.

Do not assume that “structured output” means “cannot fail.”

---

## 5.6 State should live as close as possible to where it is used

Use local React state for local UI state.

Examples:
- modal open/closed;
- selected tab;
- draft input;
- local animation state.

Do not introduce global state for data that only one screen needs.

Global state is justified only for truly cross-cutting state such as:
- authenticated user/session;
- entitlement state;
- app-level onboarding state.

Prefer server state to remain in the server/cache layer rather than duplicating it in a global client store.

---

## 5.7 Do not overuse `useEffect`

`useEffect` is for synchronization with external systems.

Do not use `useEffect` for:
- derived values;
- simple transformations;
- state that can be calculated during render;
- chaining local state updates.

Prefer:
- pure functions;
- derived variables;
- memoization only when it is useful.

---

## 5.8 Memoization is not a default

Do not mechanically add:
- `useMemo`;
- `useCallback`;
- `React.memo`.

Use them when:
- profiling shows value;
- referential stability matters for a dependency;
- expensive computation is repeated.

Readable code is preferred over speculative micro-optimization.

---

## 5.9 Lists must use list components

For potentially long or growing collections, use:
- `FlatList`;
- `SectionList`.

Do not render large dynamic lists with:

```tsx
items.map(...)
```

inside a `ScrollView`.

Pay attention to:
- stable keys;
- item layout;
- render item identity;
- pagination when needed.

For v1, optimize only where the dataset can realistically grow.

---

## 5.10 Avoid unnecessary re-renders

Prefer:
- stable domain IDs;
- localized state;
- small components;
- pure derived data.

Do not put large mutable objects into context unless necessary.

If performance is unclear, profile before rewriting.

---

# 6. Expo Principles

## 6.1 Use Expo-first APIs

Prefer Expo-supported APIs before introducing a native dependency.

Examples:
- camera;
- image picker;
- file access;
- secure storage;
- notifications where needed.

Use a native module only when:
- required functionality is unavailable in Expo;
- measurable quality is materially better;
- the dependency is justified by the product.

---

## 6.2 This app uses Development Builds

Do not assume Expo Go is the production runtime.

Native dependencies such as:
- RevenueCat;
- ML Kit, if selected;
- other native integrations

must be tested in an Expo Development Build.

---

## 6.3 Keep native configuration reproducible

Any native configuration must be expressible through:
- app config;
- Expo config plugins;
- checked-in configuration.

Avoid undocumented manual Xcode / Android Studio changes.

If a manual native step is unavoidable, document it immediately.

---

## 6.4 EAS is part of Definition of Done

A feature that works only in local development is not complete if it breaks EAS builds.

Before release milestones, verify:
- development build;
- preview build where used;
- production build.

---

# 7. Navigation Principles

Use Expo Router.

Routes should represent user workflows clearly.

Recommended shape:

```text
app/
├── _layout.tsx
├── index.tsx
├── onboarding/
├── scan/
├── review/
├── cabinet/
├── routine/
├── result/
└── settings/
```

Do not encode large business objects in route params.

Pass stable IDs whenever possible and load the authoritative data through the appropriate data layer.

---

# 8. Styling and Design Principles

The product should feel:
- calm;
- polished;
- evidence-oriented;
- modern;
- non-clinical;
- non-alarmist.

Avoid:
- aggressive red “danger” UI for ordinary cautions;
- excessive gradients;
- random animation;
- dense scientific text on first view;
- inconsistent spacing.

Use a small design token system for:
- spacing;
- radius;
- typography;
- semantic colors.

Do not scatter arbitrary values across components.

---

# 9. Animation Principles

Animation should communicate state, not decorate every screen.

Good uses:
- scan processing;
- result reveal;
- card insertion/removal;
- paywall transition;
- routine scheduling confirmation.

Avoid:
- long blocking animations;
- excessive motion;
- animation that delays action;
- non-essential animation on every component.

Respect reduced-motion preferences where practical.

---

# 10. Performance Principles

Performance matters, but do not optimize imaginary problems.

Priority:

1. interaction responsiveness;
2. scan flow reliability;
3. list scrolling;
4. image memory usage;
5. startup;
6. animation smoothness.

For images:
- resize/compress before Vision API upload where quality allows;
- do not retain unnecessary full-resolution images in memory;
- avoid repeated base64 conversions when a file URI is sufficient.

For network:
- avoid duplicate requests;
- use request cancellation when useful;
- expose loading/error states;
- retry only when safe.

---

# 11. Accessibility Principles

All important actions must be usable with accessibility services.

At minimum:
- meaningful accessibility labels;
- sufficient touch targets;
- do not encode meaning only through color;
- readable dynamic text where practical;
- logical focus/order;
- buttons must be announced as buttons.

Accessibility is part of product quality, not a post-launch feature.

---

# 12. Forms and User Input

User edits are authoritative after confirmation.

Never silently overwrite a user's reviewed ingredient list with a later model response.

Review & Edit must support:
- edit;
- add;
- delete;
- confirm.

If save fails:
- preserve the current draft;
- show a recoverable error;
- do not force the user to scan again.

---

# 13. Data and Supabase Principles

Use Postgres relational modeling where relationships matter.

Do not collapse relationships into JSON or UUID arrays merely for convenience when the data needs:
- ordering;
- per-item state;
- joins;
- future queryability.

Examples:
- `routine_products` is a junction table.

Every user-owned table must have RLS.

Agents implementing DB changes must include:
1. migration;
2. indexes if justified;
3. RLS policies;
4. rollback/recovery consideration;
5. corresponding TypeScript types or generation workflow.

---

# 14. Security Principles

Never expose:
- OpenAI keys;
- Gemini keys;
- Supabase service-role keys;
- RevenueCat secret keys;
- signing credentials.

Provider calls requiring secrets must run server-side.

Client environment variables must contain only public-safe values.

Do not log:
- authorization headers;
- tokens;
- secrets;
- full sensitive payloads unnecessarily.

---

# 15. Ingredient Knowledge Base Principles

The knowledge base must distinguish:

```text
canonical INCI
↕
aliases
↕
common names / OCR variants
```

Aliases should include a type where useful:

```text
inci_synonym
common_name
ocr_variant
```

Unknown ingredients remain unknown.

Do not ask an LLM to invent a canonical mapping when deterministic lookup fails.

A future review workflow may add new aliases, but that is outside the automatic v1 path.

---

# 16. Late Category Binding

This is a hard invariant.

Never persist a final category before human confirmation.

Correct:

```text
Scan
→ Draft INCI
→ Human edit
→ Confirm
→ Canonicalize
→ Category mapping
→ Save
```

Incorrect:

```text
Scan
→ Category mapping
→ Human edit
→ Save old categories
```

Any code path that can produce stale categories is a bug.

---

# 17. Conflict Engine Principles

The conflict engine must be:

- deterministic;
- pure where possible;
- symmetric for unordered category pairs;
- independently testable;
- free from network dependence during evaluation.

Same input + same rule set = same output.

No AI calls from the conflict engine.

No “100% safe” output.

---

# 18. RevenueCat Principles

RevenueCat is the entitlement source of truth.

Do not gate Pro only using local booleans.

Requirements:
- restore purchases;
- entitlement refresh;
- graceful offline/network state;
- store-configured pricing;
- no hard-coded price strings.

The first full conflict analysis is free in v1.

Primary paywall occurs after value has been demonstrated.

---

# 19. Analytics Principles

A feature is not complete if the critical funnel cannot be measured.

For relevant flows, add analytics alongside implementation.

Core funnel:

```text
onboarding_completed
→ scan_completed
→ review_confirmed
→ product_saved
→ routine_created
→ first_free_analysis_completed
→ paywall_viewed
→ purchase_completed
```

Do not collect data merely because it is available.

Track events that answer product questions.

---

# 20. Testing Principles

Testing priority:

1. deterministic business logic;
2. canonicalization;
3. alias matching;
4. conflict rules;
5. entitlement gating;
6. critical integration flows;
7. UI details.

Avoid spending disproportionate time snapshot-testing static presentation.

Required tests for core logic include:
- exact canonical match;
- alias match;
- case normalization;
- unknown ingredient;
- duplicate ingredients;
- duplicate categories;
- symmetric conflict pair;
- no-conflict case;
- stale category prevention after editing.

---

# 21. Vision Benchmark Rules

Do not select Vision/OCR based on preference.

Use the benchmark.

Metrics:
- Recall;
- Precision;
- Critical Active Recall;
- Exact Product Accuracy;
- median latency;
- P95 latency;
- failure rate;
- rough cost.

Accuracy and critical-active recall have priority over small latency differences.

Keep the benchmark dataset versioned.

Do not tune against the test set in a way that invalidates comparison.

---

# 22. Dependency Policy

Before adding a dependency, ask:

1. Can React Native / Expo already do this?
2. Is the dependency actively maintained?
3. Does it support the current Expo / React Native version?
4. Does it add native configuration?
5. Does it materially reduce implementation risk?
6. Is the functionality worth the maintenance cost?

Avoid installing a package for trivial helpers.

Record meaningful dependency decisions.

---

# 23. Vercel / External Agent Skills

External coding skills may be used to improve implementation quality, but they do not override this repository's specification.

If Vercel React / React Native / performance best-practice skills are available in the agent environment:

1. load the relevant skill before implementing React/React Native architecture or performance-sensitive UI;
2. use it as a review checklist;
3. apply recommendations that are compatible with Expo and React Native;
4. ignore web-only guidance that assumes DOM, Next.js, browser CSS, Server Components, or web routing;
5. never let a generic React skill override mobile constraints or the frozen stack.

Important:

**React best practices are not automatically React Native best practices.**

Any recommendation involving:
- DOM APIs;
- HTML;
- CSS layout assumptions;
- Next.js;
- React Server Components;
- browser-only caching;
- web image components

must be translated to the React Native / Expo equivalent or rejected.

If the exact skill is unavailable, continue using the principles in this file rather than blocking implementation.

---

# 24. Agent Collaboration Protocol

Multiple agents may work on this repository.

Agents must minimize overlap.

Before editing:
1. inspect the current repository;
2. inspect recent changes;
3. identify files relevant to the task;
4. avoid touching unrelated files.

Prefer narrowly scoped commits / patches.

Do not reformat the entire repository during a feature task.

Do not rename folders or reorganize architecture unless required.

---

# 25. Task Execution Protocol

For any non-trivial task:

## Step 1 — Read

Read:
- `AGENTS.md`;
- relevant sections of `SYSTEM_SPEC.md`;
- relevant sections of `BUSINESS_PLAN.md`;
- existing implementation;
- existing tests.

## Step 2 — Plan

State:
- what will change;
- what will not change;
- files expected to change;
- risks / assumptions.

Keep the plan short.

## Step 3 — Implement

Make the smallest coherent change.

Do not bundle unrelated improvements.

## Step 4 — Verify

Run the narrowest relevant:
- type checks;
- lint;
- tests;
- build checks.

Then run broader checks when the task impacts shared infrastructure.

## Step 5 — Report

Summarize:
- what changed;
- tests run;
- unresolved issues;
- any deliberate deviation from spec.

---

# 26. Do Not “Helpfully” Expand Scope

Agents must not spontaneously add:

- social login if not required;
- push notifications;
- onboarding carousels beyond current need;
- dark mode solely because it is common;
- elaborate settings;
- localization;
- offline sync;
- product recommendations;
- chat assistant;
- image history;
- custom analytics dashboards;
- custom design system packages.

A good agent leaves unrequested features unbuilt.

---

# 27. Error Handling Philosophy

Errors should be:
- visible;
- recoverable;
- actionable;
- non-destructive.

Examples:

Bad:

> Something went wrong.

Better:

> We couldn't read enough ingredients from this photo. Try taking another photo with the label flat and well lit.

Never destroy user-reviewed data because a network request failed.

---

# 28. Logging and Observability

Log enough to diagnose:
- scan pipeline stage;
- provider failure;
- schema-validation failure;
- backend error;
- purchase error.

Do not log secrets.

Use Sentry for actionable production errors.

Attach safe metadata such as:
- app version;
- platform;
- pipeline variant;
- error category.

---

# 29. Definition of Done

A task is not done when code compiles.

For a product feature, Definition of Done normally includes:

- implementation;
- TypeScript correctness;
- relevant tests;
- loading state;
- empty state where applicable;
- error state;
- analytics event where applicable;
- accessibility basics;
- no spec violation;
- no leaked secret;
- working on supported mobile targets.

For Phase 1 specifically:

> On a real phone, scan a skincare product that has not been hard-coded, obtain a draft INCI list, edit it, confirm it, canonicalize it, deterministically map known active ingredients, and save it to Cabinet without manually modifying the database.

---

# 30. Architectural Decision Records

If an agent proposes a meaningful architectural deviation, create an ADR under:

```text
docs/adr/
```

Suggested format:

```text
# ADR-XXX: Decision title

## Context
What problem are we solving?

## Decision
What are we changing?

## Alternatives
What else was considered?

## Consequences
Benefits, trade-offs, migration cost.

## Status
Proposed / Accepted / Rejected
```

Do not merge architecture drift into ordinary feature work.

---

# 31. Code Review Checklist

Before considering work complete, check:

### Product
- Does this serve the current milestone?
- Did I accidentally add scope?
- Does it preserve the first-value-before-paywall experience?

### React Native
- Is business logic outside the UI?
- Is state local where possible?
- Are lists implemented appropriately?
- Are effects actually necessary?
- Did I accidentally use web assumptions?

### Data
- Is user data protected by RLS?
- Are relationships modeled correctly?
- Can user edits be lost?

### AI
- Is output validated?
- Is AI used only within its permitted responsibility?
- Can unknown data remain unknown?

### Safety
- Did I introduce medical certainty language?
- Did I bypass human verification?
- Did I allow stale category binding?

### Monetization
- Is RevenueCat the entitlement source of truth?
- Are prices store-configured?
- Does restore purchase still work?

### Quality
- Are important errors recoverable?
- Are relevant tests present?
- Did I run verification commands?

---

# 32. Final Rule

When uncertain, prefer:

```text
smaller scope
+ deterministic behavior
+ explicit state
+ testable business logic
+ React Native / Expo conventions
+ shipping on time
```

over:

```text
more abstraction
+ more AI
+ more dependencies
+ more features
+ clever architecture
```

This repository is being built to ship.
