#!/usr/bin/env bash
set -euo pipefail
umask 077
repo="mugekarakoc9-cloud/Muses"
if [ "$(gh repo view "$repo" --json isPrivate --jq .isPrivate)" != "true" ]; then
  echo "Önce GitHub deposunu Private yap. Anahtar oluşturulmadı."
  exit 1
fi
dir="$HOME/.muses-signing"
mkdir -p "$dir"
chmod 700 "$dir"
if [ ! -f "$dir/muses.p12" ]; then
  if gh secret list -R "$repo" | grep -q '^MUSES_KEYSTORE_B64'; then
    echo "GitHub'da bir imza zaten var. Mevcut anahtarı koru; yeni anahtar oluşturulmadı."
    exit 1
  fi
  openssl rand -hex 24 > "$dir/password"
  keytool -genkeypair -keystore "$dir/muses.p12" -storetype PKCS12 -storepass:file "$dir/password" -keypass:file "$dir/password" -alias muses -keyalg RSA -keysize 3072 -validity 10000 -dname "CN=MUSES"
fi
if [ ! -f "$dir/password" ]; then echo "Mevcut anahtarın parola dosyası eksik."; exit 1; fi
base64 -w0 "$dir/muses.p12" | gh secret set MUSES_KEYSTORE_B64 -R "$repo"
gh secret set MUSES_KEYSTORE_PASSWORD -R "$repo" < "$dir/password"
echo "İmza ayarlandı. ~/.muses-signing klasörünü güvenli ve özel bir yerde yedekle; repoya ekleme."
