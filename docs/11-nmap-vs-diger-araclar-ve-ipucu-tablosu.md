# 11 - Nmap vs. Diğer Araçlar ve Gizli İpuçları Tablosu

Modern siber güvenlik operasyonlarında Nmap tek başına değil, ekosistemdeki diğer hızlı tarayıcılarla birlikte bir boru hattı (pipeline) şeklinde kullanılır.

---

## ⚖️ 1. Araç Karşılaştırması (Nmap vs. Masscan vs. RustScan vs. Naabu)

| Kriter | 🛡️ Nmap | ⚡ Masscan | 🦀 RustScan | 🚀 ProjectDiscovery Naabu |
| :--- | :--- | :--- | :--- | :--- |
| **Geliştirildiği Dil** | C / C++ / Lua | C (Asenkron) | Rust | Go |
| **En Güçlü Yönü** | Derinlemesine analiz, OS, sürüm, 600+ NSE script | Tüm interneti dakikalar içinde tarayabilme (10M pps) | Hızlı port bulup doğrudan Nmap'e aktarma | Modern bulut uyumu, subfinder/httpx entegrasyonu |
| **Versiyon & OS Analizi** | ⭐⭐⭐⭐⭐ (Endüstri standardı) | ⭐ (Yok / Yetersiz) | Nmap'e devreder | ⭐ (Temel banner) |
| **Scripting Yeteneği** | ⭐⭐⭐⭐⭐ (NSE - Lua) | Yok | Yok | Yok |
| **Kullanım Amacı** | Hedef odaklı derin analiz, zafiyet avı | Geniş IP bloklarında açık portları anında bulma | Yerel CTF ve hızlı testlerde port yakalama | Saldırı yüzeyi yönetimi (ASM), Recon pipeline |

---

## 🔗 2. Altın Keşif Kombinasyonu (Two-Stage Recon Pipeline)

Büyük IP bloklarında en verimli yaklaşım iki aşamalı hibrit modeldir:

```text
[Geniş Ağ Bloğu] ➔ [Masscan / Naabu (Ultra Hızlı Port Keşfi)] ➔ [Nmap (Derinlemesine -sV -sC Analiz)]
```

### Örnek Bash Otomasyonu:
```bash
# 1. Aşama: Naabu ile tüm portları saniyeler içinde tara ve açık olanları kaydet
naabu -host 192.168.1.50 -p - -silent -o open_ports.txt

# 2. Aşama: Bulunan portları Nmap'e aktararak derinlemesine incele
PORTS=$(cat open_ports.txt | cut -d ":" -f 2 | paste -sd "," -)
sudo nmap -sV -sC -O -p $PORTS 192.168.1.50 -oA derin_analiz
```

---

## ⌨️ 3. Tarama Sırasında Çalışan Canlı Klavye Kısayolları

Nmap terminalde çalışırken Enter tuşuna basmaktan çok daha fazlasını yapabilirsiniz! Tarama esnasında aşağıdaki tuşlara basarak canlı müdahale edebilirsiniz:

| Tuş | Eylem | Açıklama |
| :---: | :--- | :--- |
| **`Space` veya `Enter`** | **Durum Raporu** | Taramanın tahmini bitiş yüzdesini ve kalan süreyi ekrana basar. |
| **`v`** | **Ayrıntıyı Artır (Verbosity +)** | Verbosity seviyesini +1 artırır; bulunan yeni portlar hemen listelenir. |
| **`V`** | **Ayrıntıyı Azalt (Verbosity -)** | Verbosity seviyesini -1 azaltır. |
| **`d`** | **Hata Ayıklamayı Artır (Debug +)** | Debug seviyesini artırarak gönderilen probların detayını gösterir. |
| **`D`** | **Hata Ayıklamayı Azalt (Debug -)** | Debug seviyesini azaltır. |
| **`p`** | **Paket İzlemeyi Aç (Packet Trace)** | Gönderilen ve alınan tüm ham paket dökümünü canlı açar. |
| **`P`** | **Paket İzlemeyi Kapat** | Canlı paket dökümünü durdurur. |
| **`?`** | **Kısayol Yardımı** | Tarama esnasında kullanabileceğiniz tüm tuş kombinasyonlarını gösterir. |

---

## 🕵️ 4. Az Bilinen Gizli Nmap Parametreleri

* **`--stats-every 10s`**: Her 10 saniyede bir taramanın yüzdelik durumunu otomatik ekrana basar (Arka plan betikleri için harikadır).
* **`--send-eth`**: İşletim sisteminin ağ yığınını atlayıp paketleri doğrudan Ethernet katmanından (Raw Ethernet Frames) basar.
* **`--defeat-rst-ratelimit`**: Hedefteki RST rate-limit korumasını atlayarak kapalı port bekleme süresini sıfırlar.
* **`--script-help <script_adi>`**: Scriptin ne işe yaradığını, kategorilerini ve hangi argümanları kabul ettiğini doğrudan terminalde gösterir.
* **`--datadir <dizin>`**: Özel `nmap-services`, `nmap-os-db` veya script dizini tanımlamanızı sağlar.
