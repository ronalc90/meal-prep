# Guia de Despliegue - MealPrep

## Arquitectura de Despliegue

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Vercel        │     │    Railway        │     │   PostgreSQL    │
│   (Frontend)     │────>│   (Backend API)   │────>│   (Railway DB)  │
│   React SPA      │     │   Express + Node  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Backend - Railway

### Prerrequisitos

- Cuenta en [Railway](https://railway.app)
- Repositorio en GitHub

### Pasos

1. **Crear proyecto en Railway**
   - Conectar repositorio de GitHub
   - Seleccionar el directorio `backend/` como root

2. **Agregar base de datos PostgreSQL**
   - En el dashboard de Railway, agregar servicio PostgreSQL
   - Railway genera automaticamente la variable `DATABASE_URL`

3. **Configurar variables de entorno**

   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | (auto-generada por Railway) |
   | `JWT_SECRET` | Generar con `openssl rand -base64 32` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3004` |
   | `CORS_ORIGIN` | `https://tu-dominio-frontend.vercel.app` |

4. **Configurar build**

   Railway detecta Node.js automaticamente. Los comandos se configuran:

   ```
   Build Command: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   Start Command: npm start
   ```

5. **Actualizar schema.prisma para PostgreSQL**

   Cambiar el provider en produccion:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

6. **Seed inicial (opcional)**

   Ejecutar una vez despues del primer deploy:
   ```bash
   railway run npm run prisma:seed
   ```

### Verificar despliegue

```bash
curl https://tu-backend.railway.app/api/health
# Respuesta: { "status": "ok", "timestamp": "..." }
```

---

## Frontend - Vercel

### Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub

### Pasos

1. **Importar proyecto en Vercel**
   - Conectar repositorio
   - Configurar root directory como `frontend/`

2. **Configurar variables de entorno**

   | Variable | Valor |
   |----------|-------|
   | `VITE_API_URL` | `https://tu-backend.railway.app/api` |

3. **Configurar build**

   Vercel detecta Vite automaticamente:

   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Configurar rewrites para SPA**

   Crear `frontend/vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

5. **Actualizar el cliente API**

   Modificar `frontend/src/services/api.ts` para usar la variable de entorno:
   ```typescript
   const API_BASE = import.meta.env.VITE_API_URL || '/api';
   ```

---

## Docker (Alternativa)

### Backend Dockerfile

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

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3004

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/index.js"]
```

### Docker Compose (desarrollo)

Crear `docker-compose.yml` en la raiz:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mealprep
      POSTGRES_USER: mealprep
      POSTGRES_PASSWORD: mealprep
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3004:3004"
    environment:
      DATABASE_URL: postgresql://mealprep:mealprep@db:5432/mealprep
      JWT_SECRET: dev-secret-change-in-production
      JWT_EXPIRES_IN: 7d
      NODE_ENV: development
      PORT: "3004"
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3004/api

volumes:
  pgdata:
```

### Construir y ejecutar

```bash
docker-compose up --build
```

---

## Migraciones en Produccion

### Ejecutar migraciones

```bash
# Railway
railway run npx prisma migrate deploy

# Docker
docker exec -it mealprep-backend npx prisma migrate deploy
```

### Crear nueva migracion

```bash
# En desarrollo local
cd backend
npx prisma migrate dev --name nombre_de_la_migracion
```

---

## Checklist de Despliegue

- [ ] Variables de entorno configuradas en Railway
- [ ] `JWT_SECRET` generado de forma segura (no usar el default)
- [ ] `CORS_ORIGIN` apunta al dominio correcto del frontend
- [ ] Migraciones ejecutadas en produccion
- [ ] Health check responde correctamente
- [ ] Frontend apunta a la URL correcta del backend
- [ ] `vercel.json` configurado para rewrites SPA
- [ ] Datos de seed cargados (si aplica)

---

## Autor

Ronald
