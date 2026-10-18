# 08 - Güvenlik Duvarı / IDS Atlatma ve Spoofing (Firewall/IDS Evasion)

Kurumsal sızma testlerinde hedef sistemler genellikle Ağ Güvenlik Duvarları (Next-Gen Firewall), Saldırı Tespit/Engelleme Sistemleri (IDS/IPS) ve Web Uygulama Güvenlik Duvarları (WAF) arkasında yer alır.

Nmap, paket filtrelerini şaşırtmak, imza tabanlı tespitleri bozmak ve gerçek IP adresinizi gizlemek için gelişmiş **Evasion & Spoofing** teknikleri sunar.

---

## 🧩 1. Paket Parçalama (Fragmentation)

Durumsuz (stateless) paket filtreleri ve bazı eski IDS sistemleri, gelen paketleri bellekte yeniden birleştiremez (reassembly yapamaz). IP başlığı küçük parçalara bölündüğünde kural eşleşmesi başarısız olur:

### 1.1 `-f` ve `-ff` Bayrakları
* `-f`: IP başlığını 8 byte'lık küçük paket parçalarına böler.
* `-ff`: 16 byte'lık parçalama yapar.
```bash
sudo nmap -sS -f 192.168.1.1
sudo nmap -sS -ff 192.168.1.1
```

### 1.2 Özel MTU Belirleme (`--mtu`)
Kendi MTU boyutunuzu manuel ayarlayabilirsiniz (Değer mutlaka 8'in katı olmalıdır):
```bash
# 24 byte MTU ile parçala
sudo nmap -sS --mtu 24 192.168.1.1
```

---

## 🎭 2. Sahte IP'ler ile Aldatma (Decoy Taraması - `-D`)

Gerçek tarayıcı IP adresinizi, araya serpiştirilen sahte (decoy) IP adresleri arasına karıştırır. 
Hedef sistemin güvenlik yöneticisi veya SOC analisti logları incelediğinde aynı anda onlarca farklı adresten tarama yapıldığını görür; gerçek saldırganın kim olduğunu ayırt edemez:

```bash
# Belirli IP'leri ve kendinizi (ME) araya karıştırın
sudo nmap -sS -D 10.0.0.1,10.0.0.2,ME,10.0.0.5 192.168.1.1

# Rastgele (Random) 10 sahte IP üret
sudo nmap -sS -D RND:10 192.168.1.1
```
> [!WARNING]
> Decoy olarak kullanılan IP adreslerinin gerçekten aktif olması gerekir; aksi halde hedef sistem bu IP'lere SYN-ACK veya RST dönerken zaman aşımı yaşayarak Nmap'i yavaşlatabilir.

---

## 🏷️ 3. Kaynak Portu Sahteciliği (`-g` / `--source-port`)

Birçok güvenlik duvarı kuralı; dışarıdan gelen DNS (UDP 53) veya HTTP (TCP 80) yanıtlarına kural istisnası tanır. Nmap'in kendi rastgele kaynak portu yerine bilinen bir güvenli porttan paket yollaması sağlanabilir:

```bash
# Gelen paketleri DNS sunucusu cevabı gibi göster (Port 53)
sudo nmap -sS -g 53 192.168.1.1

# HTTP portundan geliyormuş gibi yap (Port 80)
sudo nmap -sS --source-port 80 192.168.1.1
```

---

## 📦 4. Paket Boyutunu Değiştirme (`--data-length`)

Nmap varsayılan olarak neredeyse hiç veri (payload) içermeyen boş SYN paketleri gönderir. Snort ve Suricata gibi IDS yazılımları bu boş paket imzasını kolayca yakalar.

`--data-length` bayrağı ile paketlerin sonuna rastgele baytlar ekleyerek imza tabanlı tespitleri bozabilirsiniz:
```bash
# Her paketin sonuna 35 rastgele bayt ilave et
sudo nmap -sS --data-length 35 192.168.1.1
```

---

## 💻 5. MAC Adresi Sahteciliği (`--spoof-mac`)

Yerel Ethernet ağlarında veya kablosuz köprülerde (AP) MAC filtrelerini atlatmak için sahte donanım adresi tanımlanabilir:

```bash
# Tanınmış bir üretici adı kullanarak MAC üret
sudo nmap -sS --spoof-mac Apple 192.168.1.1
sudo nmap -sS --spoof-mac Cisco 192.168.1.1

# Tam manuel MAC adresi gir
sudo nmap -sS --spoof-mac 00:11:22:33:44:55 192.168.1.1

# Her taramada tamamen rastgele bir MAC adresi üret
sudo nmap -sS --spoof-mac 0 192.168.1.1
```

---

## 🌐 6. Proxy ve Tor Üzerinden Yönlendirme (`--proxies`)

Nmap TCP Connect (`-sT`) modundayken trafiği HTTP veya SOCKS4 proxy sunucuları üzerinden tünelleyebilir:

```bash
# Tor ağı (9050) üzerinden anonim port taraması
nmap -sT -Pn --proxies socks4://127.0.0.1:9050 target.com

# Zincirleme birden fazla proxy üzerinden geçiş
nmap -sT -Pn --proxies http://proxy1.com:8080,socks4://proxy2.com:1080 target.com
```

---

## ⚠️ 7. Hatalı Checksum Gönderme (`--badsum`)

Hedef sisteme bilerek geçersiz (bozuk) TCP/UDP checksum taşıyan paketler gönderilir:
* Gerçek bir işletim sisteminin TCP yığını bu paketleri derhal çöpe atar ve hiçbir yanıt vermez.
* Eğer bir yanıt dönüyorsa, bu yanıt aradaki bir IDS/IPS veya durumsuz güvenlik duvarından gelmektedir!
* Güvenlik cihazlarının varlığını doğrulamak için harika bir denetim yöntemidir.

```bash
sudo nmap -sS --badsum 192.168.1.1
```

---

## 🎲 8. Hedef Sırasını Karıştırma (`--randomize-hosts`)

Nmap geniş alt ağları tararken sıralı (192.168.1.1, .2, .3...) gitmek yerine hedef listesini karıştırır. Bu sayede eşik tabanlı ağ izleme alarmları tetiklenmez:
```bash
sudo nmap -sS --randomize-hosts 10.0.0.0/16
```
