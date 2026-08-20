# SYSTEM_SPEC.md

# Shipaton 2026 — AI Skincare Ingredient Scanner & Diary
## System Specification — v1 Baseline

**Status:** Frozen for implementation  
**Target:** Shipaton 2026 MVP  
**Development model:** Solo developer  
**Primary platforms:** iOS + Android  
**Primary objective:** Ship a polished, monetized, production-ready mobile app before the Shipaton submission deadline.

> **Current v1 scope note:** `docs/SHIP_PLAN.md` supersedes this document's §5 pipeline-selection plan, §8.2–8.3 persistent routine tables for v1, and §17 milestones. The current launch uses Gemini multimodal, an 8–12 image acceptance set, transient product selection, and no persistent scheduler. All safety, validation, deterministic-engine, security, and RLS requirements below remain in force.

---

## 1. Product Summary

The product is a mobile skincare companion that:

1. lets users photograph a skincare ingredient label;
2. extracts and normalizes the ingredient list into standard INCI names;
3. requires the user to review and confirm the extracted list;
4. deterministically maps confirmed ingredients to a curated knowledge base;
5. detects predefined skincare active-category conflicts using a rule engine;
6. helps the user build AM/PM routines;
7. provides the first conflict analysis for free;
8. gates repeated conflict analysis and advanced routine guidance behind RevenueCat Pro.

The product deliberately avoids:
- barcode-based ingredient lookup;
- binary “safe / toxic” scoring;
- LLM-generated medical conclusions;
- medical diagnosis or treatment claims.

---

## 2. Product Principles

### 2.1 AI is perception, not truth

AI may:
- read images;
- clean OCR text;
- normalize ingredient names;
- produce structured JSON;
- generate user-friendly explanatory copy.

AI must not:
- decide whether two ingredients are medically safe;
- create conflict categories;
- override deterministic knowledge-base mappings;
- diagnose skin conditions.

### 2.2 Human confirmation before classification

All category binding occurs only after the user reviews and confirms the ingredient list.

Canonical flow:

```text
Photo
  ↓
Vision / OCR
  ↓
LLM normalization
  ↓
Draft INCI array
  ↓
User Review & Edit
  ↓
FINAL confirmed INCI array
  ↓
Canonicalization
  ↓
Ingredient KB / Alias lookup
  ↓
Deterministic categories
  ↓
Conflict engine
  ↓
Routine result
```

### 2.3 Accuracy over latency

Priority order:

1. Accuracy
2. Reliability
3. Implementation complexity
4. Latency
5. Cost

A 3–4 second scan is acceptable if it materially improves ingredient recall and critical-active recall.

---

## 3. Frozen Technical Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo + TypeScript |
| Routing | Expo Router |
| Build | Expo Development Build + EAS |
| Styling | NativeWind / StyleSheet |
| Animation | Reanimated |
| Backend | Supabase |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Server logic | Supabase Edge Functions |
| Vision/OCR | Winner of Phase 1 benchmark |
| AI normalization | OpenAI or Gemini structured output |
| Knowledge layer | Curated ingredient DB + aliases |
| Conflict logic | Deterministic TypeScript/SQL rule engine |
| Subscription | RevenueCat |
| Analytics | PostHog or Firebase Analytics |
| Crash reporting | Sentry |

### 3.1 Explicit non-goals

Do not add in v1:
- custom-trained OCR;
- local ML model;
- barcode / GS1 lookup;
- community features;
- social feed;
- dermatologist marketplace;
- product recommendations marketplace;
- AI diagnosis;
- generalized full cosmetic chemistry engine;
- long-term symptom causality model.

---

## 4. Core User Journeys

### 4.1 First launch

1. User launches app.
2. User sees concise onboarding.
3. User accepts informational-use disclaimer.
4. User lands on Home / Cabinet.
5. User is encouraged to scan first product.

### 4.2 Scan product

1. Tap **Scan Product**.
2. Capture ingredient-label photo.
3. App shows processing state.
4. Vision/OCR pipeline extracts text.
5. LLM returns normalized structured ingredient list.
6. App shows **Review & Edit** screen.
7. User may:
   - edit an ingredient;
   - delete an ingredient;
   - add an ingredient;
   - confirm.
8. On confirm:
   - canonicalize names;
   - resolve aliases;
   - map categories;
   - save product.
9. Product appears in My Cabinet.

### 4.3 Create routine

1. User selects AM or PM.
2. User selects products from Cabinet.
3. User optionally reorders products.
4. User taps **Analyze Routine**.
5. Conflict engine compares active categories.
6. First completed conflict analysis is free.
7. Result shows:
   - no known conflict / caution / warning;
   - soft-language explanation;
   - alternative scheduling suggestion where applicable.
8. Later conflict analyses can trigger RevenueCat Pro paywall.

### 4.4 Monetization

Free:
- limited daily scans;
- limited Cabinet size;
- first full conflict analysis free;
- basic ingredient list viewing.

Pro:
- unlimited scans;
- unlimited Cabinet;
- unlimited conflict analyses;
- smart AM/PM scheduling;
- future trigger-tracking features.

