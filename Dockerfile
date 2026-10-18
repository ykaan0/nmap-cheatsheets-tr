# ==============================================================================
# Nmap Cheatsheet TR - Docker İmajı
# Web Arayüzü (Nginx) & Nmap Güvenlik Araçları
# ==============================================================================

FROM nginx:alpine

# Nmap, xsltproc, bash ve curl paketlerini kur
RUN apk add --no-cache nmap nmap-scripts xsltproc bash curl

# Nginx varsayılan web kök dizinini temizle ve cheatsheet dosyalarını kopyala
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY index.html ./
COPY style.css ./
COPY app.js ./
COPY docs/ ./docs/
COPY scripts/ ./scripts/
COPY README.md ./

# Port 80'i dışa aç
EXPOSE 80

# Sağlık Kontrolü (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
