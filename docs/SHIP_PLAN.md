# SHIP_PLAN.md

# Layera — Shipaton 2026 Decision Record

**Dated:** 2026-08-16
**Revision:** v4 — three-store redundancy (see §15)
**Status:** Frozen for execution
**Supersedes for v1 execution:**
- `SYSTEM_SPEC.md` §5 (Vision Spike pipeline selection), §8.2–8.3 (persistent routine tables), and §17 (milestones).
- `BUSINESS_PLAN.md` §15–16 where they imply persistent routines, a full scheduler, or a 20-image A/B benchmark, and §20 (execution plan).

**Leaves unchanged:** all safety, AI-responsibility, determinism, security, and RLS invariants in `AGENTS.md`.

**Current-scope consequences:**
- Vision uses one Gemini multimodal pipeline and an 8–12 image acceptance set; ML Kit A/B is deferred.
- v1 uses transient product selection; it does not create `routines` or `routine_products` tables.
- “Fix my routine” renders a lightweight rule-backed suggestion; it is not a persistent scheduler.

---

## 1. Context

Solo developer building an AI skincare ingredient-label scanner for RevenueCat Shipaton 2026.

| Input | Value |
|---|---|
| Today | 2026-08-16 |
| Competition window | 2026-08-01 → 2026-09-30, 11:45 PM Pacific |
| Days remaining | 45 |
| Developer capacity | ~15h/week ≈ 96h remaining |
| Hardware | MacBook M3, Mac mini (Intel), **iPhone 14**, Pixel 6, one other Android; Galaxy device borrowable |
| Real skincare products owned | ~4 |
| Packaging languages expected | English and Traditional Chinese |
| Objective priority | Ship early / traction first, monetization second, design third |

### Account status — updated
| Track | Status |
|---|---|
| **Apple Developer (Individual)** | ✅ **Applied** |
| **Samsung Developer + Seller Portal** | ✅ **Applied** |
| Samsung Commercial Seller (Private Seller) | ⏳ Verify this was selected; complete financial verification |
| Google Play identity verification | ⏳ Address proof still to resubmit |
| 12 Play testers | ⏳ Recruitment not started |
| Supabase / RevenueCat / Stripe | ⏳ Not created |

---

## 2. Repo ground state (verified 2026-08-16)

| # | Finding |
|---|---|
| F1 | Phase 1's planned window (8/13–8/17) nearly elapsed with **0 of 5 gates complete**. |
| F2 | **Not a git repository.** |
| F3 | **No root `package.json` / workspace config** — `packages/shared` is unimportable. |
| F4 | **No frozen-stack dependencies installed.** |
| F5 | Benchmark has **0 of 20 images**; `ground_truth.json` is `[]`. |
| F6 | Product surface is **one static screen** plus `src/theme/tokens.ts`. |

---

## 2.1 Development environment — verified 2026-08-17

| Tool | Version | Note |
|---|---|---|
| macOS | 14.8.5, arm64 (M3), 211 GB free | ✓ |
| git | 2.50.1 | ✓ |
| node / npm | 20.19.6 / 10.8.2 | nvm-managed; npm workspaces supported |
| java | **openjdk 17.0.20** | Temurin 26 is also installed and would otherwise win. `JAVA_HOME` pinned to `openjdk@17` in `~/.zshrc` — **Android Gradle does not support JDK 26.** |
| adb / Android SDK | 1.0.41 | `ANDROID_HOME` set to `~/Library/Android/sdk` |
| Xcode | 26.6, iOS SDK 26.5 | Selected at `/Applications/Xcode.app` |
| CocoaPods | 1.17.0 | Needs a UTF-8 locale; `LANG`/`LC_ALL` set in `~/.zshrc` |
| eas-cli | 22.0.0 | Satisfies `eas.json` `>= 16.0.0` |
| supabase | 2.114.0 | Installed as a direct binary in `~/.local/bin`, bypassing the stale Command Line Tools |
| gh | 2.97.0 | ✓ |
| watchman | 2026.07.27 | Metro file watching |
| Docker | 28.0.4 | Daemon not running — only needed if local Supabase is used |

Project checks pass: `typecheck` clean, `lint` clean, `vitest` runs (no tests yet), `node_modules`
installed.

### Environment items still open

