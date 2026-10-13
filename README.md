# Ipê · Português do Brasil

A Brazilian Portuguese grammar and verb-tense trainer that installs on an iPhone Home Screen and works offline. It's a plain static web app (HTML, CSS, JavaScript) with no build step and no server code.

It borrows the habits that make Duolingo work and applies them to grammar:

- **A lesson path.** There are 12 units with 4 lessons each. Each lesson has 10 exercises, and the next one to do is highlighted.
- **Three exercise types:**
  - Multiple choice with an explanation and a rule of thumb.
  - Typed conjugation drills with an accent keyboard. Answers with a missing accent are accepted but flagged.
  - Word-tile sentence building from English prompts.
- **Mistakes come back.** Anything you get wrong is repeated at the end of the lesson.
- **XP, a daily goal and a daily streak**, with a 7-day chart.
- **Spaced review.** Every item you practice is scheduled to come back 1, 3, 7, 16 and 35 days later. Misses come back the same day.
- **A reference guide.** It has full conjugation tables for 37 verbs across 8 tenses, plus participles and gerunds. It also explains when to use each tense and collects the tips from each unit.
- **Audio.** Answers are read aloud with the iPhone's Portuguese (Brasil) voice.
- **Light and dark mode** follow the phone's setting.
- **Backup and restore.** Progress is stored on the device, and you can copy it out as text.

## Put it on your iPhone

The app has to be served over HTTPS once so Safari can install it. After that it runs offline.

### Option A: ask Claude Code to publish it (recommended)

Open Claude Code in this folder and paste:

> This folder is a finished static web app (PWA) with no build step. Publish it to GitHub Pages:
> 1. Create a new **public** GitHub repo called `ipe-portugues` (use `gh repo create`).
> 2. Commit all files and push to `main`.
> 3. Enable GitHub Pages from the `main` branch, root folder (for example `gh api -X POST repos/OWNER/ipe-portugues/pages -f "source[branch]=main" -f "source[path]=/"`).
> 4. Wait until the site is live, check that `index.html`, `sw.js` and `manifest.webmanifest` load over HTTPS, and give me the final URL.
>
> Don't change the app's code.

You need a GitHub account, and the `gh` CLI must be logged in (`gh auth login`). Free GitHub accounts can only use Pages with public repos.

### Option B: no GitHub

On a computer, go to https://app.netlify.com/drop and drag this whole folder onto the page. You'll get an HTTPS link.

### Then, on the iPhone

1. Open the link in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. Open Ipê from the Home Screen once while you're online. After that it works offline.

## Updating the app

1. Edit the files.
2. Bump `VERSION` in `sw.js`, for example `"ipe-v2"`. This step is required, or installed phones keep the old cached copy.
3. Push again, or re-upload.

The phone picks up the new version the next time the app is opened online. It may take one extra launch.

## Adding content

All course content is in `js/content.js`. Each unit has:

- `mc`: multiple-choice items. `o[0]` is always the correct answer; the options are shuffled on screen. `s` is the sentence, with `___` marking the blank. `t` is the small tag, `e` is the explanation and `r` is the rule of thumb. Add `long: true` when the options are full sentences.
- `build`: word-tile items. `en` is the English prompt and `a` is the list of accepted answers. The first answer is the one turned into tiles. `x` holds extra distractor tiles. Capitals and punctuation are ignored when checking.
- `drill`: which `tenses` and `verbs` the typed conjugation exercises draw from.

Conjugations are generated in `js/verbs.js`. Regular verbs only need a meaning in `REG_EN`. Irregular verbs go in `IRR` and only need the forms that differ; `null` keeps the generated form. Persons follow the Brazilian four-form system: eu, ele/ela/você, nós, eles/elas/vocês.

## Files

```
index.html             App shell and iOS install meta tags
manifest.webmanifest   Name, icons and standalone display
sw.js                  Offline cache (bump VERSION on every change)
css/styles.css         All styles, light and dark themes
js/verbs.js            Conjugation engine and tense notes
js/content.js          12 units of lessons
js/app.js              Path, lessons, review, guide, profile, storage
fonts/                 Self-hosted fonts (Bricolage Grotesque, Figtree, IBM Plex Mono)
icons/                 Home Screen icons
```

To try it on a computer, run `python3 -m http.server 8000` in this folder and open http://localhost:8000.
