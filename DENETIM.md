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
