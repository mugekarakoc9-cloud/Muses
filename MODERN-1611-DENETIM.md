# MUSES 0.16.11 — modern Reader ve mobil paket

Bu çalışma `fix/reader-import-goal-controls` dalının `bd01934` sürümünü temel alır. `main` bu dalın gerisindeydi. Önceki bütün modüller, gömülü kaynaklar ve mevcut veri anahtarları korunur. Uygulama sıfırdan yazılmadı.

| Talep / şikâyet | Sonuç | Kanıt / kalan kapsam |
|---|---|---|
| Her kelimeyi ayrı renkle vurgulama | Eklendi | Reader kelime penceresinde 7 renk, özel renk ve kaldırma. Aynı sözcüğün farklı geçişleri ayrıdır. `tests/modern-reader.mjs`. |
| Otomatik zorluk renkleri | Eklendi | CEFR veya kullanıcının 1–5 puanı; renkli alt çizgi/arka plan. Puanı bilinmeyene tahmin atanmaz. Eski 1=kolay kayıt biçimi ekranda doğru ters çevrilir. |
| Türkçe anlamları aç/kapat | Korundu, erişimi düzeltildi | Okuma araç çubuğunda tek düğme; kitap bazında kalıcı tercih. |
| Sade ve modern görünüm | CSS ve ana ekran yenilendi | Mor/yeşil/pembe, SVG gezinme simgeleri, gerçek görev sayılarından halka grafik, mobil kırılımlar, açık/koyu tema. Görsel tarayıcı testi tamamlanamadı: yerel Chromium ikilisi eksik, indirme HTTP 403; bulut tarayıcı localhost sunucusuna erişemiyor. |
| Shift/Ctrl/Cmd seçimi | Düzeltildi | Takvim sürüklemesi seçimde başlamaz. Shift aralık, Ctrl tekil, Ctrl+A görünürler. `tests/modern-bulk.mjs`. |
| Mobil çoklu seçim | Uzun basma eklendi | 450 ms basılı tutma seçim başlatır; fiziksel Android/iPad hareket testi bekliyor. |
| Toplu değişiklik/silme | Genişletildi | Tarih/saat/öncelik korunur; bağımsız görevlere miktar/birim; son silmeyi geri al. Kaynak birimleri anlamsız biçimde değiştirilmez. |
| Path başa dönme/sayfalama | Değiştirildi | 18'li sayfalama kaldırıldı; tek kaydırma alanı, konum hafızası, kaldığım yere dön. Aktif durak hesabı ve Mimo korunur. Büyük katalog performansı gerçek cihazda ölçülmedi. |
| Ortak birimler | Korundu, özel birim eklendi | Önceki birim listesi + bağımsız görev formunda özel birim. Birim dönüşümü önceki alışkanlık motorunda; her modülde tek ortak dönüşüm API'si henüz yok. |
| Flashcard 1–5, kısayollar, filtre | Mevcut dalda korunuyor | Mevcut regresyon testleri geçti. Kartın arka yüzünde A/S/D/F/G; F en kolay. Bu turda fiziksel cihaz ses/kaydırma doğrulanmadı. |
| Hedef planlama, habit, kaynak düzenleme, sesler | Mevcut dalda korunuyor | Önceki uygulamalar kaldırılmadı. Ek metindeki bütün ayrıntıların tamamlandığı iddia edilmez. |
| Mimo önden koşma ve tüm gerçekçi pozlar | Tamamlanmadı | Mevcut karakter ve animasyonlar korundu; yeni gerçekçi önden koşma varlığı üretilmedi. |
| Otomatik web güncellemesi | Mevcut mekanizma, sürüm düzeltildi | Gösterilen sürüm 0.16.11; offline cache yenilendi. Canlı dağıtım/özel tünel doğrulanmadı. |
| Otomatik APK güncellemesi | Bağlı değil | Eski APK imza anahtarı erişilemiyor; dağıtım adresi bağlı değil. Yerel HTML yenilemesini APK güncellemesi diye göstermiyoruz. |
| Animated Engine canlı aktarım | Yapılmadı | 27 Kasım: Codespace editörü açıldı. Terminal, VS Code “Trust Folder & Continue” onayında duruyor. Canlı 8080 adresi HTTP hatası verdi; aktarım henüz doğrulanmadı. |

## Paket ve kayıtlar

İndirilebilir paket `com.muses.studio` / **MUSES Studio** kimliğiyle eski `com.muses.life` uygulamasının yanına kurulur. Eski uygulama silinmemelidir. Kayıtları taşımak için eski uygulamanın Ayarlar bölümünden JSON veya medya dahil tam yedeği alın; yeni uygulamanın Ayarlar bölümünden içe aktarın. Farklı uygulama kimlikleri Android depolamasını otomatik paylaşmaz. Yeni kurulum mevcut gömülü başlangıç kataloğunu içerir, telefondaki son kişisel kayıtların kendiliğinden aktarıldığı iddia edilmez.

Yeni paketin kalıcı imza anahtarı özel geliştirme yedeğinde saklanır; GitHub'a yüklenmez. Sonraki MUSES Studio APK'ları aynı anahtarla ve artan versionCode ile imzalanmalıdır. Normal üretim hazırlığı eski appId'yi korur; ayrı paket için `MUSES_SIDE_BY_SIDE=1 bash scripts/prepare-android.sh` kullanılır.

## Test kapsamı

- Node: JS sözdizimi, manifest, katalog, mevcut SRS/Path/hedef regresyonları ve offline worker hata yolları.
- JSDOM bileşen testleri: renk/tercih/kayıt davranışları, 1–5 dönüşümü, sayfa ve sözcük ayrımı; Shift/Ctrl/Ctrl+A, ondalıklı toplu düzenleme, silme/geri alma (son görev silindiğinde de geri al görünür), küçük parmak hareketinde uzun basmanın korunması ve uzun basma zamanlayıcısı.
- Python: Linux başlatıcı, yerel dosya izolasyonu ve Host doğrulama.
- Görsel tarayıcı, gerçek Android/iPad kurulumu, sesler, mikrofon, bildirim ve tam cihaz yedeği bu oturumda doğrulanmadı. JSDOM gerçek tarayıcı/cihaz testi değildir.

Çalıştırma: `npm install --no-save --package-lock=false jsdom` ardından `node tests/modern-reader.mjs && node tests/modern-bulk.mjs`. Görsel/cihaz kabul matrisi tamamlanmadan tüm istekler bitmiş olarak değerlendirilmemelidir.

## 27 Kasım devam çalışması

- Reader ve toplu seçim JSDOM testleri, sözdizimi/katalog, SRS/Path/hedef, offline worker ve Linux sunucu izolasyonu testleri geçti.
- Yeni Reader/toplu seçim testleri CI akışına eklendi. Fiziksel cihaz ve görsel tarayıcı kabulü hâlâ bekliyor.
- Bu devam turunda yeni APK derlenmedi. Önceki paket hazırlığı korundu; APK dağıtımı tamamlandı sayılmaz.
- Depo API tarafından public olarak bildirildi. Bu güncelleme kişisel katalog, kitap içeriği, yedek veya imza anahtarı eklemez; canlı uygulama herkese açık yayımlanmadı.
- Önbellek kimliği `muses-life-v01611-modern-r4`; depolama anahtarları ve mevcut kullanıcı kayıtları değiştirilmedi.
