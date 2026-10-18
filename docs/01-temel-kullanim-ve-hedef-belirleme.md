# 01 - Nmap Temel Kullanım ve Hedef Belirleme Kılavuzu

Hedef belirleme, Nmap ile gerçekleştirilen her sızma testi ve keşif operasyonunun başlangıç noktasıdır. Yanlış veya eksik yapılandırılmış bir hedef tanımı; kapsam dışı hedeflerin taranmasına, yasal sorunlara veya kritik sunucuların gözden kaçmasına yol açabilir.

---

## 🎯 1. Hedef Formatları ve Sentaks

Nmap komut satırında tekil IP, alan adı (domain), IP aralığı veya CIDR alt ağ notasyonu kabul eder.

### 1.1 Tekil Hedefler (IP & Domain)
```bash
# Tekil IPv4 adresi
nmap 192.168.1.50

# Alan adı (Domain / Hostname)
nmap scanme.nmap.org

# IPv6 Hedef Taraması (-6 bayrağı zorunludur)
nmap -6 2600:3c01::f03c:91ff:fe18:bb2f
nmap -6 fe80::1%eth0
```

### 1.2 CIDR Notasyonu (Alt Ağ Blokları)
```bash
# 256 adreslik standart C sınıfı blok (/24)
nmap 192.168.1.0/24

# Daha geniş kurumsal bloklar
nmap 10.0.0.0/16
nmap 172.16.0.0/12
```

### 1.3 Sekizli (Octet) Aralık Belirleme
Nmap, her bir oktet için tire (`-`) ile aralık ve virgül (`,`) ile liste tanımlanmasına izin verir:
```bash
# 192.168.1.1 ile 192.168.1.50 arası 50 host
nmap 192.168.1.1-50

# Karma oktet aralığı (10.0.1.x, 10.0.2.x, 10.0.3.x alt ağlarının 1-254 aralığı)
nmap 10.0.1-3.1-254

# Belirli son haneleri hedefleme
nmap 192.168.1.10,20,30,40,50
```

---

## 📁 2. Dosyadan Hedef Listesi Okuma (`-iL`)

Büyük sızma testi projelerinde, alt alan adı keşif araçlarından (Subfinder, Amass vb.) elde edilen yüzlerce hedef bir metin dosyasında toplanır. Nmap bu listeyi doğrudan işleyebilir:

```bash
# hedefler.txt dosyasındaki tüm IP ve alan adlarını tara
nmap -iL hedefler.txt

# Dosyadan okurken SYN taraması ve versiyon tespiti yap
sudo nmap -sS -sV -iL canlı_hedefler.txt -oA nmap_toplu_sonuc
```

> [!TIP]
> `hedefler.txt` dosyası içinde her satırda tek bir hedef bulunmalıdır. Satırlar boşluk veya tab içerebilir, `#` ile başlayan satırlar yorum kabul edilir.

---

## 🚫 3. Hedefleri Hariç Tutma (`--exclude` & `--excludefile`)

Kurumsal ağlarda gateway yönlendiricileri, yük dengeleyiciler, kritik sağlık/üretim cihazları veya test izni bulunmayan IP adresleri tarama kapsamı dışına çıkarılmalıdır.

### 3.1 Komut Satırından Hariç Tutma (`--exclude`)
```bash
# Bütün /24 bloğunu tara ama gateway (.1) ve broadcast (.254)'i atla
nmap 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.254

# Bir IP aralığını hariç tut
nmap 10.0.0.0/16 --exclude 10.0.50.1-254
```

### 3.2 Dosyadan Hariç Tutma Listesi Okuma (`--excludefile`)
```bash
# yasakli_ipler.txt içindeki hiçbir adrese paket gönderme
nmap -iL tum_kapsam.txt --excludefile yasakli_ipler.txt -oA denetim
```

---

## 🎲 4. Rastgele İnternet Hedefleri (`-iR`)

Güvenlik araştırmacıları ve küresel istatistik çalışmaları için rastgele IPv4 adresleri seçme olanağı sunar:

```bash
# İnternet üzerinden rastgele 100 host seç ve 80/443 portlarını tara
nmap -iR 100 -p 80,443 -sS --open

# Rastgele taramalarda belirli ülkeleri veya IP bloklarını filtreleme
nmap -iR 500 -p 22 --exclude 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

---

## ⚙️ 5. DNS Çözümleme Davranışını Yönetme

Varsayılan olarak Nmap, bulduğu canlı hedeflerin Reverse DNS (PTR) kayıtlarını sorgular. Dış ağ testlerinde bu davranış gereksiz gürültüye ve yavaşlamaya neden olabilir:

| Bayrak | Anlamı | Kullanım Amacı |
| :--- | :--- | :--- |
| **`-n`** | **Asla DNS Çözümleme Yapma** | Taramayı ciddi oranda hızlandırır; hedef DNS loglarında görünmeyi engeller. |
| **`-R`** | **Her Zaman DNS Çözümle** | Çevrimdışı hedefler dahil tüm IP'ler için PTR sorgusu yapar. |
| **`--dns-servers <ip1,ip2>`** | **Özel DNS Sunucusu Kullan** | Yerel sistem DNS'i yerine Cloudflare (1.1.1.1) veya Google (8.8.8.8) kullanır. |
| **`--system-dns`** | **Sistem Çözümleyicisini Kullan** | Nmap'in kendi paralel DNS motoru yerine işletim sisteminin `getnameinfo()` çağrısını kullanır. |

```bash
# DNS çözümlemesi yapmadan hızlı SYN taraması
sudo nmap -sS -n 192.168.1.0/24 -p 80,443
```
