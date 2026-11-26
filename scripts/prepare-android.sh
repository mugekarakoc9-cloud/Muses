#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p android-wrapper/www
for f in index.html p1-activity.js p1-planning.js p1-studio.js p1-studio.css sw.js manifest.webmanifest icon-192.png icon-512.png; do
  cp "$f" android-wrapper/www/
done
if [ -d assets ]; then cp -a assets android-wrapper/www/; fi
python3 scripts/prepare-native-web.py android-wrapper/www
cd android-wrapper
npm install --no-audit --no-fund --save-exact @capacitor/core@7.0.0 @capacitor/android@7.0.0 @capacitor/cli@7.0.0
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
