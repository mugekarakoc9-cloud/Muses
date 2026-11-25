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

## 25 Kasım 2026 — P1 geliştirme dalı

- `node tests/check.mjs` ve `node tests/catalog-check.mjs` geçti.
- `python tests/storage-recovery.py` gerçek Chromium localhost üzerinde bozuk kopyadan kurtarma, eski JSON, videolu yedek ve video baytları, geri alma ve yarıda kesilen geri yüklemeyi doğruladı.
- `python tests/p1-studio.py` gerçek Chromium localhost üzerinde komut paleti, Türkçe görev taslağı, erteleme geçmişi, takvimde sürükleme, dakika bütçesi, plan çakışması, kalan programı yeniden dağıtma, ağaç yakınlaştırma, P90X 15. gün ekranı ve hareket kaydı, Flashcard ve P90X sürelerinin dört takvim görünümüne yansıması, yeniden açılış ve çevrimdışı PWA açılışını doğruladı. 16 ekranın koyu tema koşulu ve 390, 820, 1440 piksel genişliklerinde ana akışların taşma kontrolü yapıldı. Ana ekran ve hedef ağacı aynı üç genişlikte görsel olarak incelendi.
- `tests/browser-smoke.py`, `tests/integration-v09.py`, `tests/integration-v010.py` ve `tests/providers-v010.py` geçti. Bunlar okuyucu/kaynak eşleşmesini, tekil okuma kaydını, kitap sözcüğü mükerrer kontrolünü ve benzetilmiş sözlük/çeviri sağlayıcısını kapsar.
- P1 testinde süre aralıklarının çakışması, hedef ağacının gün görünümü ve önceki bir günde doğru yanıtlanan kartın yanlış tekrarının ayrıntıda görünmesi doğrulandı.
- Fiziksel Android/iPad, gerçek mikrofon ve TTS sesleri, gömülü haricî video oynatma ve eşzamanlı sekme kalıcılığı doğrulanmadı. Diğer açık P1 kapsamı şartnamedeki P1 tablosunda.


### P1 — Kaynağa bağlı Pomodoro ve Flashcard oturumları (geliştirme dalı)

- Görev, kaynak/alt bölüm, kitap, alışkanlık, Flashcard seviyesi ve spor hedefi seçilebilen ortak Pomodoro; şeffaf küçük sayaç, çalışma/mola süresi, 1–30 set, başlat/duraklat/devam/bitir. Uygulama içi gezinmede sayaç korunur. Sadece odak evresi ortak süre kaydına yazılır; İstanbul gün sınırında bölünür.
- Seçilen Flashcard oturumunun soru sayısı, gerçek yanıt kayıtları, otomatik kapanış, oturum süresi ve ön/arka yüz seslendirmesi eklendi. Cihaz sesi gerektirir; dili belirsiz eski alanlar otomatik yanlış dilde okunmaz. Tarayıcı yeniden açılırsa yarım kalmış Flashcard oturumu kısmi geçmiş olarak saklanır; kaldığı karttan otomatik sürdürme henüz yok.
- V8 sözdizimi ve saf zamanlayıcı testleri geçti: iki odak turunda mola sayılmadı, duraklatılmış sayaç süre eklemedi, kapalı tarayıcı senaryosunda sadece başlamış tur hesaplandı. Kontrollü DOM/API taklitli entegrasyon testi üç Flashcard yanıtını, otomatik bitişi, 35 saniye tekil süre kaydını, TR/EN ses kuyruğunu ve ekran geçişi/duraklatma ile 25 saniye görev süresini doğruladı. Son ek stop/switch düzenlemesi sözdizimi kontrolünden geçti; yeniden gerçek tarayıcı testi bekliyor.
- Canlı GitHub Pages dalına birleştirilmedi. Tam Chromium arayüzü, gerçek cihaz sesleri, fiziksel Android/iPad, çoklu tarayıcı sekmesi eşzamanlılığı ve gerçek çevrimdışı güncelleme doğrulanmadı. Kullanıcı verisi eklenmedi; mevcut yayın arşivinin gizlilik denetimi açık.


### P1 — Memory Palace kaynak ve hedef yolları (geliştirme dalı)

