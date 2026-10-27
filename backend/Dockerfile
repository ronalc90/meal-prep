# Prisma 5 necesita el binario `openssl` para detectar la version de OpenSSL en
# Alpine: en musl solo busca libssl en /lib y Alpine la instala en /usr/lib. Sin
# el, `prisma generate` elige el motor para OpenSSL 1.1 y el contenedor cae al
# arrancar (libssl.so.1.1 no existe). Va en una etapa base comun para que el
# motor generado en el build coincida con el que se detecta en ejecucion.
FROM node:22-alpine AS base
RUN apk add --no-cache openssl

FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json .
COPY --from=build /app/prisma ./prisma
USER app
EXPOSE 3004
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3004/api/health || exit 1
CMD ["node", "dist/src/index.js"]
