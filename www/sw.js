// Offline: app shell cache-first; site data.js network-first with cached fallback.
const V = 'kg-app-v1', SHELL = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'data/data.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.pathname.endsWith('/data.js') && u.hostname !== location.hostname) {
    const key = new Request(u.origin + u.pathname);  // ignore cache-busting query
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(key, cp)); return r; })
      .catch(() => caches.match(key).then(r => r || caches.match('data/data.js'))));
    return;
  }
  if (u.origin === location.origin) e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