Initial pricing hypothesis:
- Monthly: USD 4.99
- Annual: USD 29.99

Pricing is configurable through store products / RevenueCat and must not be hard-coded in UI.

---

## 5. Vision Spike Specification

### 5.1 Goal

Choose between:

**Pipeline A**
```text
Photo → ML Kit OCR → raw text → LLM normalization
```

**Pipeline B**
```text
Photo → multimodal LLM → structured INCI JSON
```

### 5.2 Benchmark dataset

Create 20 real skincare-label photographs including:
- cylindrical bottles;
- reflective packaging;
- small text;
- tubes;
- flat labels;
- partially curved labels;
- low-to-medium contrast labels.

Each image must have ground-truth JSON.

Suggested format:

```json
{
  "image_id": "sample_001",
  "ground_truth": {
    "brand": "The Ordinary",
    "product_name": "Example Product",
    "ingredients": [
      "Aqua",
      "Glycerin",
      "Niacinamide"
    ],
    "critical_actives": [
      "Niacinamide"
    ]
  }
}
```

### 5.3 Metrics

```text
Recall =
correctly extracted ingredients
/
ground-truth ingredient count
```

```text
Precision =
correctly extracted ingredients
/
model-output ingredient count
```

```text
Critical Active Recall =
correctly extracted critical actives
/
ground-truth critical actives
```

```text
Exact Product Accuracy =
photos with 100% exact ingredient list
/
total photos
```

Also collect:
- median latency;
- P95 latency;
- API cost estimate;
- implementation complexity;
- failure modes.

### 5.4 Selection rule

Prefer the pipeline with materially better:
1. Critical Active Recall
2. Recall
3. Precision
4. Reliability

Vision may be selected even if latency is 3.5–4.0 seconds if accuracy is materially better.

---

## 6. AI Normalization Contract

### 6.1 LLM responsibility

Input:
- OCR text OR product-label image, depending on winning pipeline.

Output:
- brand;
- product name;
- normalized INCI array.

The LLM must not output final conflict categories.

### 6.2 Example output

```json
{
  "brand": "The Ordinary",
  "name": "Glycolic Acid 7% Toning Solution",
  "inci_list": [
    "Aqua",
    "Glycolic Acid",
    "Rosa Damascena Flower Water"
  ]
}
```

### 6.3 Validation

All LLM responses must:
- use structured output;
- pass schema validation;
- reject malformed JSON;
- handle empty / partial responses;
- expose recoverable user-facing errors.

Suggested schema:

```ts
const ProductExtractionSchema = z.object({
  brand: z.string().nullable(),
  name: z.string().nullable(),
  inci_list: z.array(z.string()).min(1)
})
```

---

## 7. Canonicalization and Alias Mapping

### 7.1 Data model

