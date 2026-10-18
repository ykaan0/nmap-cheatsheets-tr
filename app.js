/**
 * NMAP CHEATSHEET TR - SİBER YÖNETİM & İNTERAKTİF MOTOR
 * Türkçe Siber Güvenlik Başvuru Kılavuzu & Komut Oluşturucu
 */

// ==========================================================================
// 1. SES EFEKTLERİ MOTORU (WEB AUDIO API)
// ==========================================================================
class CyberAudioEngine {
    constructor() {
        this.enabled = true;
        this.ctx = null;
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playBeep(freq = 880, duration = 0.05, type = 'sine') {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context engellendiyse sessizce geç
        }
    }

    playClick() { this.playBeep(1200, 0.04, 'triangle'); }
    playCopy() {
        this.playBeep(880, 0.06, 'sine');
        setTimeout(() => this.playBeep(1760, 0.09, 'sine'), 50);
    }
    playTerminal() { this.playBeep(520, 0.03, 'square'); }
}

const cyberAudio = new CyberAudioEngine();

// ==========================================================================
// 2. MATRIX YAĞMURU CANVAS ANİMASYONU
// ==========================================================================
function initMatrixCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const characters = '01ABCDEF0123456789NMAPSYNACKFINRSTUDP01<>{}[]/*+=-_';
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1);
    });

    function draw() {
        ctx.fillStyle = 'rgba(3, 6, 4, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px 'Fira Code', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 45);
}

