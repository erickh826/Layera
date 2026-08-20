# Layera Agent Skill Routing

## Purpose

Use repository skills as scoped overlays during planning, implementation, review, and release. Skills improve execution discipline; they do not replace project decisions.

## Authority and loading order

For non-trivial Layera work, use this order:

1. `AGENTS.md`
2. `docs/SHIP_PLAN.md`
3. relevant `SYSTEM_SPEC.md`
4. relevant `BUSINESS_PLAN.md`
5. relevant `docs/adr/*`
6. active task, existing code, and tests
7. `.codex/skills/layera-shipaton/SKILL.md`
8. the applicable role skill

`docs/CODEX_HANDOFF.md` is planning-agent memory only. It can supply historical context but cannot override the sources above.

## Available skills

### `layera-shipaton`

Load for every Layera task. It defines product scope, stack, safety invariants, store direction, and the current shipping posture.

### `implement-layera-mobile`

Load for implementation, debugging, code review, tests, Expo/native configuration, Supabase work, Gemini integration, RevenueCat, and store-delivery changes.

### `govern-layera-evidence`

Load when a task changes canonical INCI identities, aliases, KB facts, categories, conflict rules, health-adjacent copy, vision acceptance evidence, privacy disclosures, or factual store claims.

## Task matrix

| Change | Project skill | Coding skill | Evidence skill |
|---|---:|---:|---:|
| Repository/bootstrap/tooling | Required | Required | No |
| UI with no health or evidence claim | Required | Required | No |
| Gemini extraction implementation | Required | Required | Required for acceptance evidence or privacy copy |
| Canonicalization algorithm only | Required | Required | No, unless mappings or aliases change |
| INCI alias or KB content | Required | Required | Required first |
| Conflict engine mechanics | Required | Required | No, unless rule content changes |
| Conflict rule, severity, or warning copy | Required | Required after approval | Required first |
| RevenueCat adapter mechanics | Required | Required | No |
| Paywall, disclaimer, privacy, or store claims | Required | Required | Required |
| Release readiness | Required | Required | Required for evidence/privacy/store surfaces |

Do not load the evidence skill for a purely mechanical change. Do not let the coding skill invent evidence-sensitive content.

## Evidence-to-code gate

Use this sequence for evidence-sensitive changes:

```text
Evidence task
→ evidence record and exact proposed payload
→ human approval
→ coding implementation
→ automated regression tests
→ evidence/copy audit of the final diff
```

An analysis agent may return `insufficient-information` or `escalate-to-qualified-reviewer`. In either case, do not convert the proposal into production KB data or user-facing medical guidance.

## PR gate

Before requesting review, the working agent must report:

- governing task and source documents read;
- role skills used and why;
- exact scope and deliberate non-goals;
- evidence record used, or `not applicable`;
- automated checks and results;
- Development Build or physical-device checks still required;
- unresolved architecture, safety, privacy, store, or monetization risks.

Keep PRs narrow. Never combine an unapproved evidence decision with unrelated implementation work.

## Suggested prompts

Implementation:

```text
Use layera-shipaton and implement-layera-mobile. Read the repository sources in priority order, inspect Git state, and implement only <task>. Do not alter evidence-sensitive content. Report checks and device verification still required.
```

Evidence-sensitive work:

```text
Use layera-shipaton and govern-layera-evidence. Prepare an evidence record for <claim/rule/alias>, including exact proposed payload, limitations, status, and required human approval. Do not edit production code or approve the rule yourself.
```

Implementation after approval:

```text
Use layera-shipaton and implement-layera-mobile. Implement only the human-approved evidence record <reference>. Add deterministic regression tests and preserve unknown handling and late category binding.
```
