"""Install the local Google authorization bridge into Capacitor's generated Android app."""
from pathlib import Path
import re

root = Path("android")
source = Path("native-src")
main = list(root.glob("app/src/main/java/**/MainActivity.java"))
if len(main) != 1:
    raise SystemExit("MainActivity not found")
activity = main[0]
s = activity.read_text()
package = re.search(r"^package\s+([\w.]+);", s, re.M).group(1)
for name in ("MusesDriveAuthActivity", "MusesDriveAuthPlugin"):
    (activity.parent / (name + ".java")).write_text((source / (name + ".java")).read_text().replace("__PACKAGE__", package))
if "registerPlugin(MusesDriveAuthPlugin.class)" not in s:
    if re.search(r"super\.onCreate\(", s):
        s = re.sub(r"(super\.onCreate\([^;]+;)", r"registerPlugin(MusesDriveAuthPlugin.class);\n        \1", s, count=1)
    else:
        s = re.sub(r"(class MainActivity extends BridgeActivity\s*\{)", r"\1\n    @Override public void onCreate(android.os.Bundle state) {\n        registerPlugin(MusesDriveAuthPlugin.class);\n        super.onCreate(state);\n    }\n", s, count=1)
    if "registerPlugin(MusesDriveAuthPlugin.class)" not in s:
        raise SystemExit("Cannot register Drive plugin")
    activity.write_text(s)
# Drive's embedded preview requires third-party cookies in Android WebView.
# This affects this application's WebView only; keep HTTPS and mixed-content policy unchanged.
s = activity.read_text()
cookie = "android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(getBridge().getWebView(), true);"
if cookie not in s:
    s, count = re.subn(r"(super\.onCreate\([^;]+;)", lambda m: m.group(1) + "\n        " + cookie, s, count=1)
    if count != 1:
        raise SystemExit("Cannot configure Drive preview cookies")
    activity.write_text(s)
manifest = root / "app/src/main/AndroidManifest.xml"
s = manifest.read_text()
if "MusesDriveAuthActivity" not in s:
    s = s.replace("</application>", '<activity android:name="' + package + '.MusesDriveAuthActivity" android:exported="false" />\n    </application>', 1)
    manifest.write_text(s)
gradle = root / "app/build.gradle"
s = gradle.read_text()
if "com.google.android.gms:play-services-auth:" not in s:
    s = re.sub(r"dependencies\s*\{", "dependencies {\n    implementation 'com.google.android.gms:play-services-auth:22.0.0'", s, count=1)
    gradle.write_text(s)
