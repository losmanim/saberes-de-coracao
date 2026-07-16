const CACHE = 'saberes-v3';
const CACHE_DYNAMIC = 'saberes-dinamico-v3';

const PRECACHE = [
  '/',
  '/index.html',
  '/biblioteca.html',
  '/apocrifos.html',
  '/404.html',
  '/css/style.css',
  '/js/app.js',
  '/js/features.js',
  '/data/dados-unificados.json',
  '/sitemap.xml',
  '/manifest.json',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(PRECACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== CACHE_DYNAMIC)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network first
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/dados' || url.pathname.startsWith('/api/saberes') || url.pathname.startsWith('/api/midia')) {
      event.respondWith(networkFirst(request, CACHE_DYNAMIC));
      return;
    }
    event.respondWith(networkOnly(request));
    return;
  }

  // Cloudinary media: cache first
  if (url.hostname.includes('cloudinary')) {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
    return;
  }

  // Static assets: cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
    return;
  }

  // Local media files
  if (url.pathname.startsWith('/midia/')) {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
    return;
  }

  // Appwrite CDN
  if (url.hostname.includes('appwrite')) {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
    return;
  }

  // Navigation & everything else: network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, CACHE_DYNAMIC).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(networkFirst(request, CACHE_DYNAMIC));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(cacheName || CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(cacheName || CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response('Offline', { status: 503 });
  }
}
