# MUSES Life Studio

Türkçe, yerel öncelikli ajanda, öğrenme, okuma ve spor uygulaması. P1 sürümü ilk açılışta boş bir katalogla çalışır.

## Yerelde açma

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Tarayıcıda `http://127.0.0.1:4173` adresini aç. Kayıtlarına tekrar erişmek için aynı tarayıcı profilini ve adresi kullan.

## Kendi kaynaklarını kullanma

**Ayarlar → Yerel kaynak paketi → Paket seç** ile bu uygulama için hazırlanmış güvendiğin bir katalog JSON dosyasını seç. Uygulamadan önce kayıt sayılarını görebilirsin. İşlem cihazdaki IndexedDB'de saklanır. Önceki kataloğa dönüş aynı ekrandadır. Kitap ve bölüm kimliklerinin korunması eski çalışma kayıtlarıyla bağlantıyı sürdürür.

Katalog biçimi `muses-local-catalog`, sürüm `1`. Bir paket `data` altında bir veya daha fazla koleksiyon içerir. Desteklenen koleksiyonların şeması `local-catalog.js` dosyasındadır. Çalışan küçük bir yapay katalog `tests/fixture_app.py` içinde bulunur.

Kayıt JSON yedeği kullanıcı durumunu taşır. **Videolarla tam yedek** yerel kaynak katalogunu ve kayıtlı video dosyalarını da kapsar. Eski durum JSON dosyaları ve sürüm 1 medya yedekleri desteklenir. Geri yükleme öncesinde cihazda bir kurtarma kopyası tutulur. Büyük video arşivlerinde bellek ve tarayıcı kotası sınırlayıcı olabilir.

## Doğrulama

```sh
node tests/check.mjs
node tests/catalog-check.mjs
python tests/storage-recovery.py
python tests/browser-smoke.py
python tests/p1-studio.py
python tests/catalog-training.py
python tests/integration-v09.py
python tests/integration-v010.py
python tests/providers-v010.py
```

Tarayıcı testleri Python Playwright ve Chromium kullanır. Set kaydı testi kısa bir yapay video oluşturmak için FFmpeg kullanır. Güncel kapsam ve açık gereksinimler DENETIM.md dosyasındadır.
