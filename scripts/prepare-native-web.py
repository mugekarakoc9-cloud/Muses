"""Native packages ship assets directly; retire the browser PWA worker without touching study data."""
import pathlib
import json
import os
import shutil
import re
import sys

root = pathlib.Path(sys.argv[1])
index = root / "index.html"
html = index.read_text(encoding="utf-8")
# Private deployment only: never commit the personal manifest to the repository.
private_manifest = os.environ.get("MUSES_PRIVATE_P90_MANIFEST", "")
if private_manifest:
    data = json.loads(private_manifest)
    if data.get("format") != "muses-p90-drive-v1" or not isinstance(data.get("dvds"), list):
        raise SystemExit("Invalid private P90X manifest")
    seen = set()
    for item in data["dvds"]:
        dvd = item.get("dvd")
        if type(dvd) is not int or not 1 <= dvd <= 12 or dvd in seen or not re.fullmatch(r"https://drive\.google\.com/file/d/[\w-]{10,200}/(?:view|preview)(?:\?[^#\s]*)?", item.get("url", "")):
            raise SystemExit("Invalid private DVD entry")
        seen.add(dvd)
    (root / "mx-private-p90.js").write_text("window.MUSES_PRIVATE_P90_DRIVE = " + json.dumps(data).replace("<", "\\u003c") + ";\n", encoding="utf-8")
    html, count = re.subn(r"(<head(?:\s[^>]*)?>)", lambda m: m.group(1) + '<script src="./mx-private-p90.js"></script>', html, count=1, flags=re.I)
    if count != 1:
        raise SystemExit("Native build: cannot find HTML head")
# Preserve origin, application ID, localStorage, and IndexedDB.
bootstrap = """<script src="./mx-native-offline.js"></script>"""
html, count = re.subn(r"(<head(?:\s[^>]*)?>)", lambda m: m.group(1) + bootstrap, html, count=1, flags=re.I)
if count != 1:
    raise SystemExit("Native build: cannot find HTML head")
# Native update checks must not read the APK's own version as a remote version.
source = pathlib.Path(__file__).resolve().parent.parent
release = json.loads((root / "deployment-version.json").read_text(encoding="utf-8"))
metadata = {
    "version": release["release"], "revision": release.get("revision", 0),
    "buildCode": int(os.environ.get("MUSES_BUILD_CODE", "0")),
    "appId": os.environ.get("MUSES_APP_ID", "com.muses.studio" if os.environ.get("MUSES_SIDE_BY_SIDE") == "1" else "com.muses.life"),
    "certificateSHA256": os.environ.get("MUSES_CERT_SHA256", "").lower()
}
(root / "mx-native-version.js").write_text("window.MUSES_NATIVE_BUILD = " + json.dumps(metadata) + ";\n", encoding="utf-8")
shutil.copyfile(source / "scripts" / "mx-native-update.js", root / "mx-native-update.js")
html, count = re.subn(r"</body\s*>", lambda m: '<script src="./mx-native-version.js"></script><script src="./mx-native-update.js"></script>' + m.group(0), html, count=1, flags=re.I)
if count != 1:
    raise SystemExit("Native build: cannot find HTML body")
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
