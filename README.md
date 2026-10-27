<p align="center">
  <h1 align="center">MealPrep</h1>
  <p align="center">Planificador de comidas semanal con lista de compras automatica</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License MIT">
</p>

---

## Sobre el Proyecto

**MealPrep** es una aplicacion web full-stack para planificar comidas semanales y generar listas de compras automaticas. Permite a los usuarios crear recetas con ingredientes detallados, organizar un plan de comidas semanal con desayuno, almuerzo, cena y snacks, y luego generar una lista de compras inteligente que agrega cantidades, convierte unidades y agrupa los items por pasillo del supermercado.

### Problema que resuelve

Planificar comidas para la semana y hacer la lista de compras manualmente es tedioso y propenso a errores: se olvidan ingredientes, se compran duplicados y se pierde tiempo en el supermercado. MealPrep automatiza todo este proceso.

---

## Caracteristicas

- **Gestion de recetas**: Crear, editar, eliminar y buscar recetas con ingredientes, tiempos de preparacion y calorias
- **Planificacion semanal**: Calendario interactivo para asignar recetas a cada dia y tipo de comida (desayuno, almuerzo, cena, snack)
- **Auto-generacion de comidas**: Rellenar automaticamente el plan semanal basado en preferencias y calorias
- **Lista de compras inteligente**: Generacion automatica con agregacion de ingredientes, conversion de unidades y agrupacion por categoria
- **Exportar lista de compras**: Formato texto plano listo para compartir o imprimir
- **Dashboard**: Estadisticas semanales con calorias, progreso de compras y recetas populares
- **Autenticacion JWT**: Registro, login y rutas protegidas
- **Busqueda y filtrado**: Por titulo, tiempo de preparacion y calorias
- **Paginacion**: Listado de recetas con paginacion configurable
- **Validacion**: Esquemas Zod para todas las entradas del API

---

## Arquitectura

MealPrep es un **monorepo** con dos aplicaciones independientes:

```
04-MealPrep/
├── backend/          # API REST con Express + Prisma + SQLite
├── frontend/         # SPA con React + Vite + TailwindCSS
└── docs/             # Documentacion del proyecto
```

### Backend
API REST en Express con arquitectura en capas: **Routes -> Services -> Prisma (Repository)**. Cada ruta delega la logica de negocio al servicio correspondiente. Validacion de entrada con Zod, autenticacion con JWT y manejo centralizado de errores.

### Frontend
Single Page Application en React 18 con React Router v6. Estado global gestionado con Context API (AuthContext + MealPlanContext). Comunicacion con el backend via un cliente API centralizado con interceptores de autenticacion. Estilos con TailwindCSS.

> Documentacion detallada de la arquitectura en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| **Runtime** | Node.js 22+ |
| **Backend Framework** | Express 4.x |
| **ORM** | Prisma 5.x |
| **Base de Datos** | SQLite (desarrollo) / PostgreSQL (produccion) |
| **Validacion** | Zod 3.x |
| **Autenticacion** | JWT (jsonwebtoken) |
| **Hashing** | bcryptjs |
| **Frontend Framework** | React 18 |
| **Bundler** | Vite 6.x |
| **Estilos** | TailwindCSS 3.x |
| **Routing** | React Router 6.x |
| **Lenguaje** | TypeScript 5.x |
| **Testing** | Jest + Supertest |

---

## Instalacion

### Prerrequisitos

- Node.js >= 22
- npm >= 9

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Generar cliente Prisma y ejecutar migraciones
npx prisma generate
npx prisma migrate dev

# (Opcional) Poblar la base de datos con datos de ejemplo
npm run prisma:seed

# Iniciar en modo desarrollo
npm run dev
```

El servidor inicia en `http://localhost:3004`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicacion inicia en `http://localhost:5173` con proxy automatico al backend.

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexion a la base de datos | `file:./dev.db` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `mi-secreto-seguro` |
| `JWT_EXPIRES_IN` | Tiempo de expiracion del token | `7d` |
| `PORT` | Puerto del servidor | `3004` |
| `NODE_ENV` | Entorno de ejecucion | `development` |
| `CORS_ORIGIN` | Origenes permitidos (separados por coma) | `http://localhost:5173` |

