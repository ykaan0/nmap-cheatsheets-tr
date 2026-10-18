# Katkıda Bulunma Rehberi (Contributing Guidelines)

Öncelikle bu projeye katkı sağlamak istediğiniz için teşekkür ederiz! 🎉

Bu depo; siber güvenlik araştırmacıları, sızma testi uzmanları ve açık kaynak topluluğu tarafından geliştirilen **interaktif Türkçe Nmap başvuru kılavuzudur**.

---

## 🛠️ Nasıl Katkıda Bulunabilirsiniz?

1. **Yeni Nmap Parametreleri ve İpuçları:**
   - Eksik olduğunu düşündüğünüz bayrakları veya pratik kullanım senaryolarını ekleyin.
2. **Yeni NSE Script Örnekleri:**
   - Yeni keşfedilen kritik CVE'ler veya faydalı bilgi toplama scriptleri için yeni kartlar ve dokümanlar ekleyin.
3. **Web Arayüzü İyileştirmeleri:**
   - `index.html`, `style.css` ve `app.js` dosyalarında siber tema görsel kalitesini, arama hızını veya komut oluşturucu seçeneklerini geliştirin.
4. **Yazım ve Çeviri Düzeltmeleri:**
   - Dokümanlardaki teknik terimlerin Türkçeleştirilmesi ve yazım hatalarının düzeltilmesi.

---

## 📋 Katkı Adımları (Pull Request Süreci)

1. Depoyu forklayın (Fork).
2. Özelliğiniz için yeni bir dal (branch) açın:
   ```bash
   git checkout -b ozellik/yeni-nse-senaryosu
   ```
3. Değişikliklerinizi yapın ve yerel olarak test edin:
   - `index.html` dosyasını tarayıcınızda açarak komut oluşturucunun ve arama fonksiyonunun sorunsuz çalıştığını doğrulayın.
4. Değişikliklerinizi commit edin (Anlaşılır ve Türkçe commit mesajları tercih edilir):
   ```bash
   git commit -m "feat: smb-vuln denetimleri için yeni kartlar eklendi"
   ```
5. Dalınızı GitHub'a gönderin (Push):
   ```bash
   git push origin ozellik/yeni-nse-senaryosu
   ```
6. Ana depoya yönelik bir **Pull Request (PR)** açın.

---

## ⚖️ Kod ve İçerik Standartları

- Açıklamalar sade, anlaşılır ve teknik doğruluğu yüksek Türkçe ile yazılmalıdır.
- Komutlarda kullanılan parametrelerin ne işe yaradığı mutlaka maddeler halinde belirtilmelidir.
- Zararlı, yıkıcı veya yetkisiz sistemlere zarar vermeyi teşvik eden açıklamalar kabul edilmez.
