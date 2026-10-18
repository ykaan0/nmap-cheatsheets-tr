# 06 - Nmap Scripting Engine (NSE) Kılavuzu

**Nmap Scripting Engine (NSE)**, Nmap'i basit bir port tarayıcısından gelişmiş bir siber güvenlik ve zafiyet denetim aracına dönüştüren en güçlü bileşendir. Lua programlama diliyle yazılmış 600'den fazla hazır betik (script) barındırır.

---

## 🏷️ 1. NSE Script Kategorileri

NSE scriptleri işlevlerine ve risk seviyelerine göre 14 resmi kategoriye ayrılır:

| Kategori | Açıklama | Risk Seviyesi | Örnek Kullanım |
| :--- | :--- | :---: | :--- |
| **`default`** | Hızlı, güvenli ve yüksek oranda faydalı varsayılan scriptler (`-sC`). | Çok Düşük | `nmap -sC <hedef>` |
| **`safe`** | Hedef sistemi çökertme riski olmayan, servisleri zorlamayan betikler. | Çok Düşük | `nmap --script safe <hedef>` |
| **`discovery`** | Ağ, alt alan adı, paylaşımlar ve servisler hakkında aktif bilgi toplayanlar. | Düşük | `nmap --script discovery <hedef>` |
| **`vuln`** | Bilinen zafiyetleri (CVE'ler, güvenlik açıkları) denetleyen betikler. | Orta | `nmap --script vuln <hedef>` |
| **`auth`** | Hedef servisteki kimlik doğrulama mekanizmalarını ve açık izinleri sorgular. | Düşük | `nmap --script auth <hedef>` |
| **`brute`** | Parola kaba kuvvet (brute-force) denemeleri yapar. | Yüksek | `nmap --script brute <hedef>` |
| **`exploit`** | Tespit edilen zafiyeti aktif olarak sömürmeye çalışan betikler. | Çok Yüksek | `nmap --script exploit <hedef>` |
| **`intrusive`** | Sistemi yavaşlatabilecek veya çökertme riski bulunan agresif scriptler. | Yüksek | `nmap --script intrusive <hedef>` |
| **`malware`** | Hedefte backdoor veya zararlı yazılım izi arayan scriptler. | Düşük | `nmap --script malware <hedef>` |
| **`fuzzer`** | Protokol fuzzing yaparak beklenmeyen yanıtlar ve çökmeler arar. | Yüksek | `nmap --script fuzzer <hedef>` |
| **`dos`** | Hizmet dışı bırakma (Denial of Service) zafiyetlerini test eder. | Çok Yüksek | `nmap --script dos <hedef>` |
| **`broadcast`** | Yerel ağda broadcast yaparak cihaz keşfi gerçekleştirir. | Düşük | `nmap --script broadcast` |
| **`external`** | Whois, Shodan, VirusTotal gibi üçüncü taraf harici API'lerle konuşur. | Düşük | `nmap --script external <hedef>` |
| **`version`** | `-sV` motorunu genişleten özel sürüm çıkarma betikleri. | Düşük | `nmap -sV --script version <hedef>` |

---

## 🚀 2. En Çok Kullanılan NSE Komut Kombinasyonları

### 2.1 Güvenli Zafiyet Taraması (DoS Scriptleri Hariç)
Zafiyetleri taramak isterken hedef sistemi kilitlememek için DoS scriptlerini hariç tutmak hayati önem taşır:
```bash
# Vuln kategorisini çalıştır ama dos ve intrusive olanları atla
nmap -sV --script "vuln and not (dos or intrusive)" 192.168.1.50
```

### 2.2 SMB ve Windows Güvenlik Denetimleri
Windows Domain Controller veya dosya sunucularına yönelik denetimler:
```bash
# EternalBlue (MS17-010) kontrolü
nmap -p 445 --script smb-vuln-ms17-010 192.168.1.10

# Tüm SMB zafiyet kontrolleri
nmap -p 445 --script "smb-vuln-*" 192.168.1.10

# SMB Anonim Paylaşım ve Kullanıcı Numaralandırma
nmap -p 139,445 --script smb-enum-shares,smb-enum-users 192.168.1.10

# SMB İmzalama (Signing) Gereksinimi (Relay saldırıları için kritik)
nmap -p 445 --script smb2-security-mode 192.168.1.10
```

### 2.3 Web Sunucusu ve HTTP Keşifleri
```bash
# Yönetim panelleri ve hassas dosyaları bulma
nmap -p 80,443 --script http-enum 192.168.1.1

# HTTP Güvenlik Başlıkları (HSTS, CSP, X-Frame-Options vb.)
nmap -p 80,443 --script http-security-headers 192.168.1.1

# İzin verilen HTTP metotları (PUT, DELETE, TRACE tehlikelidir)
nmap -p 80,443 --script http-methods 192.168.1.1

# Web SQL Injection Açığı Kontrolü
nmap -p 80,443 --script http-sql-injection 192.168.1.1
```

### 2.4 SSL/TLS Kriptografik Güvenlik Analizi
```bash
# Desteklenen SSL/TLS sürümleri ve zayıf şifreleme anahtarları (SWEET32, RC4 vb.)
nmap -p 443 --script ssl-enum-ciphers 192.168.1.1

# Heartbleed (CVE-2014-0160) Zafiyet Kontrolü
nmap -p 443 --script ssl-heartbleed 192.168.1.1
```

---

## ⚙️ 3. Script Argümanları (`--script-args`)

Scriptlerin çoğu kullanıcı adı listesi, parola veritabanı veya hedef URL gibi parametrelere ihtiyaç duyar. Bu parametreler `--script-args` ile aktarılır:

```bash
# HTTP Basic Auth Kaba Kuvvet Denemesi
nmap -p 80 --script http-brute --script-args userdb=kullanicilar.txt,passdb=parolalar.txt 192.168.1.1

# Özel User-Agent Belirleme
nmap -p 80 --script http-enum --script-args "http.useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64)'" 192.168.1.1
```

---

## 🛠️ 4. NSE Bakımı ve Hata Ayıklama

```bash
# Script veritabanını güncelleme
sudo nmap --script-updatedb

# Script yardım ve kullanım kılavuzunu görüntüleme
nmap --script-help smb-vuln-ms17-010

# Script çalışırken canlı ağ paketlerini ve debug loglarını görme
nmap -p 80 --script http-enum --script-trace 192.168.1.1
```
