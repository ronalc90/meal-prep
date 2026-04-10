```
 __  __            _ ____                
|  \/  | ___  __ _| |  _ \ _ __ ___ _ __  
| |\/| |/ _ \/ _` | | |_) | '__/ _ \ '_ \ 
| |  | |  __/ (_| | |  __/| | |  __/ |_) |
|_|  |_|\___|\__,_|_|_|   |_|  \___| .__/ 
                                    |_|    
```

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License MIT"/>
</p>

---

**Planifica tus comidas semanales, genera listas de compras automaticas y ahorra tiempo y dinero.**

MealPrep es una aplicacion full-stack que te permite organizar tu alimentacion semanal de forma inteligente. Gestiona recetas, asignalas a un calendario de 7 dias con 4 comidas diarias, y genera automaticamente listas de compras con agregacion de ingredientes y conversion de unidades.

---

## Funcionalidades

- **Planificador semanal** -- Calendario de 7 dias x 4 comidas (desayuno, almuerzo, merienda, cena)
- **Base de recetas** -- Crea, edita y busca recetas con ingredientes detallados
- **Lista de compras automatica** -- Generada a partir del plan semanal con agregacion inteligente de ingredientes
- **Conversion de unidades** -- Sistema integrado para unificar cantidades en la lista de compras
- **Seguimiento de presupuesto** -- Controla el gasto semanal en alimentacion
- **Dashboard** -- Estadisticas y metricas de tu planificacion
- **Autenticacion JWT** -- Registro e inicio de sesion seguros
- **Exportacion** -- Exporta la lista de compras como texto plano

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS, React Router |
| **Backend** | Node.js, Express 4, TypeScript |
| **ORM** | Prisma 5 (SQLite en desarrollo) |
| **Autenticacion** | JWT (jsonwebtoken + bcryptjs) |
| **Validacion** | Zod |
| **Testing** | Jest, Supertest |
| **Arquitectura** | Monorepo (backend/ + frontend/) |

---

## Arquitectura

```
meal-prep/
├── backend/                  # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos
│   │   └── seed.ts           # Datos iniciales
│   └── src/
│       ├── middleware/        # Auth, validacion, error handler
│       ├── routes/            # Endpoints por dominio
│       ├── services/          # Logica de negocio
│       ├── types/             # Schemas Zod y tipos
│       ├── utils/             # JWT, helpers
│       ├── __tests__/         # Tests unitarios e integracion
│       ├── app.ts             # Configuracion Express
│       └── index.ts           # Entry point
├── frontend/                 # SPA (React + Vite)
│   └── src/
│       ├── components/        # Navbar, RecipeCard, WeeklyCalendar, etc.
│       ├── pages/             # Dashboard, Recipes, MealPlanner, ShoppingList
│       ├── context/           # AuthContext, MealPlanContext
│       ├── services/          # Cliente HTTP (api.ts)
│       └── types/             # Interfaces TypeScript
└── docs/                     # Documentacion del proyecto
```

---

## Ejecucion Local

### Requisitos previos

- Node.js >= 18
- npm >= 9

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente Prisma y migrar base de datos
npx prisma generate
npx prisma migrate dev

# (Opcional) Cargar datos de ejemplo
npm run prisma:seed

# Iniciar en modo desarrollo (puerto 3001)
npm run dev
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo (puerto 5173)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Endpoints de la API

Base URL: `http://localhost:3001/api`

### Salud

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` | `/health` | Health check del servidor |

### Autenticacion (`/auth`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/register` | Registrar usuario | No |
| `POST` | `/auth/login` | Iniciar sesion | No |
| `GET` | `/auth/me` | Perfil del usuario actual | Si |

### Recetas (`/recipes`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `GET` | `/recipes` | Listar recetas (publicas + propias) | Opcional |
| `GET` | `/recipes/:id` | Obtener receta por ID | No |
| `POST` | `/recipes` | Crear receta | Si |
| `PUT` | `/recipes/:id` | Actualizar receta | Si |
| `DELETE` | `/recipes/:id` | Eliminar receta | Si |

### Planes de comida (`/meal-plans`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `GET` | `/meal-plans/current` | Plan de la semana actual | Si |
| `GET` | `/meal-plans/week/:weekStart` | Plan por fecha de inicio | Si |
| `POST` | `/meal-plans` | Crear plan semanal | Si |
| `PUT` | `/meal-plans/:id` | Actualizar plan | Si |
| `POST` | `/meal-plans/:id/auto-generate` | Auto-generar sugerencias | Si |

### Listas de compras (`/shopping-lists`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `POST` | `/shopping-lists/generate` | Generar lista desde plan | Si |
| `GET` | `/shopping-lists/:mealPlanId` | Obtener lista de compras | Si |
| `PATCH` | `/shopping-lists/:id/items/:itemId` | Marcar/desmarcar item | Si |
| `GET` | `/shopping-lists/:mealPlanId/export` | Exportar como texto | Si |

### Dashboard (`/dashboard`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| `GET` | `/dashboard/stats` | Estadisticas del usuario | Si |

---

## Modelos de Datos

- **User** -- Usuarios con preferencias dieteticas y presupuesto semanal
- **Recipe** -- Recetas con tiempo de preparacion, calorias y porciones
- **Ingredient** -- Ingredientes con categoria y unidad base
- **RecipeIngredient** -- Relacion receta-ingrediente con cantidad y unidad
- **MealPlan** -- Plan semanal vinculado a un usuario
- **MealPlanItem** -- Asignacion de receta a dia y tipo de comida
- **ShoppingList** -- Lista de compras generada desde un plan
- **ShoppingListItem** -- Items individuales con estado de compra

---

## Scripts Disponibles

### Backend

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar build de produccion |
| `npm test` | Ejecutar tests |
| `npm run prisma:seed` | Cargar datos de ejemplo |

### Frontend

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor Vite de desarrollo |
| `npm run build` | Build de produccion |
| `npm run preview` | Preview del build |
| `npm run lint` | Ejecutar ESLint |

---

## Autor

**Ronald** -- [github.com/ronalc90](https://github.com/ronalc90)

## Licencia

Este proyecto esta bajo la licencia [MIT](LICENSE).
