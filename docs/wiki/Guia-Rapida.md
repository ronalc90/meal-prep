# Guia Rapida

## Requisitos

- Node.js >= 18
- npm >= 9

## 1. Clonar el Repositorio

```bash
git clone https://github.com/ronalc90/meal-prep.git
cd meal-prep
```

## 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cat > .env << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="mi-secreto-local"
JWT_EXPIRES_IN="7d"
PORT=3004
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Cargar datos de ejemplo (16 recetas)
npm run prisma:seed

# Iniciar servidor
npm run dev
```

El backend estara disponible en `http://localhost:3004`

## 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estara disponible en `http://localhost:5173`

## 4. Probar la Aplicacion

### Credenciales de Demo

Si ejecutaste el seed, puedes usar:
- Email: `ronald@mealprep.dev`
- Password: `password123`

### Flujo Basico

1. Iniciar sesion o registrarse
2. Ir a "Recetas" para ver las recetas disponibles
3. Ir a "Planificador" para crear un plan semanal
4. Asignar recetas a los dias y tipos de comida
5. Generar la lista de compras desde el plan
6. Marcar items como comprados en la lista

## 5. Ejecutar Tests

```bash
cd backend
npm test
```

## Comandos Utiles

| Comando | Directorio | Descripcion |
|---------|-----------|-------------|
| `npm run dev` | backend/ | Servidor con hot-reload |
| `npm run dev` | frontend/ | Vite dev server |
| `npm test` | backend/ | Ejecutar tests |
| `npm run build` | backend/ | Compilar TypeScript |
| `npm run build` | frontend/ | Build de produccion |
| `npx prisma studio` | backend/ | GUI de la base de datos |
| `npx prisma migrate dev` | backend/ | Crear migracion |
| `npm run prisma:seed` | backend/ | Cargar datos de ejemplo |

## Problemas Comunes

### Error "Cannot find module '@prisma/client'"

```bash
cd backend
npx prisma generate
```

### Error de CORS

Verificar que `CORS_ORIGIN` en `.env` incluya la URL del frontend.

### Puerto ocupado

Cambiar el puerto en `.env` (backend) o en `vite.config.ts` (frontend).

## Autor

Ronald
