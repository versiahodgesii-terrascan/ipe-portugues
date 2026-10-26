# Notes for Claude Code

- This repo was the 500-lesson Ipê study app. On 2026-10-26 it was replaced by
  **Ipê Cards**, a spaced-repetition flashcard app. The lessons app is tagged
  `lessons-app-v1` — `git checkout lessons-app-v1` brings it all back.
- Vite + React + TypeScript + Dexie. There IS a build step now, unlike before.
- **GitHub Pages serves `docs/`, not the root.** Run `npm run build` and commit
  `docs/` or the live site does not change.
- After changing anything, bump `VERSION` in `public/sw.js`, or installed
  iPhones keep serving the old cache. This is still the rule that bites.
- Scheduling lives in `src/scheduler.ts` and is covered by `npm test`
  (23 checks against Anki's defaults). Change the scheduler and the tests tell
  you what you broke.
- Data is in IndexedDB (Dexie, database `ipe-cards`). The old lesson progress in
  `localStorage` under `ipe-progress-v1` is untouched but nothing reads it.
- Local test: `npm run dev`.
