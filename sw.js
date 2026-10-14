/* Offline support: cache the whole app on install, serve cache-first.
   Bump VERSION whenever you change any file so phones pick up the update. */
const VERSION = "ipe-v11";
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/verbs.js",
  "./js/content.js",
  "./js/termo.js",
  "./js/app.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./fonts/figtree-latin-400-normal.woff2",
  "./fonts/figtree-latin-500-normal.woff2",
  "./fonts/figtree-latin-600-normal.woff2",
  "./fonts/figtree-latin-700-normal.woff2",
  "./fonts/ibm-plex-mono-latin-500-normal.woff2"
];

/* addAll() reads through the HTTP cache, so a VERSION bump could fill the new
   cache with the files it was meant to replace. Fetch each one from the network. */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION).then(c => Promise.all(FILES.map(u =>
      fetch(new Request(u, { cache: "reload" })).then(res => {
        if (!res.ok) throw new Error("install failed for " + u + ": " + res.status);
        return c.put(u, res);
      })
    ))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
