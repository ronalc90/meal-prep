# API Reference

Base URL: `http://localhost:3004/api`

## Autenticacion

Endpoints protegidos requieren header:
```
Authorization: Bearer <token>
```

## Endpoints

### Salud

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |

### Auth

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesion |
| GET | `/auth/me` | Si | Obtener perfil |

### Recetas

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/recipes` | Opcional | Listar recetas |
| GET | `/recipes/:id` | No | Obtener receta |
| POST | `/recipes` | Si | Crear receta |
| PUT | `/recipes/:id` | Si | Actualizar receta |
| DELETE | `/recipes/:id` | Si | Eliminar receta |

**Parametros de busqueda** (GET /recipes):
- `page` - Numero de pagina (default: 1)
- `limit` - Items por pagina (default: 20, max: 100)
- `search` - Buscar por titulo/descripcion
- `maxPrepTime` - Tiempo maximo de preparacion (minutos)
- `maxCalories` - Calorias maximas

### Planes de Comida

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/meal-plans/current` | Si | Plan semana actual |
| GET | `/meal-plans/week/:weekStart` | Si | Plan por fecha |
| POST | `/meal-plans` | Si | Crear plan |
| PUT | `/meal-plans/:id` | Si | Actualizar plan |
| POST | `/meal-plans/:id/auto-generate` | Si | Auto-generar comidas |

### Listas de Compras

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/shopping-lists/generate` | Si | Generar lista |
| GET | `/shopping-lists/:mealPlanId` | Si | Obtener lista |
| PATCH | `/shopping-lists/:id/items/:itemId` | Si | Toggle item |
| GET | `/shopping-lists/:mealPlanId/export` | Si | Exportar texto |

### Dashboard

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/dashboard/stats` | Si | Estadisticas |

## Categorias de Ingredientes

| Categoria | Descripcion |
|-----------|-------------|
| PRODUCE | Frutas, verduras, hierbas |
| DAIRY | Lacteos y huevos |
| MEAT | Carnes y pescados |
| PANTRY | Despensa y especias |
| FROZEN | Congelados |
| BAKERY | Panaderia |
| BEVERAGES | Bebidas |
| OTHER | Otros |

## Tipos de Comida

| Tipo | Descripcion |
|------|-------------|
| BREAKFAST | Desayuno |
| LUNCH | Almuerzo |
| DINNER | Cena |
| SNACK | Merienda |

## Codigos de Error

| HTTP | Code | Descripcion |
|------|------|-------------|
| 400 | VALIDATION_ERROR | Validacion fallida |
| 401 | UNAUTHORIZED | Token invalido |
| 403 | FORBIDDEN | Sin permisos |
| 404 | NOT_FOUND | No encontrado |
| 409 | CONFLICT | Conflicto |
| 500 | INTERNAL_ERROR | Error interno |

Para documentacion detallada con ejemplos curl, ver [docs/API.md](../API.md).

## Autor

Ronald