// ==========================================================================
// 3. KAPSAMLI NMAP KOMUT VERİTABANI (75+ ZENGİN GİRDİ)
// ==========================================================================
const NMAP_DATABASE = [
    // --- TOP DAILY DRIVERS ---
    {
        id: "top-standard-full",
        category: "top",
        title: "Kapsamlı Standart Keşif ve Analiz",
        command: "sudo nmap -sC -sV -O -oA full_scan <hedef>",
        tags: ["top", "önerilen", "standart", "versiyon"],
        noise: "low",
        desc: "Varsayılan güvenli NSE scriptlerini çalıştırır (-sC), servis sürümlerini belirler (-sV), işletim sistemini tahmin eder (-O) ve 3 farklı formatta kaydeder.",
        flags: [
            { flag: "-sC", text: "Default NSE script setini çalıştırır" },
            { flag: "-sV", text: "Portlardaki açık servislerin sürümlerini çeker" },
            { flag: "-O", text: "TCP/IP stack analiziyle işletim sistemini tahmin eder" },
            { flag: "-oA", text: "Sonuçları .nmap, .xml ve .gnmap dosyalarına yazar" }
        ]
    },
    {
        id: "top-stealth-all-ports",
        category: "top",
        title: "Tüm Portların Sessiz SYN Taraması (65.535)",
        command: "sudo nmap -sS -p- -T4 --open -oN all_ports.txt <hedef>",
        tags: ["top", "bütün portlar", "syn", "hızlı"],
        noise: "med",
        desc: "Hedefin 1'den 65535'e kadar tüm TCP portlarını yarım açık SYN yöntemiyle tarar ve yalnızca açık portları kaydeder.",
        flags: [
            { flag: "-sS", text: "TCP SYN (Half-Open) Stealth taraması" },
            { flag: "-p-", text: "1 ile 65535 arasındaki tüm portları kapsar" },
            { flag: "-T4", text: "Agresif ve optimize edilmiş zamanlama" },
            { flag: "--open", text: "Filtrelenmiş ve kapalı portları gizler" }
        ]
    },
    {
        id: "top-fast-discovery",
        category: "top",
        title: "Hızlı İlk Keşif (Top 100 Port)",
        command: "nmap -F -sV --version-light <hedef>",
        tags: ["top", "hızlı", "top100"],
        noise: "low",
        desc: "En popüler 100 portu hafif versiyon tarama kuralıyla saniyeler içinde inceler.",
        flags: [
            { flag: "-F", text: "Fast Scan (En çok kullanılan 100 port)" },
            { flag: "-sV", text: "Servis versiyonu tespiti" },
            { flag: "--version-light", text: "Yalnızca en yaygın probları gönderir (Intensity: 2)" }
        ]
    },
    {
        id: "top-firewall-bypass-pn",
        category: "top",
        title: "Ping Engelini Aşma (No-Ping Scan)",
        command: "nmap -Pn -sS -p 80,443,8080,8443 <hedef>",
        tags: ["top", "firewall", "ping bypass", "waf"],
        noise: "low",
        desc: "ICMP ping isteklerine yanıt vermeyen veya firewall arkasında gizlenen hedefleri canlı kabul edip doğrudan port taramasına başlar.",
        flags: [
            { flag: "-Pn", text: "Host canlılık kontrolünü atla (Ping kapalı)" },
            { flag: "-sS", text: "TCP SYN taraması" },
            { flag: "-p", text: "Hedef web portları" }
        ]
    },
    {
        id: "top-vuln-audit",
        category: "top",
        title: "Otomatik Zafiyet ve CVE Taraması",
        command: "nmap -sV --script vuln <hedef>",
        tags: ["top", "zafiyet", "cve", "nse"],
        noise: "high",
        desc: "NSE kütüphanesindeki bilinen tüm zafiyet kontrol scriptlerini (CVE denetimleri, zayıf konfigürasyonlar vb.) çalıştırır.",
        flags: [
            { flag: "-sV", text: "Doğru script eşleşmesi için servis tespiti şarttır" },
            { flag: "--script vuln", text: "Tüm zafiyet kategorisi scriptlerini tetikler" }
        ]
    },
    {
        id: "top-turbo-rate",
        category: "top",
        title: "Turbo Hızda Ağ Keşfi (Min-Rate 2000)",
        command: "sudo nmap -sS --min-rate 2000 -p- --open <hedef>",
        tags: ["top", "turbo", "hızlı", "rate"],
        noise: "high",
        desc: "Saniyede gönderilen minimum paket sayısını 2000'e sabitleyerek geniş port bloklarını dakikalar içinde tarar.",
        flags: [
            { flag: "--min-rate 2000", text: "Paket hızını saniyede en az 2000 pakete zorlar" },
            { flag: "--open", text: "Sadece açık portları ekrana getirir" }
        ]
    },

    // --- HOST KEŞFİ & PING TEKNİKLERİ ---
    {
        id: "host-sn-ping",
        category: "host",
        title: "Port Taramasız Yalnızca Canlı Cihaz Keşfi",
        command: "nmap -sn 192.168.1.0/24",
        tags: ["host", "ping", "subnet", "hızlı"],
        noise: "low",
        desc: "Eski adıyla -sP. Ağdaki aktif cihazları hızlıca belirlemek için kullanılır; portları taramaz.",
        flags: [
            { flag: "-sn", text: "Port taraması yapma, sadece canlı hostları listele" }
        ]
    },
    {
        id: "host-arp-local",
        category: "host",
        title: "Yerel Ağda Ultra Hızlı ARP Keşfi",
        command: "sudo nmap -sn -PR 192.168.1.0/24",
        tags: ["host", "arp", "lan", "yerel"],
        noise: "low",
        desc: "Yerel Ethernet ağında IP ping yerine doğrudan ARP paketleriyle canlı cihazları anında ve kesin doğrulukla bulur.",
        flags: [
            { flag: "-PR", text: "ARP Ping kullan (Yerel ağda engellenemez)" }
        ]
    },
    {
        id: "host-tcp-syn-ping",
        category: "host",
        title: "TCP SYN Ping ile Canlılık Denetimi",
        command: "sudo nmap -sn -PS22,80,443,3389 192.168.1.0/24",
        tags: ["host", "syn ping", "firewall"],
        noise: "low",
        desc: "ICMP engelli ağlarda belirtilen portlara TCP SYN paketi göndererek RST veya SYN-ACK cevabına göre canlılığı doğrular.",
        flags: [
            { flag: "-PS[portlar]", text: "Belirtilen portlara TCP SYN canlılık paketi gönderir" }
        ]
    },
    {
        id: "host-tcp-ack-ping",
        category: "host",
        title: "TCP ACK Ping ile Durumsuz Firewall Atlama",
        command: "sudo nmap -sn -PA80,443 192.168.1.0/24",
        tags: ["host", "ack ping", "stateless"],
        noise: "low",
        desc: "Hedefe doğrudan ACK paketi fırlatır; canlı hostlar geçerli bir oturum olmadığı için RST döner ve varlıkları kanıtlanır.",
        flags: [
            { flag: "-PA[portlar]", text: "TCP ACK paketiyle canlılık doğrulaması" }
        ]
    },
    {
        id: "host-udp-ping",
        category: "host",
        title: "UDP Ping ile Canlı Cihaz Keşfi",
        command: "sudo nmap -sn -PU53,161 192.168.1.0/24",
        tags: ["host", "udp ping", "snmp", "dns"],
        noise: "low",
        desc: "DNS (53) veya SNMP (161) gibi yaygın UDP portlarına boş paketler atarak ICMP Port Unreachable yanıtı arar.",
        flags: [
            { flag: "-PU[portlar]", text: "UDP canlılık sorgusu" }
        ]
    },
    {
        id: "host-icmp-combos",
        category: "host",
        title: "ICMP Karma Canlılık Sorguları (Echo, Timestamp, Mask)",
        command: "sudo nmap -sn -PE -PP -PM 192.168.1.0/24",
        tags: ["host", "icmp", "timestamp", "netmask"],
        noise: "low",
        desc: "Standart Echo (-PE) dışında Zaman Damgası (-PP) ve Ağ Maskesi (-PM) ICMP sorguları ile eski filtreleri atlatır.",
        flags: [
            { flag: "-PE", text: "ICMP Echo Request" },
            { flag: "-PP", text: "ICMP Timestamp Request" },
            { flag: "-PM", text: "ICMP Address Mask Request" }
        ]
    },
    {
        id: "host-traceroute",
        category: "host",
        title: "Ağ Yolu ve Atlama Noktalarını Çıkarma (Traceroute)",
        command: "nmap -sn --traceroute scanme.nmap.org",
        tags: ["host", "traceroute", "hop", "route"],
        noise: "low",
        desc: "Hedefe giden ağ rotasını ve her yönlendirici düğümünün yanıt sürelerini haritalandırır.",
        flags: [
            { flag: "--traceroute", text: "Ağ yönlendirme atlamalarını listeler" }
        ]
    },

    // --- PORT TARAMA TEKNİKLERİ ---
    {
        id: "port-syn-scan",
        category: "port",
        title: "TCP SYN Stealth Scan (Yarım Açık Tarama)",
        command: "sudo nmap -sS -p 1-1000 192.168.1.1",
        tags: ["port", "syn", "stealth", "popüler"],
        noise: "low",
        desc: "TCP 3'lü el sıkışmayı tamamlamaz (SYN -> SYN/ACK -> RST). Hedef sistem loglarında iz bırakma ihtimali düşüktür.",
        flags: [
            { flag: "-sS", text: "TCP SYN taraması (Root yetkisi gerektirir)" }
        ]
    },
    {
        id: "port-connect-scan",
        category: "port",
        title: "TCP Connect Scan (Kullanıcı Modu)",
        command: "nmap -sT -p 80,443,22 192.168.1.1",
        tags: ["port", "connect", "non-root"],
        noise: "med",
        desc: "İşletim sisteminin connect() sistem çağrısını kullanarak 3'lü el sıkışmayı tam olarak bitirir. Root yetkisi gerekmez.",
        flags: [
            { flag: "-sT", text: "TCP Connect taraması" }
        ]
    },
    {
        id: "port-udp-scan",
        category: "port",
        title: "UDP Port Taraması (DNS, SNMP, DHCP, NTP)",
        command: "sudo nmap -sU -p 53,67,68,69,123,161,162 192.168.1.1",
        tags: ["port", "udp", "kritik"],
        noise: "med",
        desc: "Bağlantısız UDP protokolünü hedefler. Yanıt dönmeyen portlar 'open|filtered' olarak işaretlenir.",
        flags: [
            { flag: "-sU", text: "UDP port taraması" }
        ]
    },
    {
        id: "port-xmas-scan",
        category: "port",
        title: "TCP Xmas Scan (Noel Ağacı Taraması)",
        command: "sudo nmap -sX 192.168.1.1",
        tags: ["port", "xmas", "fin", "psh", "urg"],
        noise: "low",
        desc: "FIN, PSH ve URG bayraklarını aktif eder. RFC 793 uyumlu Unix/BSD sistemlerinde kapalı portlar RST döner, açıklar sessiz kalır.",
        flags: [
            { flag: "-sX", text: "Xmas Bayrak Taraması" }
        ]
    },
    {
        id: "port-null-scan",
        category: "port",
        title: "TCP Null Scan (Bayraksız Paket Taraması)",
        command: "sudo nmap -sN 192.168.1.1",
        tags: ["port", "null", "bayraksız"],
        noise: "low",
        desc: "TCP başlığında hiçbir bayrak biti yer almaz (0). Bazı durumsuz güvenlik duvarlarını şaşırtmak için kullanılır.",
        flags: [
            { flag: "-sN", text: "Null Taraması" }
        ]
    },
    {
        id: "port-fin-scan",
        category: "port",
        title: "TCP FIN Scan (Yalnızca FIN Bayrağı)",
        command: "sudo nmap -sF 192.168.1.1",
        tags: ["port", "fin", "rfc793"],
        noise: "low",
        desc: "Yalnızca TCP FIN biti set edilir. SYN paketlerini bloklayan basit paket filtrelerini aşabilir.",
        flags: [
            { flag: "-sF", text: "FIN Taraması" }
        ]
    },
    {
        id: "port-ack-scan",
        category: "port",
        title: "TCP ACK Taraması (Firewall Kural Haritalama)",
        command: "sudo nmap -sA -p 22,80,443 192.168.1.1",
        tags: ["port", "ack", "firewall", "filtre"],
        noise: "low",
        desc: "Portların açık/kapalı olduğunu değil; filtrelenmiş (filtered) mi yoksa filtrelenmemiş (unfiltered) mi olduğunu gösterir.",
        flags: [
            { flag: "-sA", text: "TCP ACK taraması" }
        ]
    },
    {
        id: "port-window-scan",
        category: "port",
        title: "TCP Window Scan (TCP Pencere Boyutu Analizi)",
        command: "sudo nmap -sW 192.168.1.1",
        tags: ["port", "window", "anomali"],
        noise: "low",
        desc: "Dönen RST paketlerindeki TCP pencere boyutuna göre açık/kapalı ayrımı yapar.",
        flags: [
            { flag: "-sW", text: "Window Taraması" }
        ]
    },
    {
        id: "port-idle-zombie-scan",
        category: "port",
        title: "TCP Idle Scan (Zombi Host ile Hayalet Tarama)",
        command: "sudo nmap -sI 192.168.1.200:80 192.168.1.50",
        tags: ["port", "idle", "zombie", "spoof", "hayalet"],
        noise: "low",
        desc: "Hedefe doğrudan kendi IP'nizden tek bir paket bile göndermez! Bir zombi hostun IPID artışlarını kullanarak kör tarama yapar.",
        flags: [
            { flag: "-sI [zombi:port]", text: "Belirtilen zombi IP'sini kullanarak hedefi gizlice tarar" }
        ]
    },
    {
        id: "port-sctp-init",
        category: "port",
        title: "SCTP INIT Taraması (Telekomünikasyon & SS7)",
        command: "sudo nmap -sY -p 2905,3868 192.168.1.1",
        tags: ["port", "sctp", "telekom", "diameter"],
        noise: "low",
        desc: "Telekom ağlarında (Diameter, SIGTRAN vb.) kullanılan SCTP protokolü için INIT paketleri yollar.",
        flags: [
            { flag: "-sY", text: "SCTP INIT taraması" }
        ]
    },

    // --- VERSİYON & OS TESPİTİ ---
    {
        id: "detect-service-standard",
        category: "detection",
        title: "Standart Servis & Versiyon Tespiti",
        command: "nmap -sV 192.168.1.1",
        tags: ["detection", "versiyon", "banner", "servis"],
        noise: "med",
        desc: "Açık portlara özel proplar göndererek çalışan uygulamanın adını ve tam versiyon numarasını çıkarır.",
        flags: [
            { flag: "-sV", text: "Servis versiyon tespiti" }
        ]
    },
    {
        id: "detect-version-deep",
        category: "detection",
        title: "Derinlemesine Servis Sürüm Tespiti (Intensity 9)",
        command: "nmap -sV --version-all 192.168.1.1",
        tags: ["detection", "versiyon", "derin", "intensity9"],
        noise: "high",
        desc: "Nmap'in nmap-service-probes veritabanındaki tüm propları dener. Standart taramanın tanıyamadığı bilinmeyen servisleri çözer.",
        flags: [
            { flag: "--version-all", text: "En yüksek versiyon yoğunluğu (Intensity 9)" }
        ]
    },
    {
        id: "detect-os-standard",
        category: "detection",
        title: "İşletim Sistemi (OS) Tespiti",
        command: "sudo nmap -O --osscan-guess 192.168.1.1",
        tags: ["detection", "os", "fingerprint", "tahmin"],
        noise: "med",
        desc: "Hedefin TCP/IP yığın davranışını inceleyerek Linux, Windows, macOS veya gömülü sistem (IoT) olduğunu belirler.",
        flags: [
            { flag: "-O", text: "OS tespiti" },
            { flag: "--osscan-guess", text: "Eşleşme tam olmasa bile en yakın tahmini zorla" }
        ]
    },
    {
        id: "detect-aggressive-all",
        category: "detection",
        title: "Agresif Denetim Modu (-A)",
        command: "sudo nmap -A -T4 192.168.1.1",
        tags: ["detection", "agresif", "all-in-one"],
        noise: "high",
        desc: "OS tespiti (-O), Servis versiyonu (-sV), Varsayılan Scriptler (-sC) ve Traceroute'u tek bir bayrakta birleştirir.",
        flags: [
            { flag: "-A", text: "Agresif tarama modu" }
        ]
    },

    // --- NSE (NMAP SCRIPTING ENGINE) ---
    {
        id: "nse-default-safe",
        category: "nse",
        title: "Varsayılan Güvenli Script Seti (-sC)",
        command: "nmap -sC 192.168.1.1",
        tags: ["nse", "default", "safe", "temel"],
        noise: "low",
        desc: "Sisteme zarar vermeyen, hedefi çökertmeyen en popüler bilgi toplama scriptlerini çalıştırır.",
        flags: [
            { flag: "-sC", text: "--script=default ile eşdeğerdir" }
        ]
    },
    {
        id: "nse-vuln-all",
        category: "nse",
        title: "Tüm Bilinen Zafiyetleri Denetleme",
        command: "nmap -sV --script vuln 192.168.1.1",
        tags: ["nse", "vuln", "cve", "zafiyet"],
        noise: "high",
        desc: "Hedefteki servislerde bilinen güvenlik açıklarını (CVE kayıtları, zayıflıklar) sorgular.",
        flags: [
            { flag: "--script vuln", text: "Vuln kategorisindeki tüm NSE betiklerini çalıştırır" }
        ]
    },
    {
        id: "nse-eternalblue",
        category: "nse",
        title: "SMB EternalBlue (MS17-010) Denetimi",
        command: "nmap -p 445 --script smb-vuln-ms17-010 192.168.1.1",
        tags: ["nse", "smb", "eternalblue", "ms17-010", "windows"],
        noise: "low",
        desc: "WannaCry ve NotPetya gibi saldırılarda kullanılan kritik Windows SMB zafiyetini hedefler.",
        flags: [
            { flag: "-p 445", text: "SMB portu" },
            { flag: "--script smb-vuln-ms17-010", text: "EternalBlue açık kontrol scripti" }
        ]
    },
    {
        id: "nse-http-enum",
        category: "nse",
        title: "Web Sunucusu Dizin & Servis Keşfi",
        command: "nmap -p 80,443 --script http-enum,http-title 192.168.1.1",
        tags: ["nse", "http", "web", "dizin", "admin"],
        noise: "med",
        desc: "Web sunucusu üzerinde bilinen yönetim panelleri (/admin, /wp-admin), yedek dosyaları ve sayfa başlıklarını bulur.",
        flags: [
            { flag: "http-enum", text: "Yaygın web yollarını numaralandırır" },
            { flag: "http-title", text: "Web sitesinin HTML title etiketini çeker" }
        ]
    },
    {
        id: "nse-ssl-ciphers",
        category: "nse",
        title: "SSL/TLS Şifreleme Güvenlik Denetimi",
        command: "nmap -p 443 --script ssl-enum-ciphers 192.168.1.1",
        tags: ["nse", "ssl", "tls", "cipher", "kripto"],
        noise: "low",
        desc: "Hedefin desteklediği TLS sürümlerini ve şifreleme algoritmalarını (Cipher Suites) zayıflık puanlarıyla listeler.",
        flags: [
            { flag: "ssl-enum-ciphers", text: "Zayıf SSLv3, TLS 1.0/1.1 ve güvensiz şifreleri raporlar" }
        ]
    },
    {
        id: "nse-smb-enum-shares",
        category: "nse",
        title: "SMB Paylaşımları & Kullanıcı Keşfi",
        command: "nmap -p 445 --script smb-enum-shares,smb-enum-users 192.168.1.1",
        tags: ["nse", "smb", "shares", "paylaşım", "active directory"],
        noise: "med",
        desc: "Anonim veya yetkisiz erişime açık Windows ağ paylaşımlarını ve kullanıcı listesini listeler.",
        flags: [
            { flag: "smb-enum-shares", text: "Erişilebilir klasör paylaşımlarını gösterir" }
        ]
    },
    {
        id: "nse-custom-args",
        category: "nse",
        title: "NSE Scriptlerine Özel Argüman Aktarma",
        command: "nmap -p 80 --script http-brute --script-args userdb=users.txt,passdb=pass.txt 192.168.1.1",
        tags: ["nse", "args", "brute", "sözlük"],
        noise: "high",
        desc: "Scriptin çalışması için gereken kullanıcı adı veya parola sözlüğü gibi parametreleri aktarır.",
        flags: [
            { flag: "--script-args", text: "Virgülle ayrılmış anahtar=değer argümanları" }
        ]
    },

    // --- IDS / WAF ATLATMA (EVASION & SPOOFING) ---
    {
        id: "evasion-fragmentation",
        category: "evasion",
        title: "Paket Parçalama (Packet Fragmentation)",
        command: "sudo nmap -sS -f 192.168.1.1",
        tags: ["evasion", "fragment", "parçalama", "waf"],
        noise: "low",
        desc: "IP başlığını 8 byte'lık küçük parçalara böler. Durumsuz paket filtreleri paket içeriğini tek parça göremediğinden kuralı atlatabilir.",
        flags: [
            { flag: "-f", text: "Paketleri 8 byte'a böler (-ff: 16 byte)" }
        ]
    },
    {
        id: "evasion-mtu",
        category: "evasion",
        title: "Özel MTU Boyutu ile Paket Bölme",
        command: "sudo nmap -sS --mtu 24 192.168.1.1",
        tags: ["evasion", "mtu", "firewall"],
        noise: "low",
        desc: "Belirtilen MTU boyutunda özel parçalama yapar (Değer 8'in katı olmalıdır).",
        flags: [
            { flag: "--mtu 24", text: "24 byte MTU parçalama boyutu" }
        ]
    },
    {
        id: "evasion-decoy-ips",
        category: "evasion",
        title: "Sahte Decoy IP'ler ile Hedefi Aldatma",
        command: "sudo nmap -sS -D 10.0.0.1,10.0.0.2,ME,10.0.0.5 192.168.1.1",
        tags: ["evasion", "decoy", "sahte ip", "ids aldatma"],
        noise: "low",
        desc: "Hedefin IDS/IPS ve güvenlik duvarı loglarında gerçek IP adresinizi sahte IP adresleri arasına karıştırarak gizler.",
        flags: [
            { flag: "-D", text: "Decoy IP listesi (ME: Gerçek tarayıcı konumu)" },
            { flag: "RND:10", text: "10 rastgele sahte IP üretir" }
        ]
    },
    {
        id: "evasion-source-port",
        category: "evasion",
        title: "Kaynak Portu Maskeleme (DNS / HTTP)",
        command: "sudo nmap -sS -g 53 192.168.1.1",
        tags: ["evasion", "source port", "dns 53", "firewall rule"],
        noise: "low",
        desc: "Gelen paketleri 'güvenli DNS sunucusu yanıtı' gibi göstermek için kaynak portu 53 olarak değiştirir.",
        flags: [
            { flag: "-g 53 / --source-port", text: "Tarama paketlerinin kaynak portunu sabitler" }
        ]
    },
    {
        id: "evasion-data-length",
        category: "evasion",
        title: "Paketlere Rastgele Payload Ekleyerek İmzayı Bozma",
        command: "sudo nmap -sS --data-length 40 192.168.1.1",
        tags: ["evasion", "data length", "imza", "snort"],
        noise: "low",
        desc: "Nmap'in standart boş SYN paketlerine rastgele veri ekleyerek IDS sistemlerinin 'boş SYN' imzalarını tetiklemesini engeller.",
        flags: [
            { flag: "--data-length [boyut]", text: "Paket sonuna rastgele baytlar ilave eder" }
        ]
    },
    {
        id: "evasion-spoof-mac",
        category: "evasion",
        title: "Sahte MAC Adresi ile Tarama",
        command: "sudo nmap -sS --spoof-mac Apple 192.168.1.1",
        tags: ["evasion", "mac", "spoof", "wifi", "switch"],
        noise: "low",
        desc: "MAC filtreli yerel ağlarda Apple, Cisco gibi üretici prefixleri veya doğrudan sahte bir donanım adresi kullanır.",
        flags: [
            { flag: "--spoof-mac [üretici/MAC]", text: "Donanım MAC adresini sahteler" }
        ]
    },
    {
        id: "evasion-proxies",
        category: "evasion",
        title: "SOCKS4 veya HTTP Proxy Üzerinden Tarama",
        command: "nmap -sT --proxies socks4://127.0.0.1:9050,http://10.10.1.1:8080 192.168.1.1",
        tags: ["evasion", "proxy", "tor", "socks"],
        noise: "low",
        desc: "Bağlantıları zincirleme proxy veya Tor servisi üzerinden yönlendirerek gerçek IP'yi gizler.",
        flags: [
            { flag: "--proxies", text: "Virgülle ayrılmış HTTP/SOCKS4 proxy listesi" }
        ]
    },
    {
        id: "evasion-badsum",
        category: "evasion",
        title: "Hatalı TCP Checksum ile Güvenlik Duvarı Tespiti",
        command: "sudo nmap -sS --badsum 192.168.1.1",
        tags: ["evasion", "badsum", "checksum", "firewall audit"],
        noise: "low",
        desc: "Bilinçli olarak geçersiz TCP checksum gönderir. Gerçek hostlar paketi düşürür; cevap dönüyorsa aradaki bir firewall'dur.",
        flags: [
            { flag: "--badsum", text: "Hatalı checksum paketleri gönder" }
        ]
    },

    // --- ZAMANLAMA & PERFORMANS ---
    {
        id: "timing-t4-fast",
        category: "timing",
        title: "Standart Hızlı Zamanlama Şablonu (-T4)",
        command: "nmap -T4 192.168.1.1",
        tags: ["timing", "t4", "hızlı", "standart"],
        noise: "low",
        desc: "Güvenilir ve modern ağlar için varsayılan önerilen hız şablonu. Zaman aşımlarını makul seviyede tutar.",
        flags: [
            { flag: "-T4", text: "Aggressive zamanlama şablonu" }
        ]
    },
    {
        id: "timing-t0-paranoid",
        category: "timing",
        title: "Paranoid Gizlilik Modu (-T0)",
        command: "nmap -T0 192.168.1.1",
        tags: ["timing", "t0", "paranoid", "ids bypass"],
        noise: "low",
        desc: "Paketler arasında 5 dakikaya varan gecikmeler koyar. Klasik IDS sistemlerinin zamana dayalı korelasyonunu tamamen kırar.",
        flags: [
            { flag: "-T0", text: "Paranoid (Aşırı yavaş ama tespit edilmesi çok zor)" }
        ]
    },
    {
        id: "timing-scan-delay",
        category: "timing",
        title: "Özel Paket Gecikmesi ile Rate-Limit Aşma",
        command: "sudo nmap -sS --scan-delay 1.5s 192.168.1.1",
        tags: ["timing", "delay", "rate limit", "waf"],
        noise: "low",
        desc: "Her bir prob paketi arasına 1.5 saniye bekleme süresi koyarak WAF/IPS hız limitlerine takılmayı önler.",
        flags: [
            { flag: "--scan-delay [süre]", text: "Paketler arasına sabit gecikme ekler" }
        ]
    },
    {
        id: "timing-host-timeout",
        category: "timing",
        title: "Yavaş Hostları Otomatik Terk Etme",
        command: "nmap --host-timeout 10m 192.168.1.0/24",
        tags: ["timing", "timeout", "geniş ağ"],
        noise: "low",
        desc: "10 dakika içinde tamamlanmayan yavaş veya yanıt vermeyen cihazları atlayıp sonraki hedefe geçer.",
        flags: [
            { flag: "--host-timeout", text: "Bir hedefe ayrılabilecek maksimum süre" }
        ]
    },

    // --- ÇIKTI & RAPORLAMA ---
    {
        id: "output-all-formats",
        category: "output",
        title: "Tüm Formatlarda Eşzamanlı Kayıt (-oA)",
        command: "nmap -oA audit_raporu 192.168.1.1",
        tags: ["output", "tüm formatlar", "arşiv"],
        noise: "low",
        desc: "audit_raporu.nmap (metin), audit_raporu.xml (araç entegrasyonu) ve audit_raporu.gnmap (grep) dosyalarını aynı anda üretir.",
        flags: [
            { flag: "-oA [dosya_adı]", text: "Normal, XML ve Grep formatlarını tek seferde oluşturur" }
        ]
    },
    {
        id: "output-xml-xslt",
        category: "output",
        title: "XML Çıktısını Profesyonel HTML Rapora Çevirme",
        command: "xsltproc scan.xml -o scan.html",
        tags: ["output", "xml", "html", "rapor", "xsltproc"],
        noise: "low",
        desc: "Nmap'in ürettiği XML dosyasını tarayıcıda görüntülenebilir şık bir HTML yönetim raporuna dönüştürür.",
        flags: [
            { flag: "xsltproc", text: "Linux XML dönüştürücü paketi" }
        ]
    },
    {
        id: "output-reason-packet",
        category: "output",
        title: "Port Durum Nedenlerini İnceleme (--reason)",
        command: "nmap --reason -p 80,443 192.168.1.1",
        tags: ["output", "reason", "syn-ack", "rst"],
        noise: "low",
        desc: "Bir portun neden 'open' (syn-ack ile) veya neden 'closed' (reset ile) olduğunu detaylandırır.",
        flags: [
            { flag: "--reason", text: "Durum belirleyen TCP/IP bayrağını gösterir" }
        ]
    },
    {
        id: "output-grep-open-ports",
        category: "output",
        title: "Açık Portları Tek Satırda Grep ile Ayıklama",
        command: "grep -E 'open' scan.gnmap | cut -d ' ' -f 2",
        tags: ["output", "bash", "grep", "gnmap", "otomasyon"],
        noise: "low",
        desc: "Grep formatındaki çıktıdan yalnızca açık porta sahip IP adreslerini süzüp bash pipeline'ına aktarır.",
        flags: [
            { flag: "scan.gnmap", text: "Grep-edilebilir Nmap çıktısı" }
        ]
    },

    // --- PENTEST REÇETELERİ & SENARYOLAR ---
    {
        id: "playbook-stealth-external",
        category: "playbook",
        title: "Senaryo 1: Dış Ağda Hayalet Keşif (Stealth Recon)",
        command: "sudo nmap -sS -Pn -n -T2 -D RND:5 -g 53 --data-length 25 -p 80,443,8443,22 -oA stealth_recon 10.10.10.50",
        tags: ["playbook", "red team", "stealth", "waf bypass", "senaryo"],
        noise: "low",
        desc: "SIEM ve SOC alarmlarını tetiklemeden dış ağ IP'sinde servis haritalandırma yapar. DNS portundan gelir, sahte IP'lerle karışır.",
        flags: [
            { flag: "-n", text: "DNS çözümlemesini kapat (Trafiği azaltır)" },
            { flag: "-T2", text: "Nazik zamanlama" },
            { flag: "-g 53", text: "DNS kaynak portu maskesi" }
        ]
    },
    {
        id: "playbook-internal-ad-audit",
        category: "playbook",
        title: "Senaryo 2: Active Directory & Domain Controller Analizi",
        command: "nmap -p 53,88,135,139,389,445,464,593,636,3268,3269,3389 --script 'smb-vuln*,smb-enum-shares,smb-security-mode,ldap-rootdse' -oA ad_audit 192.168.1.10",
        tags: ["playbook", "active directory", "smb", "ldap", "kerberos", "senaryo"],
        noise: "med",
        desc: "Kurumsal ağlarda Domain Controller sunucusunun kritik portlarını ve SMB güvenlik yapılandırmalarını tek seferde inceler.",
        flags: [
            { flag: "88, 389, 445", text: "Kerberos, LDAP ve SMB portları" }
        ]
    },
    {
        id: "playbook-web-vuln-stack",
        category: "playbook",
        title: "Senaryo 3: Web Uygulama & Zafiyet Tarama Yığını",
        command: "nmap -p 80,443 -sV --script 'http-enum,http-vuln*,http-headers,http-methods' --open -oA web_audit target.local",
        tags: ["playbook", "web", "http", "api", "zafiyet", "senaryo"],
        noise: "high",
        desc: "Web portlarındaki HTTP metotlarını, zayıf başlıkları ve bilinen web uygulama açıklarını raporlar.",
        flags: [
            { flag: "http-vuln*", text: "Tüm web zafiyet denetimleri" }
        ]
    }
];

