// Service Worker LODGE
// IMPORTANT : bumper CACHE_NAME à chaque déploiement qui change le HTML statique.
// Toute version différente déclenche la purge des caches précédents dans
// `activate` ci-dessous, ce qui force les clients PWA installés à recharger
// la version live des pages au lieu d'une version périmée.
// Bump papimo-v3 -> lodge-v1 au rebrand : purge tous les caches papimo-* sur
// les clients PWA installés.
const CACHE_NAME = "lodge-v1";

// Précacher uniquement les ressources réellement statiques.
// Ne PAS précacher /fr ou / : le HTML est régénéré en SSR/ISR à chaque release
// et doit toujours suivre le réseau (network-first ci-dessous).
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.includes("/auth/")) {
    return;
  }

  // 1) Static assets : cache-first (immutable, hashed by Next.js or static)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|woff2|woff|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // 2) HTML pages, RSC, données : network-first.
  // Le réseau gagne toujours quand il est disponible : la nouvelle version
  // est immédiatement visible. Le cache n'intervient qu'en mode offline,
  // et fallback offline.html si même le cache est vide.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          request.mode === "navigate"
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match("/offline.html")),
      ),
  );
});
