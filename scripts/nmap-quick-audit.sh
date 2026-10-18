#!/usr/bin/env bash
# ==============================================================================
# Nmap Hızlı Güvenlik ve Ağ Denetim Betiği (nmap-quick-audit.sh)
# Kullanım: ./nmap-quick-audit.sh <hedef-ip-veya-aralık> [cikti-dizini]
# Örnek: sudo ./nmap-quick-audit.sh 192.168.1.1/24 ./raporlar
# ==============================================================================

set -euo pipefail

TARGET="${1:-}"
OUTPUT_DIR="${2:-./nmap_reports_$(date +%Y%m%d_%H%M%S)}"

if [[ -z "$TARGET" ]]; then
    echo -e "\033[1;31m[!] Hata: Lütfen taranacak hedef IP veya subnet belirtin.\033[0m"
    echo -e "Kullanım: $0 <hedef> [çıktı_dizini]"
    echo -e "Örnek: sudo $0 192.168.1.50 ./audit_sonuclari"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo -e "\033[1;32m"
cat << "EOF"
   _  __                     ____        _      _      _   
  | \ | |                   / __ \      (_)    | |    | |  
  |  \| |_ __ ___   __ _ _ | |  | |_   _ _  ___| | __ | |_ 
  | . ` | '_ ` _ \ / _` | || |  | | | | | |/ __| |/ / | __|
  | |\  | | | | | | (_| | || |__| | |_| | | (__|   <  | |_ 
  |_| \_|_| |_| |_|\__,_|_| \___\_\\__,_|_|\___|_|\_\  \__|
EOF
echo -e "\033[0m"
echo -e "\033[1;34m[*] Hedef:\033[0m $TARGET"
echo -e "\033[1;34m[*] Çıktı Dizini:\033[0m $OUTPUT_DIR"
echo -e "\033[1;34m[*] Başlangıç Zamanı:\033[0m $(date)"
echo "--------------------------------------------------------"

# 1. Aşama: Canlı Cihaz Keşfi
echo -e "\033[1;33m[1/3] Canlı cihazlar aranıyor (Host Discovery)... \033[0m"
nmap -sn -n "$TARGET" -oG "$OUTPUT_DIR/01_hosts_up.gnmap" > /dev/null
grep "Up" "$OUTPUT_DIR/01_hosts_up.gnmap" | awk '{print $2}' > "$OUTPUT_DIR/alive_hosts.txt"
ALIVE_COUNT=$(wc -l < "$OUTPUT_DIR/alive_hosts.txt" || echo "0")
echo -e "\033[1;32m[+] Toplam $ALIVE_COUNT adet canlı cihaz bulundu.\033[0m"

if [[ "$ALIVE_COUNT" -eq 0 ]]; then
    echo -e "\033[1;31m[-] Canlı cihaz tespit edilemedi. Hedef güvenlik duvarı arkasında olabilir.\033[0m"
    echo -e "[*] '-Pn' bayrağı ile doğrudan hedef taranıyor..."
    echo "$TARGET" > "$OUTPUT_DIR/alive_hosts.txt"
fi

# 2. Aşama: Hızlı SYN Port Taraması
echo -e "\033[1;33m[2/3] Açık portlar taranıyor (Top 1000 + Hızlı SYN)... \033[0m"
sudo nmap -sS -T4 --open -iL "$OUTPUT_DIR/alive_hosts.txt" -oA "$OUTPUT_DIR/02_open_ports" > /dev/null
echo -e "\033[1;32m[+] Açık port taraması tamamlandı.\033[0m"

# 3. Aşama: Servis, Versiyon ve Güvenli Script Denetimi
echo -e "\033[1;33m[3/3] Servis sürümleri ve NSE güvenlik scriptleri çalıştırılıyor... \033[0m"
sudo nmap -sV -sC -O --version-intensity 7 -iL "$OUTPUT_DIR/alive_hosts.txt" -oA "$OUTPUT_DIR/03_deep_audit" --open

# HTML Rapor Oluşturma (xsltproc kuruluysa)
if command -v xsltproc &> /dev/null; then
    echo -e "\033[1;34m[*] HTML Raporu üretiliyor...\033[0m"
    xsltproc "$OUTPUT_DIR/03_deep_audit.xml" -o "$OUTPUT_DIR/guvenlik_raporu.html"
    echo -e "\033[1;32m[✓] HTML Raporu hazır: $OUTPUT_DIR/guvenlik_raporu.html\033[0m"
fi

echo "--------------------------------------------------------"
echo -e "\033[1;32m[✓] Denetim başarıyla tamamlandı!\033[0m"
echo -e "[*] Tüm sonuçlar \033[1m$OUTPUT_DIR\033[0m dizininde saklandı."
