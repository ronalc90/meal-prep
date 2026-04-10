# Arquitectura de MealPrep

## Vision General

MealPrep sigue una arquitectura **monorepo** con dos aplicaciones independientes que se comunican via API REST. El backend expone endpoints JSON y el frontend los consume a traves de un cliente HTTP centralizado.

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (SPA)                    │
│              React 18 + Vite + TailwindCSS           │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Pages   │──│   Context    │──│   Services    │  │
│  │          │  │  (Estado)    │  │   (api.ts)    │  │
│  └──────────┘  └──────────────┘  └───────┬───────┘  │
└──────────────────────────────────────────┼──────────┘
                                           │ HTTP/JSON
                                           │ (proxy Vite)
┌──────────────────────────────────────────┼──────────┐
│                    Backend (API)          │          │
│              Express + Prisma + SQLite   │          │
│                                          │          │
│  ┌──────────┐  ┌──────────────┐  ┌──────┴────────┐ │
│  │  Routes  │──│  Middleware   │──│   Express     │ │
│  │          │  │  (auth/zod)  │  │   (app.ts)    │ │
│  └────┬─────┘  └──────────────┘  └───────────────┘ │
│       │                                             │
│  ┌────┴─────┐                                       │
│  │ Services │  Logica de negocio                    │
│  └────┬─────┘                                       │
│       │                                             │
│  ┌────┴─────┐                                       │
│  │  Prisma  │  ORM / Acceso a datos                 │
│  └────┬─────┘                                       │
│       │                                             │
│  ┌────┴─────┐                                       │
│  │  SQLite  │  Base de datos                        │
│  └──────────┘                                       │
└─────────────────────────────────────────────────────┘
```

---

## Backend - Capas

### 1. Entry Point (`index.ts`)

Punto de entrada que inicia el servidor Express en el puerto configurado (default: 3004).

### 2. App (`app.ts`)

Configuracion central de Express:
- CORS con origenes configurables via `CORS_ORIGIN`
- Parser JSON
- Health check en `/api/health`
- Montaje de routers por dominio
- Error handler global como ultimo middleware

### 3. Routes

Cada router agrupa endpoints de un dominio y delega al servicio correspondiente:

| Router | Prefijo | Responsabilidad |
|--------|---------|----------------|
| `authRouter` | `/api/auth` | Registro, login, perfil |
| `recipeRouter` | `/api/recipes` | CRUD de recetas |
| `mealPlanRouter` | `/api/meal-plans` | Gestion de planes semanales |
| `shoppingListRouter` | `/api/shopping-lists` | Generacion y gestion de listas |
| `dashboardRouter` | `/api/dashboard` | Estadisticas del usuario |

### 4. Middleware

| Middleware | Archivo | Funcion |
|-----------|---------|---------|
| `authenticate` | `auth.ts` | Valida token JWT del header Authorization |
| `validate` | `validate.ts` | Valida body con esquema Zod |
| `errorHandler` | `errorHandler.ts` | Captura errores y devuelve respuesta JSON estandar |

### 5. Services

Capa de logica de negocio. Cada servicio encapsula las operaciones de un dominio:

- **authService**: Registro con hash bcrypt, login con verificacion, generacion de JWT
- **recipeService**: CRUD con busqueda, filtrado y paginacion. Upsert de ingredientes en transaccion
- **mealPlanService**: Creacion/actualizacion de planes con items. Auto-generacion aleatoria
- **shoppingListService**: Algoritmo de agregacion de ingredientes con conversion de unidades
- **dashboardService**: Consultas agregadas para estadisticas del usuario

### 6. Utils

| Utilidad | Responsabilidad |
|----------|----------------|
| `prisma.ts` | Instancia singleton del cliente Prisma |
| `jwt.ts` | Sign y verify de tokens JWT |
| `errors.ts` | Jerarquia de errores: AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError, ConflictError |
| `pagination.ts` | Parseo de parametros y construccion de resultados paginados |
| `unitConversion.ts` | Normalizacion, compatibilidad y formato de unidades |

### 7. Types (`schemas.ts`)

Esquemas Zod con exports de tipos inferidos:
- `registerSchema` / `loginSchema`
- `createRecipeSchema` / `updateRecipeSchema`
- `createMealPlanSchema` / `updateMealPlanSchema` / `autoGenerateSchema`
- `generateShoppingListSchema` / `toggleItemSchema`

---

## Frontend - Arbol de Componentes

```
App
├── Navbar
├── Routes
│   ├── LoginPage
│   ├── RegisterPage
│   ├── ProtectedRoute
│   │   ├── DashboardPage
│   │   ├── RecipesPage
│   │   │   └── RecipeCard (x N)
│   │   ├── RecipeDetailPage
│   │   │   └── RecipeForm
│   │   ├── MealPlannerPage
│   │   │   └── WeeklyCalendar
│   │   └── ShoppingListPage
│   │       └── ShoppingListView
│   └── Redirect (catch-all -> /)
```

### Providers (Context)

```
BrowserRouter
└── AuthProvider          # Estado de autenticacion (user, token, login, register, logout)
    └── MealPlanProvider  # Estado del plan semanal (currentPlan, shoppingList, CRUD operations)
        └── App