// ==========================================================================
// 4. BAYRAK SÖZLÜĞÜ VERİLERİ (FLAG DICTIONARY)
// ==========================================================================
const NMAP_FLAGS_DICTIONARY = [
    { flag: "-sS", cat: "Port Tarama", desc: "TCP SYN Stealth (Yarım Açık) tarama; en popüler ve hızlı yöntem.", root: "Evet", example: "sudo nmap -sS <hedef>" },
    { flag: "-sT", cat: "Port Tarama", desc: "TCP Connect taraması; 3'lü el sıkışmayı tamamlar, root yetkisi gerektirmez.", root: "Hayır", example: "nmap -sT <hedef>" },
    { flag: "-sU", cat: "Port Tarama", desc: "UDP port taraması; DNS, SNMP, DHCP ve NTP gibi servisler için kullanılır.", root: "Evet", example: "sudo nmap -sU <hedef>" },
    { flag: "-sn", cat: "Host Keşfi", desc: "Yalnızca canlı cihazları keşfeder; port taraması yapmaz (Eski -sP).", root: "Hayır", example: "nmap -sn 192.168.1.0/24" },
    { flag: "-Pn", cat: "Host Keşfi", desc: "Ping atma kontrolünü devre dışı bırakır; hostu doğrudan canlı kabul eder.", root: "Hayır", example: "nmap -Pn <hedef>" },
    { flag: "-PR", cat: "Host Keşfi", desc: "Yerel Ethernet ağında ARP Ping ile cihazları keşfeder.", root: "Evet", example: "sudo nmap -sn -PR 192.168.1.0/24" },
    { flag: "-sV", cat: "Versiyon", desc: "Açık portlarda koşan servislerin isim ve sürüm bilgilerini tespit eder.", root: "Hayır", example: "nmap -sV <hedef>" },
    { flag: "-O", cat: "İşletim Sistemi", desc: "TCP/IP stack parmak izi analizi ile işletim sistemini tahmin eder.", root: "Evet", example: "sudo nmap -O <hedef>" },
    { flag: "-A", cat: "Kombinasyon", desc: "Agresif mod: -sV, -O, -sC ve --traceroute bayraklarını tek seferde çalıştırır.", root: "Evet", example: "sudo nmap -A <hedef>" },
    { flag: "-sC", cat: "NSE Script", desc: "Varsayılan güvenli script setini (--script=default) çalıştırır.", root: "Hayır", example: "nmap -sC <hedef>" },
    { flag: "--script", cat: "NSE Script", desc: "Belirtilen script veya script kategorisini (vuln, auth vb.) çalıştırır.", root: "Hayır", example: "nmap --script vuln <hedef>" },
    { flag: "-p-", cat: "Port Seçimi", desc: "1 ile 65535 arasındaki tüm TCP portlarını kapsar.", root: "Hayır", example: "nmap -p- <hedef>" },
    { flag: "-F", cat: "Port Seçimi", desc: "Fast Scan: En sık kullanılan 100 portu hızlıca inceler.", root: "Hayır", example: "nmap -F <hedef>" },
    { flag: "-T4", cat: "Zamanlama", desc: "Hızlı ve güvenilir agresif zamanlama şablonu (Önerilen).", root: "Hayır", example: "nmap -T4 <hedef>" },
    { flag: "--min-rate", cat: "Zamanlama", desc: "Saniyede gönderilen minimum paket sayısını sabitleyerek taramayı hızlandırır.", root: "Hayır", example: "nmap --min-rate 1000 <hedef>" },
    { flag: "-f", cat: "Evasion", desc: "Paketleri 8 byte'lık parçalara (fragment) bölerek WAF/IDS aldatır.", root: "Evet", example: "sudo nmap -f <hedef>" },
    { flag: "-D", cat: "Evasion", desc: "Sahte Decoy IP'ler göndererek gerçek tarayıcı IP'sini loglarda gizler.", root: "Evet", example: "sudo nmap -D RND:5 <hedef>" },
    { flag: "-g", cat: "Evasion", desc: "Kaynak portu belirler (Örn: 53 DNS, 80 HTTP) ve güvenlik kurallarını aşar.", root: "Evet", example: "sudo nmap -g 53 <hedef>" },
    { flag: "-oA", cat: "Çıktı", desc: "Sonuçları hem Normal (.nmap), hem XML (.xml) hem de Grep (.gnmap) olarak kaydeder.", root: "Hayır", example: "nmap -oA sonuc <hedef>" },
    { flag: "--open", cat: "Filtreleme", desc: "Yalnızca açık (veya muhtemelen açık) portları listeler; kapalıları gizler.", root: "Hayır", example: "nmap --open <hedef>" },
    { flag: "--reason", cat: "Ayrıntı", desc: "Port durumunun belirlenme sebebini (SYN-ACK, RST vb.) gösterir.", root: "Hayır", example: "nmap --reason <hedef>" },
    { flag: "-v", cat: "Ayrıntı", desc: "Ayrıntı düzeyini artırır (Verbose); tarama ilerlemesini ekranda gösterir.", root: "Hayır", example: "nmap -v <hedef>" }
];

