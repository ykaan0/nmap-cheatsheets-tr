# Nmap Siber Güvenlik ve Ağ Tarama Kılavuzu (Nmap Cheatsheet TR)

![Lisans: MIT](https://img.shields.io/badge/Lisans-MIT-00ff66.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=black)
![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20macOS%20%7C%20Windows-003311?style=for-the-badge&logo=linux&logoColor=00ff66)
![Nmap Version](https://img.shields.io/badge/Nmap-v7.95%2B-00ff66?style=for-the-badge&logo=wireshark&logoColor=black)
[![Canlı Web Sitesi](https://img.shields.io/badge/%F0%9F%8C%90_Canl%C4%B1_Aray%C3%BCz-ykaan0.github.io%2Fnmap--cheatsheets--tr-00ff66?style=for-the-badge&logo=githubpages&logoColor=black)](https://ykaan0.github.io/nmap-cheatsheets-tr/)
![Katkılara Açık](https://img.shields.io/badge/Katk%C4%B1lara-A%C3%A7%C4%B1k-brightgreen.svg?style=for-the-badge)

> 🚀 **İnteraktif Siber Web Arayüzü & Canlı Komut Oluşturucu:**
> Tüm parametreleri interaktif olarak denemek, özel parametre kombinasyonlarıyla tek tıkla komut üretmek ve canlı arama yapmak için yerel veya web arayüzünü kullanabilirsiniz:
> 👉 **[İnteraktif Nmap Komut Paneli (Canlı Web Sitesi)](https://ykaan0.github.io/nmap-cheatsheets-tr/)** *(veya yerel [index.html](index.html) dosyası)*

---

```
   _  __                     _____ _                _   _____ _                 _   
  | \ | |                   / ____| |              | | / ____| |               | |  
  |  \| |_ __ ___   __ _ _ | |    | |__   ___  __ _| || (___ | |__   ___   ___ | |_ 
  | . ` | '_ ` _ \ / _` | || |    | '_ \ / _ \/ _` | __/\___ \| '_ \ / _ \ / _ \| __|
  | |\  | | | | | | (_| | || |____| | | |  __/ (_| | |_ ____) | | | |  __/|  __/| |_ 
  |_| \_|_| |_| |_|\__,_|_| \_____|_| |_|\___|\__,_|\__|_____/|_| |_|\___| \___| \__|
                  CYBER RECONNAISSANCE & AUDIT ENGINE [TURKISH EDITION]
```

Bu depo; sızma testi uzmanları (pentester), güvenlik analistleri (blue/red team), sistem yöneticileri ve siber güvenlik meraklıları için hazırlanmış **en kapsamlı Türkçe Nmap (Network Mapper) başvuru kaynağıdır**. Temel port taramasından gelişmiş NSE (Nmap Scripting Engine) betiklerine, IDS/IPS/Firewall atlatma (evasion) tekniklerinden performans optimizasyonuna ve kurumsal pentest senaryolarına kadar Nmap'in tüm derinliklerini kapsar.

---

## 📑 İçindekiler Tablosu

1. [🔥 En Çok Kullanılan Kullanımlar (Daily Drivers)](#-en-çok-kullanılan-kullanımlar-top-daily-drivers)
2. [📚 Detaylı Modül Kılavuzları](#-detaylı-modül-kılavuzları)
3. [⚡ Hızlı Başvuru Kartları (Quick Reference)](#-hızlı-başvuru-kartları-quick-reference)
   - [Hedef Belirleme & Kapsam](#1-hedef-belirleme--kapsam-ip-aralık-liste)
   - [Host Keşfi (Host Discovery & Ping)](#2-host-keşfi-host-discovery--ping)
   - [Port Tarama Teknikleri](#3-port-tarama-teknikleri-scan-techniques)
   - [Port Belirleme ve Aralıklar](#4-port-belirleme-ve-aralıklar)
   - [Servis & Versiyon Tespiti](#5-servis-ve-versiyon-tespiti)
   - [İşletim Sistemi (OS) Analizi](#6-i̇şletim-sistemi-os-analizi)
   - [Nmap Scripting Engine (NSE)](#7-nmap-scripting-engine-nse)
   - [Güvenlik Duvarı / IDS Atlatma (Evasion & Spoofing)](#8-güvenlik-duvarı-ids-atlatma-evasion--spoofing)
   - [Zamanlama & Performans Optimizasyonu](#9-zamanlama--performans-optimizasyonu)
   - [Çıktı Formatları & Raporlama](#10-çıktı-formatları--raporlama)
4. [🧪 Gerçek Hayat Sızma Testi Senaryoları (Playbooks)](#-gerçek-hayat-sızma-testi-senaryoları-playbooks)
5. [🌐 İnteraktif Web Arayüzü Özellikleri](#-i̇nteraktif-web-arayüzü-özellikleri)
6. [📁 Depo Dosya Yapısı](#-depo-dosya-yapısı)
7. [💻 Hızlı Kurulum & Docker ile Çalıştırma](#-hızlı-kurulum--docker-ile-çalıştırma)
8. [⚖️ Yasal ve Etik Sorumluluk Reddi](#-yasal-ve-etik-sorumluluk-reddi)

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)

Sahada ve güvenlik operasyonlarında en sık kullanılan 12 altın Nmap komut kombinasyonu:

| Amaç | Komut | Açıklama & Not |
| :--- | :--- | :--- |
| **Hızlı & Kapsamlı Standart Tarama** | `nmap -sC -sV -O -oA full_scan <hedef>` | Varsayılan scriptler, versiyon tespiti ve OS analizi yapar; 3 formatta kaydeder. |
| **Sessiz & Hızlı SYN Taraması** | `sudo nmap -sS -T4 -p- -oN all_ports.txt <hedef>` | Tüm 65.535 TCP portunu hızlı SYN taramasıyla inceler. |
| **Hızlı Keşif (Top 1000 Port)** | `nmap -F -sV <hedef>` | En sık kullanılan 100 portu hızlıca kontrol edip versiyonları çeker. |
| **Ping Atmadan Güvenlik Duvarı Arkası** | `nmap -Pn -sS -p 80,443,8080,8443 <hedef>` | ICMP ping'i filtreleyen hedeflerde hostu canlı kabul edip portları tarar. |
| **Kritik Zafiyet Taraması (Vuln Scripts)** | `nmap -sV --script vuln <hedef>` | Bilinen CVE'leri ve yaygın güvenlik açıklarını otomatik tespit eder. |
| **SMB & EternalBlue Analizi** | `nmap -p 445 --script smb-vuln-ms17-010,smb-vuln* <hedef>` | Windows SMB servis zafiyetlerini (MS17-010 vb.) hedefler. |
| **Kritik UDP Servisleri Keşfi** | `sudo nmap -sU -T4 -p 53,67,68,69,123,161,500 <hedef>` | DNS, DHCP, TFTP, NTP, SNMP ve IKE VPN UDP portlarını inceler. |
| **Agresif Denetim Modu** | `nmap -A -T4 <hedef>` | OS tespiti, versiyon tespiti, script tarama ve traceroute'u tek bayrakta birleştirir. |
| **WAF / IDS Atlatma (Decoy & Fragment)** | `sudo nmap -sS -D RND:10 -f -g 53 <hedef>` | 10 sahte IP (decoy) arasına gizlenir, paketleri parçalar, kaynak portu 53 yapar. |
| **Turbo Hızda Ağ Keşfi** | `sudo nmap -sS --min-rate 2000 -p- --open <hedef>` | Saniyede en az 2000 paket göndererek yalnızca açık portları anında yakalar. |
| **Yerel Ağda Yalnızca Canlı Cihazlar** | `sudo nmap -sn -PR 192.168.1.0/24` | Port taraması yapmadan yerel ağdaki cihazları ultra hızlı ARP ping ile listeler. |
| **Web Güvenlik & Dizin Keşfi** | `nmap -p 80,443 --script http-enum,http-headers,http-methods <hedef>` | HTTP metotlarını, başlıkları ve bilinen yönetim dizinlerini keşfeder. |

---

## 📚 Detaylı Modül Kılavuzları

Depodaki `docs/` dizini altında, her konu için hazırlanmış derinlemesine rehberler bulunmaktadır:

| No | Modül Kılavuzu | Açıklama |
| :---: | :--- | :--- |
| **01** | [Temel Kullanım ve Hedef Belirleme](docs/01-temel-kullanim-ve-hedef-belirleme.md) | Tekil IP, IP aralıkları, CIDR notasyonu, dosya listeleri (`-iL`), hariç tutmalar (`--exclude`). |
| **02** | [Host Keşfi ve Ping Teknikleri](docs/02-host-kesfi-ve-ping-teknikleri.md) | `-sn`, `-Pn`, TCP SYN/ACK ping (`-PS`, `-PA`), UDP ping (`-PU`), ARP ping (`-PR`), traceroute. |
| **03** | [Port Tarama Teknikleri](docs/03-port-tarama-teknikleri.md) | SYN (`-sS`), Connect (`-sT`), UDP (`-sU`), FIN (`-sF`), Xmas (`-sX`), Null (`-sN`), Idle/Zombie Scan (`-sI`). |
| **04** | [Servis ve Versiyon Tespiti](docs/04-servis-ve-versiyon-tespiti.md) | `-sV`, yoğunluk seviyeleri (`--version-intensity`), hafif/derin taramalar, RPC analizi. |
| **05** | [İşletim Sistemi (OS) Tespiti](docs/05-isletim-sistemi-tespiti.md) | `-O`, TCP/IP parmak izi analizi, tahmin zorlama (`--osscan-guess`), deneme limitleri. |
| **06** | [Nmap Scripting Engine (NSE)](docs/06-nmap-scripting-engine-nse.md) | Script kategorileri (`vuln`, `exploit`, `auth`, `discovery`), argüman geçişleri, hata ayıklama. |
| **07** | [Zamanlama ve Performans Optimizasyonu](docs/07-zamanlama-ve-performans-optimizasyonu.md) | `-T0` - `-T5`, paket hızlandırma (`--min-rate`), paralellik, gecikme kontrolü (`--scan-delay`). |
| **08** | [Güvenlik Duvarı / IDS Atlatma](docs/08-guvenlik-duvari-ids-atlatma-ve-spoofing.md) | Parçalama (`-f`, `--mtu`), Decoy (`-D`), IP/MAC sahteciliği (`-S`, `--spoof-mac`), Proxy kullanımı. |
| **09** | [Çıktı Formatları ve Raporlama](docs/09-cikti-formatlari-ve-raporlama.md) | `-oN`, `-oX`, `-oG`, `-oA`, XML'den HTML'e dönüştürme (`xsltproc`), AWK/Grep filtreleme. |
| **10** | [İleri Düzey Senaryolar & Pentest Reçeteleri](docs/10-ileri-duzey-senaryolar-ve-pentest-receteleri.md) | Active Directory, Web, SSL/TLS, SCADA/IoT ve Kablosuz alt ağ denetimleri. |
| **11** | [Nmap vs. Diğer Araçlar & İpuçları](docs/11-nmap-vs-diger-araclar-ve-ipucu-tablosu.md) | Masscan, RustScan ve Naabu karşılaştırması; Nmap bilinmeyen bayrakları ve püf noktaları. |

---

## ⚡ Hızlı Başvuru Kartları (Quick Reference)

### 1. Hedef Belirleme & Kapsam (IP, Aralık, Liste)

```bash
# Tekil IP veya Hostname
nmap 192.168.1.10
nmap scanme.nmap.org

# IP Aralığı ve CIDR Bloğu
nmap 192.168.1.1-100
nmap 10.0.0.0/24
nmap 172.16.0-5.1-254

# Dosyadan Hedef Listesi Okuma
nmap -iL hedefler.txt

# Belirli IP'leri Taramadan Hariç Tutma
nmap 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.254
nmap 192.168.1.0/24 --excludefile haric_tutulanlar.txt

# İnternet Üzerinden Rastgele Hedefler Seçme (Örn: 50 rastgele host)
nmap -iR 50 -p 80,443
```

### 2. Host Keşfi (Host Discovery & Ping)

```bash
# Sadece Canlı Cihazları Keşfet (Port taraması yapmaz)
nmap -sn 192.168.1.0/24

# Ping Kontrolünü Devre Dışı Bırak (Hostu doğrudan açık kabul eder)
nmap -Pn 192.168.1.50

# TCP SYN Ping (Belirtilen portlara SYN paketi atarak canlılık sınar)
sudo nmap -PS22,80,443 192.168.1.0/24

# TCP ACK Ping (Firewall durum tablosunu bypass etmek için)
sudo nmap -PA80,443,3389 192.168.1.0/24

# UDP Ping (UDP servisleri üzerinden canlılık kontrolü)
sudo nmap -PU53,161 192.168.1.0/24

# Yerel Ağda Hızlı ARP Ping (Varsayılan olarak yerel subnetlerde etkindir)
sudo nmap -PR 192.168.1.0/24

# Traceroute ile Ağ Yolunu ve Sekme Sayısını Göster
nmap --traceroute scanme.nmap.org
```

### 3. Port Tarama Teknikleri (Scan Techniques)

```bash
# TCP SYN Stealth Scan (Yarım açık tarama - En popüler, root gerektirir)
sudo nmap -sS 192.168.1.10

# TCP Connect Scan (3'lü el sıkışmayı tamamlar - Root yetkisi gerekmez)
nmap -sT 192.168.1.10

# UDP Port Taraması (Yavaş ama kritiktir - DNS, SNMP, DHCP için)
sudo nmap -sU 192.168.1.10

# TCP ACK Taraması (Port açık/kapalıyı değil, firewall filtre durumunu tespit eder)
sudo nmap -sA 192.168.1.10

# TCP FIN Taraması (Sadece FIN bayrağı gönderir - Eski Unix/BSD sistemlerde etkili)
sudo nmap -sF 192.168.1.10

# TCP Xmas Taraması (FIN, PSH ve URG bayrakları açıktır - Noel ağacı gibi yanar)
sudo nmap -sX 192.168.1.10

# TCP Null Taraması (Hiçbir bayrak gönderilmez)
sudo nmap -sN 192.168.1.10

# TCP Idle (Zombie) Scan (IP kimliğini gizleyerek zombi host üzerinden kör tarama)
sudo nmap -sI 192.168.1.200:80 192.168.1.50
```

### 4. Port Belirleme ve Aralıklar

```bash
# Belirli Tekil Portlar veya Aralık
nmap -p 22,80,443,8080 192.168.1.1
nmap -p 1-1024 192.168.1.1

# Tüm 65.535 Portu Tara
nmap -p- 192.168.1.1

# Hızlı Tarama (En popüler 100 port)
nmap -F 192.168.1.1

# En Çok Kullanılan N Portu Tara (Örn: İlk 1000)
nmap --top-ports 1000 192.168.1.1

# Protokole Özel Port Ayrımı (UDP ve TCP'yi aynı anda tarama)
sudo nmap -sS -sU -p T:80,443,U:53,161 192.168.1.1

# Portları Karışık Değil Sıralı Tara
nmap -r 192.168.1.1
```

### 5. Servis ve Versiyon Tespiti

```bash
# Standart Versiyon Tespiti
nmap -sV 192.168.1.1

# Versiyon Prob Yoğunluğunu Ayarla (0: En hafif, 9: Tüm proplar)
nmap -sV --version-intensity 8 192.168.1.1

# Hafif Versiyon Taraması (Intensity 2 - Çok hızlı)
nmap -sV --version-light 192.168.1.1

# Kapsamlı Versiyon Taraması (Intensity 9 - En detaylı)
nmap -sV --version-all 192.168.1.1

# Versiyon Tarama Adımlarını Ekrana Bas (Debug amaçlı)
nmap -sV --version-trace 192.168.1.1
```

### 6. İşletim Sistemi (OS) Analizi

```bash
# İşletim Sistemi Tespiti
sudo nmap -O 192.168.1.1

# Yalnızca Umut Veren Hedeflerde OS Tahmini Yap (Zaman kazandırır)
sudo nmap -O --osscan-limit 192.168.1.0/24

# OS Tespiti İçin Tahmini Zorla (Fuzzy Logic)
sudo nmap -O --osscan-guess 192.168.1.1

# Maksimum Deneme Sayısını Belirle
sudo nmap -O --max-os-tries 2 192.168.1.1

# Agressif Hepsi Bir Arada Tarama (OS + Versiyon + Default Script + Traceroute)
sudo nmap -A -T4 192.168.1.1
```

### 7. Nmap Scripting Engine (NSE)

```bash
# Varsayılan (Default) Güvenli Scriptleri Çalıştır
nmap -sC 192.168.1.1

# Bilinen Güvenlik Açıklarını ve CVE'leri Tara
nmap --script vuln 192.168.1.1

# Belirli Bir Scripti Çalıştır
nmap -p 445 --script smb-os-discovery 192.168.1.1

# Joker Karakter ile Script Grubu Çalıştır
nmap -p 80,443 --script "http-*" 192.168.1.1

# Birden Fazla Script Kategorisi Birleştirme
nmap --script "discovery and safe" 192.168.1.1

# Scriptlere Özel Argüman Aktarma
nmap -p 80 --script http-brute --script-args userdb=users.txt,passdb=pass.txt 192.168.1.1

# Script Veritabanını Güncelle
sudo nmap --script-updatedb
```

### 8. Güvenlik Duvarı / IDS Atlatma (Evasion & Spoofing)

```bash
# Paket Parçalama (Fragmentation - 8 byte paketler)
sudo nmap -f 192.168.1.1
sudo nmap -ff 192.168.1.1 # 16 byte

# Özel MTU Boyutu Belirleme (8'in katı olmalıdır)
sudo nmap --mtu 24 192.168.1.1

# Sahte IP'ler (Decoys) Araya Karıştırma
sudo nmap -D 10.0.0.1,10.0.0.2,ME,10.0.0.5 192.168.1.1
sudo nmap -D RND:10 192.168.1.1 # 10 rastgele decoy

# Kaynak Port Numarasını Değiştirme (Firewall kuralını aldatma)
sudo nmap -g 53 192.168.1.1         # DNS portundan geliyormuş gibi
sudo nmap --source-port 80 192.168.1.1 # HTTP portundan geliyormuş gibi

# Paketlere Rastgele Veri (Payload) Ekleme
sudo nmap --data-length 64 192.168.1.1

# Sahte MAC Adresi ile Tarama (Vendor/Prefix veya Rastgele)
sudo nmap --spoof-mac Apple 192.168.1.1
sudo nmap --spoof-mac 00:11:22:33:44:55 192.168.1.1

# HTTP veya SOCKS4 Proxy Üzerinden Tarama
nmap --proxies http://127.0.0.1:8080,socks4://127.0.0.1:9050 192.168.1.1

# Hatalı Checksum Göndererek Güvenlik Cihazı Tepkisini İnceleme
sudo nmap --badsum 192.168.1.1
```

### 9. Zamanlama & Performans Optimizasyonu

```bash
# Zamanlama Şablonları (-T0 En Yavaş -> -T5 En Hızlı)
nmap -T0 192.168.1.1 # Paranoid (IDS atlatma amaçlı, aşırı yavaş)
nmap -T2 192.168.1.1 # Polite (Bant genişliğini korur)
nmap -T4 192.168.1.1 # Aggressive (Modern hızlı ağlar için standart önerilen)
nmap -T5 192.168.1.1 # Insane (Çok hızlı, yerel gigabit ağlar için)

# Saniyede Gönderilen Minimum Paket Hızını Sabitleme (Turbo Tarama)
sudo nmap --min-rate 1000 -p- 192.168.1.1

# Paketler Arası Gecikme Ekleyerek Rate-Limit Aşma
sudo nmap --scan-delay 1s 192.168.1.1

# Cevap Vermeyen Yavaş Hostları Otomatik Terk Etme
nmap --host-timeout 15m 192.168.1.0/24
```

### 10. Çıktı Formatları & Raporlama

```bash
# Standart Metin Çıktısı (.txt)
nmap -oN tarama.txt 192.168.1.1

# XML Formatında Kayıt (Araç ve betik entegrasyonu için)
nmap -oX tarama.xml 192.168.1.1

# Grep Edilebilir Tek Satır Format
nmap -oG tarama.gnmap 192.168.1.1

# Tüm Formatlarda Tek Seferde Kaydet (-oN, -oX, -oG)
nmap -oA sonuc_dosyalari 192.168.1.1

# Yalnızca Açık Portları Göster (Gereksiz kapalı portları filtreler)
nmap --open 192.168.1.1

# Bir Portun Neden Açık/Kapalı Olduğunu Belirten RST/SYN Bayrağını Göster
nmap --reason 192.168.1.1

# XML Çıktısını Profesyonel HTML Rapora Dönüştürme
xsltproc tarama.xml -o guvenlik_raporu.html
```

---

## 🧪 Gerçek Hayat Sızma Testi Senaryoları (Playbooks)

### Senaryo 1: Sessiz ve İz Bırakmayan Dış Ağ Keşfi (Stealth Recon)
```bash
sudo nmap -sS -Pn -n -T2 -D RND:5 --data-length 25 -g 53 --randomize-hosts -p 80,443,8443,22 -oA stealth_recon <hedef-ip>
```
* **Neden?** DNS kaynak portu maskesi, rastgele 5 sahte IP (decoy), DNS sorgusuz (`-n`), paketlere rastgele 25 byte ekleme ile SIEM ve IDS alarmlarını tetiklemeden dış ağ yüzeyini haritalandırır.

### Senaryo 2: Yerel Ağda Kritik Güvenlik Denetimi & Zafiyet Avı
```bash
sudo nmap -sS -sV --version-intensity 7 -O --script "vuln and not dos" --open -T4 -oA local_vuln_audit 192.168.1.0/24
```
* **Neden?** Servislerin versiyonunu derinlemesine sorgular, DoS (hizmet dışı bırakma) tehlikesi içermeyen tüm zafiyet scriptlerini çalıştırır ve yalnızca açık portları raporlar.

### Senaryo 3: Active Directory & Domain Controller Keşfi
```bash
nmap -p 53,88,135,139,389,445,464,593,636,3268,3269,3389 --script "smb-vuln*,smb-enum-shares,smb-security-mode,ldap-rootdse" -oA ad_audit <dc-ip>
```
* **Neden?** Kerberos (88), LDAP (389), SMB (445) ve Global Catalog portlarını tarar; SMB imzalama durumunu ve kritik zafiyetleri raporlar.

---

## 🌐 İnteraktif Web Arayüzü Özellikleri

Bu depoda yer alan `index.html`, modern yeşil-siyah siber estetikle (Matrix & Cyberpunk terminal konsepti) donatılmıştır:

* 🛠️ **Canlı Komut Oluşturucu (Nmap Command Builder):** Hedef, tarama türü, port listesi, NSE kategorileri, firewall evasion anahtarları ve zamanlama seçeneklerini formdan seçtiğiniz anda komut canlı olarak terminal kutusunda oluşturulur.
* 📋 **Tek Tıkla Kopyalama:** Her komut kutucuğunda anında panoya kopyalama ve görsel kopyalandı bildirimi.
* 🔍 **Anlık Canlı Arama:** 100+ komut, parametre ve bayrak arasında anında Türkçe açıklama veya bayrak araması.
* 🏷️ **Kategori Filtreleme:** Günlük komutlar, Host keşfi, Port tarama, Servis/Versiyon, Evasion, NSE ve Senaryolar arasında hızlı geçiş.
* ⭐ **Sık Kullanılanlar / Yer İmleri:** Kendi operasyonlarınızda en çok beğendiğiniz komutları tarayıcı hafızasına (`localStorage`) kaydedip filtreleme.
* 💻 **Dahili Terminal Simülatörü:** Tarayıcınız içerisinden interaktif terminal komutlarını (`help`, `scan`, `matrix`, `clear`) çalıştırabilme.

---

## 📁 Depo Dosya Yapısı

```text
nmap-cheatsheet-tr/
├── README.md                          # Ana giriş, genel indeks ve hızlı başvuru kılavuzu
├── index.html                         # İnteraktif Siber Web Arayüzü & Komut Oluşturucu
├── style.css                          # Siber yeşil-siyah Matrix & terminal cam tasarımı
├── app.js                             # Canlı arama, komut derleyici, favoriler ve terminal motoru
├── Dockerfile                         # Web arayüzü ve Nmap ortamını barındıran Docker imajı
├── docker-compose.yml                 # Tek komutla ayağa kaldırılabilen servis konfigürasyonu
├── CONTRIBUTING.md                    # Açık kaynak katkı sağlama kuralları
├── SECURITY.md                        # Güvenlik politikası ve yasal sınırlar
├── LICENSE                            # MIT Lisansı
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Pages otomatik yayınlama iş akışı
├── docs/                              # Detaylı Nmap Modül Kılavuzları
│   ├── 01-temel-kullanim-ve-hedef-belirleme.md
│   ├── 02-host-kesfi-ve-ping-teknikleri.md
│   ├── 03-port-tarama-teknikleri.md
│   ├── 04-servis-ve-versiyon-tespiti.md
│   ├── 05-isletim-sistemi-tespiti.md
│   ├── 06-nmap-scripting-engine-nse.md
│   ├── 07-zamanlama-ve-performans-optimizasyonu.md
│   ├── 08-guvenlik-duvari-ids-atlatma-ve-spoofing.md
│   ├── 09-cikti-formatlari-ve-raporlama.md
│   ├── 10-ileri-duzey-senaryolar-ve-pentest-receteleri.md
│   └── 11-nmap-vs-diger-araclar-ve-ipucu-tablosu.md
└── scripts/
    ├── nmap-quick-audit.sh            # Hızlı ağ ve zafiyet denetimi bash scripti
    └── nmap-to-html.sh                # Nmap XML çıktılarını HTML rapora çeviren yardımcı araç
```

---

## 💻 Hızlı Kurulum & Docker ile Çalıştırma

### 1. Yerel Olarak Çalıştırma
İnteraktif web arayüzünü çalıştırmak için herhangi bir kuruluma ihtiyaç yoktur. Depodaki `index.html` dosyasını doğrudan çift tıklayarak tarayıcınızda açabilirsiniz:
```bash
# Depoyu klonlayın
git clone https://github.com/ykaan0/nmap-cheatsheets-tr.git
cd nmap-cheatsheets-tr

# Tarayıcıda açın
xdg-open index.html # Linux
open index.html     # macOS
start index.html    # Windows
```

### 2. Docker & Docker Compose ile Çalıştırma
```bash
# Docker Compose ile web arayüzünü 8088 portunda başlatın
docker compose up -d

# Tarayıcınızda açın:
# http://localhost:8088
```

---

## ⚖️ Yasal ve Etik Sorumluluk Reddi

> [!IMPORTANT]
> Bu depodaki tüm bilgiler, komutlar ve metodolojiler; **yalnızca yetkili olduğunuz sistemlerin güvenlik testlerinde**, sözleşmeli sızma testlerinde (authorized penetration testing), sistem yöneticiliği görevlerinde ve laboratuvar/eğitim ortamlarında kullanılmak üzere hazırlanmıştır.
>
> Yazılı izin veya yetkilendirme olmaksızın üçüncü taraf bilişim sistemlerine yönelik gerçekleştirilen port taramaları, zafiyet araştırmaları veya ağ analizi faaliyetleri **5237 sayılı Türk Ceza Kanunu'nun 243. ve 244. maddeleri** başta olmak üzere yerel ve uluslararası siber suç mevzuatları kapsamında suç teşkil edebilir. Tüm hukuki ve cezai sorumluluk uygulayıcıya aittir.

---

## 🤝 Katkıda Bulunma

Topluluğa katkıda bulunmak, yeni Nmap ipuçları veya NSE senaryoları eklemek isterseniz lütfen [CONTRIBUTING.md](CONTRIBUTING.md) belgesini inceleyin. Pull Request'leriniz memnuniyetle karşılanır!

---
**Hazırlayan:** Siber Güvenlik Topluluğu & Açık Kaynak Geliştiricileri | Lisans: [MIT](LICENSE)
