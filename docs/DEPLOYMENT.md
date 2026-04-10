# Guia de Despliegue - MealPrep

## Arquitectura de Despliegue

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel         │     │   Railway        │
│   (Frontend)     │────>│   (Backend)      │
│                  │     │                  │
│  React + Vite    │     │  Express +       │
│  Static files    │     │  Prisma +        │
│                  │     │  PostgreSQL      │
└─────────────────┘     └─────────────────┘
```

---

## Backend - Railway

### 1. Preparar el proyecto

Asegurarse de que el backend compila correctamente:

```bash
cd backend
npm run build
npm start  # Verificar que inicia sin errores
```

### 2. Crear proyecto en Railway

1. Ir a [railway.app](https://railway.app)
2. Crear nuevo proyecto desde repositorio de GitHub
3. Seleccionar el repositorio `ronalc90/meal-prep`
4. Configurar el Root Directory como `backend`

### 3. Agregar base de datos PostgreSQL

1. En el dashboard de Railway, hacer clic en "New" -> "Database" -> "PostgreSQL"
2. Railway genera automaticamente la variable `DATABASE_URL`

### 4. Configurar variables de entorno

En el dashboard de Railway, agregar:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | (auto-generada por Railway PostgreSQL) |
| `JWT_SECRET` | (generar un secreto seguro de 64+ caracteres) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://tu-app.vercel.app` |
| `PORT` | `3004` |

### 5. Configurar comandos

En la configuracion del servicio:

| Campo | Valor |
|-------|-------|
| Build Command | `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` |
| Start Command | `npm start` |

### 6. Ejecutar migraciones

Railway ejecuta el build command automaticamente. Las migraciones se aplican con `prisma migrate deploy`.

Para poblar datos iniciales (opcional):

```bash
railway run npm run prisma:seed
```

### 7. Cambiar de SQLite a PostgreSQL

Actualizar `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Generar nueva migracion:

```bash
npx prisma migrate dev --name switch-to-postgres
```

---

## Frontend - Vercel

### 1. Preparar el proyecto

```bash
cd frontend
npm run build  # Verificar que compila sin errores
```

### 2. Crear proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Importar repositorio `ronalc90/meal-prep`
3. Configurar:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Configurar variables de entorno

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://tu-backend.railway.app/api` |

### 4. Configurar proxy en produccion

En produccion, el frontend ya no usa el proxy de Vite. Actualizar `frontend/src/services/api.ts` para usar la URL de la API en produccion:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

### 5. Configurar dominio personalizado (opcional)

En el dashboard de Vercel:
1. Ir a Settings -> Domains
2. Agregar dominio personalizado
3. Configurar DNS segun las instrucciones de Vercel

---

## Docker

### Dockerfile para el Backend

Crear `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3004

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]
```

### docker-compose.yml

Crear `docker-compose.yml` en la raiz del proyecto:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3004:3004"
    environment:
      DATABASE_URL: postgresql://mealprep:mealprep@db:5432/mealprep
      JWT_SECRET: ${JWT_SECRET:-change-this-secret}
      JWT_EXPIRES_IN: 7d
      NODE_ENV: production
      CORS_ORIGIN: http://localhost:5173
      PORT: 3004
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: mealprep
      POSTGRES_PASSWORD: mealprep
      POSTGRES_DB: mealprep
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mealprep"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### Ejecutar con Docker

```bash
# Construir e iniciar
docker compose up -d

# Ver logs
docker compose logs -f backend

# Ejecutar seed (opcional)
docker compose exec backend npm run prisma:seed

# Detener
docker compose down
```

---

## CI/CD con GitHub Actions

El pipeline de CI se ejecuta automaticamente en cada push a `main` y en pull requests. Ver `.github/workflows/ci.yml`.

### Pipeline

1. **Backend**: Instalar deps -> Generar Prisma -> Migrar -> Tests -> Build
2. **Frontend**: Instalar deps -> Build

### Despliegue automatico

- **Railway**: Conectar el repositorio. Railway despliega automaticamente en cada push a `main`
- **Vercel**: Conectar el repositorio. Vercel despliega automaticamente en cada push a `main`

---

## Checklist de Produccion

- [ ] Cambiar base de datos a PostgreSQL
- [ ] Generar JWT_SECRET seguro (64+ caracteres aleatorios)
- [ ] Configurar CORS_ORIGIN con el dominio del frontend
- [ ] Establecer NODE_ENV=production
- [ ] Configurar HTTPS
- [ ] Agregar rate limiting al backend
- [ ] Configurar backups de base de datos
- [ ] Monitorear logs y errores
- [ ] Configurar dominio personalizado

---

## Autor

Ronald
