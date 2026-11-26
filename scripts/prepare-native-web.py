"""Native packages ship assets directly; retire the browser PWA worker without touching study data."""
import pathlib
import re
import sys

root = pathlib.Path(sys.argv[1])
index = root / "index.html"
html = index.read_text(encoding="utf-8")
# Preserve origin, application ID, localStorage, and IndexedDB.
bootstrap = """<script src="./mx-native-offline.js"></script>"""
html, count = re.subn(r"(<head(?:\\s[^>]*)?>)", lambda m: m.group(1) + bootstrap, html, count=1, flags=re.I)
if count != 1:
    raise SystemExit("Native build: cannot find HTML head")
index.write_text(html, encoding="utf-8")
# Update old registrations as well as new installations. No fetch interception.
(root / "sw.js").write_text("""self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  try {
    for (const key of await caches.keys()) {
      if (key.startsWith('muses-life-')) await caches.delete(key);
    }
  } finally {
    await self.registration.unregister();
    await self.clients.claim();
  }
})()));
self.addEventListener('message', event => {
  if (event.data?.type === 'MUSES_VERSION') event.ports[0]?.postMessage({version:'native-bundle'});
});
""", encoding="utf-8")
(root / "mx-native-offline.js").write_text("""(() => {
  if (!('serviceWorker' in navigator)) return;
  // Existing worker may still control this page. Ask it to update to the
  // packaged, non-intercepting retirement script before unregistering.
  const workers = navigator.serviceWorker;
  let originalController = workers.controller;
  let reloaded = false;
  workers.addEventListener('controllerchange', () => {
    if (originalController && !reloaded) {
      reloaded = true;
      // No automatic reload: never interrupt a user's active study session.
      console.info('MUSES native: browser cache worker retired.');
    }
  });
  workers.getRegistrations().then(async registrations => {
    for (const registration of registrations) {
      try { await registration.update(); } catch (_) {}
      try { await registration.unregister(); } catch (_) {}
    }
    if ('caches' in window) {
      for (const key of await caches.keys()) {
        if (key.startsWith('muses-life-')) await caches.delete(key);
      }
    }
  }).catch(() => {});
})();
""", encoding="utf-8")
print("Native assets prepared: browser service worker replaced; personal storage untouched.")