1. **EAS project is not linked.** No `projectId` in `apps/mobile/app.json`. Requires `eas login`
   (developer credentials) then `eas init`. **Blocks every cloud build, including the Aug 31 Play
   closed-test build.**
2. **iOS simulator runtimes not downloaded.** `simctl` lists no devices. Not blocking — the physical
   iPhone 14 works — but needed for simulator testing.
3. **Command Line Tools are 15.3.0 (Feb 2024).** Now cosmetic since full Xcode is selected, but it is
   what blocked `brew install supabase`. Update via Software Update when convenient.
4. **Local Supabase vs hosted.** Docker is installed but not running. Recommendation: **develop
   against the hosted Supabase project and skip local**, one less moving part for a solo developer on
   a deadline. Decision not yet confirmed.

### Build-queue risk

EAS free tier uses a **low-priority shared queue**; builds "frequently grow to an hour or more" at
peak. September is Shipaton's peak, with thousands of entrants building against the same deadline,
and the build pipeline sits on the critical path in exactly that week.

Mitigations, both now available: **local Android builds** (JDK 17 + Android SDK are configured, so
`expo run:android` works without touching the queue), and **~$19 for one month of EAS Starter** for
high-priority queue access around the submission window. Take both.

---

## 3. Verified external facts

| # | Fact | Consequence |
|---|---|---|
| F7 | App must be **live and downloadable** by Sep 30. "Submissions still in review cannot win." | Real deadline is review completion. |
| F8 | Eligibility: RevenueCat SDK powering **an in-app or web purchase, or RevenueCat Ads**. | Store billing not required for eligibility. |
| F9 | Play personal accounts (post-2023-11-13) need **≥12 testers × 14 continuous days** before production access. | Rigid ~3-week gate. |
| F11 | **Own/duplicate accounts don't count as testers.** Real people, real devices, repeated use. | Needs 12 actual humans. |
| F12 | Prior Play closure was **inactivity**, not termination. | New account is clean. |
| F13 | **Samsung Galaxy Store is eligible, new to Shipaton this year.** RevenueCat supports Samsung IAP natively (RN SDK ≥10.3.0 + Galaxy Store add-on). No tester gate. IAP testing needs a **physical Galaxy device**. | Primary store. |
| F15 | **Samsung Commercial Seller Status is required to publish free apps too.** | Web purchase is a **billing** fallback, not a **publishing** fallback. |
| **F16** | **New in v4.** Commercial Seller splits into **Private Seller** and **Corporate Seller**. Private Seller needs personal ID, financial details, and name consistency — **no company registration, no D-U-N-S.** D-U-N-S and the associated ~10-business-day verification apply to the corporate path only. | Samsung drops from *possible corporate bottleneck* to *identity + financial verification lead time*. Materially more achievable. |
| **F17** | **New in v4, corrects F10.** Apple **Individual** enrollment requires **no D-U-N-S**, costs $99, and Apple's own documentation describes it as immediate upon verification and payment, with confirmation within 24 hours. D-U-N-S, notarized documents, and extended verification apply to **Organization** ($299) only. The 2–7 week reports cited in v1–v3 are the **tail** — weighted toward Organization enrollments and flagged identity checks — not the median for an individual using their own legal name and card. | **iOS is not "effectively unreachable." It has the shortest pre-publication gate of the three stores.** |

---

## 4. Store strategy

```text
Samsung Private Seller  →  PRIMARY
Apple Individual        →  ACTIVE SECONDARY
Google Play Closed Test →  LONG-LEAD HEDGE
```

### 4.1 Gate comparison — why redundancy is worth having

| Store | Pre-publication gate | Then | Character of risk |
|---|---|---|---|
| **Samsung** | Commercial Seller (Private) — days to ~3 weeks, opaque | Review 2–5 business days | Waiting on an opaque queue |
| **Apple** | Enrollment only — ~24–48h for Individual | Review: 2–5 days baseline, +September peak, +health-adjacent scrutiny, rejection restarts queue | Review latency you partly control through submission quality |
| **Play** | 12 real testers × 14 continuous days + production access | Review ~days | Rigid, unshortenable, needs 12 humans |

**No single store should carry the submission.** All three approval tracks run in parallel because
approvals are admin, not engineering, and therefore nearly free.

### 4.2 Monetization paths (unchanged)

