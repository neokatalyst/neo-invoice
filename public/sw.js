// public/sw.js
// public/sw.js

const SW_VERSION = 'v2'; // <-- Bump this on every deploy
console.log('🌀 Service Worker Version:', SW_VERSION);

self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ✅ Skip cross-origin requests (e.g., Supabase functions)
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error('❌ Service Worker fetch failed:', event.request.url, error);
      return new Response('Service Worker fetch error', { status: 408 });
    })
  );
});
