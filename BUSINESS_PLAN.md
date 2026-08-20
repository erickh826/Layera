# BUSINESS_PLAN.md

# Shipaton 2026 — AI Skincare Ingredient Scanner & Diary
## Business Plan — MVP / Competition Edition

> **Execution note:** This document preserves product positioning and monetization intent. `docs/SHIP_PLAN.md` is authoritative for the current v1 execution scope, dates, store strategy, Gemini acceptance protocol, and the decision to defer persistent routines and the full scheduler.

---

## 1. Executive Summary

The product is a consumer skincare mobile app that helps users understand what is actually written on their skincare packaging and build lower-friction AM/PM routines.

Its core differentiation is not “AI tells you whether a product is good or bad.”

Instead, the product is built around three principles:

1. **Read the real ingredient label** rather than trusting stale barcode databases.
2. **Avoid fear-based “toxic vs safe” scoring.**
3. **Use deterministic, curated rules for ingredient-combination guidance rather than LLM hallucinations.**

The initial user journey is intentionally short:

```text
Scan a product
→ verify ingredients
→ save to Cabinet
→ combine products into a routine
→ see a conflict / caution result
→ receive an alternative schedule
```

The first conflict analysis is free. Repeated analysis and advanced routine assistance are monetized through RevenueCat Pro.

---

## 2. Problem

Skincare consumers often own multiple products containing strong actives such as:
- retinoids;
- AHA;
- BHA;
- vitamin C;
- niacinamide;
- benzoyl peroxide.

Users commonly face three problems.

### 2.1 Ingredient data may be stale

Barcode-based apps generally identify a product record, not the current physical formulation printed on the user's package.

If a manufacturer changes formulation while preserving the same product identifier, database-driven analysis may not reflect the bottle in the user's hand.

### 2.2 Existing products can encourage fear-based interpretation

Many ingredient apps reduce complex formulation questions to:
- green / red;
- clean / dirty;
- safe / toxic.

The product rejects this framing.

### 2.3 Users struggle with product combinations

The higher-value question is often not:

> “Is this ingredient bad?”

It is:

> “Can I reasonably use these three products in the same routine, or should I alternate them?”

That is the commercial wedge.

---

## 3. Product Positioning

### Positioning statement

> A skincare routine companion that reads the ingredient list you actually own, lets you verify it, and gives calm, deterministic guidance about potentially irritating active combinations.

### What the product is

- ingredient-label scanner;
- personal skincare Cabinet;
- AM/PM routine planner;
- deterministic active-combination warning engine;
- routine scheduling assistant.

### What it is not

- medical device;
- dermatologist replacement;
- diagnosis tool;
- toxic-ingredient ranking app;
- barcode lookup app;
- beauty social network.

---

## 4. Target Customer

### Primary segment

Skincare-active users who:
- use 3+ skincare products;
- buy products from multiple brands;
- use retinol, acids, vitamin C, acne products, or exfoliants;
- search online before combining products;
- value a simple answer at the moment of routine planning.

### Secondary segment

Users who:
- are new to active skincare;
- have purchased several products but do not know how to schedule them;
- are overwhelmed by conflicting advice across TikTok, Reddit, YouTube, blogs, and brand pages.

### Early adopter profile

The strongest early adopter is likely:

> someone who already owns multiple actives and has experienced uncertainty or irritation from stacking them.

This user has both:
- an immediate pain point;
- a clear reason to pay for repeated routine checks.

---

## 5. Jobs To Be Done

### Functional

- “Read this ingredient label for me.”
- “Help me verify what is actually in this product.”
- “Keep my skincare products organized.”
- “Tell me whether my planned routine contains a known caution.”
- “Suggest a simpler AM/PM split.”

### Emotional

- reduce uncertainty;
- reduce information overload;
- avoid fear-based skincare content;
- feel more confident using products already purchased.

### Convenience

- avoid manually searching every ingredient;
- avoid comparing multiple websites;
- avoid remembering every active interaction.

---

## 6. Core Value Proposition

### Aha Moment 1 — Scan

User photographs a real ingredient label and receives a structured, editable INCI list.

### Aha Moment 2 — Combine

User selects several products and receives a calm, understandable caution where relevant.

### Aha Moment 3 — Fix it for me

The app suggests an alternative schedule, for example:

```text
AM
Vitamin C

PM — Day 1
BHA

PM — Day 2
Retinoid

PM — Day 3
Recovery
```

This third moment is the strongest monetization opportunity.

---

## 7. Competitive Differentiation

Based on the competition analysis prepared for this project, skincare ingredient analysis is a competitive category, with products such as Think Dirty, SkinSAFE, Yuka, INCI Beauty, Hwahae, and others occupying adjacent positions.

The proposed product differentiates through:

### 7.1 Physical-label-first input