| Path | Mechanism | Role |
|---|---|---|
| A — primary | Store IAP via RevenueCat | Plan of record |
| B — billing fallback | RevenueCat Web Purchase / Stripe | If IAP integration becomes a schedule risk |

Path B still does **not** solve publishing. Every store gate above applies regardless.

---

## 5. The tension this revision must resolve

The v3 review proposes Apple submission by **Sep 8–10** to preserve rejection buffer. The engineering
schedule has the paywall and result screens landing **Sep 7–13**. Both cannot be true.

**Resolution — separate the cheap redundancy from the expensive redundancy.**

| Layer | Cost | Decision |
|---|---|---|
| **Approval tracks** | Admin only, ~zero engineering | **Run all three in parallel. Already done for two.** |
| **Engineering** | One shared Expo codebase | **One track. Zero platform-specific work, zero platform-specific features.** |
| **Store submission** | ~6–8h per additional store (store assets, IAP products, screenshots, privacy labels, review management) | **Commit to one primary submission. Add the second only if hours survive or the primary stalls.** |

Redundancy in approvals is free. Redundancy in *submissions* is not — and the binding constraint on
this project has never been store approvals. It is the ~15h/week.

**Honest arithmetic:**

```text
56h  happy-path implementation
+15h integration, debug, store friction
────
71h  one store
+8h  second store submission
────
79h  two stores
```

Available before a Sep 12–14 submission: **~60h.** Two stores puts the gap at roughly **19h ≈ 2.5–3
days of leave**, or a deep cut. One store puts it at ~11h ≈ 1.5–2 days. Choose deliberately at §12.

---

## 6. Priority order

### P0 — external lead times (approvals; admin, not code)
1. ✅ Apple Developer Individual — applied
2. ✅ Samsung Developer + Seller Portal — applied
3. **Confirm Samsung Commercial Seller was submitted as _Private Seller_**, and complete ID +
   financial verification. Name must match exactly across Samsung account, Seller Portal profile, and
   PayPal/bank holder. **Record submission date and case number; track daily.**
4. Google Play identity verification — resubmit the correct address proof
5. **Begin recruiting 12 genuine testers**
6. Create Stripe, RevenueCat, Supabase accounts
7. Confirm the borrowed Galaxy device for the week of Sep 7

### P1 — eligibility-critical engineering
Git + workspace → Supabase schema + RLS → anonymous auth → Gemini extraction → Review & Edit →
canonicalization/aliases → ingredient KB → deterministic conflict engine → RevenueCat entitlement.

### P2 — launch experience
Cabinet UI → transient selection → conflict result → lightweight "Fix my routine" → disclaimer →
Sentry → store assets.

### P3 — after v1 is live
Persistent routines → email linking → PostHog → animation → more rules → bilingual UX polish.

---

## 7. Hard dates

| Date | Event |
|---|---|
| **Aug 16** | All P0 approval tracks initiated ✅ (Apple, Samsung done) |
| **~Aug 31** | Minimally usable build on a Play **closed track**, 12 testers opted in. Later than this and Play is unusable as a fallback. |
| **Sep 6** | Store decision point (§12) |
| **Sep 12–14** | Submit to the primary store |
| **Sep 30, 11:45 PM PT** | Hard floor — app must be **live** |

---

## 8. Schedule

### Aug 17–23 — Foundation and knowledge base (~15h)
- `git init`, first commit, `.gitignore` (`dist/`, `.expo/`, `node_modules/`).
- Root `package.json` with npm workspaces so `packages/shared` is importable. Add Supabase client,
  Zod, camera, RevenueCat.
- First migration: `ingredient_knowledge`, `ingredient_aliases` (**with `lang`**), `products`,
  `conflict_rules`, indexes, RLS owner-only policies. **No routine tables.**
- Anonymous auth end to end.
- Seed the knowledge base — developer-authored content.

**Gate:** local DB reset succeeds; RLS proves one user cannot read another's products.

### Aug 24–30 — Extraction and conflict engine (~15h)
- `normalize-inci` Edge Function: Gemini multimodal, Zod validation, timeout, safe logging.
- Run the **Vision Acceptance Set** (§10). Write `results/decision.md` and the ADR.
- Canonicalization, alias lookup, unknown handling — pure functions in `packages/shared`.
- Conflict engine + full unit suite.

**Gate:** all domain tests pass with no network; no model response can supply a category.

