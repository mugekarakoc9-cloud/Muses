const CACHE = 'muses-life-v01611-r38-compact-habits-flash';
const FILES = ['./', './index.html', './p1-planning.js', './p1-studio.js', './p1-studio.css', './p1-activity.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './assets/mimo/front.json'];
const core = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
const isMimo = url => /^assets\/mimo\/(idle|happy|love|knead|walk|front|still|greet|sad|play|sleep|gift)\.json$/.test(url.href.slice(self.registration.scope.length));
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  // Never install a login page or a tunnel error as an application asset.
  const responses = await Promise.all(FILES.map(async path => {
    const request = new Request(new URL(path, self.registration.scope), {cache:'reload', redirect:'error'});
    const response = await fetch(request);
    if (!response.ok) throw new Error('Application asset unavailable');
    return [request, response];
  }));
  await Promise.all(responses.map(([request, response]) => cache.put(request, response)));
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(request, {cache:'no-store', redirect:'error', signal:controller.signal});
      if (response.ok) {
        try { await cache.put(request, response.clone()); } catch {}
        return response;
      }
      // A stopped/private tunnel can return 401/403/404 as well as 5xx.
      // Keep the already-installed local app available in all these cases.
    } catch {} finally { clearTimeout(timeout); }
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
