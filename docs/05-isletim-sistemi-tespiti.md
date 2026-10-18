# 05 - İşletim Sistemi Tespiti (OS Fingerprinting)

Nmap'in en güçlü özelliklerinden biri, uzaktaki bir hedef sistemin hangi işletim sistemini (Windows 11, Windows Server 2022, Ubuntu 24.04, FreeBSD, Cisco IOS, embedded Linux vb.) çalıştırdığını tespit edebilmesidir.

Bu işlem için Nmap, **TCP/IP Stack Fingerprinting** (TCP/IP Yığın Parmak İzi) tekniğini kullanır.

---

## 🧬 1. TCP/IP Parmak İzi Nasıl Çalışır?

Farklı işletim sistemleri RFC standartlarını birebir aynı şekilde yorumlamaz. TCP pencere boyutu (window size), TTL (Time to Live) varsayılanları, TCP seçenekleri sırası (TCP Options ordering), SYN paketlerine verilen yanıt bayrakları ve IPID üretim mantığı işletim sisteminden işletim sistemine belirgin farklılıklar gösterir.

Nmap hedefe yaklaşık bir düzine özel TCP ve UDP paketi gönderir; dönen yanıtları `nmap-os-db` veritabanındaki binlerce bilinen işletim sistemi parmak iziyle karşılaştırır.

```bash
# Standart işletim sistemi tespiti (Root gerektirir)
sudo nmap -O 192.168.1.1
```

---

## ⚙️ 2. OS Tespit Bayrakları ve Seçenekleri

| Bayrak | Açıklama |
| :--- | :--- |
| **`-O`** | İşletim sistemi tespitini etkinleştirir. |
| **`--osscan-limit`** | Yalnızca en az 1 açık ve 1 kapalı TCP portu bulunan hedeflerde OS tespiti dener (Zamandan tasarruf sağlar). |
| **`--osscan-guess` / `--fuzzy`** | Parmak izi tam uyuşmadığında en yakın olasılığı tahmin etmeye zorlar. |
| **`--max-os-tries <sayı>`** | Bir hedef için en fazla kaç kez OS prob seti gönderileceğini sınırlar (Varsayılan: 2). |

```bash
# Hızlı ve optimize edilmiş OS tespiti
sudo nmap -O --osscan-limit --max-os-tries 1 192.168.1.0/24

# Tahmini zorlayarak sonuç al
sudo nmap -O --osscan-guess 192.168.1.50
```

---

## 🚀 3. Agresif Tarama Modu (`-A`)

Birçok sızma testinde işletim sistemi tespiti, servis tespiti, default scriptler ve traceroute birlikte istenir. Nmap bu dört işlemi tek bir parametrede birleştirir:

```bash
# Agresif Tarama (OS + Sürüm + Script + Traceroute)
sudo nmap -A -T4 192.168.1.50
```

---

## 📈 4. TTL Değerlerinden Manuel OS Tahmini (Hızlı İpucu)

Tarama yapmadan da basit bir `ping` çıktısındaki varsayılan TTL (Time to Live) değerine bakarak işletim sistemi kabaca tahmin edilebilir:

* **TTL ~ 64:** Linux, macOS, Android, FreeBSD
* **TTL ~ 128:** Microsoft Windows (Windows 10/11, Windows Server)
* **TTL ~ 255:** Cisco yönlendiriciler, Solaris ve ağ anahtarları (Switch)

```text
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.82 ms  --> %95 Linux / Router
64 bytes from 192.168.1.50: icmp_seq=1 ttl=128 time=1.20 ms --> %95 Windows
```
