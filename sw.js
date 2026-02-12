
const CACHE_NAME = 'vantez-pro-cache-v1';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.bcb.gov.br') || event.request.url.includes('brapi.dev') || event.request.url.includes('coingecko') || event.request.url.includes('awesomeapi')) {
    return;
  }
  event.respondWith(caches.match(event.request).then((res) => res || fetch(event.request)));
});
