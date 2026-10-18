# 09 - Çıktı Formatları ve Raporlama (Output & Reporting)

Nmap ile gerçekleştirilen taramaların sonuçlarını doğru formatta saklamak; kanıt niteliği taşımak, sızma testi raporlarına dahil etmek ve diğer güvenlik araçlarına (Metasploit, Nuclei, EyeWitness vb.) veri aktarmak için zorunludur.

---

## 📄 1. Temel Çıktı Formatları

Nmap 5 farklı çıktı biçimini destekler:

| Parametre | Format Adı | Dosya Uzantısı | Açıklama |
| :--- | :--- | :---: | :--- |
| **`-oN`** | Normal Metin | `.nmap` | Ekranda görülen insan tarafından okunabilir standart metin çıktısı. |
| **`-oX`** | XML Biçimi | `.xml` | Programatik analiz, otomasyon araçları ve HTML dönüştürme için standart format. |
| **`-oG`** | Grep Edilebilir | `.gnmap` | Her hostun tek satıra yazıldığı; `grep`, `awk` ve `cut` ile kolayca filtrelenebilen format. |
| **`-oS`** | ScripT KIdDiE | `.txt` | Harflerin büyüklü küçüklü yazıldığı Nmap'in klasik mizahi çıktısı (h4ck3r stili). |
| **`-oA`** | **Tüm Formatlar** | *hepsi* | **En çok önerilen yöntem.** Normal, XML ve Grep formatlarının üçünü birden tek isimle kaydeder. |

```bash
# Üç formatı aynı anda kaydet (rapor_adi.nmap, rapor_adi.xml, rapor_adi.gnmap)
nmap -sC -sV -oA rapor_adi 192.168.1.1
```

---

## 🌐 2. XML Çıktısını Şık HTML Rapora Dönüştürme (`xsltproc`)

Nmap XML çıktıları XSLT stil şablonları içerir. `xsltproc` aracıyla bu XML dosyasını tarayıcılarda görüntülenebilen modern bir HTML yönetim raporuna dönüştürebilirsiniz:

```bash
# 1. Adım: XML çıktısı alın
nmap -sV -sC -oX denetim_sonuc.xml 192.168.1.0/24

# 2. Adım: HTML'e dönüştürün
xsltproc denetim_sonuc.xml -o denetim_raporu.html

# 3. Adım: Tarayıcıda açın
xdg-open denetim_raporu.html # Linux
open denetim_raporu.html     # macOS
```

---

## 🔍 3. Sonuç Filtreleme ve Ayrıntı Bayrakları

### 3.1 Yalnızca Açık Portları Gösterme (`--open`)
Kapalı ve filtrelenmiş yüzlerce gereksiz satırı gizler; yalnızca açık portları ekrana ve rapora basar:
```bash
nmap --open 192.168.1.1
```

### 3.2 Port Durum Nedenini Gösterme (`--reason`)
Bir portun neden açık veya kapalı kabul edildiğini belirten bayrağı gösterir:
```bash
nmap --reason -p 80,443 192.168.1.1
# Çıktı örneği: 80/tcp open http syn-ack ttl 54
```

### 3.3 Ayrıntı Düzeyi (`-v` / `-vv` / `-vvv`)
Tarama sürerken bulunan portları anında ekrana basar:
```bash
nmap -vv 192.168.1.1
```

### 3.4 Ham Paket İzleme (`--packet-trace`)
Nmap'in gönderdiği ve aldığı tüm ham paketleri hex ve başlık detaylarıyla canlı izler:
```bash
sudo nmap --packet-trace -p 80 192.168.1.1
```

---

## 🛠️ 4. Grepable Format (.gnmap) ile Bash Tek Satırlık Komutlar

Sızma testlerinde binlerce IP taranırken `.gnmap` formatı büyük kolaylık sağlar:

```bash
# Açık 80 veya 443 portu bulunan IP'leri tek satırda ayıkla
grep -E "80/open|443/open" tarama.gnmap | cut -d " " -f 2 > web_ipleri.txt

# Açık SMB (445) portuna sahip hedefleri listele
grep "445/open" tarama.gnmap | awk '{print $2}' > smb_hedefler.txt

# Bulunan tüm açık portları benzersiz olarak listele
grep "Ports:" tarama.gnmap | sed -e 's/.*Ports: //' -e 's/, /\n/g' | cut -d "/" -f 1 | sort -u
```

---

## ⏸️ 5. Yarıda Kalan Taramayı Devam Ettirme (`--resume`)

Uzun süren bir C sınıfı veya B sınıfı ağ taraması elektrik kesintisi veya bağlantı kopmasıyla yarıda kaldığında:
```bash
# Normal veya Grepable çıktı dosyası kullanılarak kaldığı yerden devam edilir
nmap --resume yarida_kalan.nmap
```
