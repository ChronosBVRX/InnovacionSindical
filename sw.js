// sw.js — PWA para GitHub Pages (network-first con timeout para HTML)
const CACHE_NAME = 'ua-pwa-v6'; // ⬅️ súbelo (v7, v8, ...) cuando cambies archivos
const CORE = [
  '/InnovacionSindical/',
  '/InnovacionSindical/index.html',
  '/InnovacionSindical/login.html',
  '/InnovacionSindical/miembros.html',
  '/InnovacionSindical/manifest.webmanifest'
  // Agrega aquí otros assets estáticos (CSS/JS propios) si los tienes
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

// HTML: network-first con timeout, luego caché
async function networkFirstWithTimeout(req, ms = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const net = await fetch(req, { signal: controller.signal });
    clearTimeout(timer);
    const copy = net.clone();
    caches.open(CACHE_NAME).then(c => c.put(req, copy));
    return net;
  } catch {
    clearTimeout(timer);
    const cached = await caches.match(req);
    if (cached) return cached;
    return caches.match('/InnovacionSindical/index.html');
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';

  if (accept.includes('text/html')) {
    e.respondWith(networkFirstWithTimeout(req));
    return;
  }

  // Otros: cache-first
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy));
      return res;
    }).catch(() => cached))
  );
});