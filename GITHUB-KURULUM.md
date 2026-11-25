# GitHub bağlantısı

Bu proje özel çalışma arşivini ve kitap içeriklerini barındırır. **Public depoya göndermeyin.**

1. Muses GitHub deposunda Settings → General → Danger Zone → Change repository visibility → Private.
2. GitHub Settings → Applications → Installed GitHub Apps → ChatGPT/OpenAI bağlantısını yapılandırın; Muses deposuna erişim ve Contents yazma izni sağlayın. ChatGPT entegrasyonunun depoya erişimi yeniden bağlandıktan sonra kontrol edilmelidir.
3. İsterseniz yerel Git bundle dosyasından Git geçmişini kendiniz geri yükleyebilirsiniz (GitHub deposu boş ve private olduğunda):

```sh
git clone MUSES-Life-Studio-v0.10-private.bundle Muses
cd Muses
git remote set-url origin https://github.com/mugekarakoc9-cloud/Muses.git
# Private olduğunu ve depoya yazma yetkinizi doğruladıktan sonra:
git push -u origin main
```

Mevcut uzak depoda başka commitler varsa force-push yapmayın; önce `git fetch` ile geçmişi inceleyin.