```sql
CREATE TABLE ingredient_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_inci_name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ingredient_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alias_name TEXT UNIQUE NOT NULL,
    alias_type TEXT CHECK (
      alias_type IN ('inci_synonym', 'common_name', 'ocr_variant')
    ),
    ingredient_id UUID NOT NULL
      REFERENCES ingredient_knowledge(id)
      ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 7.2 Rules

- Store canonical names in a normalized lookup form.
- Alias lookup must be case-insensitive.
- User-confirmed INCI list is authoritative for the current product.
- If no KB match exists:
  - keep the ingredient in the product list;
  - category remains `UNKNOWN`;
  - do not invent a category via LLM.
- Category binding is executed only after user confirmation.

---

## 8. Product Data Model

### 8.1 Products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
      REFERENCES auth.users(id)
      ON DELETE CASCADE,
    brand TEXT,
    name TEXT NOT NULL,
    image_url TEXT,
    cleaned_inci_list TEXT[] NOT NULL,
    detected_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

`detected_categories` is a cached deterministic result derived from the confirmed INCI list and KB. It is never accepted directly from the LLM.

### 8.2 Routines

```sql
CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
      REFERENCES auth.users(id)
      ON DELETE CASCADE,
    date DATE NOT NULL,
    slot TEXT NOT NULL CHECK (slot IN ('AM', 'PM')),
    reaction_level INT DEFAULT 0,
    reaction_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, date, slot)
);
```

### 8.3 Routine products

```sql
CREATE TABLE routine_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID NOT NULL
      REFERENCES routines(id)
      ON DELETE CASCADE,
    product_id UUID NOT NULL
      REFERENCES products(id)
      ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    is_skipped BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(routine_id, product_id)
);
```

---

## 9. Conflict Rule Engine

### 9.1 Rule table

```sql
CREATE TABLE conflict_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_a TEXT NOT NULL,
    category_b TEXT NOT NULL,
    severity TEXT NOT NULL
      CHECK (severity IN ('caution', 'warning')),
    warning_text TEXT NOT NULL,
    suggestion_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_a, category_b)
);
```

### 9.2 Engine behavior

Input:
- selected products;
- deterministic category sets;
- conflict rule matrix.

Output:

```ts
interface ConflictResult {
  hasConflict: boolean
  warnings: Array<{
    categoryA: string
    categoryB: string
    severity: 'caution' | 'warning'
    warningText: string
    suggestionText?: string
  }>
}
```

### 9.3 Important rules

- No LLM call during conflict evaluation.
- Same input must always produce same output.
- Unknown ingredients do not automatically create warnings.
- “No known conflict” must never be phrased as “100% safe”.
- Conflict copy uses soft, non-diagnostic language.

---

## 10. RevenueCat

### 10.1 Entitlement

```text
pro_access
```

### 10.2 Paywall trigger

Primary trigger:
- second completed conflict analysis after one free full preview.

Secondary triggers:
- adding a product beyond free Cabinet limit;
- exceeding free scan quota.

### 10.3 RevenueCat rules

- Use store-configured prices.
- Restore purchases must be supported.
- Entitlement state must survive app restart.
- Network failure must fail gracefully.
- Premium access must never depend only on local state.

---

## 11. Legal and Safety UX

### 11.1 First-launch disclaimer

The app is informational only and does not provide medical diagnosis, treatment, or professional dermatology advice.

Users must acknowledge before first scan.

### 11.2 Result copy principles

Avoid:
- “safe”;
- “dangerous”;
- “toxic”;
- “will cause”;
- “guaranteed”.

Prefer:
- “may increase irritation”;
- “some users may prefer to alternate”;
- “our knowledge base contains a caution for this combination”;
- “consider patch testing”.

### 11.3 Human verification

The Review & Edit screen must state that extraction may contain errors and must be checked against the package before analysis.

---

## 12. Analytics

Minimum events:

```text
onboarding_completed
scan_started
scan_completed
scan_failed
review_confirmed
product_saved
cabinet_limit_reached
routine_created
conflict_analysis_started
conflict_found
first_free_analysis_completed
paywall_viewed
purchase_started
purchase_completed
purchase_failed
restore_completed
```

Important funnel:

```text
Install
→ First scan
→ Product saved
→ Routine created
→ First free analysis
→ Paywall viewed
→ Trial / Purchase
```

---

## 13. Error Handling

Required states:
- camera permission denied;
- image processing failed;
- empty ingredient extraction;
- malformed AI response;
- AI timeout;
- Supabase unavailable;
- RevenueCat unavailable;
- no network;
- unknown ingredient;
- user cancels scan;
- product save fails.

Never discard user edits silently.

---

## 14. Security

- API keys must never live in client source.
- AI provider calls go through server/Edge Function.
- Supabase RLS enabled for all user-owned tables.
- Users may only access their own products and routines.
- Storage bucket access must be private or signed.
- Logs must not expose auth tokens or secrets.
- Validate all Edge Function inputs.
- Apply basic rate limiting / abuse protection where practical.

---

## 15. Testing Requirements

### 15.1 Unit tests

Required:
- canonical name lookup;
- alias mapping;
- unknown ingredient behavior;
- category mapping;
- conflict rule matching;
- category order symmetry;
- duplicate category handling;
- no-conflict case;
- RevenueCat entitlement gating logic.

### 15.2 Integration tests

Required:
- extraction → review → confirm → canonicalization → save;
- routine creation → category aggregation → conflict result;
- first-free-analysis → next-analysis paywall.

### 15.3 Manual release checks

iOS + Android:
- clean install;
- permissions;
- scan;
- edit;
- save;
- routine;
- paywall;
- restore purchase;
- offline behavior;
- crash-free startup.

---

## 16. Phase 1 Definition of Done

By the end of Phase 1:

> Using a real phone, scan a skincare product never hard-coded into the database, obtain a draft INCI list, edit it, confirm it, canonicalize it, map known active ingredients deterministically, and save the product to Cabinet without manually editing the database.

---

## 17. Implementation Milestones

### Phase 1 — Vertical Slice
**8/11–8/17**
- benchmark dataset;
- OCR / Vision spike;
- minimal Supabase;
- LLM normalization;
- aliases;
- KB;
- Review & Edit;
- Cabinet save.

### Phase 2 — Routine + Conflict Engine
**8/18–8/30**
- Cabinet CRUD;
- routine builder;
- AM/PM slots;
- ordering;
- conflict rules;
- result UI;
- first free analysis.

### Phase 3 — Monetization + Polish
**8/31–9/07**
- RevenueCat;
- paywall;
- analytics;
- Sentry;
- onboarding;
- legal copy;
- animation polish.

### Phase 4 — Store Submission
**9/08–9/18**
- production builds;
- App Store / Play Store metadata;
- screenshots;
- review;
- rejection buffer.

### Phase 5 — Shipaton Submission
**9/19–9/30**
- production release;
- 2-minute demo;
- Devpost;
- #BuildInPublic content.

---

## 18. Codex Implementation Rules

When implementing this project:

1. Do not change the frozen architecture without documenting the reason.
2. Prefer the smallest production-safe implementation.
3. Do not add features outside the current milestone.
4. Keep business rules outside UI components.
5. Keep AI-provider code behind an interface.
6. Keep the conflict engine deterministic and independently testable.
7. Every DB table containing user data must have RLS.
8. Add tests whenever conflict logic, canonicalization, or entitlements change.
9. Never hard-code subscription prices.
10. Do not use LLM output as a source of medical truth.
