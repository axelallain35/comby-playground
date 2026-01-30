FROM node:20-bookworm-slim

WORKDIR /app

# Dépendances système requises par comby
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates \
    libsqlite3-0 \
    libgmp10 \
    libev4 \
    libpcre3 \
 && rm -rf /var/lib/apt/lists/*

# Installer comby (binaire amd64)
RUN curl -fsSL \
  https://sourceforge.net/projects/comby.mirror/files/1.7.0/comby-1.7.0-x86_64-linux/download \
  -o /usr/local/bin/comby \
 && chmod +x /usr/local/bin/comby

# Node deps
COPY api/package.json ./package.json
RUN npm install --omit=dev

# App
COPY api/server.js ./server.js
COPY web ./web

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]