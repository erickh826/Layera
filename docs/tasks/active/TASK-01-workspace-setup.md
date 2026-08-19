# TASK-01: Root Workspace & Shared Package Setup

**Status:** ACTIVE
**Current Stage:** PLAN
**Created:** 2026-08-18
**Owner:** Codex / Antigravity / Human

---

## Scope
### Will Do
- Create root `package.json` with `npm` workspaces configured (`apps/*`, `packages/*`).
- Create `packages/shared/package.json` with package name `@layera/shared`.
- Create `packages/shared/tsconfig.json` extending strict TypeScript settings.
- Create minimal entry point `packages/shared/src/index.ts` exporting baseline types/schemas.
- Add `@layera/shared` dependency to `apps/mobile/package.json` and configure `tsconfig.json` paths for seamless module resolution.
- Configure root-level unified scripts: `npm run typecheck`, `npm run lint`, `npm run test`.
- Verify clean `npm install` and that `apps/mobile` can import from `@layera/shared`.

### Will Not Do
- Add DB migrations or seed data (reserved for TASK-02).
- Implement Gemini Edge Functions or Vision benchmarks (reserved for TASK-03).
- Implement full conflict engine logic (reserved for TASK-04).
- Add third-party UI libraries or heavy dependencies.

---

## Source Of Truth
- AGENTS.md (§4 Frozen v1 Technical Direction, §5.4 TypeScript Strictness, §22 Dependency Policy)
- docs/SHIP_PLAN.md (§8 Foundation and knowledge base, §10 Store abstraction)
- SYSTEM_SPEC.md (§3 Frozen Technical Stack)

---

## Output Contract
- **Files:**
  - `package.json` (Root workspace config & orchestration scripts)
  - `packages/shared/package.json` (`@layera/shared` definition)
  - `packages/shared/tsconfig.json` (Strict TS config)
  - `packages/shared/src/index.ts` (Entry point export)
  - `apps/mobile/package.json` (Updated with `@layera/shared: "*"`)
  - `apps/mobile/tsconfig.json` (Updated with path alias if needed for bundler resolution)
- **Interfaces / Types:**
  - `packages/shared` exports placeholder health check type or basic INCI type definition.
- **Commands:**
  - `npm run typecheck` (Runs `tsc --noEmit` across all workspaces)
  - `npm run lint` (Runs lint across workspaces)
  - `npm run test` (Runs Vitest across workspaces)
- **Behavior:**
  - Root `npm install` links `@layera/shared` into `apps/mobile`.
  - Importing `@layera/shared` inside `apps/mobile/src` compiles with zero TypeScript errors.

---

## Acceptance Criteria
- [ ] Root `package.json` exists with `workspaces: ["apps/*", "packages/*"]`.
- [ ] `@layera/shared` is recognized by npm and resolvable within `apps/mobile`.
- [ ] `npm run typecheck` passes with 0 errors across both `apps/mobile` and `packages/shared`.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run test` executes vitest cleanly without failure.

---

## Plan
1. **Root Configuration**: Author root `package.json` specifying workspace paths and aggregated scripts (`typecheck`, `lint`, `test`).
2. **Shared Package Setup**:
   - Create `packages/shared/package.json` (`@layera/shared`, version `1.0.0`, dependencies including `zod`).
   - Create `packages/shared/tsconfig.json`.
   - Create `packages/shared/src/index.ts` and baseline structure.
3. **Mobile Linkage**:
   - Update `apps/mobile/package.json` to depend on `"@layera/shared": "*"`.
   - Ensure Metro / TypeScript paths resolve `@layera/shared` properly.
4. **Dependency Resolution & Verification**:
   - Run `npm install` at workspace root.
   - Run `npm run typecheck`, `npm run lint`, and `npm run test`.

---

## Implementation Log
*(Pending approval to transition to IMPLEMENT stage)*

---

## QA Log
- **TypeScript (`typecheck`):** *(Pending)*
- **Lint (`lint`):** *(Pending)*
- **Unit Tests (`vitest`):** *(Pending)*
- **Edge Cases & Invariant Verifications:** *(Pending)*

---

## Review Checklist
- [ ] **Late Binding Preserved:** N/A for workspace scaffolding.
- [ ] **No Medical Certainty Language:** N/A.
- [ ] **No Secrets in Client:** No secrets added to client configs.
- [ ] **No Scope Expansion:** Only workspace config and package linkage.
- [ ] **Architecture Invariants Preserved:** Monorepo uses npm workspaces without heavyweight framework.
- [ ] **Tests Passing:** Root `typecheck`, `lint`, and `test` commands verified.

---

## Archive Summary
- **Changed:**
- **Verified:**
- **Known Follow-ups:**
