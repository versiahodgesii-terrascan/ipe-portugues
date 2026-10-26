/*
 * A self-destructing worker.
 *
 * The old one cached the whole app and served it first, so an installed phone
 * would keep opening the retired app and never see the page that replaced it.
 * A worker is only replaced when the browser fetches this file and finds it
 * different — so this file exists, claims control, deletes every cache, and
 * unregisters itself.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    for (const client of clients) client.navigate(client.url);
  })());
});