---

## API Documentation

Base URL: `http://localhost:3004/api`

### Endpoints

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `GET` | `/health` | Health check del servidor | No |
| `POST` | `/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/auth/login` | Iniciar sesion | No |
| `GET` | `/auth/me` | Obtener perfil del usuario autenticado | Si |
| `GET` | `/recipes` | Listar recetas (publicas + propias) | Opcional |
| `GET` | `/recipes/:id` | Obtener detalle de una receta | No |
| `POST` | `/recipes` | Crear nueva receta | Si |
| `PUT` | `/recipes/:id` | Actualizar receta | Si |
| `DELETE` | `/recipes/:id` | Eliminar receta | Si |
| `GET` | `/meal-plans/current` | Obtener plan de la semana actual | Si |
| `GET` | `/meal-plans/week/:weekStart` | Obtener plan por fecha de inicio | Si |
| `POST` | `/meal-plans` | Crear plan de comidas | Si |
| `PUT` | `/meal-plans/:id` | Actualizar plan de comidas | Si |
| `POST` | `/meal-plans/:id/auto-generate` | Auto-generar comidas sugeridas | Si |
| `POST` | `/shopping-lists/generate` | Generar lista de compras desde plan | Si |
| `GET` | `/shopping-lists/:mealPlanId` | Obtener lista de compras | Si |
| `PATCH` | `/shopping-lists/:id/items/:itemId` | Marcar/desmarcar item | Si |
| `GET` | `/shopping-lists/:mealPlanId/export` | Exportar lista como texto plano | Si |
| `GET` | `/dashboard/stats` | Obtener estadisticas del dashboard | Si |

> Documentacion completa con ejemplos curl en [docs/API.md](docs/API.md)

---

## Algoritmo de Lista de Compras

El corazon de MealPrep es el algoritmo de generacion de listas de compras:

1. **Recoleccion**: Recorre todos los items del plan semanal con sus recetas e ingredientes
2. **Escalado**: Multiplica las cantidades por el factor de porciones (`servings / recipe.servings`)
3. **Normalizacion**: Convierte todas las unidades a su base comun (ml para volumen, g para peso)
4. **Agregacion**: Suma las cantidades del mismo ingrediente
5. **Formato legible**: Convierte de unidades base a unidades practicas (g -> kg, ml -> L/cups/tbsp)
6. **Agrupacion**: Organiza los items por categoria de supermercado (PRODUCE, DAIRY, MEAT, PANTRY, etc.)

### Conversion de Unidades

- **Volumen**: tsp, tbsp, cup, fl oz, ml, L -> base en ml
- **Peso**: oz, lb, g, kg -> base en g
- **Sin unidad**: unit, bunch, slices, stalks -> se mantienen tal cual

> Explicacion detallada en [docs/SHOPPING-LIST-ALGORITHM.md](docs/SHOPPING-LIST-ALGORITHM.md)

---

## Estructura del Proyecto