```

### Paginas

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| `LoginPage` | `/login` | Formulario de inicio de sesion |
| `RegisterPage` | `/register` | Formulario de registro |
| `DashboardPage` | `/` | Estadisticas semanales y recetas populares |
| `RecipesPage` | `/recipes` | Listado de recetas con busqueda y creacion |
| `RecipeDetailPage` | `/recipes/:id` | Detalle y edicion de receta |
| `MealPlannerPage` | `/meal-planner` | Calendario semanal interactivo |
| `ShoppingListPage` | `/shopping-list` | Lista de compras con checkboxes |

### Componentes Reutilizables

| Componente | Uso |
|-----------|-----|
| `Navbar` | Navegacion principal con links y boton logout |
| `ProtectedRoute` | Wrapper que redirige a `/login` si no hay sesion |
| `RecipeCard` | Tarjeta de receta con titulo, calorias y tiempo |
| `RecipeForm` | Formulario de creacion/edicion de recetas con ingredientes dinamicos |
| `WeeklyCalendar` | Grilla 7 dias x 4 comidas con drag & drop |
| `ShoppingListView` | Lista agrupada por categoria con checkboxes |

### Servicio API (`api.ts`)

Cliente HTTP centralizado que:
- Agrega token JWT automaticamente desde localStorage
- Maneja errores con clase `ApiError`
- Soporta respuestas JSON y texto plano
- Agrupa metodos por dominio: `authApi`, `recipesApi`, `mealPlansApi`, `shoppingListsApi`, `dashboardApi`

---

## Flujo de Datos

### Flujo de Autenticacion

```
1. Usuario llena formulario de login/registro
2. AuthContext llama authApi.login() / authApi.register()
3. Backend valida credenciales, genera JWT
4. Frontend almacena token en localStorage
5. Todas las peticiones posteriores incluyen Bearer token
6. En cada recarga, AuthContext llama authApi.me() para rehidratar sesion
```

### Flujo de Planificacion

```
1. Usuario navega al planificador semanal
2. MealPlanContext carga el plan actual via mealPlansApi.getCurrent()
3. Usuario arrastra recetas al calendario (dia + tipo de comida)
4. Al guardar, se llama mealPlansApi.update() con los items
5. Backend reemplaza todos los items del plan en una transaccion
```

### Flujo de Lista de Compras

```
1. Usuario hace clic en "Generar Lista" desde el plan semanal
2. Frontend llama shoppingListsApi.generate(mealPlanId)
3. Backend ejecuta el algoritmo de agregacion:
   a. Recolecta todos los ingredientes de todas las recetas del plan
   b. Escala cantidades por porciones
   c. Normaliza unidades a base comun (ml/g)
   d. Agrupa por ingrediente y suma cantidades
   e. Formatea a unidades legibles
   f. Agrupa por categoria de supermercado
4. Frontend renderiza la lista agrupada con checkboxes
5. Usuario marca items comprados via PATCH toggle
```

---

## Modelo de Datos

```
User 1──N Recipe
User 1──N MealPlan
User 1──N ShoppingList

Recipe N──N Ingredient (via RecipeIngredient)
Recipe 1──N MealPlanItem

MealPlan 1──N MealPlanItem
MealPlan 1──1 ShoppingList

ShoppingList 1──N ShoppingListItem
ShoppingListItem N──1 Ingredient
```

### Relaciones Clave

- Un usuario puede tener multiples recetas, planes y listas
- Un plan de comidas tiene items que referencian recetas con dia/tipo/porciones
- Cada plan tiene como maximo una lista de compras (relacion 1:1)
- Los ingredientes son unicos por nombre y se reutilizan entre recetas
- Las listas de compras agrupan items por ingrediente con cantidad agregada

---

## Autor

Ronald
