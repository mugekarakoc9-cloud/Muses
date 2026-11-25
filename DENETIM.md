# MUSES Life Studio v0.8 — geçmiş talepler ve teknik denetim

25 Kasım 2026. Mevcut v0.7 kodu ve önceki MUSES/planlayıcı talepleri karşılaştırıldı. Bu belge tamamlanmış işlerle test edilmemiş veya henüz eksik kalan işleri birbirinden ayırır. Kişisel arşiv içerdiğinden depo özel kalmalıdır.

| Alan | v0.8 durumu | Sınır / açık iş |
|---|---|---|
| Ortak ajanda | Gün, hafta, ay, yıl; plan/gerçekleşen; kategori renkleri, hızlı görev ve akıllı Türkçe/İngilizce tekrarlar; kaynak görevleri ajandadan tamamlanır. | Native takvim sürükle-bırak, tüm TickTick RRULE biçimleri ve tam geçmiş aktarımı yok. |
| Plan uyumu | Plan dışı kayıtlar plan toplamından ayrılır; bugüne kadar olan görevlerle uyum hesaplanır. | Örtüşen kapsamlı hedefler bağımsız hedefler olarak kalabilir. |
| Rutinler | Su 2500 ml, kitap, piyano, P90X, sigara/kahve, saç masajı, saç yıkama; 30 Kasım sonrası Effortless, konuşma ve haftalık kontrol. Rutinler düzenlenebilir/kapatılabilir. | Kaydedilmemiş geçmiş günler uydurulmaz. Günlük İngilizce genel durumu kaynak/SRS/konuşma kayıtlarından türetilir. |
| TickTick | Fono 1–45 ve 47 tamamlandı; 46 açık. 23–24 Kasım sigara/kahve değerleri; 23 Kasım P90X ilk gün tamamlanma kaydı. Mevcut yerel değerler ezilmez. | Su birimi belirsiz; sayımdan ml türetilmedi. Tüm TickTick geçmişi aktarılmadı. |
| İngilizce kaynaklar | 67 kaynak, 2788 takip birimi, 59 Drive grup ağacı; iç içe seçim, hedefler, öğrenme yolu. | Bazı birimler numaralı çalışma planıdır, özgün alt konu listesi değildir. |
| Flashcards | 6861 kelime/tür; kaynak, seviye, kart alanları, karıştır, otomatik oynatma, tam ekran, yıldız/bayrak, yazma, dinle-yaz, test, eşleştirme, SRS ve ayrıntılı yanlış yanıtlar. Tam ekran ev sahibi sabit tutulur. | Mikrofon metin eşleşmesi; gerçek fonem/aksan puanı değil. Tüm kelimelerde güvenilir etimoloji ve görsel yok. |
| Kök ağı | Sürükle, yakınlaştır, kart geçişi; kaynak veya elle doğrulanan bağlantılar. | Tam sözlük/etimoloji arşivi değil; yanlış otomatik kök tahmini yapılmaz. |
| Pole | 377 hareketin 32 sütunlu kaynak kaydı; 3034 geçiş, 54 kombinasyon, 1508 kondisyon, 18 kas ailesi. Hareket ayrıntıları ve filtrelenebilir giriş/çıkış bağlantıları artık yerel. | Kaynaktaki aile temelli tahminler doğrulanmış anatomik hareket analizi değildir. Tüm medya eksiksiz değil. |
| P90X | 90 günlük plan, 311 set/hareket kaydı, ilk gün aktarımı, gerçek tamamlanma tarihi seçimi ve alışkanlık özeti. | Yetkili tam DVD video arşivi mevcut değil; mevcut PDF setleri bazı disklerde ikincil kaynaktan. |
| Okuma | 103 gerçek kitap, mevcut kapak/metadata, kitap kartları, aylık 4 kitap hedefi, tarihli bitirmeler. Kapak hata durumunda okunaklı yedek. | Her baskının kapağı, sayfa sayısı, özeti ve geçmiş bitirme tarihi tamamlanmadı. |
| Saç ve kişisel gelişim | 12 aylık görsel takvim; fotoğraf, boya/kesim/bakım notu, yerel kayıt, JSON yedeğine dahil. | Fotoğraf boyutu cihazda en uzun kenar 900 piksele düşürülür; orijinal fotoğraf ayrı saklanmalıdır. |
| Görünüm | Mobil/masaüstü uyumlu kartlar, renkli yıllık takvim, klavye odak göstergeleri, hareket azaltma tercihi, Mimo, sesler ve madalyalar. | 8K raster medya değil; vektör/CSS çözünürlükten bağımsız. Her ekranın gerçek cihaz kullanılabilirlik testi yapılmadı. |
| Veri | Gömülü yerel katalog; JSON şema kontrolü, önceki kopya kurtarma, mevcut IndexedDB/yerel depolama. Dinamik eksik veri haritası. | Gerçek HTTPS açılışı test ortamında engelli. Video dosyaları JSON yedeğinde yok. Cihazlar arası eşitleme yok. |
| Kurulum/entegrasyon | PWA kaynak paketi, güncellenmiş önbellek, yerel Git geçmişi. | İmzalı APK/IPA, kapalı uygulamada garantili native bildirim, ChatGPT doğrudan okuma/yazma yok. GitHub uzaktaki depo önceki kontrolünde public ve yazma yetkisi 403; kişisel veri yüklenmedi. |

