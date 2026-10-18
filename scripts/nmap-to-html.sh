#!/usr/bin/env bash
# ==============================================================================
# Nmap XML -> HTML Dönüştürme Scripti (nmap-to-html.sh)
# Kullanım: ./nmap-to-html.sh scan.xml [cikti.html]
# ==============================================================================

set -euo pipefail

INPUT_XML="${1:-}"
OUTPUT_HTML="${2:-${INPUT_XML%.*}.html}"

if [[ -z "$INPUT_XML" ]] || [[ ! -f "$INPUT_XML" ]]; then
    echo -e "\033[1;31m[!] Hata: Geçerli bir Nmap XML dosyası belirtiniz.\033[0m"
    echo -e "Kullanım: $0 <girdi.xml> [çıktı.html]"
    echo -e "Örnek: $0 scan_results.xml nmap_raporu.html"
    exit 1
fi

if ! command -v xsltproc &> /dev/null; then
    echo -e "\033[1;33m[*] xsltproc bulunamadı, kuruluyor (apt / brew)...\033[0m"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y xsltproc
    elif command -v brew &> /dev/null; then
        brew install xsltproc
    else
        echo -e "\033[1;31m[!] xsltproc otomatik kurulamadı. Lütfen paket yöneticinizden manuel yükleyin.\033[0m"
        exit 1
    fi
fi

echo -e "\033[1;34m[*] Dönüştürülüyor: $INPUT_XML -> $OUTPUT_HTML\033[0m"
xsltproc "$INPUT_XML" -o "$OUTPUT_HTML"

echo -e "\033[1;32m[✓] HTML Rapor başarıyla oluşturuldu: $OUTPUT_HTML\033[0m"
