# Vision/OCR benchmark protocol

> **ARCHIVED PROTOCOL:** This 20-image ML Kit-versus-multimodal comparison is retained for history only. The current v1 protocol is `benchmark/vision-acceptance/README.md`: one Gemini multimodal pipeline evaluated on an 8–12 image acceptance set. Do not rebuild Pipeline A unless explicitly requested through a new approved ADR.


This benchmark selects the Phase 1 extraction pipeline. It is evidence for an implementation
decision, not a product feature and not a place to tune against the holdout set.

## Candidates

- `pipeline_a`: on-device ML Kit OCR followed by server-side LLM normalization.
- `pipeline_b`: server-side multimodal LLM returning structured extraction.

Both candidates must produce the same validated extraction shape and must not return ingredient
categories, compatibility claims, or medical guidance.

## Dataset

Store 20 consented skincare-label images under `images/` using stable IDs:

```text
sample_001.jpg
sample_002.jpg
...
sample_020.jpg
```

Include cylindrical bottles, reflective packaging, small text, tubes, flat labels, partially curved
labels, and low-to-medium contrast labels. Crop unrelated people, addresses, receipts, or other
personal information before committing an image.

Use five representative samples as `dev` and fifteen as `test`. Candidate prompts and preprocessing
may be adjusted using only the `dev` split. Freeze the `test` ground truth before the first scored
holdout run.

## Ground truth

`ground_truth.json` is an array of records:

```json
[
  {
    "image_id": "sample_001",
    "split": "dev",
    "ground_truth": {
      "brand": "Example Brand",
      "product_name": "Example Product",
      "ingredients": ["Aqua", "Glycerin", "Niacinamide"],
      "critical_actives": ["Niacinamide"]
    }
  }
]
```

Rules:

- Transcribe the physical package, not a website or barcode database.
- Preserve printed ingredient order.
- Use standard INCI spelling only when the package text is unambiguous.
- Have a second human pass verify each test record against the image.
- Do not modify test ground truth after viewing candidate output unless the original transcription is
  demonstrably wrong; record any correction in the result notes.

## Comparison normalization

Metric comparison may apply only these mechanical transformations:

- Unicode normalization;
- trim surrounding whitespace;
- collapse repeated internal whitespace;
- case-fold;
- normalize comma spacing.

Do not use an LLM or the ingredient knowledge base to turn a wrong extraction into a match.
Ingredient precision and recall use multiset counts so duplicate output cannot inflate scores.
Exact-product accuracy requires the full normalized ingredient sequence to match in order.

## Required metrics

For each candidate, record:

- ingredient recall;
- ingredient precision;
- critical-active recall;
- exact-product accuracy;
- median latency;
- P95 latency;
- failure rate;
- estimated API cost;
- implementation complexity;
- observed failure modes.

Report `dev`, `test`, and overall values separately. Pipeline selection must prioritize test
critical-active recall, then recall, precision, and reliability. Small latency or cost advantages do
not outweigh materially better accuracy.

## Result artifacts

Write immutable, dated runs under `results/`:

```text
results/
└── 2026-08-14/
    ├── pipeline_a.json
    ├── pipeline_b.json
    └── decision.md
```

Each candidate result should contain:

- candidate and model/provider versions;
- prompt/configuration version;
- dataset revision;
- per-image extraction and latency;
- aggregate metrics;
- errors and failure notes;
- estimated cost assumptions.

`decision.md` must name the selected pipeline, summarize the evidence, and list remaining risks. Do
not commit provider keys, signed URLs, authorization headers, or full provider logs.

## Reproducibility checklist

- Ground truth and split frozen before holdout scoring.
- Same image bytes used for both candidates unless preprocessing is an explicit pipeline step.
- Same extraction schema and timeout policy.
- Warm-up requests excluded consistently.
- Failed and timed-out requests counted in failure rate.
- Model/provider versions recorded.
- Raw result artifacts retained without secrets.