- Kaynaklar: kategori → kaynak → seçili bölüm → alt bölüm → çalışma. CSS/SVG ile derinlik hissi, kıvrımlı yol, kategori renkleri, çizgi ikonlar, 18 duraklık sayfalama, fareyle kaydırma ve yakınlaştırma düğmeleri. Tamamlanma gerçek alt birimlerden türetilir; sıralı görünümde ilk tamamlanmamış duraktan sonrası kilitli, serbest erişim seçilebilir. Önceki katalog erişimi korunur; kaynak checkbox ve plan yaprakları gerçek çalışma beyanına yönlendirilir. Pomodoro tek başına tamamlanma değildir. Not ve beyan yerelde saklanır; önceki kayıtlar korunur.
- Benim Yolum: seçili dönemde gerçek hedeflerden tarih ve kaynak yapraklarına inen yol. Mimo sonraki bitmemiş durağa konur; tamamlandıktan sonra üst dal görünümüne döner. Gerçekçi yeni kedi çizimleri veya kaydedilmiş kedi sesleri eklenmedi: mevcut SVG karaktere hareket ve üç ayrı sentezlenmiş kedi benzeri ses eklendi. 116 haftalık özel programın tamamı yeni veri modeliyle henüz entegre edilmedi.
- Derslerde YouTube (privacy-enhanced embed), Dailymotion, doğrudan HTTPS ses/video ve izinli yerel video desteği. Bahrom Hudayar'ın Alıştırmalar serisinde 01, 02 ve 09 başlıkları için doğrulanmış kamuya açık video URL'leri: v2PfdZ-SZu8, lDRnktYqfHo, aPOOmVJd-vM. Tam katalogda özgün ders URL'leri bulunmadığından diğerleri ekleme alanıyla bırakıldı. Gömme ve oynatma izinleri gerçek tarayıcıda doğrulanmadı; üye içeriklerine erişim kısıtı aşılmaz. Yerel medya 300 MB/dosya sınırına tabi. Kaynağa bağlı Pomodoro başlat/durdur aynı medya DOM'unu yeniden çizmez.
- JavaScript sözdizimi ve saf fonksiyon testleri: sıralı kilit, serbest erişim, YouTube zaman damgası, Dailymotion, sahte host ve javascript URL reddi. Taklit DOM/veri ile yeni kaynak kategori/dal görünümü, gerçek tamamlanmaya bağlı durum, ders çalışma paneli, medya düğmesi ve hedef yolu oluşturulması kontrol edildi. Son düzeltmelerin sözdizimi kontrolü yapıldı; gerçek Chromium ve fiziksel cihaz, video gömme, ses kalitesi ve tüm P1 entegrasyon regresyonu açık. Bu commit'ler canlı Pages dalına birleştirilmedi. Özel içerik eklenmedi; mevcut deponun gömülü kişisel arşivi için gizlilik denetimi hâlâ gerekli.


### Mimo, ödül sistemi ve kaynak SRS — geliştirme dalı
- Kişisel karakter paketi: 10 adet 12 kareli şeffaf GIF ve 1 durağan PNG. Yerel paketin tüm 121 karesi Python/Pillow ile okunmuş ve ilk karelerin alfa kanalı doğrulanmıştır. Görsel dosyalar kişisel olduğundan kamuya açık depoya konmadı. Mimo → Animasyon ve sesler → JSON paketini içe aktar; IndexedDB medya deposunda kalır. Bu, gerçek zamanlı 3D model değil, gerçekçi görünümlü animasyonlardır.
- Her sayfada mevcut kedi bileşeni paketten animasyon seçer; ilerleme, görev bitişi, mola, bekleyen geçmiş görev, hediye, pati, oyun, sevgi, yoğurma ve uyku durumları. 14 sanal Petshop ürünü; hedefe seçilen eşya ve kişisel gerçek hayat ödülü. Mavi yatak koşulsuz erişilebilir. Gerçek satın alma yok. Günlük Pomodoro seti ödülleri tamamlanma gününe göre kaydedilir; görev ve hedef ödülleri gerçek tamamlanma sayısından türetilir.
- Ses: Kerzoven, Cat Purr & Meow, CC0, https://opengameart.org/content/cat-purr-meow . Beş WAV için kullanıcı başlatmalı indirme ve yerel dosya yükleme; ses düzeyi ve susturma, özgün kısa başarı melodisi. Bu çalışma ortamından ses dosyaları indirilemedi. CORS, tarayıcı ses oynatma izni ve fiziksel cihaz sesleri test edilmedi. İçe aktarılan gerçek kayıtlar kullanılır; yeni kedi sesi henüz cihazda hazır kabul edilmez.
- Kaynak/kitap bölümlerine SRS hedefi, yöntem, süre, ilk çalışma beyanı; 5 zorluk profili, gerçek aktif hatırlama kaydı, erken tekrarın vadesini koruma, başarısızlıkta kısa tekrar, sıradaki vade, geçmiş ve duraklatma; Bugün/agendaRows5 bağlantısı. Mevcut kelime SRS geçmişi değiştirilmedi. Genel SRS için profil düzenleme, tüm modüllerle zaman bütçesi ve günlük 10 yeni kelime otomasyonu henüz tam kapsamlı değil.
- Testler: V8 sözdizimi; taklit uygulama durumu ile iki görev, beş Pomodoro, bir sonlu hedef, aynı ödülün tekrar verilmemesi ve gün sınırı. SRS erken/başarılı/başarısız vade hesapları, geciken tekrarın tekil ajanda görünümü, süre tahmini ve kapatma. Bunlar gerçek Chromium entegrasyon testleri değildir. Çoklu sekme eşzamanlılığı ve IndexedDB medya yedeği/kurtarma tam regresyonu açıktır.
- Issue #1 kapsam denetimi: 116 haftanın gerçek özel veri aktarımı ve tümüyle kaynak bağlantılı uygulaması; günlük 10 yeni kelime ve tam SRS yük motoru; Goodnotes uyumlu dijital defter/PDF kalemi; bütün kitapların/kapakların içe aktarımı ve otomatik ses çözümleme; tüm P90X DVD/hareket/video doğrulaması; gerçek pole/esneklik paketlerinin tam entegrasyonu; gelişmiş özelleştirilebilir dashboard, kök ağı ve kelime evreni; fiziksel cihaz ve gerçek tarayıcı regresyonları henüz tamamlanmadı. Özel veri ve telifli içerik için mevcut kamuya açık depo geçmişi denetlenmeden yayın önerilmez. Geliştirme dalı canlı Pages dalına birleştirilmedi.