## Test kapsamı
- Node sözdizimi ve PWA referansları; katalog bütünlüğü, Fono kontrol sayısı.
- Kontrollü Chromium DOM: 16 ekran, 377/3034 kayıt kontrolü, 12 aylık takvim, Fono görevi → kaynak → ajanda, fotoğraf notu, kart tam ekran kısayolu, mobil 390px taşma kontrolü. Test değişiklikleri yalnız tarayıcı oturumu içindedir.
- Gerçek HTTPS adresi/IndexedDB yeniden yükleme testi ortam tarafından engellendi (`ERR_BLOCKED_BY_ADMINISTRATOR`). Gerçek cihazda test edilmeden başarılı sayılmaz.


# v0.9 denetimi

- Otomatik aktif çalışma süresi: uygulama içi Flashcard, açık kaynak çalışma oturumu ve okuyucu; 2 dk hareketsizlik veya gizli sekme sonrası durur. Önceki sürümlerde eksik otomatik süre geriye dönük üretilmedi.
- Takvim plan/gerçekleşen filtreleri: süre kaydı plan olarak sayılmaz. Hedef planı kaynak alt konu kimliklerini ve tarihlerini saklar; süreyi görev tamamlamasıyla eşitlemez.
- Okuyucu: Sherlock Holmes: Two Plays, The Elephant Man, The Phantom of the Opera, The Piano Man, The Wizard of Oz. Sonuncusu taranmış; TTS ve kelime seçimi yok. EPUB birimi bölüm; diğerleri PDF sayfası.
- Kaynaklar: 59 Pole Anatomy başlık eşleşmesi, 319 Pole Dance Fitness teknik sayfası eşleşmesi. Bu iki sayı çakışabilir; 377 bağımsız anatomi doğrulaması anlamına gelmez.
- Hâlâ eksik: kalan kitap dosyaları/kapaklar, tam EPUB/PDF içe aktarma, tarama OCR, orijinal kitap metninin tam Türkçe çevirisi, doğrulanmış tüm hareket anatomisi/görsel/video, etimoloji, gerçek cihaz bildirimleri, cihazlar arası güvenli eşitleme ve ChatGPT bağlantısı.
- GitHub'a yükleme yapılmadı; bu paket kişisel içerik taşır.


## v0.10 denetimi

**Tamamlanan:** kitap içi tıklanabilir sözcükler, seçili metin penceresi, kelime/kalıp/cümle türü, mükerrer önleme (normalize edilmiş ifade; özgün ayrı POS kayıtları korunur), kitaba bağlı Flashcard desteleri, karttan kitaba dönüş, bağlam ve Türkçe bağlam alanları, iki sütunlu okuyucu, isteğe bağlı çeviri/sözlük sağlayıcıları, ortak hedef ağacı ve doğrudan çalışma rotaları.

