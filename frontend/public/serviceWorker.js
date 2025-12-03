self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

// CACHE ONLY full images
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Adjust this to match your image path
  if (url.pathname.includes("/lukasz321/chasingchipmunks")) {
    event.respondWith(
      caches.open("image-cache-v1").then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        const response = await fetch(event.request);
        // If fetch fails, don't crash
        if (!response || response.status !== 200) return response;

        cache.put(event.request, response.clone());
        return response;
      }),
    );
  }
});