The user scans the INCI list printed on the package rather than relying primarily on a barcode lookup.

### 7.2 Human verified extraction

The user confirms the ingredient list before it becomes the source for later analysis.

### 7.3 Deterministic conflict engine

LLMs are not used as the final source of skincare compatibility decisions.

### 7.4 Calm language

The product avoids exaggerated “danger” and “toxic” framing.

### 7.5 Routine-level utility

The product is not only a static ingredient dictionary. Its higher-value feature is deciding how to schedule products the user already owns.

---

## 8. Business Model

### Free

Recommended MVP free tier:
- up to 3 scans per day;
- up to 10 products in Cabinet;
- basic ingredient list;
- first full conflict analysis free.

### Pro

Initial pricing hypothesis:
- USD 4.99 / month;
- USD 29.99 / year.

Pro includes:
- unlimited scans;
- unlimited Cabinet;
- unlimited conflict analysis;
- smart routine scheduling;
- future personalized trigger tracking.

### Why subscription is defensible

The recurring value is not the initial scan.

Recurring value comes from:
- adding products;
- changing routines;
- checking combinations;
- planning weekly usage;
- tracking future reactions.

The product therefore needs to evolve from “scanner” into “routine assistant.”

---

## 9. Paywall Strategy

Avoid placing the first paywall before the user experiences the core value.

Recommended funnel:

```text
Install
→ Scan
→ Review
→ Save product
→ Create routine
→ First full conflict result
→ Aha Moment
→ Next analysis triggers Pro
```

Primary paywall message:

> You’ve used your free routine check. Upgrade to Pro for unlimited conflict checks and smart routine scheduling.

Secondary paywall triggers:
- 11th Cabinet item;
- scan quota exceeded.

The paywall should emphasize:
- ongoing routine protection;
- time saved;
- confidence;
- scheduling assistance.

It should not use fear as a conversion tactic.

---

## 10. Shipaton Strategy

According to the project’s competition research, the app is especially suited to competing on:
- monetization strategy;
- product design;
- user activation and growth.

### HAMM-oriented narrative

The strongest monetization story is:

> The user receives the first meaningful analysis for free, understands the value, and then converts when they want repeated protection and scheduling.

This demonstrates:
- activation;
- product value;
- entitlement gating;
- recurring utility.

### Design-oriented narrative

The app can also compete visually through:
- polished camera flow;
- elegant Review & Edit;
- calm warning banners;
- satisfying routine scheduling interaction;
- high-quality paywall transition.

### Grand Prize narrative

Grand-prize potential depends less on technical sophistication than on:
- shipping early;
- acquisition;
- activation;
- retention;
- visible growth.

Therefore the product should be released as early as practical rather than using the entire competition period for development.

---

## 11. Go-To-Market

### 11.1 Build in public

Document:
- first prototype;
- OCR benchmark;
- ingredient-label failures;
- before/after UI;
- RevenueCat integration;
- App Store submission;
- user reactions.

Content angle:

> “I’m building a skincare app that refuses to label ingredients as toxic.”

This is clearer and more differentiated than:

> “I built an AI skincare scanner.”

### 11.2 Short-form demo content

Potential demo hooks:
- “Can these two products be used together?”
- “Your barcode may not tell you the formula on your bottle.”
- “I scanned my bathroom shelf and built an AM/PM routine.”
- “I made AI read the label — but I don’t let AI decide what is medically true.”

### 11.3 Communities

Potential organic channels:
- skincare communities;
- beauty creator communities;
- indie app / build-in-public communities;
- product-hunt-style launch audiences;
- Reddit communities where promotion is allowed;
- Threads / X;
- TikTok / Instagram Reels.

Community rules must be respected; avoid spam.

---

## 12. Activation Metrics

Primary activation definition:

> User scans at least two products and completes one routine analysis.

This is stronger than defining activation as “opened the app” or “completed one scan.”

Track:

- install → onboarding completion;
- onboarding → first scan;
- scan → product saved;
- product saved → second product;
- second product → routine;
- routine → first analysis;
- first analysis → paywall;
- paywall → purchase.

---

## 13. MVP KPIs

### Acquisition
- installs;
- store page conversion;
- source / campaign.

### Activation
- first scan completion rate;
- Review & Edit confirmation rate;
- second product save rate;
- first routine-analysis completion rate.

### Product quality
- scan success rate;
- ingredient recall benchmark;
- critical-active recall;
- scan retry rate;
- crash-free sessions.

### Monetization
- paywall view rate;
- purchase conversion;
- annual vs monthly mix;
- trial conversion if trial is used;
- revenue per activated user.

### Retention
- D1;
- D7;
- weekly routine-analysis frequency;
- products added per active user.

---

## 14. Unit Economics to Observe