**Sınırlar:** önceden kayıtlı olmayan tanım/eş anlam/zıt anlam bilgisi sağlayıcının kapsamına bağlıdır; olmayan alanlar eksik olarak belirtilir. Tarayıcı Translator API desteklenmeyebilir. MyMemory ücretsiz kullanımında 5000 karakter/gün kotası ve istek başına 500 bayt sınırı vardır. Sonuçlar makine çevirisidir; kontrol ve düzenleme mümkündür. Ağ erişimi varsayılan kapalıdır. Taranmış PDF sayfaları metin seçimi/çeviri özelliğinden yararlanamaz. Önceki kitap ve medya kapsamı eksikleri, tam etimoloji, native bildirim, gerçek cihaz kalıcılığı ve cihazlar arası eşitleme devam ediyor.

**Doğrulama:** kontrollü Chromium ortamında 16 ekran, mevcut/yeni ifade tekrar ekleme, özel kitap destesi, kitaba dönüş, klavye ve metin seçimi, hedef ağacı, P90X gününe geçiş, kaynak tamamlama, 390 px mobil görünüm test edildi. Sözlük/çeviri alan eşleştirmesi, önbellek ve hata yolu sahte servis yanıtlarıyla test edildi; gerçek ağ erişimi test edilmedi. GitHub deposu public ve yazma API çağrısı 403 döndü; kişisel veriler uzaktaki depoya gönderilmedi.

## v0.10 P0 — Açılışta yerel kayıt kurtarma

Bozuk veya geçersiz localStorage kopyası bulunduğunda geçerli IndexedDB kopyası, zaman damgası boş olan eski kayıtlar dahil, yeniden yüklenir. Geçersiz IndexedDB kopyası sırf daha yeni tarihli olduğu için geçerli yerel kaydın yerine geçmez. Depolama anahtarları ve veri şeması korunur.

`python tests/storage-recovery.py` bu senaryoları Chromium'da gerçek localhost, localStorage ve IndexedDB üzerinden sınar. Bu test JSON yedeğinin içe aktarılmasını, medya kurtarmayı veya fiziksel cihaz kalıcılığını kapsamaz.

## P0/P1 — Tam yedek ve etkinlik akışı

| Gereksinim | Durum | Kanıt ve kalan işler |
|---|---|---|
| Eski JSON, video dahil yedek, geri yükleme ve geri alma | Tamamlanan akış | Ayarlar'da kayıt yedeği ve videolu tam yedek var. IndexedDB işleminde kayıt, video ve geri alma kopyası birlikte yazılıyor. `tests/storage-recovery.py` eski JSON, geçersiz dosya, video baytları, eklenen videonun geri alınması, yeniden açılış ve yarıda kesilen yazmayı sınar. Büyük video arşivlerinde bellek ve kota ölçümü bekliyor. |
| Ortak kayıtlar ve modüller | Kısmi | `tests/integration-v09.py` okuyucu ile kaynak arasında çift yönlü tamamlanmayı ve tek okuma kaydını sınar. `tests/integration-v010.py` kaynak hedefi, gerçek alt konu ve P90X yönlendirmesini sınar. Bütün modüllerin tam kabul matrisi açık. |
| Aktif süre, ajanda, hedef ve öğrenme yolu | Kısmi | İstanbul gece yarısı bölünmesi, gün başına tek süre satırı, plan toplamından ayrılma ve süre ayrıntısından ilgili ajanda gününe geçiş doğrulandı. Plan görevini tekrar işaretlemek ilk tamamlanma tarihini değiştirmez. Fiziksel cihaz ve paralel sekme senaryoları açık. |
| Düğmeler ve sade gezinme | Kısmi | Ayarlar'daki yinelenen yedek düğmeleri azaltıldı. Süre ayrıntısındaki tarih düğmesi ve DVD ayar düğmesinin erişilebilir adı güncellendi. Kalan ekranların görev bazlı etkileşim ve erişilebilirlik denetimi açık. |
| Güvenli canlı önizleme | Bağlantı eksik | Bulut ortamında doğrulanmış bir HTTP önizleme portu yok. Uygulama özel veri içerdiğinden genel yayın yapılmadı. |
| P2 öğrenme, P3 spor/yaşam, P4 üretim | Kısmi veya doğrulanmadı | Yukarıdaki v0.10 envanteri geçerli. PDF/EPUB ve OCR kapsamı, kaynak eşleştirmeleri, gerçek cihaz bildirimi, eşitleme ve asistan bağlantısı ayrıca doğrulanmalı. |
