# Arquitectura

## Monorepo

MealPrep usa una estructura monorepo simple con dos aplicaciones independientes:

```
meal-prep/
├── backend/     # API REST (Express + Prisma)
├── frontend/    # SPA (React + Vite)
└── docs/        # Documentacion
```

Cada aplicacion tiene su propio `package.json`, `tsconfig.json` y scripts independientes.

## Backend - Capas

```
Request HTTP
    │
    ▼
┌──────────┐
│  Express  │  Middleware: CORS, JSON parser
└────┬─────┘
     │
┌────▼─────┐
│  Router   │  Enrutamiento + middleware de auth/validacion
└────┬─────┘
     │
┌────▼──────┐
│  Service   │  Logica de negocio
└────┬──────┘
     │
┌────▼──────┐
│  Prisma    │  ORM / Acceso a datos
└────┬──────┘
     │
┌────▼──────┐
│  SQLite    │  Base de datos
└───────────┘
```

### Routers

Cada dominio tiene su propio router que solo se encarga de:
- Recibir el request
- Delegar al servicio
- Devolver la respuesta

| Router | Prefijo | Endpoints |
|--------|---------|-----------|
| authRouter | `/api/auth` | register, login, me |
| recipeRouter | `/api/recipes` | list, get, create, update, delete |
| mealPlanRouter | `/api/meal-plans` | current, week, create, update, auto-generate |
| shoppingListRouter | `/api/shopping-lists` | generate, get, toggle, export |
| dashboardRouter | `/api/dashboard` | stats |

### Middleware

| Middleware | Funcion |
|-----------|---------|
| `authenticate` | Extrae y valida JWT del header Authorization |
| `validate` | Valida body con esquema Zod |
| `errorHandler` | Centraliza manejo de errores (AppError, ZodError, generico) |

### Services

La capa de servicios contiene toda la logica de negocio:

- **authService**: Hash de passwords, verificacion, generacion de JWT
- **recipeService**: CRUD con transacciones para upsert de ingredientes
- **mealPlanService**: Gestion de planes con calculo de semana
- **shoppingListService**: Algoritmo de agregacion de ingredientes
- **dashboardService**: Queries agregadas para estadisticas

### Manejo de Errores

Jerarquia personalizada de errores:

```
Error
└── AppError (statusCode, code)
    ├── NotFoundError (404)
    ├── UnauthorizedError (401)
    ├── ForbiddenError (403)
    ├── ValidationError (400)
    └── ConflictError (409)
```

El `errorHandler` captura todos los errores y los transforma en respuestas JSON estandar.

## Frontend - Componentes

### Providers

```
BrowserRouter
└── AuthProvider
    └── MealPlanProvider
        └── App
```

### Paginas

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| LoginPage | `/login` | Formulario de login |
| RegisterPage | `/register` | Formulario de registro |
| DashboardPage | `/` | Estadisticas y resumen |
| RecipesPage | `/recipes` | Listado y busqueda |
| RecipeDetailPage | `/recipes/:id` | Detalle y edicion |
| MealPlannerPage | `/meal-planner` | Calendario semanal |
| ShoppingListPage | `/shopping-list` | Lista de compras |

### Cliente API

`api.ts` centraliza todas las llamadas HTTP:
- Agrega token JWT automaticamente
- Maneja errores con `ApiError`
- Agrupa metodos por dominio

## Flujos de Datos

### Autenticacion

```
Login/Register → API → JWT → localStorage → Header Authorization
```

### Planificacion

```
Seleccionar receta → Asignar a dia/comida → Guardar plan → API update
```

### Lista de Compras

```
Plan semanal → Recolectar ingredientes → Escalar → Normalizar → Agregar → Formatear → Agrupar
```

## Autor

Ronald
