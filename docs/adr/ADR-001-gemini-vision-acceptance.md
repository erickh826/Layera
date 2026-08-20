# ADR-001: Gemini Multimodal Vision Acceptance Set

## Status

Accepted — 2026-08-20

## Context

The original Phase 1 plan proposed building and comparing two extraction pipelines:

1. on-device ML Kit OCR followed by LLM normalization;
2. a multimodal model returning structured INCI data.

That plan required a 20-image A/B benchmark and introduced a second native pipeline. The current Shipaton schedule, solo-developer capacity, and product architecture favour a smaller implementation while preserving measurable acceptance evidence and mandatory human verification.

Layera's invariant remains:

```text
AI = perception / normalization
Human = verification
Knowledge Base = source of truth
Conflict Engine = deterministic decision
```

## Decision

For v1, use one extraction pipeline:

```text
Photo
→ Supabase Edge Function
→ Gemini multimodal
→ validated structured INCI JSON
→ human Review & Edit
```

Evaluate it with an approximately 8–12 image Vision Acceptance Set following `benchmark/vision-acceptance/README.md`.

The acceptance set must include diverse physical labels and record recall, precision, critical-active recall, exact-product accuracy, latency, failure cases, cost assumptions, and limitations.

The model output must not contain authoritative categories or conflict decisions. Category binding occurs only after the user confirms the edited INCI list.

## Alternatives

### ML Kit OCR followed by Gemini normalization

Deferred. It adds native integration, Development Build testing, preprocessing, and a second failure surface before the main vertical slice is proven.

### Full 20-image A/B benchmark

Deferred. It provides stronger comparative evidence but costs more implementation and data-preparation time than the current schedule supports.

### No acceptance set

Rejected. Model output remains probabilistic, and Layera needs versioned evidence of real-label limitations before relying on the pipeline.

## Consequences

### Positive

- one smaller, shippable v1 pipeline;
- fewer native dependencies;
- faster progress toward Review & Edit;
- measurable real-label limitations remain documented;
- human verification and deterministic post-confirmation mapping are preserved.

### Trade-offs

- no evidence that Gemini is better than every alternative;
- limited sample size cannot represent all packaging;
- future failures may justify reopening the OCR/provider decision.

### Follow-up

Revisit the pipeline only when acceptance evidence is inadequate, production failures justify the cost, or a new ADR explicitly authorizes another provider or native OCR path.
