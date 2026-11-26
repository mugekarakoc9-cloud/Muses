const CACHE = 'muses-life-v0151-restore-stable';
const FILES = ['./', './index.html', './p1-planning.js', './p1-studio.js', './p1-studio.css', './p1-activity.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const core = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
const isMimo = url => /^assets\/mimo\/(idle|happy|love|knead|walk|still|greet|sad|play|sleep|gift)\.json$/.test(url.href.slice(self.registration.scope.length));
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(FILES.map(path => new Request(new URL(path, self.registration.scope), {cache:'reload'})));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  await Promise.all((await caches.keys()).filter(key => key.startsWith('muses-life-') && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const asset = isMimo(url);
  if (!asset && request.mode !== 'navigate' && !core.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, {cache:'no-store'});
      if (response.ok) {
        try { await cache.put(request, response.clone()); } catch {}
      }
      if (response.ok || response.status < 500) return response;
    } catch {}
    return (await cache.match(request)) || (request.mode === 'navigate' ? await cache.match(new URL('./index.html', self.registration.scope)) : null) || Response.error();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'MUSES_VERSION') event.ports[0]?.postMessage({version:CACHE});
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients => clients.length ? clients[0].focus() : self.clients.openWindow('./')));
});
