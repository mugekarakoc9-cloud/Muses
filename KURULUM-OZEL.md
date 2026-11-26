# MUSES — kişisel Android ve Linux kurulumu

## Android
Özel GitHub Actions çalışmasındaki `MUSES-private-android` ZIP paketini aç.
İçindeki `MUSES.apk` dosyasına dokun ve Android kurulum ekranını tamamla.
Mevcut MUSES uygulamasını kaldırmadan üzerine güncelle; imza ve paket adı korunur.
Bu paket kendi dosyalarını içerir, Codespaces bağlantısına ihtiyaç duymaz.

## Linux: Ubuntu / Debian / Mint
`MUSES-Linux.deb` dosyasını yazılım yükleyiciyle açıp kur. Ardından uygulamalar
menüsünden **MUSES**’i aç. Chrome/Chromium varsa ayrı uygulama penceresi açılır;
diğer tarayıcılarda normal sekme açılır. Python 3 ve bir tarayıcı gereklidir.

Diğer Linux dağıtımları için `MUSES-Linux.zip` paketini çıkart. Çıkartılan
`MUSES-Linux` klasöründe terminal açıp `python3 install.py` çalıştır.
Kurulum yalnız kendi kullanıcı hesabına yapılır; sudo gerekmez.
İki kurulum yönteminden yalnız birini seç.

Linux sürümü `http://127.0.0.1:8765/` adresinde yalnız kendi bilgisayarında
çalışır. MUSES simgesi yerel sunucuyu da başlatır. Bilgisayarı yeniden başlattıktan
sonra doğrudan eski sekmeyi değil MUSES simgesini aç. Bu adres telefonda çalışmaz;
telefon için APK’yı kullan. Uygulama mağazası veya herkese açık site gerekmez.

## Kayıtların
Mevcut tarayıcı kurulumu, Linux kurulumu ve Android APK farklı depolama alanlarıdır.
Kayıtlar kendiliğinden taşınmaz veya cihazlar arasında eşitlenmez.
Eski uygulamada **Yaşam → Ayarlar → Yedek al** ile JSON indir; yeni kurulumda
**Yedek yükle** ile aynı dosyayı seç. Yerel videoların için **Videolarla tam yedek al**
seçeneğini kullan. İçe aktarım yeni cihazdaki mevcut kayıtları değiştirebilir;
önce her iki cihazın yedeğini sakla. Tarayıcı verilerini temizleme veya APK’yı kaldırma.
Linux sürümü tarayıcının mevcut profilini kullanır; hep aynı tarayıcı ve profili kullan.

## Eski Codespaces bağlantısı neden hata verebilir?
Özel bağlantı GitHub oturumu ister. Codespace durduğunda veya 8080 portundaki
sunucu kapanınca bağlantı uygulamayı açamaz. GitHub hesabına giriş yapıp mevcut
Codespace’i aç; terminalde depo klasöründe şu komutu çalıştır:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Ports sekmesinde 8080 portunu **Private** tut. Önceden kullandığın aynı adresi aç;
bu eski kayıtlarının bulunduğu tarayıcı alanını korur. Sunucu zaten çalışıyorsa
ikinci kez başlatma. Paketler Codespace kapanmasından etkilenmez.

## Doğrulama sınırı
Kaynak sözdizimi/katalog kontrolleri ve önizlemede ana ekran/ajanda açılışı kontrol
edildi. Android imzalı APK derlemesi başarılıdır. Fiziksel Android cihazda kurulum,
bildirimler, mikrofon, dosya dışa aktarımı ve gerçek Linux masaüstü kurulumu ayrıca
doğrulanmalıdır. Kodda kullanıcı kayıtlarını dönüştüren veya silen değişiklik yoktur.