// ==========================================================================
// 5. UYGULAMA DURUMU (APP STATE)
// ==========================================================================
const appState = {
    favorites: JSON.parse(localStorage.getItem('nmap_favs') || '[]'),
    currentCategory: 'all',
    searchQuery: '',
    builder: {
        target: '192.168.1.1/24',
        scanType: '-sS',
        ports: '',
        detectVersion: true,
        detectOS: true,
        noPing: false,
        traceroute: false,
        aggressive: false,
        onlyOpen: true,
        reason: true,
        verbose: true,
        nse: '',
        customNse: '',
        fragment: false,
        decoy: false,
        sourcePort: false,
        dataLength: false,
        timing: '-T4',
        minRate: '',
        output: '-oA scan_results'
    }
};

// ==========================================================================
// 6. DOM ELEMANLARI & BAŞLANGIÇ
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initMatrixCanvas();
    initHeaderControls();
    initCommandBuilder();
    initCheatsheetGrid();
    initTerminalSimulator();
    populateFlagsTable();
    updateFavoriteCount();

    // Ses tercihi yükle
    const savedAudio = localStorage.getItem('nmap_audio_enabled');
    if (savedAudio !== null) {
        cyberAudio.enabled = (savedAudio === 'true');
        updateAudioButtonUI();
    }
});

