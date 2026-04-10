# API Reference - MealPrep

Base URL: `http://localhost:3004/api`

## Autenticacion

Los endpoints protegidos requieren un header `Authorization` con un token JWT:

```
Authorization: Bearer <token>
```

El token se obtiene al registrarse o iniciar sesion.

---

## Health Check

### `GET /health`

Verifica que el servidor esta activo.

```bash
curl http://localhost:3004/api/health
```

**Respuesta** `200 OK`:
```json
{
  "status": "ok",
  "timestamp": "2024-10-15T10:30:00.000Z"
}
```

---

## Autenticacion (`/auth`)

### `POST /auth/register`

Registrar un nuevo usuario.

```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mipassword123",
    "name": "Juan"
  }'
```

**Body**:
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| `email` | string | Si | Email valido |
| `password` | string | Si | Minimo 6 caracteres |
| `name` | string | Si | 1-100 caracteres |

**Respuesta** `201 Created`:
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores**:
- `409 CONFLICT`: Ya existe un usuario con ese email

---

### `POST /auth/login`

Iniciar sesion.

```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mipassword123"
  }'
```

**Body**:
| Campo | Tipo | Requerido |
|-------|------|-----------|
| `email` | string | Si |
| `password` | string | Si |

**Respuesta** `200 OK`:
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores**:
- `401 UNAUTHORIZED`: Email o password incorrectos

---

### `GET /auth/me`

Obtener perfil del usuario autenticado.

```bash
curl http://localhost:3004/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Respuesta** `200 OK`:
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "name": "Juan",
  "dietaryPreferences": null,
  "weeklyBudget": 150,
  "createdAt": "2024-10-15T10:30:00.000Z"
}
```

---

## Recetas (`/recipes`)

### `GET /recipes`

Listar recetas publicas (y privadas si esta autenticado).

```bash
# Sin autenticacion (solo publicas)
curl "http://localhost:3004/api/recipes?page=1&limit=10&search=pollo"

# Con autenticacion (publicas + propias)
curl "http://localhost:3004/api/recipes?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters**:
| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| `page` | number | 1 | Numero de pagina |
| `limit` | number | 20 | Items por pagina (max 100) |
| `search` | string | - | Buscar por titulo o descripcion |
| `maxPrepTime` | number | - | Tiempo maximo de preparacion (minutos) |
| `maxCalories` | number | - | Calorias maximas |

**Respuesta** `200 OK`:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Spaghetti Bolognese",
      "description": "Classic Italian pasta...",
      "servings": 4,
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 30,
      "calories": 520,
      "imageUrl": null,
      "isPublic": true,
      "createdAt": "2024-10-15T10:30:00.000Z",
      "ingredients": [...],
      "user": { "id": "uuid", "name": "Ronald" }
    }
  ],
  "meta": {
    "total": 16,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### `GET /recipes/:id`

Obtener detalle de una receta.

```bash
curl http://localhost:3004/api/recipes/<recipe-id>
```

**Respuesta** `200 OK`:
```json
{
  "id": "uuid",
  "title": "Chicken Caesar Salad",
  "description": "Crispy romaine lettuce...",
  "servings": 2,
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 12,
  "calories": 450,
  "ingredients": [
    {
      "id": "uuid",
      "ingredientId": "uuid",
      "quantity": 400,
      "unit": "g",
      "notes": null,
      "ingredient": {
        "id": "uuid",
        "name": "chicken breast",
        "category": "MEAT",
        "unit": "g"
      }
    }
  ],
  "user": { "id": "uuid", "name": "Ronald" }
}
```

**Errores**:
- `404 NOT_FOUND`: Receta no encontrada

---

### `POST /recipes`

Crear una nueva receta. Requiere autenticacion.

```bash
curl -X POST http://localhost:3004/api/recipes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pasta con Pesto",
    "description": "Pasta fresca con salsa pesto casera",
    "servings": 2,
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 12,
    "calories": 450,
    "isPublic": true,
    "ingredients": [
      {
        "name": "pasta",
        "quantity": 250,
        "unit": "g",
        "category": "PANTRY"
      },
      {
        "name": "basil",
        "quantity": 1,
        "unit": "cup",
        "category": "PRODUCE"
      },
      {
        "name": "parmesan cheese",
        "quantity": 50,
        "unit": "g",
        "category": "DAIRY"
      }
    ]
  }'