### Günlük yeni kelimeler, kelime evreni ve dijital defter
- 10 yeni kelime (düzenlenebilir miktar ve günler), mevcut arşivden seçme/arama/öneri, daha önce çalışılan kartları dışlama, sonlu Pomodoro oturumu. Yalnızca doğru İngilizce yazılı hatırlama ilk öğrenme kaydı oluşturur; orta profil ile ilk 4 günlük vade başlar. Önceki kelime SRS tarihleri korunur. Seçilen ve ilk doğru hatırlanan miktar ayrıdır. Bugün ve ajandaya hedef yansır, geçmiş günlük miktar kaydı korunur. Bu ilk çalışma kaydı uzun vadeli ustalık değildir. Mevcut Flashcard SRS'nin tüm eski puanlama/failure kuralları henüz yeniden tasarlanmadı.
- Kelime evreni: 240 kart/sayfa, CEFR ve arama, gerçek zorluk/ustalık renkleri, vadesi gelen kartta sınır, hover/klavye odağı bilgisi, tıklayınca mevcut kart. Tüm ek filtreler ve Anki tarih heatmap entegrasyonu açık.
- MUSES Notes: çok sayfalı defter, 4 kâğıt şablonu, yerel vektör kalem kayıtları, basınç, 5 araç, renk/kalınlık, silme, geri al/yinele, sayfa kopyalama/silme, metin notu, düzenlenebilir JSON içe/dışa aktarım ve sayfa PNG. Goodnotes yerel biçimi/PDF üzerinde çizim, lasso, cetvel, iPad fiziksel kalem testi ve tüm gelişmiş araçlar açık.
- Test: yeni kelime seçiminde mükerrer dışlama, yanlış cevap ve eski kelimenin yeni sayılmaması, bir kez doğru hatırlama, 4 gün sonra vade, ajanda geçmişi kontrolü (6 kontrollü mantık testi). Defter oluşturma, sayfa ekleme/kopyalama/silme, gezinme, silgi geometrisi ve defter silme (7 kontrollü mantık testi). Sözdizimi kontrolü. tests/mx-regression.mjs tekrar çalıştırılabilir test dosyası eklendi. Tam tarayıcı testi için bu ortamda file:// ve HTTPS navigasyonu ERR_BLOCKED_BY_ADMINISTRATOR, GitHub ağ erişimi DNS hatası verdi; uzak depodaki büyük index.html ve tüm P1 uzantılarını gerçek tarayıcıda birlikte çalıştırmak doğrulanmadı. Yeni test dosyasının Node ile tam depo üzerinde çalıştırılması ve fiziksel cihazlar açık.
- Önceki eksikler listesi geçerlidir: 116 haftanın özel program verisi, kitap/PDF/EPUB/DOCX dönüşümü, PDF defter araçları, otomatik altyazı, tüm P90X videoları ve hareket eşleştirmeleri, pole/esneklik özel kaynak aktarımı, kök ağının kapsamlı iyileştirmesi, gerçek kedi sesleri, özel arşiv ayrımı ve canlı Pages yayını. Bunlar tamamlanmış gösterilmemelidir.
