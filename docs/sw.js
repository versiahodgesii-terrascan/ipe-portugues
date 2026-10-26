/*
 * Offline shell.
 *
 * VERSION must be bumped on every release or installed phones keep serving
 * the old cache — the same rule ipe-portugues has in its CLAUDE.md, and the
 * same way of getting bitten.
 *
 * Built assets are hashed, so instead of listing files this caches what it
 * serves, as it serves it, and serves from cache when the network is gone.
 * Your words live in IndexedDB, not here; clearing this cache costs you
 * nothing but a reload.
 */
const VERSION = "ipe-cards-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(["./", "./index.html"]).catch(() => {})));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  // Navigations: network first so a deploy is picked up, cache as the
  // fallback so the app opens on a plane.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || Response.error())),
    );
    return;
  }

  // Everything else: cache first — hashed filenames make staleness impossible.
  event.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }),
    ),
  );
});
