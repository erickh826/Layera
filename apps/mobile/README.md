# Layera mobile

React Native + Expo application for the Layera skincare ingredient scanner and routine diary.

## Get started

```bash
npm install
npm start
```

This project targets Expo Development Builds. Expo Go can be useful before native integrations
arrive, but it is not the production runtime.

## Checks

```bash
npm run typecheck
npm run lint
npm test
```

Application routes live in `app`. Domain logic belongs under `src/domain`, provider
integrations under `src/services`, and feature UI under `src/features`.
