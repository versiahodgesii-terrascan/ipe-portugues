# Ipê Cards

Spaced repetition for Brazilian Portuguese, on Anki's schedule.

After speaking practice you type in what you could not say. The app asks you
again — tomorrow, in four days, in two weeks — until you can.

**Live:** https://versiahodgesii-terrascan.github.io/ipe-portugues/

Add it to your home screen from Safari and it runs offline. Everything is
stored on the device; there is no account and nothing is sent anywhere.

## What it does

- Type an English phrase, its Portuguese, and a note. Each entry makes two
  cards — producing the Portuguese and recognising it — because those are
  different skills learned at different speeds.
- Review with Again / Hard / Good / Easy, each showing the interval it would
  give. Space reveals, 1–4 grade.
- Browse, search, edit, suspend or delete anything.
- CSV export for Google Sheets; JSON backup that keeps the schedule.

## Scheduling

Anki's default preset — 1 min and 10 min learning steps, graduating at 1 day,
easy at 4 days, 250% starting ease, ×1.2 on Hard, ×ease on Good, ×ease×1.3 on
Easy, −20% and relearning on Again, a 130% ease floor, a 365-day cap, fuzz on
longer intervals, 20 new and 200 reviews a day, and the day rolling over at
4am. `src/scheduler.ts`, with 23 tests.

## Developing

```
npm install
npm run dev      # localhost:5177
npm test         # the scheduler
npm run build    # writes docs/, which is what Pages serves
```

Bump `VERSION` in `public/sw.js` on every release.

## The lessons app

This repo used to hold a 500-lesson study app. It is tagged `lessons-app-v1`
and can be restored with `git checkout lessons-app-v1`.
