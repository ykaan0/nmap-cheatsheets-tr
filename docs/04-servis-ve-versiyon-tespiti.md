# 04 - Servis ve Versiyon Tespiti (Service & Version Detection)

Bir portun sadece açık olduğunu bilmek bir sızma testi için yeterli değildir. Port 80 üzerinde Apache mi, Nginx mi, IIS mi yoksa gömülü bir IoT cihazının mini web sunucusu mu çalışıyor? Dahası bu yazılımın tam sürümü nedir (Örn: `Apache 2.4.49` zafiyetli mi)?

İşte bu soruların cevabını Nmap'in **Servis ve Versiyon Tespiti (`-sV`)** motoru verir.

---

## 🛠️ 1. Servis Versiyon Tespiti Nasıl Çalışır?

Nmap bir portu açık bulduğunda:
1. Port üzerinde bekleyen servisin "Hoş geldiniz" (Welcome banner) mesajını dinler.
2. `nmap-service-probes` dosyasında yer alan binlerce özel bayt dizilimine sahip probu sırayla gönderir.
3. Servisten dönen yanıtı regex kurallarıyla karşılaştırarak;
   - Servis Adı (Product)
   - Sürüm Numarası (Version)
   - Ek Bilgiler (Hostname, OS, Device Type, Info) alanlarını doldurur.

```bash
# Standart servis ve versiyon tespiti
nmap -sV 192.168.1.50
```

---

## 🎚️ 2. Prob Yoğunluğu (Version Intensity: 0 - 9)

Her prob gönderme işlemi zaman ve bant genişliği harcar. Nmap bu süreci kontrol etmek için 0 ile 9 arasında yoğunluk seviyeleri sunar:

| Parametre | Seviye | Açıklama |
| :--- | :---: | :--- |
| **`--version-light`** | 2 | Hafif tarama; yalnızca en yüksek olasılıklı probları dener. Çok hızlıdır. |
| **Standart (`-sV`)** | 7 | Varsayılan yoğunluk. Çoğu bilinen servisi hatasız tanır. |
| **`--version-all`** | 9 | Tüm probları istisnasız dener. Alışılmadık portlarda koşan garip servisleri çözer. |
| **`--version-intensity <0-9>`** | 0-9 | Manuel olarak yoğunluk seviyesi belirlemenizi sağlar. |

```bash
# Hızlı keşif için hafif versiyon tespiti
nmap -sV --version-light -p 80,443,22 192.168.1.1

# Bilinmeyen bir servisi zorla tespit etmek için tam yoğunluk
nmap -sV --version-all -p 31337 192.168.1.1
```

---

## 🔬 3. Versiyon Hata Ayıklama (`--version-trace`)

Eğer Nmap bir servisi tanıyamıyorsa veya yanlış tahmin yapıyorsa, arka planda hangi probların gönderildiğini ve hedefin ne yanıt verdiğini canlı izleyebilirsiniz:

```bash
nmap -sV --version-trace -p 8080 192.168.1.1
```

---

## 📡 4. RPC Taraması (`-sR`)

Sunucu üzerindeki RPC (Remote Procedure Call) servislerini sorgular. Portmap/rpcbind (port 111) servisiyle konuşarak çalışan RPC program numarasını ve sürümünü çözer:

```bash
nmap -sV -sR -p 111 192.168.1.1
```

---

## 💡 İpuçları ve En İyi Uygulamalar

1. **Önce Hızlı SYN Taraması Yapın:** Doğrudan tüm portlara `-sV` atmak saatler sürebilir. Önce açık portları listeleyin, ardından sadece açık portlara `-sV` uygulayın:
   ```bash
   # 1. Adım: Açık portları bul
   sudo nmap -sS -p- --open -n -T4 192.168.1.50 -oG ports.gnmap

   # 2. Adım: Sadece bulunan portlarda versiyon analizi yap
   nmap -sV -p 22,80,443,3306 192.168.1.50 -oA service_detail
   ```
2. **SSL/TLS Servislerini Otomatik Algılama:** Nmap, düz HTTP portunda SSL çalışıp çalışmadığını otomatik anlayarak güvenli el sıkışma başlatır.