```
04-MealPrep/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Modelo de datos
│   │   └── seed.ts                # Datos de ejemplo (16 recetas)
│   ├── src/
│   │   ├── __tests__/             # Tests unitarios e integracion
│   │   │   ├── auth.test.ts
│   │   │   ├── recipes.test.ts
│   │   │   ├── mealPlans.test.ts
│   │   │   ├── shoppingList.test.ts
│   │   │   ├── dashboard.test.ts
│   │   │   ├── integration.test.ts
│   │   │   ├── setup.ts
│   │   │   └── helpers.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # Middleware JWT
│   │   │   ├── errorHandler.ts    # Manejo centralizado de errores
│   │   │   └── validate.ts        # Validacion con Zod
│   │   ├── routes/
│   │   │   ├── authRouter.ts
│   │   │   ├── recipeRouter.ts
│   │   │   ├── mealPlanRouter.ts
│   │   │   ├── shoppingListRouter.ts
│   │   │   └── dashboardRouter.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── recipeService.ts
│   │   │   ├── mealPlanService.ts
│   │   │   ├── shoppingListService.ts
│   │   │   └── dashboardService.ts
│   │   ├── types/
│   │   │   └── schemas.ts         # Esquemas Zod + tipos
│   │   ├── utils/
│   │   │   ├── errors.ts          # Jerarquia de errores
│   │   │   ├── jwt.ts             # Utilidades JWT
│   │   │   ├── pagination.ts      # Paginacion generica
│   │   │   ├── prisma.ts          # Cliente Prisma singleton
│   │   │   └── unitConversion.ts  # Conversion de unidades
│   │   ├── app.ts                 # Configuracion Express
│   │   └── index.ts               # Entry point
│   ├── jest.config.ts
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeForm.tsx
│   │   │   ├── WeeklyCalendar.tsx
│   │   │   └── ShoppingListView.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Estado de autenticacion
│   │   │   └── MealPlanContext.tsx # Estado del plan semanal
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── RecipesPage.tsx
│   │   │   ├── RecipeDetailPage.tsx
│   │   │   ├── MealPlannerPage.tsx
│   │   │   └── ShoppingListPage.tsx
│   │   ├── services/
│   │   │   └── api.ts             # Cliente API centralizado
│   │   ├── types/
│   │   │   └── index.ts           # Interfaces TypeScript
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── docs/                          # Documentacion
├── .github/workflows/ci.yml       # CI/CD
└── README.md
```

---

## Decisiones Tecnicas

| Decision | Justificacion |
|----------|--------------|
| **Express sobre Fastify** | Ecosistema maduro, mayor cantidad de middleware disponible y familiaridad del equipo |
| **Prisma sobre TypeORM** | Type-safety nativo, migraciones declarativas, cliente generado con autocompletado |
| **Vite sobre CRA** | Build significativamente mas rapido, HMR instantaneo, configuracion minima |
| **Monorepo sin herramientas** | Simplicidad para un MVP; cada app tiene su propio package.json sin necesidad de Turborepo/Nx |
| **SQLite en desarrollo** | Zero-config, portable; cambia a PostgreSQL en produccion via Prisma |
| **Context API sobre Redux** | Estado predecible sin boilerplate para una aplicacion de esta escala |
| **Zod sobre Joi** | Inferencia de tipos TypeScript nativa, menor bundle size |

> Decisiones detalladas con contexto completo en [docs/DECISIONS.md](docs/DECISIONS.md)

---

## Testing

```bash
cd backend

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npx jest --coverage
```

### Cobertura de Tests

- Autenticacion (registro, login, perfil)
- CRUD completo de recetas
- Planes de comida (crear, actualizar, auto-generar)
- Listas de compras (generar, toggle items, exportar)
- Dashboard (estadisticas)
- Integracion end-to-end

---

## Despliegue

### Backend (Railway)

```bash
# El backend se despliega directamente desde el directorio backend/
# Railway detecta Node.js automaticamente
# Configurar variables de entorno en el dashboard de Railway
```

### Frontend (Vercel)

```bash
cd frontend
npm run build
# El directorio dist/ se despliega en Vercel
```

> Guia completa de despliegue en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## Roadmap

- [ ] Soporte para multiples idiomas (i18n)
- [ ] Modo offline con Service Workers
- [ ] Compartir planes de comida entre usuarios
- [ ] Integracion con APIs de nutricion para datos mas precisos
- [ ] Notificaciones push para recordatorios de compras
- [ ] Escanear codigos de barras para marcar items comprados
- [ ] Presupuesto semanal con tracking de gastos
- [ ] Exportar lista de compras a formato PDF
- [ ] App movil con React Native

---

## Licencia

Distribuido bajo la Licencia MIT. Ver [LICENSE](LICENSE) para mas informacion.

---

## Autor

Desarrollado por **Ronald**.

GitHub: [@ronalc90](https://github.com/ronalc90)