### Aug 31–Sep 6 — Scan flow, and the Play clock starts (~15h)
- Scan, processing, Review & Edit, Cabinet routes; full recoverable-error set.
- **Push to a Play closed track at the START of this week. 12 testers opted in.**

**Gate:** a real device scans an unseen label and saves it to Cabinet with no manual DB edits.
**Gate:** Play closed test running with 12 testers by Aug 31.

### Sep 7–13 — Result, paywall, store assets (~15h)
- Transient selection → conflict result UI, soft language, no "safe" claim.
- Lightweight "Fix my routine" (§10), Pro-gated.
- RevenueCat behind `PurchaseService` (§11), `pro_access`, restore purchases, offline handling.
- Onboarding, disclaimer, Sentry, store listing, screenshots, production build.

**Gate:** a real purchase completes and restores.

### Sep 12–14 — Submit to the primary store

### Sep 18–30 — Live: update, film, submit (~25h)
v1.1 full scheduler, routine persistence, email linking · v1.2 PostHog, more rules, polish · demo
video · Devpost well before the cutoff.

---

## 9. Apple positioning — free risk reduction

If iOS is activated, category is **Health & Fitness**, never Medical. The product provides an
ingredient scanner, a personal Cabinet, routine organization, and non-diagnostic caution messages. It
provides no diagnosis, treatment, disease prediction, clinical decision support, or medical-device
function.

Metadata, App Store description, UI copy, and disclaimer must all say the same thing.

```text
Avoid:  dangerous ingredients · medical diagnosis · safe / unsafe · will cause irritation
Prefer: may increase irritation · known caution · routine guidance
        informational purposes only · consider patch testing
```

This costs nothing and it is already what `SYSTEM_SPEC.md` §11.2 requires. Consistency across store
metadata is the new part.

---

## 10. Knowledge base, vision, and "Fix my routine"

### Content volume
Reduce content, never architecture. Keep tables, aliases, deterministic mapping, tests.

```text
Prefer:  6 categories · 25 well-curated ingredients · 5 defensible rules
Over:   10 categories · 40 ingredients · 10 weak or folklore-based rules
```

### Sourcing
Authoritative: published dermatology literature, official brand usage instructions.
Discovery only: community consensus — it says which pairs to research, never what the rule says.
**`source_note TEXT NOT NULL`. A rule that cannot be sourced does not ship.**

### Bilingual alias model
Canonical INCI is the language-neutral internal truth; aliases carry a `lang` tag.

| canonical | alias | lang | alias_type |
|---|---|---|---|
| Salicylic Acid | 水楊酸 | zh-Hant | common_name |
| Ascorbic Acid | Vitamin C | en | common_name |
| Ascorbic Acid | 維他命 C | zh-Hant | common_name |

Priority: multilingual **input** support > bilingual UX.

### Vision plan
Single pipeline: photo → Gemini multimodal → validated structured INCI JSON. No ML Kit, no A/B.

**8–12 image Vision Acceptance Set** covering flat labels, curved bottles, reflective packaging,
small text, tubes, **English**, **Traditional Chinese + English**, **multilingual Asian packaging**,
and products containing critical actives. Measure recall, precision, Critical Active Recall, failure
cases, latency. **Write an ADR** for the reduced protocol.

### "Fix my routine" — v1.0
Renders the existing rule payload. No calendar engine, no persistence, no optimization.

```text
Retinoid + AHA
Caution:  Using both in the same routine may increase irritation for some users.
Pro:      Consider alternating these products on different evenings.
          Tonight   AHA
          Tomorrow  Retinoid
```

---

## 11. Store abstraction (mandatory)

No Samsung-, Apple-, or Stripe-specific types in domain logic. `packages/shared` contains zero store,
billing, or RevenueCat types.

```ts
interface PurchaseService {
  getEntitlement(): Promise<'free' | 'pro'>
  purchasePro(): Promise<void>
  restorePurchases(): Promise<void>
}
```

Adapters: Samsung/RevenueCat · Apple/RevenueCat · Web/Stripe. UI and domain care only about
`pro_access`. **This is what makes a second store cost 8 hours instead of 30.**

---

## 12. Decision point — September 6

Assess which approvals are in hand, then choose **one** primary submission target:

- **Samsung approved** → primary. Submit Sep 12–14.
- **Samsung stalled, Apple approved** → Apple primary. Pull submission as early as the build allows;
  Apple's review math (September peak + health-adjacent) needs more buffer than Samsung's.
