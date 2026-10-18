# 02 - Host Keşfi ve Ping Teknikleri (Host Discovery)

Nmap bir hedefteki binlerce portu taramaya başlamadan önce kural olarak: *"Bu hedef açık mı (up) yoksa kapalı mı (down)?"* sorusuna yanıt arar. Bu aşama **Host Keşfi (Host Discovery)** veya **Ping Taraması** olarak adlandırılır.

Eğer host keşfi doğru yönetilmezse:
1. ICMP engelleyen bir güvenlik duvarı yüzünden canlı sunucular "çevrimdışı" kabul edilip taranmayabilir.
2. Kapalı IP'lere boş yere binlerce port probu atılarak saatler kaybedilebilir.

---

## 🔍 1. Temel Canlılık Bayrakları

### 1.1 `-sn` (Eski adıyla `-sP`): Yalnızca Host Keşfi
Port taramasını tamamen devre dışı bırakır. Sadece ağdaki hangi cihazların açık olduğunu listeler:
```bash
# Yerel ağdaki canlı cihazları tespit et
sudo nmap -sn 192.168.1.0/24
```
* **Root kullanıcısı çalıştırdığında:** ARP isteği (yerel ağda) veya TCP SYN (443), TCP ACK (80) ve ICMP Echo gönderir.
* **Normal kullanıcı çalıştırdığında:** Port 80 ve 443'e TCP Connect() dener.

---

### 1.2 `-Pn`: Ping Aşamasını Atla (Firewall Arkası)
Hedefin canlı olup olmadığını test etmez; hedefin açık olduğunu varsayarak doğrudan port taramasına geçer:
```bash
# ICMP ping'i filtreleyen Windows sunucuyu doğrudan tara
nmap -Pn -p 80,443,445,3389 192.168.1.50
```
> [!IMPORTANT]
> Modern kurumsal ağlarda, AWS/Azure bulut sunucularında ve uç nokta güvenlik yazılımlarında (EDR) ICMP Echo yanıtları genellikle engellenir. Bu nedenle hedef yanıt vermiyorsa ilk başvurulacak bayrak her zaman `-Pn`'dir.

---

## ⚡ 2. İleri Düzey Ping Türleri

### 2.1 TCP SYN Ping (`-PS[port_listesi]`)
Belirtilen portlara TCP SYN paketi gönderir. 
* Port **açıksa**: Hedef `SYN-ACK` ile döner (Nmap hemen `RST` atarak bağlantıyı sonlandırır).
* Port **kapalıysa**: Hedef doğrudan `RST` döner.
* Her iki durumda da hedef yanıt verdiği için **canlı (up)** kabul edilir!
```bash
# Web ve uzak yönetim portlarına SYN ping at
sudo nmap -sn -PS80,443,22,3389 192.168.1.0/24
```

---

### 2.2 TCP ACK Ping (`-PA[port_listesi]`)
Hedefe doğrudan TCP ACK paketi yollar.
* Durumsuz (stateless) güvenlik duvarları giden bir bağlantının cevabı sanarak pakete izin verebilir.
* Hedef sistem böyle bir TCP oturumu hatırlamadığı için standart gereği `RST` (Reset) fırlatır.
* `RST` paketi Nmap'e ulaştığı anda hedef canlı ilan edilir!
```bash
# 80 ve 443 portlarına ACK ping atarak durumsuz filtreleri aldat
sudo nmap -sn -PA80,443 192.168.1.0/24
```

---

### 2.3 UDP Ping (`-PU[port_listesi]`)
Varsayılan olarak boş UDP paketleri gönderir (Varsayılan port: 40125).
* Kapalı bir UDP portuna ulaşıldığında hedef `ICMP Port Unreachable` (Tip 3, Kod 3) mesajı döner.
* Bu hata mesajı hedefin canlı olduğunun kanıtıdır.
```bash
# DNS ve SNMP servis portları üzerinden canlılık kontrolü
sudo nmap -sn -PU53,161,123 192.168.1.0/24
```

---

### 2.4 SCTP INIT Ping (`-PY[port_listesi]`)
Telekom ve sinyalleşme ağlarında kullanılan SCTP protokolü için `INIT` chunk içeren paket yollar:
```bash
sudo nmap -sn -PY2905,3868 10.0.0.0/24
```

---

### 2.5 ICMP Ping Çeşitleri (`-PE`, `-PP`, `-PM`)
Birçok güvenlik duvarı klasik Ping'i (`Echo Request - Type 8`) engellerken diğer ICMP türlerini unutabilir:
```bash
# -PE: Standart ICMP Echo Request
sudo nmap -sn -PE 192.168.1.0/24

# -PP: ICMP Timestamp Request (Sistem zaman damgası sorgusu - Type 13)
sudo nmap -sn -PP 192.168.1.0/24

# -PM: ICMP Address Mask Request (Alt ağ maskesi sorgusu - Type 17)
sudo nmap -sn -PM 192.168.1.0/24
```

---

### 2.6 Yerel Ağda ARP Ping (`-PR`)
Eğer hedef Nmap ile aynı yerel Ethernet ağında (LAN) ise, işletim sistemi seviyesindeki firewall ne olursa olsun paketlerin hedefe ulaşması için ARP sorgusuna cevap vermek zorundadır.
* Nmap varsayılan olarak yerel subnetlerde ARP Ping kullanır.
* Hızı diğer tüm ping yöntemlerinden kat kat yüksektir.
```bash
# Yerel ağda sadece ARP ile canlı cihazları dök
sudo nmap -sn -PR 192.168.1.0/24

# İstenirse ARP ping iptal edilebilir:
sudo nmap -sn --disable-arp-ping 192.168.1.0/24
```

---

## 🗺️ 3. Ağ Rotasını ve Atlama Noktalarını Çıkarma (`--traceroute`)

Hedefe giderken hangi yönlendiricilerden (router/gateway) geçildiğini ve her düğümün gecikmesini gösterir. Klasik `traceroute` komutundan farklı olarak, Nmap en uygun portu ve protokolü otomatik seçer:

```bash
# Canlılık denetimiyle birlikte ağ yolunu çiz
nmap -sn --traceroute scanme.nmap.org

# Port taramasıyla birlikte traceroute
sudo nmap -sS -p 80,443 --traceroute 192.168.1.1
```
