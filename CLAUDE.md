# Notes for Claude Code

- **This site is retired.** `docs/` holds a single page saying the app moved,
  plus a self-destructing service worker. Nothing here is built any more.
- The app this repo used to serve is now native, in `~/Downloads/IpeCards`
  (SwiftUI, xcodegen). Changes go there, not here.
- History, in tags:
  - `lessons-app-v1` — the original 500-lesson study app.
  - `pwa-v1` — the React/Dexie flashcard PWA that replaced it.
  Either is restorable with `git checkout <tag>`.
- The Vite source for the PWA is still at the repo root. It is no longer
  built or deployed; `npm run build` would overwrite the retirement page in
  `docs/`, so do not run it unless you mean to bring the PWA back.
- `docs/sw.js` must keep unregistering itself. An installed phone serves the
  OLD cached app until a worker it has never seen takes over and clears the
  caches — delete that file and anyone who installed the PWA is stuck on it
  forever with no way to see that it moved.
- `docs/.nojekyll` must stay, or Pages 404s anything it does not recognise.