// ==========================================================================
// 7. HEADER BUTONLARI & EFEKTLER
// ==========================================================================
function initHeaderControls() {
    const audioBtn = document.getElementById('toggle-audio-btn');
    const crtBtn = document.getElementById('toggle-crt-btn');
    const crtOverlay = document.getElementById('crt-overlay');

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            cyberAudio.enabled = !cyberAudio.enabled;
            localStorage.setItem('nmap_audio_enabled', cyberAudio.enabled);
            updateAudioButtonUI();
            cyberAudio.playClick();
            showToast(cyberAudio.enabled ? 'Siber Ses Efektleri Açıldı' : 'Siber Ses Efektleri Kapatıldı');
        });
    }

    if (crtBtn && crtOverlay) {
        crtBtn.addEventListener('click', () => {
            crtOverlay.classList.toggle('disabled');
            const isDisabled = crtOverlay.classList.contains('disabled');
            crtBtn.querySelector('.btn-text').textContent = isDisabled ? 'CRT: KAPALI' : 'CRT: AÇIK';
            cyberAudio.playClick();
        });
    }
}

function updateAudioButtonUI() {
    const audioBtn = document.getElementById('toggle-audio-btn');
    if (audioBtn) {
        audioBtn.querySelector('.btn-text').textContent = cyberAudio.enabled ? 'SES: AÇIK' : 'SES: KAPALI';
        audioBtn.querySelector('.icon').textContent = cyberAudio.enabled ? '🔊' : '🔇';
    }
}

