const CACHE_NAME = 'semarak-rw10-v1';
const STATIC_ASSETS = [
  '/',
  '/logo-hutri-81.png',
  '/banner-hutri-81.png',
  '/icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'omit' }))).catch(err => {
        console.warn('SW: Beberapa aset statis awal gagal dicache:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Hanya proses request HTTP/HTTPS dengan metode GET
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // PENTING: Jangan pernah cache rute API atau Portal agar operasi data & verifikasi QR selalu akurat real-time 100%
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/portal') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/login') || url.pathname.startsWith('/setup')) {
    return;
  }

  // Stale-While-Revalidate untuk halaman umum dan file statis (gambar/font/CSS)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch((error) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        throw error;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
