// public/sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 🚫 Bypass cross-origin requests (e.g. Supabase functions)
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error('[Service Worker] Fetch failed:', event.request.url, error);
      return new Response('Service Worker fetch error', { status: 408 });
    })
  );
});