```

**Body**:
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| `title` | string | Si | 1-200 caracteres |
| `description` | string | No | - |
| `servings` | number | No | Entero positivo (default: 4) |
| `prepTimeMinutes` | number | No | Entero >= 0 (default: 0) |
| `cookTimeMinutes` | number | No | Entero >= 0 (default: 0) |
| `calories` | number | No | Entero positivo |
| `imageUrl` | string | No | URL valida |
| `isPublic` | boolean | No | Default: true |
| `ingredients` | array | Si | Minimo 1 ingrediente |
| `ingredients[].name` | string | Si | Nombre del ingrediente |
| `ingredients[].quantity` | number | Si | Mayor a 0 |
| `ingredients[].unit` | string | Si | Unidad de medida |
| `ingredients[].category` | enum | No | PRODUCE, DAIRY, MEAT, PANTRY, FROZEN, BAKERY, BEVERAGES, OTHER |
| `ingredients[].notes` | string | No | Notas adicionales |

**Respuesta** `201 Created`: Receta completa con ingredientes.

---

### `PUT /recipes/:id`

Actualizar una receta propia.

```bash
curl -X PUT http://localhost:3004/api/recipes/<recipe-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pasta con Pesto Actualizada",
    "calories": 480
  }'
```

Acepta los mismos campos que POST pero todos opcionales (actualizacion parcial).

**Errores**:
- `404 NOT_FOUND`: Receta no encontrada
- `403 FORBIDDEN`: No eres el propietario de esta receta

---

### `DELETE /recipes/:id`

Eliminar una receta propia.

```bash
curl -X DELETE http://localhost:3004/api/recipes/<recipe-id> \
  -H "Authorization: Bearer <token>"
```

**Respuesta** `204 No Content`

**Errores**:
- `404 NOT_FOUND`: Receta no encontrada
- `403 FORBIDDEN`: No eres el propietario de esta receta

---

## Planes de Comida (`/meal-plans`)

Todos los endpoints requieren autenticacion.

### `GET /meal-plans/current`

Obtener el plan de la semana actual.

```bash
curl http://localhost:3004/api/meal-plans/current \
  -H "Authorization: Bearer <token>"
```

**Respuesta** `200 OK`:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "weekStartDate": "2024-10-13T00:00:00.000Z",
  "items": [
    {
      "id": "uuid",
      "mealPlanId": "uuid",
      "recipeId": "uuid",
      "dayOfWeek": 1,
      "mealType": "LUNCH",
      "servings": 2,
      "recipe": { ... }
    }
  ],
  "shoppingList": null
}
```

Retorna `null` si no existe plan para la semana actual.

---

### `GET /meal-plans/week/:weekStart`

Obtener plan de una semana especifica.

```bash
curl http://localhost:3004/api/meal-plans/week/2024-10-07 \
  -H "Authorization: Bearer <token>"
```

---

### `POST /meal-plans`

Crear un nuevo plan semanal.

```bash
curl -X POST http://localhost:3004/api/meal-plans \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "weekStartDate": "2024-10-14",
    "items": [
      {
        "recipeId": "<recipe-uuid>",
        "dayOfWeek": 0,
        "mealType": "BREAKFAST",
        "servings": 2
      },
      {
        "recipeId": "<recipe-uuid>",
        "dayOfWeek": 0,
        "mealType": "LUNCH",
        "servings": 1
      }
    ]
  }'
```

**Body**:
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| `weekStartDate` | string | Si | Fecha valida (ISO) |
| `items` | array | No | Items del plan |
| `items[].recipeId` | string | Si | UUID de receta |
| `items[].dayOfWeek` | number | Si | 0 (domingo) a 6 (sabado) |
| `items[].mealType` | enum | Si | BREAKFAST, LUNCH, DINNER, SNACK |
| `items[].servings` | number | No | Entero positivo (default: 1) |

**Errores**:
- `409 CONFLICT`: Ya existe un plan para esa semana

---

### `PUT /meal-plans/:id`

Actualizar items del plan (reemplaza todos los items).

