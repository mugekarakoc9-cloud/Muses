# MUSES özel Android APK
- Depo Private değilse APK iş akışı çalışmaz.
- Önce mevcut tarayıcıdan uygulamanın kendi yedekleme özelliğiyle kayıtları dışa aktar.
- Bir kez `bash scripts/setup-android-signing.sh` çalıştır (GitHub CLI giriş yapmış olmalı; keytool ve openssl gerekli).
- İş akışını tetiklemek için imza kurulduktan sonra çalışma dalında yeni commit gerekir; GitHub Actions ekranında APK oluşturulduğunda MUSES-private-android artifact ZIP dosyasını indir, aç ve MUSES.apk dosyasını telefonuna yükle.
- Sonraki sürümler aynı paket adı com.muses.life ve aynı imza ile, daha yüksek versionCode ile hazırlanır. APK kurulumunu Android'de onayla. Uygulamayı kaldırma.
- İmza anahtarını/parolayı asla Git deposuna, sohbet mesajına veya herkese açık yere koyma. ~/.muses-signing klasörünün güvenli yedeğini tut.
- Bu sürüm yerel web varlıklarını paketler; canlı eşitleme, uygulama içi otomatik APK indirme, bildirimler, WebView seslendirme ve dosya dışa aktarma gerçek cihazda henüz doğrulanmamıştır. Tarayıcı verileri otomatik aktarılmaz.

## Android güncelleme kanalı (0.16.11, revizyon 11)
- Eski APK’nin kimliği ve imzası doğrulanmadan yeni imza üretme. Android SDK ile eski APK üzerinde `aapt dump badging eski.apk` ve `apksigner verify --print-certs eski.apk` çalıştır. Paket adını repo Actions değişkeni `MUSES_ANDROID_APP_ID`, SHA-256 sertifika özetini `MUSES_ANDROID_CERT_SHA256` olarak ayarla (64 hex karakter). Mevcut eşleşen keystore secrets kullanılmalı; yeni anahtar eski APK’yı güncelleyemez.
- Depo Private, imza ve paket doğrulaması doğruysa her push özel APK derler; yalnız doğrulanmış APK ve SHA-256 özeti özel Releases sayfasına yüklenir. Artan CI buildCode kullanılır. Eski yerel APK’nin versionCode değerinin de yeni koddan küçük olduğu kontrol edilmelidir. Eski uygulamayı silme.
- Android ana ekranındaki ↻ ve Ayarlar > Android güncellemeleri artık paketlenmiş yerel sürüm dosyasını uzaktaki yayın olarak değerlendirmez. Özel GitHub Releases bağlantısı cihaz tarayıcısında hesap oturumu gerektirir. Otomatik karşılaştırma için erişilebilir özel HTTPS sunucuda release içindeki android-update.json dosyasını güncel tut; WebView için CORS gerekir. Bu adres henüz bağlı değil. Kimlik, sertifika, buildCode ve APK adresi doğrulanır; yükleme Android onayıyla yapılır. Token/parola uygulama içine girilmez.
- Açık çalışma oturumunu zorla yenilemez. APK bağlantısı açılmadan çalışma kaydını kaydetmeye çalışır; kullanıcı tam yedeği kendisi alır. Otomatik medya yedeği, imza uyumu ve gerçek cihaz kurulumu doğrulanmamıştır.

- Mevcut APK’nın `versionCode` değerini `MUSES_OLD_VERSION_CODE` Actions değişkenine bir defa kaydet; bu sabit taban üzerine artan CI kodu eklenir. Daha sonra her yayın için tabanı değiştirme. APK doğrulama testleri özel APK işi atlandığında da genel regresyon akışında çalışır.
