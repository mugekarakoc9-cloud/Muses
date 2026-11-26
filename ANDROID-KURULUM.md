# MUSES özel Android APK
- Depo Private değilse APK iş akışı çalışmaz.
- Önce mevcut tarayıcıdan uygulamanın kendi yedekleme özelliğiyle kayıtları dışa aktar.
- Bir kez `bash scripts/setup-android-signing.sh` çalıştır (GitHub CLI giriş yapmış olmalı; keytool ve openssl gerekli).
- İş akışını tetiklemek için imza kurulduktan sonra çalışma dalında yeni commit gerekir; GitHub Actions ekranında APK oluşturulduğunda MUSES-private-android artifact ZIP dosyasını indir, aç ve MUSES.apk dosyasını telefonuna yükle.
- Sonraki sürümler aynı paket adı com.muses.life ve aynı imza ile, daha yüksek versionCode ile hazırlanır. APK kurulumunu Android'de onayla. Uygulamayı kaldırma.
- İmza anahtarını/parolayı asla Git deposuna, sohbet mesajına veya herkese açık yere koyma. ~/.muses-signing klasörünün güvenli yedeğini tut.
- Bu sürüm yerel web varlıklarını paketler; canlı eşitleme, uygulama içi otomatik APK indirme, bildirimler, WebView seslendirme ve dosya dışa aktarma gerçek cihazda henüz doğrulanmamıştır. Tarayıcı verileri otomatik aktarılmaz.
