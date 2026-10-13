# Notes for Claude Code

- Static PWA, no build step, no dependencies. Serve the folder as-is (GitHub Pages, Netlify, any HTTPS static host).
- All paths are relative, so the app works from a sub-path such as `https://user.github.io/ipe-portugues/`.
- After changing any file, bump `VERSION` in `sw.js`, or installed iPhones will keep serving the old cache.
- If you add a file the app needs offline, add it to the `FILES` list in `sw.js`.
- Content lives in `js/content.js`. Conjugations are in `js/verbs.js`. See README.md for the formats.
- Progress is stored in `localStorage` under the key `ipe-progress-v1`. Don't rename it, or users lose their progress.
- Quick local test: `python3 -m http.server 8000`.