// ==========================================================================
// 8. İNTERAKTİF KOMUT OLUŞTURUCU (COMMAND BUILDER ENGINE)
// ==========================================================================
function initCommandBuilder() {
    const targetInput = document.getElementById('target-input');
    const scanSelect = document.getElementById('scan-type-select');
    const scanDesc = document.getElementById('scan-type-desc');
    const portCustomInput = document.getElementById('port-custom-input');
    const nseSelect = document.getElementById('nse-select');
    const customNseInput = document.getElementById('custom-nse-input');
    const outputSelect = document.getElementById('output-select');
    const minRateInput = document.getElementById('min-rate-input');

    // Checkboxlar
    const checkSv = document.getElementById('check-sV');
    const checkO = document.getElementById('check-O');
    const checkPn = document.getElementById('check-Pn');
    const checkTrace = document.getElementById('check-traceroute');
    const checkA = document.getElementById('check-A');
    const checkOpen = document.getElementById('check-open');
    const checkReason = document.getElementById('check-reason');
    const checkV = document.getElementById('check-v');
    const checkFragment = document.getElementById('check-fragment');
    const checkDecoy = document.getElementById('check-decoy');
    const checkSourcePort = document.getElementById('check-source-port');
    const checkDataLength = document.getElementById('check-data-length');

    // Hedef Preset Butonları
    document.querySelectorAll('[data-target-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-target-preset]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            targetInput.value = btn.dataset.targetPreset;
            appState.builder.target = btn.dataset.targetPreset;
            cyberAudio.playClick();
            updateGeneratedCommand();
        });
    });

    targetInput.addEventListener('input', (e) => {
        appState.builder.target = e.target.value.trim() || '192.168.1.1';
        updateGeneratedCommand();
    });

    // Tarama türü açıklamaları
    const scanDescriptions = {
        '-sS': 'Yarım açık (half-open) SYN paketleriyle hızlı ve sessiz tarama yapar (Root gerektirir).',
        '-sT': 'İşletim sistemi soketiyle TCP 3\'lü el sıkışmayı bitirir. Root yetkisi gerekmez.',
        '-sU': 'UDP tabanlı servisleri (DNS, SNMP, NTP vb.) inceler.',
        '-sn': 'Yalnızca hangi hostların canlı olduğunu listeler, port taraması yapmaz.',
        '-sA': 'TCP ACK paketleri yollar; firewall kurallarını ve filtrelerini haritalar.',
        '-sF': 'Yalnızca TCP FIN bayrağı gönderir; bazı firewallları şaşırtır.',
        '-sX': 'Xmas taraması; FIN, PSH ve URG bayraklarını açar.',
        '-sN': 'Null taraması; hiçbir bayrak biti yer almaz.',
        '-sI': 'Zombi bir host arkasından kör (hayalet) tarama gerçekleştirir.'
    };

    scanSelect.addEventListener('change', (e) => {
        appState.builder.scanType = e.target.value;
        scanDesc.textContent = scanDescriptions[e.target.value] || '';
        cyberAudio.playClick();
        updateGeneratedCommand();
    });

    // Port Preset Butonları
    document.querySelectorAll('#port-presets .chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#port-presets .chip-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            portCustomInput.value = btn.dataset.port;
            appState.builder.ports = btn.dataset.port;
            cyberAudio.playClick();
            updateGeneratedCommand();
        });
    });

    portCustomInput.addEventListener('input', (e) => {
        appState.builder.ports = e.target.value.trim();
        updateGeneratedCommand();
    });

    // Checkbox Dinleyicileri
    checkSv.addEventListener('change', (e) => { appState.builder.detectVersion = e.target.checked; updateGeneratedCommand(); });
    checkO.addEventListener('change', (e) => { appState.builder.detectOS = e.target.checked; updateGeneratedCommand(); });
    checkPn.addEventListener('change', (e) => { appState.builder.noPing = e.target.checked; updateGeneratedCommand(); });
    checkTrace.addEventListener('change', (e) => { appState.builder.traceroute = e.target.checked; updateGeneratedCommand(); });
    checkA.addEventListener('change', (e) => { appState.builder.aggressive = e.target.checked; updateGeneratedCommand(); });
    checkOpen.addEventListener('change', (e) => { appState.builder.onlyOpen = e.target.checked; updateGeneratedCommand(); });
    checkReason.addEventListener('change', (e) => { appState.builder.reason = e.target.checked; updateGeneratedCommand(); });
    checkV.addEventListener('change', (e) => { appState.builder.verbose = e.target.checked; updateGeneratedCommand(); });
    checkFragment.addEventListener('change', (e) => { appState.builder.fragment = e.target.checked; updateGeneratedCommand(); });
    checkDecoy.addEventListener('change', (e) => { appState.builder.decoy = e.target.checked; updateGeneratedCommand(); });
    checkSourcePort.addEventListener('change', (e) => { appState.builder.sourcePort = e.target.checked; updateGeneratedCommand(); });
    checkDataLength.addEventListener('change', (e) => { appState.builder.dataLength = e.target.checked; updateGeneratedCommand(); });

    // NSE Dinleyicileri
    nseSelect.addEventListener('change', (e) => {
        appState.builder.nse = e.target.value;
        cyberAudio.playClick();
        updateGeneratedCommand();
    });

    customNseInput.addEventListener('input', (e) => {
        appState.builder.customNse = e.target.value.trim();
        updateGeneratedCommand();
    });

    // Timing Butonları
    document.querySelectorAll('.timing-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.timing-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.builder.timing = btn.dataset.timing;
            cyberAudio.playClick();
            updateGeneratedCommand();
        });
    });

    minRateInput.addEventListener('input', (e) => {
        appState.builder.minRate = e.target.value.trim();
        updateGeneratedCommand();
    });

    outputSelect.addEventListener('change', (e) => {
        appState.builder.output = e.target.value;
        cyberAudio.playClick();
        updateGeneratedCommand();
    });

    // Komutu Kopyala Butonu
    const copyBuilderBtn = document.getElementById('copy-builder-cmd-btn');
    if (copyBuilderBtn) {
        copyBuilderBtn.addEventListener('click', () => {
            const cmdText = document.getElementById('generated-command-output').textContent.trim();
            copyToClipboard(cmdText);
        });
    }

    // Terminalde Simüle Et Butonu
    const runSimBtn = document.getElementById('run-simulation-btn');
    if (runSimBtn) {
        runSimBtn.addEventListener('click', () => {
            const cmdText = document.getElementById('generated-command-output').textContent.trim();
            runCommandInSimulator(cmdText);
            document.getElementById('terminal-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Favorilere Kaydet Butonu
    const saveFavBtn = document.getElementById('save-to-favs-btn');
    if (saveFavBtn) {
        saveFavBtn.addEventListener('click', () => {
            const cmdText = document.getElementById('generated-command-output').textContent.trim();
            saveCustomFavorite(cmdText);
        });
    }

    updateGeneratedCommand();
}

function updateGeneratedCommand() {
    const b = appState.builder;
    const parts = [];

    // Root kontrolü (SYN, OS, UDP, Fragment vb. sudo gerektirir)
    const needsRoot = ['-sS', '-sU', '-sA', '-sF', '-sX', '-sN', '-sI'].includes(b.scanType) 
                    || b.detectOS || b.fragment || b.decoy || b.sourcePort || b.dataLength;

    if (needsRoot) {
        parts.push('sudo');
    }
    parts.push('nmap');

    // Tarama türü
    if (b.scanType) {
        parts.push(b.scanType);
    }

    // Ping atlama
    if (b.noPing) {
        parts.push('-Pn');
    }

    // Portlar
    if (b.ports) {
        parts.push(b.ports);
    }

    // Agresif mod veya ayrı ayrı versiyon & OS
    if (b.aggressive) {
        parts.push('-A');
    } else {
        if (b.detectVersion) parts.push('-sV');
        if (b.detectOS) parts.push('-O');
    }

    // Traceroute
    if (b.traceroute && !b.aggressive) {
        parts.push('--traceroute');
    }

    // NSE Scriptler
    if (b.customNse) {
        parts.push(b.customNse.startsWith('--script') ? b.customNse : `--script ${b.customNse}`);
    } else if (b.nse) {
        parts.push(b.nse);
    }

    // Evasion bayrakları
    if (b.fragment) parts.push('-f');
    if (b.decoy) parts.push('-D RND:5');
    if (b.sourcePort) parts.push('-g 53');
    if (b.dataLength) parts.push('--data-length 32');

    // Zamanlama
    if (b.timing) parts.push(b.timing);
    if (b.minRate) parts.push(`--min-rate ${b.minRate}`);

    // Çıktı & Filtreler
    if (b.onlyOpen) parts.push('--open');
    if (b.reason) parts.push('--reason');
    if (b.verbose) parts.push('-v');
    if (b.output) parts.push(b.output);

    // Hedef
    parts.push(b.target || '192.168.1.1');

    const finalCmd = parts.join(' ');
    const cmdEl = document.getElementById('generated-command-output');
    if (cmdEl) {
        cmdEl.textContent = finalCmd;
    }

    // Açıklamayı güncelle
    updateCommandExplanation(b, finalCmd);
}

function updateCommandExplanation(b, cmd) {
    const expEl = document.getElementById('command-explanation');
    if (!expEl) return;

    let text = `<strong>Komut Açıklaması:</strong> Hedef <code>${b.target}</code> üzerinde `;

    if (b.scanType === '-sS') text += `yarım açık TCP SYN (${b.scanType}) tekniğiyle `;
    else if (b.scanType === '-sT') text += `TCP Connect (${b.scanType}) yöntemiyle `;
    else if (b.scanType === '-sU') text += `UDP (${b.scanType}) protokolü taranır. `;
    else if (b.scanType === '-sn') text += `port taraması yapılmadan sadece canlı cihazlar aranır (-sn). `;

    if (b.ports) text += `Port kapsamı: <code>${b.ports}</code>. `;
    else text += `Varsayılan en yaygın 1000 port taranır. `;

    if (b.noPing) text += `Ping koruması atlanır (-Pn). `;
    if (b.detectVersion) text += `Servis sürümleri (-sV) sorgulanır. `;
    if (b.detectOS) text += `İşletim sistemi (-O) tahmin edilir. `;
    if (b.nse) text += `NSE scriptleri (${b.nse}) çalıştırılır. `;
    if (b.fragment) text += `Paketler 8 byte parçalanır (-f). `;
    if (b.decoy) text += `5 adet sahte IP araya karıştırılır (-D). `;
    if (b.timing) text += `Hız şablonu: ${b.timing}. `;

    expEl.innerHTML = text;
}

// ==========================================================================
// 9. CHEATSHEET KARTLARI VE CANLI ARAMA MOTORU
// ==========================================================================
function initCheatsheetGrid() {
    renderCheatsCards();

    // Arama Çubuğu
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            clearBtn.style.display = appState.searchQuery ? 'block' : 'none';
            renderCheatsCards();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            appState.searchQuery = '';
            clearBtn.style.display = 'none';
            renderCheatsCards();
            cyberAudio.playClick();
        });
    }

    // Kategori Tab Butonları
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.currentCategory = btn.dataset.category;
            cyberAudio.playClick();
            renderCheatsCards();
        });
    });

    // Reset Filter Butonu
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            appState.searchQuery = '';
            appState.currentCategory = 'all';
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-category="all"]').classList.add('active');
            renderCheatsCards();
            cyberAudio.playClick();
        });
    }

    // Toplam Sayıyı Güncelle
    const countAllEl = document.getElementById('count-all');
    if (countAllEl) {
        countAllEl.textContent = NMAP_DATABASE.length;
    }
}

