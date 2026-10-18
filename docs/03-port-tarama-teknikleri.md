# 03 - Port Tarama Teknikleri (Scan Techniques)

Nmap'in kalbi, portların durumunu belirlemek için kullandığı TCP, UDP ve SCTP paket teknikleridir. Bir portun açık (open), kapalı (closed) veya filtrelenmiş (filtered) olduğunu anlamak için hedef sisteme özel bayrak dizilimlerine sahip problar gönderilir.

---

## 📊 1. Port Durumları (Port States) Ne Anlama Gelir?

Nmap sonuçlarında karşılaşılan 6 temel durum:

| Durum | Açıklama |
| :--- | :--- |
| **`open`** | Uygulama bu portta aktif olarak gelen bağlantıları kabul etmektedir. |
| **`closed`** | Port açıktır ve Nmap'in probuna yanıt vermiştir (genellikle RST paketi), ancak arkasında dinleyen bir servis yoktur. |
| **`filtered`** | Güvenlik duvarı (Firewall/IDS) veya ağ filtresi probu engellemiştir; Nmap portun açık mı kapalı mı olduğunu kestirememektedir. |
| **`unfiltered`** | Port proba yanıt vermiştir ancak açık mı kapalı mı olduğu belirsizdir (Örn: ACK taraması). |
| **`open\|filtered`** | Nmap portun açık mı yoksa filtrelenmiş mi olduğunu ayırt edememektedir (Örn: UDP, Null, FIN, Xmas). |
| **`closed\|filtered`** | Portun kapalı mı yoksa filtrelenmiş mi olduğu anlaşılamamıştır (Idle scan). |

---

## 🛡️ 2. Temel ve İleri Düzey Tarama Teknikleri

### 2.1 TCP SYN Stealth Scan (`-sS`)
* **Varsayılan ve en popüler tarama tipidir.**
* Root yetkisi (raw socket erişimi) gerektirir.
* 3'lü el sıkışma tamamlanmaz:
  1. İstemci -> Hedef: `SYN`
  2. Hedef -> İstemci: `SYN/ACK` (Port AÇIK demektir)
  3. İstemci -> Hedef: `RST` (Bağlantı anında kesilir)
* Uygulama katmanında oturum kurulmadığı için uygulama loglarına genellikle düşmez.
```bash
sudo nmap -sS -p 1-1000 192.168.1.1
```

---

### 2.2 TCP Connect Scan (`-sT`)
* Root yetkisi **gerekmediğinde** veya IPv6 taramalarında standart soket API'si (`connect()`) kullanılır.
* İşletim sistemi seviyesinde tam TCP el sıkışması tamamlanır:
  `SYN` ➔ `SYN/ACK` ➔ `ACK` ➔ `RST/FIN`
* Hedef sunucunun erişim loglarında net şekilde görünür.
```bash
nmap -sT -p 80,443,22 192.168.1.1
```

---

### 2.3 UDP Port Taraması (`-sU`)
Birçok güvenlik denetçisi UDP'yi ihmal eder; oysa DNS (53), SNMP (161), DHCP (67/68), TFTP (69) ve IKE VPN (500) gibi kritik servisler UDP üzerinde çalışır.
* UDP bağlantısızdır (handshake yoktur).
* Açık servisler çoğu zaman cevap vermez.
* Kapalı bir porta gidildiğinde hedef işletim sistemi `ICMP Port Unreachable` (Type 3, Code 3) fırlatır.
* Çoğu işletim sistemi (Linux çekirdeği) ICMP hata mesajlarını saniyede 1 adetle sınırlar (rate-limit). Bu yüzden UDP taramaları yavaştır.
```bash
# Kritik UDP portlarını agresif zamanlamayla tara
sudo nmap -sU -T4 -p 53,67,68,69,123,161,500 192.168.1.1
```

---

### 2.4 TCP ACK Taraması (`-sA`)
ACK taraması portların açık olup olmadığını bulmak için değil, **güvenlik duvarı kurallarını ve durum tablosunu haritalandırmak** için kullanılır.
* Yalnızca `ACK` bayrağı gönderilir.
* Eğer hedef `RST` dönerse, paket firewall'u aşmış demektir ➔ Port **`unfiltered`** görünür.
* Eğer hiç yanıt dönmezse veya ICMP hatası dönerse ➔ Port **`filtered`** görünür.
```bash
sudo nmap -sA -p 22,80,443,3389 192.168.1.1
```

---

### 2.5 TCP Null (`-sN`), FIN (`-sF`) ve Xmas (`-sX`) Taramaları
Bu üç tarama tipi, RFC 793 standardındaki bir incelikten yararlanır:
* Eğer kapalı bir porta herhangi bir bayrak gelirse (RST hariç), sistem `RST` yanıtı vermelidir.
* Eğer açık bir porta SYN, RST veya ACK içermeyen bir paket gelirse, sistem paketi sessizce düşürmelidir.
* **Xmas Scan (`-sX`)**: FIN, PSH ve URG bayraklarını aktif eder (Noel ağacı gibi parlar).
* **Null Scan (`-sN`)**: Hiçbir bayrak biti içermez (0).
* **FIN Scan (`-sF`)**: Yalnızca FIN biti aktiftir.

```bash
# Xmas taraması
sudo nmap -sX -p 80,443 192.168.1.1

# Null taraması
sudo nmap -sN 192.168.1.1

# FIN taraması
sudo nmap -sF 192.168.1.1
```
> [!NOTE]
> Microsoft Windows, Cisco cihazları ve bazı BSD türevleri RFC 793'e tam uymaz ve her durumda RST döner. Bu taramalar genellikle Linux ve Unix tabanlı sistemlerde etkilidir.

---

### 2.6 TCP Idle Scan (`-sI` - Zombi Taraması)
Siber güvenlik dünyasının en sofistike tarama yöntemidir. 
* Kendi IP adresinizden hedefe **tek bir paket bile gitmez**.
* IPID (IP Identification) dizilimi tahmin edilebilir bir üçüncü parti "zombi" makine aracı olarak kullanılır.
* Hedef sistemin loglarında yalnızca zombi IP'si görünür!

```bash
# 192.168.1.200 zombi makinesi üzerinden 192.168.1.50 hedefini tara
sudo nmap -sI 192.168.1.200:80 192.168.1.50
```

---

### 2.7 Özel Bayrak Taraması (`--scanflags`)
Standart dışı TCP bayrak kombinasyonları tanımlamanıza izin verir. Güvenlik cihazlarının özel kurallarını test etmek için idealdir:
```bash
# Hem SYN hem FIN bayrağını aynı anda yolla (Normalde imkansız bir durum)
sudo nmap --scanflags SYNFIN 192.168.1.1

# URG, ACK, PSH, RST, SYN, FIN kombinasyonu
sudo nmap --scanflags URGACKPSHRSTSYNFIN 192.168.1.1
```