Initial costs:
- vision / LLM inference;
- Supabase;
- analytics;
- storage;
- Apple / Google developer costs;
- optional design / marketing tools.

Key metric:

```text
AI cost per activated user
```

and later:

```text
AI cost per paying user
```

The scan pipeline should not be optimized for minimum API cost before product-market evidence exists.

Accuracy and activation matter more in the competition phase.

---

## 15. Product Roadmap

### v1 — Shipaton

Must:
- scan;
- normalize;
- Review & Edit;
- Cabinet;
- deterministic category binding;
- routine builder;
- conflict rules;
- first free analysis;
- RevenueCat Pro;
- legal UX;
- analytics;
- store-ready polish.

### v1.1 — Post-launch

Potential:
- richer ingredient cards;
- more conflict rules;
- saved routine templates;
- better onboarding;
- reminder notifications;
- user feedback loop.

### v1.2+

Potential only if validated:
- symptom logs;
- trigger correlation;
- routine history;
- ingredient evidence references;
- dermatologist export;
- personalized scheduling.

Do not build these before the MVP funnel is proven.

---

## 16. Risk Analysis

### Risk 1 — OCR / Vision errors

Mitigation:
- benchmark 20 real labels;
- optimize for Critical Active Recall;
- human review before classification.

### Risk 2 — Incorrect health interpretation

Mitigation:
- deterministic curated rule engine;
- soft language;
- no medical diagnosis;
- explicit disclaimer;
- unknown ingredients remain unknown.

### Risk 3 — Low conversion

Mitigation:
- allow first full analysis free;
- trigger paywall only after user understands value;
- measure full activation funnel.

### Risk 4 — Scope creep

Mitigation:
- frozen v1 scope;
- milestone-based implementation;
- no social/community/barcode/custom-model work.

### Risk 5 — App Store review delay

Mitigation:
- production submission well before final competition deadline;
- maintain rejection buffer;
- avoid medical-device claims.

### Risk 6 — Weak retention

Mitigation:
- position the product around recurring routine planning, not one-time scanning.

---

## 17. Moat Hypothesis

The MVP itself does not yet have a strong defensible moat.

Potential future moat comes from:

1. curated ingredient canonicalization and aliases;
2. high-quality deterministic rule library;
3. real-world OCR correction pairs;
4. verified user routine data;
5. aggregate behavioral data about how users combine products;
6. increasingly personalized routine assistance.

The business should not claim a moat before this data and knowledge layer actually exist.

---

## 18. Brand and UX Principles

Tone:
- calm;
- evidence-oriented;
- non-judgmental;
- not clinical;
- not fear-based;
- not overly pink-coded.

Avoid:
- alarmist red error states for normal cautions;
- “toxic” language;
- overwhelming ingredient science on the first screen.

Prefer:
- clear hierarchy;
- short explanations;
- optional deeper detail;
- soft caution colors;
- polished scan and routine transitions.

---

## 19. 2-Minute Demo Narrative

Suggested sequence:

### 0:00–0:15 — Problem

“I own several active skincare products, but I don’t want another app that simply labels ingredients safe or toxic.”

### 0:15–0:40 — Scan

Photograph the real product label.

Show:
- processing;
- normalized ingredient list;
- Review & Edit.

### 0:40–1:05 — Cabinet

Confirm and save.

Select several real products.

### 1:05–1:30 — Conflict moment

Run first free analysis.

Show a soft caution and explain that the result comes from a deterministic rule engine, not an LLM guessing medical facts.

### 1:30–1:45 — Smart schedule

Show alternate AM/PM or day-based schedule.

### 1:45–1:55 — RevenueCat

Trigger Pro on the next analysis / advanced scheduling feature.

### 1:55–2:00 — Positioning

“Scan what you actually own. Verify it. Build a calmer routine.”

---

## 20. Competition Execution Plan

### 8/11–8/17
Prove the scan-to-Cabinet vertical slice.

### 8/18–8/30
Complete routines and deterministic conflict logic.

### 8/31–9/07
Monetization, analytics, crash monitoring, polish.

### 9/08–9/18
Store submission and review buffer.

### 9/19–9/30
Launch, collect traction, produce final demo and Devpost submission.

---

## 21. Codex Product Guardrails

When Codex implements product features:

- prioritize the activation funnel over feature count;
- preserve the non-fear-based positioning;
- never replace deterministic conflict logic with LLM reasoning;
- do not introduce medical claims;
- do not add unplanned scope;
- keep first-value experience before the primary paywall;
- make analytics part of feature completion;
- treat store submission readiness as a product requirement, not an afterthought.

---

## 22. One-Sentence Pitch

> A skincare routine assistant that reads the ingredient label you actually own, lets you verify it, and gives calm, deterministic guidance on active-product combinations.

