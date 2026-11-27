#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p android-wrapper/www
for f in index.html p1-activity.js p1-planning.js p1-studio.js p1-studio.css sw.js deployment-version.json manifest.webmanifest icon-192.png icon-512.png; do
  cp "$f" android-wrapper/www/
done
if [ -d assets ]; then cp -a assets android-wrapper/www/; fi
python3 scripts/prepare-native-web.py android-wrapper/www
cd android-wrapper
npm ci --no-audit --no-fund
# Keep production identity by default. An explicitly separate installation leaves the old app intact.
cp capacitor.config.json capacitor.config.build-backup
trap 'mv capacitor.config.build-backup capacitor.config.json' EXIT
node - <<'JS'
const fs=require('fs'),c=JSON.parse(fs.readFileSync('capacitor.config.json'));
if(process.env.MUSES_SIDE_BY_SIDE==='1'){c.appId='com.muses.studio';c.appName='MUSES Studio';}
fs.writeFileSync('capacitor.config.json',JSON.stringify(c,null,2));
JS
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
node - <<'JS'
const fs=require('fs'),c=JSON.parse(fs.readFileSync('capacitor.config.json')),v=JSON.parse(fs.readFileSync('../deployment-version.json')).release;
const [major,minor,patch]=v.split('.').map(Number),code=major*1000000+minor*10000+patch*100;
const file='android/app/build.gradle';let s=fs.readFileSync(file,'utf8');s=s.replace(/applicationId "[^"]+"/,'applicationId "'+c.appId+'"').replace(/versionCode \d+/,'versionCode '+code).replace(/versionName "[^"]+"/,'versionName "'+v+'"');fs.writeFileSync(file,s);
const strings='android/app/src/main/res/values/strings.xml';s=fs.readFileSync(strings,'utf8');for(const k of ['app_name','title_activity_main'])s=s.replace(new RegExp('(<string name="'+k+'">)[^<]*'),(_,a)=>a+c.appName);for(const k of ['package_name','custom_url_scheme'])s=s.replace(new RegExp('(<string name="'+k+'">)[^<]*'),(_,a)=>a+c.appId);fs.writeFileSync(strings,s);
JS