- **Both approved and hours survive** → submit to both from the same EAS build. Costs ~8h; fund it
  from the cut ladder, not from the reserve.
- **Neither approved** → Play status becomes decisive; check testers and days elapsed.

**Second store is submitted only if the primary stalls, is rejected, or hours genuinely survive.**

---

## 13. Cut ladder

**Cut in this order:** animation polish → extra onboarding screens → PostHog → bilingual polish
beyond the data layer → Cabinet visual enhancements → number of KB entries and rules.

**Never cut:** RevenueCat eligibility · Review & Edit · canonicalization · deterministic mapping ·
core KB · conflict engine · restore purchases · RLS and security · basic error recovery.

---

## 14. Risk order

1. External account / seller approval
2. Store review / rejection
3. RevenueCat / billing integration
4. Core scan vertical slice
5. Product polish
6. Additional features

The structural change from the original plan: **store and account work runs from day one in parallel
with coding, rather than as a final phase.**

---

## 15. Review log

### Fourth revision — three-store redundancy
**Corrections:** F17 replaces F10 — Apple Individual needs no D-U-N-S and is documented as effectively
immediate; the multi-week reports were the tail, mostly Organization enrollments. F16 — Samsung
Commercial Seller has a **Private Seller** path needing no company and no D-U-N-S. Both of my earlier
"effectively unreachable" framings were too pessimistic, and iOS was dropped partly on the weaker one.

**Changes:** iOS restored from *cut* to *active secondary*; three-store gate comparison added (§4.1);
Apple positioned as Health & Fitness with consistent metadata (§9); Samsung Private Seller path made
explicit in P0; §5 added to resolve the Apple-submits-Sep-8 vs engineering-lands-Sep-13 conflict by
separating free approval redundancy from costly submission redundancy.

**Not accepted as stated:** "run all three in parallel" applies to *approvals*, not *submissions*.
Three simultaneous store submissions would add ~16h to a budget already ~11h short. Approvals are
free; store assets, IAP configuration, and review management are not.

### Third revision
Samsung seller status gates publishing of free apps too (F15), so web purchase is billing-only
fallback; Play promoted to active hedge with an Aug 31 clock start; Vision Acceptance Set expanded to
include Traditional Chinese and multilingual packaging; `lang` on aliases; realistic budget restated;
cut ladder added.

### Second revision
Corrected an IAP-only reading of eligibility (F8); required store abstraction; kept KB and conflict
engine while cutting routine persistence from v1.0; kept lightweight "Fix my routine" at launch.

---

## 16. Final principle

> **Eligibility first, vertical slice second, product differentiation third, polish fourth.**
> Do not bet the competition on one store — but do not pay for the same app twice either.

```text
AI = perception / normalization
Human = verification
KB = source of truth
Conflict Engine = deterministic decision
```

The launch version must prove exactly this and nothing more:

```text
Photograph a real skincare label → extract ingredients → user verifies them
→ map confirmed ingredients deterministically → save the product → select products
→ detect a defensible caution → show a calm explanation → offer a useful Pro suggestion
→ complete a valid RevenueCat purchase → publish a downloadable competition entry
```

---

## 17. Sources

- [Shipaton 2026 rules (Devpost)](https://revenuecat-shipaton-2026.devpost.com/rules)
- [Shipaton 2026 FAQ](https://www.shipaton.com/faq)
- [Apple Developer: program enrollment](https://developer.apple.com/help/account/membership/program-enrollment/) — Individual vs Organization, D-U-N-S scope
- [Apple Developer: compare memberships](https://developer.apple.com/support/compare-memberships/)
- [Play Console: testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [Play: everything about the 12 testers requirement](https://support.google.com/googleplay/android-developer/community-guide/255621488/everything-about-the-12-testers-requirement?hl=en)
- [Play: closure of inactive developer accounts](https://support.google.com/googleplay/android-developer/answer/11605267?hl=en)
- [RevenueCat React Native installation](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- [Samsung: supported IAP management platforms](https://developer.samsung.com/iap/supported-management-platforms.html)
- [Samsung: get started in Galaxy Store](https://developer.samsung.com/galaxy-store/prepare.html)
- [Samsung Galaxy Store FAQ](https://developer.samsung.com/galaxy-store/faq.html)
