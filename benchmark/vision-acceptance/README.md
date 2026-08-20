# Vision Acceptance Protocol

## Purpose

Validate that Layera's selected v1 extraction pipeline is usable on a small, diverse set of real skincare labels before the scan-to-Cabinet vertical slice is accepted.

This is an acceptance exercise for one pipeline, not an A/B provider benchmark and not a product feature.

## Frozen pipeline

```text
Photo
→ Supabase Edge Function
→ Gemini multimodal
→ validated structured INCI JSON
→ human Review & Edit
```

The model may return:

- nullable brand;
- nullable product name;
- an ordered, non-empty draft INCI list.

The model must not return final ingredient categories, conflict outcomes, medical conclusions, or compatibility decisions.

## Acceptance set

Use approximately 8–12 consented, versioned package images. Include as much diversity as the available products allow:

- flat labels;
- curved bottles;
- reflective packaging;
- small text;
- tubes or partially obscured text;
- English packaging;
- Traditional Chinese + English packaging;
- multilingual Asian packaging;
- products containing critical actives.

Crop unrelated people, addresses, receipts, or other personal information before committing an image.

Store images with stable IDs under `images/`. Record the physical package transcription in `ground_truth.json`; do not substitute a website or barcode database.

## Ground truth

Each record should preserve printed ingredient order and identify critical actives separately:

```json
{
  "image_id": "sample_001",
  "ground_truth": {
    "brand": "Example Brand",
    "product_name": "Example Product",
    "ingredients": ["Aqua", "Glycerin", "Niacinamide"],
    "critical_actives": ["Niacinamide"]
  }
}
```

A second human pass should verify each transcription where feasible. Corrections made after a run must be documented.

## Mechanical comparison only

Metric normalization may apply only:

- Unicode normalization;
- trimming;
- repeated-whitespace collapse;
- case folding;
- comma-spacing normalization.

Do not use an LLM or the ingredient knowledge base to convert a wrong extraction into a match.

## Record for every run

- Gemini model/version;
- prompt/schema version;
- dataset revision;
- per-image structured output;
- ingredient recall;
- ingredient precision;
- critical-active recall;
- exact-product accuracy;
- median and P95 latency;
- timeout/failure rate;
- estimated API cost;
- observed failure modes;
- manual edits that a user would need to make.

Accuracy and critical-active recall take priority over small latency or cost differences.

## Result

Write an immutable dated result under:

```text
results/YYYY-MM-DD/
├── gemini.json
└── decision.md
```

`decision.md` must classify the pipeline as:

- accepted for v1;
- accepted with documented limitations; or
- blocked pending a product/architecture decision.

Human Review & Edit remains mandatory even if the pipeline is accepted.

## Security

Do not commit provider keys, authorization headers, signed URLs, full provider logs, or unnecessary package imagery. Provider secrets remain server-side.