function renderCheatsCards() {
    const grid = document.getElementById('cheats-grid');
    const noResults = document.getElementById('no-results-box');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = NMAP_DATABASE.filter(item => {
        // Kategori Kontrolü
        if (appState.currentCategory === 'favorites') {
            if (!appState.favorites.includes(item.id)) return false;
        } else if (appState.currentCategory !== 'all') {
            if (item.category !== appState.currentCategory && !(appState.currentCategory === 'top' && item.tags.includes('top'))) {
                return false;
            }
        }

        // Arama Kelimesi Kontrolü
        if (appState.searchQuery) {
            const q = appState.searchQuery;
            const inTitle = item.title.toLowerCase().includes(q);
            const inCmd = item.command.toLowerCase().includes(q);
            const inDesc = item.desc.toLowerCase().includes(q);
            const inTags = item.tags.some(t => t.toLowerCase().includes(q));
            const inFlags = item.flags ? item.flags.some(f => f.flag.toLowerCase().includes(q) || f.text.toLowerCase().includes(q)) : false;

            if (!inTitle && !inCmd && !inDesc && !inTags && !inFlags) {
                return false;
            }
        }

        return true;
    });

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    filtered.forEach(item => {
        const isFav = appState.favorites.includes(item.id);
        const card = document.createElement('div');
        card.className = 'cheat-card';

        // Gürültü etiketi
        const noiseClass = item.noise === 'low' ? 'noise-low' : (item.noise === 'med' ? 'noise-med' : 'noise-high');
        const noiseText = item.noise === 'low' ? 'Düşük Gürültü' : (item.noise === 'med' ? 'Orta Gürültü' : 'Yüksek Gürültü / Sesli');

        // Bayrak dökümü
        let flagsHtml = '';
        if (item.flags && item.flags.length > 0) {
            flagsHtml = `
                <div class="card-flags-breakdown">
                    ${item.flags.map(f => `<div class="flag-item"><strong>${f.flag}</strong>: ${f.text}</div>`).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-top">
                <div class="card-badge-group">
                    <span class="tag-badge ${noiseClass}">● ${noiseText}</span>
                    ${item.tags.includes('top') ? '<span class="tag-badge top-tag">★ Popüler</span>' : ''}
                    <span class="tag-badge">${item.category.toUpperCase()}</span>
                </div>
                <button class="fav-card-btn ${isFav ? 'favorited' : ''}" data-fav-id="${item.id}" title="${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                    ${isFav ? '★' : '☆'}
                </button>
            </div>

            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.desc}</p>
            </div>

            <div class="card-cmd-box">
                <code class="cmd-code">${escapeHtml(item.command)}</code>
                <button class="card-copy-btn" data-copy-cmd="${escapeHtml(item.command)}" title="Panoya Kopyala">
                    📋 Kopyala
                </button>
            </div>

            ${flagsHtml}
        `;

        grid.appendChild(card);
    });

    // Kopyalama Butonlarını Bağla
    grid.querySelectorAll('.card-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.dataset.copyCmd;
            copyToClipboard(cmd);
            btn.textContent = '✓ Alındı!';
            setTimeout(() => { btn.textContent = '📋 Kopyala'; }, 1500);
        });
    });

    // Favori Butonlarını Bağla
    grid.querySelectorAll('.fav-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.favId;
            toggleFavorite(id);
        });
    });
}