```bash
curl -X PUT http://localhost:3004/api/meal-plans/<plan-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "recipeId": "<recipe-uuid>",
        "dayOfWeek": 0,
        "mealType": "BREAKFAST",
        "servings": 2
      }
    ]
  }'
```

---

### `POST /meal-plans/:id/auto-generate`

Auto-generar comidas sugeridas para el plan.

```bash
curl -X POST http://localhost:3004/api/meal-plans/<plan-id>/auto-generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "maxCaloriesPerDay": 2000,
      "mealsPerDay": 3,
      "includeSnacks": false
    }
  }'
```

**Body** (todo opcional):
| Campo | Tipo | Default | Descripcion |
|-------|------|---------|-------------|
| `preferences.maxCaloriesPerDay` | number | - | Limite calorico diario |
| `preferences.mealsPerDay` | number | 3 | Comidas por dia (1-4) |
| `preferences.includeSnacks` | boolean | false | Incluir snacks |

---

## Listas de Compras (`/shopping-lists`)

Todos los endpoints requieren autenticacion.

### `POST /shopping-lists/generate`

Generar lista de compras desde un plan semanal.

```bash
curl -X POST http://localhost:3004/api/shopping-lists/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "mealPlanId": "<plan-uuid>" }'
```

**Respuesta** `201 Created`:
```json
{
  "id": "uuid",
  "mealPlanId": "uuid",
  "userId": "uuid",
  "items": [
    {
      "id": "uuid",
      "ingredientId": "uuid",
      "quantity": 1.5,
      "unit": "kg",
      "isChecked": false,
      "category": "MEAT",
      "ingredient": {
        "id": "uuid",
        "name": "chicken breast",
        "category": "MEAT",
        "unit": "g"
      }
    }
  ]
}
```

---

### `GET /shopping-lists/:mealPlanId`

Obtener lista de compras de un plan.

```bash
curl http://localhost:3004/api/shopping-lists/<plan-uuid> \
  -H "Authorization: Bearer <token>"
```

---

### `PATCH /shopping-lists/:id/items/:itemId`

Marcar o desmarcar un item como comprado.

```bash
curl -X PATCH http://localhost:3004/api/shopping-lists/<list-id>/items/<item-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "isChecked": true }'
```

---

### `GET /shopping-lists/:mealPlanId/export`

Exportar lista de compras como texto plano.

```bash
curl http://localhost:3004/api/shopping-lists/<plan-uuid>/export \
  -H "Authorization: Bearer <token>"
```

**Respuesta** `200 OK` (text/plain):
```
SHOPPING LIST
=============

--- DAIRY ---
[ ] milk: 3 cups
[ ] parmesan cheese: 175 g

--- MEAT ---
[ ] chicken breast: 400 g

--- PRODUCE ---
[x] tomatoes: 6 unit
[ ] onion: 4 unit
```

---

## Dashboard (`/dashboard`)

### `GET /dashboard/stats`

Obtener estadisticas del usuario.

```bash
curl http://localhost:3004/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

**Respuesta** `200 OK`:
```json
{
  "currentWeek": {
    "mealsPlanned": 14,
    "totalCalories": 5600,
    "avgCaloriesPerDay": 800,
    "shoppingProgress": {
      "total": 25,
      "checked": 10,
      "percentage": 40
    }
  },
  "overall": {
    "totalRecipes": 16,
    "totalMealPlans": 3,
    "popularRecipes": [
      {
        "id": "uuid",
        "title": "Chicken Caesar Salad",
        "calories": 450,
        "usageCount": 5
      }
    ]
  }
}
```

---

## Formato de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Recipe with id 'abc' not found"
  }
}
```

### Codigos de Error

| Codigo HTTP | Code | Descripcion |
|-------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Error de validacion Zod |
| 401 | `UNAUTHORIZED` | Token invalido o ausente |
| 403 | `FORBIDDEN` | Sin permisos para la operacion |
| 404 | `NOT_FOUND` | Recurso no encontrado |
| 409 | `CONFLICT` | Conflicto (ej: email duplicado) |
| 500 | `INTERNAL_ERROR` | Error interno del servidor |

### Errores de Validacion

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "password", "message": "Password must be at least 6 characters" }
    ]
  }
}
```

---

## Autor

Ronald
