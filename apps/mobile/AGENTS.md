# Layera mobile instructions

Before changing code under `apps/mobile`, read:

1. `../../AGENTS.md`
2. `../../docs/SHIP_PLAN.md`
3. the active task under `../../docs/tasks/active/`

The repository-level instructions remain authoritative. This file adds mobile-specific guidance only; it does not replace Layera's safety, late-binding, deterministic-engine, scope, or testing invariants.

## Expo version rule

Expo has changed. Read the exact versioned documentation at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code.

Translate generic React guidance to React Native and Expo. Do not introduce DOM, browser-only, or Next.js assumptions into the mobile app.