// Favori Durumunu Değiştir
function toggleFavorite(id) {
    const idx = appState.favorites.indexOf(id);
    if (idx > -1) {
        appState.favorites.splice(idx, 1);
        showToast('Favorilerden kaldırıldı');
    } else {
        appState.favorites.push(id);
        showToast('Favorilere eklendi! ⭐');
    }
    localStorage.setItem('nmap_favs', JSON.stringify(appState.favorites));
    cyberAudio.playClick();
    updateFavoriteCount();
    renderCheatsCards();
}

function updateFavoriteCount() {
    const favCountEl = document.getElementById('fav-count');
    if (favCountEl) {
        favCountEl.textContent = appState.favorites.length;
    }
}

function saveCustomFavorite(cmd) {
    showToast('Özel oluşturulan komut panoya kopyalandı ve belleğe alındı! ⭐');
    copyToClipboard(cmd);
}

// ==========================================================================
// 10. DAHİLİ SİBER TERMİNAL SİMÜLATÖRÜ
// ==========================================================================
function initTerminalSimulator() {
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');
    const clearBtn = document.getElementById('clear-term-btn');

    if (!input || !history) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (!val) return;

            appendTermLine(`root@antigravity:~/nmap# ${val}`, 'text-neon');
            handleTerminalCommand(val);
            input.value = '';
            cyberAudio.playTerminal();
            history.scrollTop = history.scrollHeight;
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            history.innerHTML = '';
            cyberAudio.playClick();
        });
    }
}

function appendTermLine(text, className = '') {
    const history = document.getElementById('terminal-history');
    if (!history) return;
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = text;
    history.appendChild(div);
}

function handleTerminalCommand(cmd) {
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
        appendTermLine(`
            <div class="text-green">KULLANILABİLİR TERMİNAL KOMUTLARI:</div>
            <div>- <strong>help</strong>: Bu yardım menüsünü ekrana basar.</div>
            <div>- <strong>scan [hedef]</strong>: Hedef IP veya alan adını simüle ederek tarar.</div>
            <div>- <strong>ports</strong>: En popüler ağ servis portlarını listeler.</div>
            <div>- <strong>matrix</strong>: Matrix kod akışını hızlandırır.</div>
            <div>- <strong>clear</strong>: Terminal ekranını temizler.</div>
            <div>- <strong>nmap [parametreler]</strong>: Yazdığınız Nmap komutunun sahte simülasyonunu çalıştırır.</div>
        `, 'text-dim');
    } else if (lower === 'clear') {
        document.getElementById('terminal-history').innerHTML = '';
    } else if (lower === 'ports') {
        appendTermLine(`
            <div class="text-green">SIK KULLANILAN NMAP PORTLARI:</div>
            <div>21/tcp (FTP), 22/tcp (SSH), 23/tcp (Telnet), 25/tcp (SMTP)</div>
            <div>53/udp (DNS), 80/tcp (HTTP), 110/tcp (POP3), 139/tcp (NetBIOS)</div>
            <div>443/tcp (HTTPS), 445/tcp (SMB), 3389/tcp (RDP), 8080/tcp (HTTP-Proxy)</div>
        `, 'text-dim');
    } else if (lower.startsWith('scan') || lower.startsWith('nmap')) {
        simulateScanOutput(cmd);
    } else {
        appendTermLine(`bash: ${escapeHtml(cmd)}: komut bulunamadı. 'help' yazarak yardım alabilirsiniz.`, 'text-warn');
    }
}

function runCommandInSimulator(cmd) {
    appendTermLine(`root@antigravity:~/nmap# ${cmd}`, 'text-neon');
    simulateScanOutput(cmd);
    cyberAudio.playTerminal();
}

function simulateScanOutput(cmd) {
    appendTermLine(`<span class="text-dim">Starting Nmap 7.95 ( https://nmap.org ) at 2026-10-18 14:00 TRT</span>`);
    appendTermLine(`<span class="text-dim">Initiating SYN Stealth Scan at 14:00...</span>`);

    setTimeout(() => {
        appendTermLine(`<span class="text-green">Discovered open port 80/tcp on 192.168.1.1</span>`);
        appendTermLine(`<span class="text-green">Discovered open port 443/tcp on 192.168.1.1</span>`);
        appendTermLine(`<span class="text-green">Discovered open port 22/tcp on 192.168.1.1</span>`);
    }, 400);

    setTimeout(() => {
        appendTermLine(`
            <div class="text-primary" style="margin-top: 0.5rem;">
                <strong>Nmap scan report for target (192.168.1.1)</strong><br>
                Host is up (0.0012s latency).<br>
                Not shown: 997 closed tcp ports (reset)<br>
                <table style="width:100%; border-collapse:collapse; margin-top:4px;">
                    <tr style="color:#00ff66; border-bottom:1px solid #00ff66;">
                        <th style="text-align:left;">PORT</th>
                        <th style="text-align:left;">STATE</th>
                        <th style="text-align:left;">SERVICE</th>
                        <th style="text-align:left;">VERSION</th>
                    </tr>
                    <tr><td>22/tcp</td><td style="color:#27c93f;">open</td><td>ssh</td><td>OpenSSH 9.6p1 Ubuntu</td></tr>
                    <tr><td>80/tcp</td><td style="color:#27c93f;">open</td><td>http</td><td>nginx/1.24.0</td></tr>
                    <tr><td>443/tcp</td><td style="color:#27c93f;">open</td><td>ssl/https</td><td>nginx/1.24.0 (TLSv1.3)</td></tr>
                </table>
                <br>
                Device type: general purpose<br>
                Running: Linux 5.X | 6.X<br>
                OS CPE: cpe:/o:linux:linux_kernel:5<br>
                OS details: Linux 5.15 - 6.8 (Ubuntu 24.04 LTS)<br>
                Network Distance: 1 hop<br><br>
                <span class="text-green">Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds</span>
            </div>
        `);
        cyberAudio.playCopy();
    }, 900);
}

// ==========================================================================
// 11. BAYRAK TABLOSU OLUŞTURUCU
// ==========================================================================
function populateFlagsTable() {
    const tbody = document.getElementById('flags-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    NMAP_FLAGS_DICTIONARY.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="flag-badge">${item.flag}</span></td>
            <td>${item.cat}</td>
            <td>${item.desc}</td>
            <td><span class="${item.root === 'Evet' ? 'root-yes' : 'root-no'}">${item.root}</span></td>
            <td><code>${item.example}</code></td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// 12. YARDIMCI ARAÇLAR (CLIPBOARD, TOAST, ESCAPE)
// ==========================================================================
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            cyberAudio.playCopy();
            showToast('Komut Panoya Kopyalandı! 📋');
        }).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    cyberAudio.playCopy();
    showToast('Komut Panoya Kopyalandı! 📋');
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2400);
}

function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
