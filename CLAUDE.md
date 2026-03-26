# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Drinktracker is a client-only PWA (no backend) that tracks alcohol consumption and calculates real-time BAC decay. Built with Create React App, React 18, and Bulma CSS. Deployed to Netlify.

## Commands

```bash
npm start              # Dev server
npm test               # Jest tests (jsdom)
npm run build          # Production build (outputs to /build, copies Netlify _redirects)
npm run storybook      # Component dev on port 9009
npm run analyze        # Bundle size analysis
```

Node 16 (see `.nvmrc`). No lint script defined; ESLint config exists via CRA defaults.

## Architecture

**Data flow:** All state lives in IndexedDB via `idb-keyval`. No Redux, no backend API. Key stored values: `drinks`, `newDrinkState`, `drinkCalculatorState`, `drinkTrackerState`.

**Core algorithm:** `src/currentDrinks.js` — calculates remaining BAC based on drink array and current time. Each drink has a duration (`value × 60 minutes`) and decays over that period.

**Routing:** React Router v5. Routes: `/` (main app), `/help`, `/terms`. SPA routing handled by Netlify `_redirects` in `etc/`.

**Component patterns:** Mix of class components (`NewDrink`) and functional components with hooks. Custom hooks: `useDrinks()`, `useDeferredInstallPrompt()`. `Help` and `Terms` are lazy-loaded.

**Styling:** Bulma CSS framework + SCSS. No Tailwind, no CSS modules.

**Analytics:** Amplitude, FullStory (production only), and Google Analytics (gtag). Keys come from env vars: `REACT_APP_FULLSTORY_ID`, `REACT_APP_AMPLITUDE_API_KEY`, `REACT_APP_FEEDBACK_FORM`.

## Formatting

Prettier: 2-space indent, single quotes. See `.prettierrc`.
