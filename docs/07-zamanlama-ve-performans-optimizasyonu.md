# 07 - Zamanlama ve Performans Optimizasyonu

Büyük bir /16 veya /24 alt ağını tararken Nmap'in hızı ve zamanlama parametreleri testin başarıyla sonuçlanması ile günlerce sürmesi arasındaki farkı belirler. 

Doğru zamanlama:
1. Taramayı 10 kata kadar hızlandırabilir.
2. Ağ bağlantısını tıkamadan ve hedef sistemleri boğmadan güvenli veri toplar.
3. IDS/IPS ve WAF cihazlarının rate-limit mekanizmalarına takılmayı önler.

---

## ⏱️ 1. Zamanlama Şablonları (`-T0` - `-T5`)

Nmap en pratik hız ayarı olarak 6 hazır şablon sunar:

| Şablon | Kod Adı | Paket Gecikmesi | Kullanım Senaryosu |
| :---: | :--- | :--- | :--- |
| **`-T0`** | **Paranoid** | 5 dakika | IDS/IPS atlatmak için aşırı yavaş. Gerçek sızma testlerinde nadiren kullanılır. |
| **`-T1`** | **Sneaky** | 15 saniye | Sessiz tarama; IDS loglarında eşik değerlerini aşmamak için tasarlanmıştır. |
| **`-T2`** | **Polite** | 0.4 saniye | Bant genişliğini korur, hedef sistemin kaynaklarını tüketmez. |
| **`-T3`** | **Normal** | Dinamik | Nmap'in varsayılan ayarıdır. Ağ durumuna göre dinamik ayarlanır. |
| **`-T4`** | **Aggressive** | Dinamik (Hızlı) | **En çok önerilen şablon.** Hızlı ve kararlı modern ağlar için optimize edilmiştir. |
| **`-T5`** | **Insane** | < 5 ms | Ultra hızlı; yalnızca gigabit yerel ağlarda (LAN) kullanılır. Paket kaybı yaşanabilir. |

```bash
# Standart önerilen agresif tarama
sudo nmap -sS -T4 -p 1-1000 192.168.1.1
```

---

## ⚡ 2. Paket Hızı ve Paralellik Kontrolleri

Hazır `-T` şablonları yerine saniyede gönderilen paket sayısını manuel sabitleyerek muazzam hızlara ulaşabilirsiniz:

### 2.1 Paket Gönderme Hızı (`--min-rate` & `--max-rate`)
Nmap'in en güçlü hız parametreleridir:
```bash
# Saniyede en az 1000 paket gönder (Turbo Tarama)
sudo nmap -sS --min-rate 1000 -p- 192.168.1.1

# IDS sistemini tetiklememek için saniyede en fazla 20 paketle sınırla
sudo nmap -sS --max-rate 20 -p 80,443 192.168.1.1
```

---

### 2.2 Paralel Problar (`--min-parallelism` & `--max-parallelism`)
Aynı anda kaç prob paketinin havada olacağını belirler:
```bash
# En az 50 probu eşzamanlı hatta tut
sudo nmap -sS --min-parallelism 50 192.168.1.0/24
```

---

### 2.3 Ana Bilgisayar Grubu Boyutu (`--min-hostgroup` & `--max-hostgroup`)
Nmap ağ taramalarında hedefleri gruplar halinde işler:
```bash
# Her seferinde en az 64 hostu paralel tara
sudo nmap -sS --min-hostgroup 64 10.0.0.0/16
```

---

## 🛑 3. Zaman Aşımları (Timeouts) ve Gecikmeler

### 3.1 Host Zaman Aşımı (`--host-timeout`)
Bazı cihazlar paketlere geç yanıt verir veya hiç vermez. Bir tek cihaz yüzünden tüm taramanın takılmasını önlemek için:
```bash
# 15 dakika içinde tamamlanmayan hostu otomatik terk et
nmap --host-timeout 15m 192.168.1.0/24
```

### 3.2 Paket Gecikmesi (`--scan-delay`)
Paketler arasına sabit veya maksimum bir bekleme süresi koyar (WAF bypass için idealdir):
```bash
# Paketler arasında en az 1 saniye bekle
sudo nmap -sS --scan-delay 1s 192.168.1.50
```

### 3.3 Maksimum Yeniden Deneme (`--max-retries`)
Bir porttan cevap gelmediğinde Nmap varsayılan olarak tekrar dener. Bu değeri düşürmek taramayı hızlandırır:
```bash
# Yanıt vermeyen porta yalnızca 1 kez tekrar dene
sudo nmap -sS --max-retries 1 -p- 192.168.1.1
```
