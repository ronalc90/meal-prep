# Modelo de Datos

## Diagrama de Relaciones

```
┌──────────┐       ┌──────────────┐       ┌─────────────┐
│   User   │──1:N──│    Recipe     │──N:N──│  Ingredient  │
│          │       │              │  (via)  │             │
│          │       │              │RecipeIng│             │
└────┬─────┘       └──────┬───────┘        └──────┬──────┘
     │                    │                       │
     │ 1:N                │ 1:N                   │
     │                    │                       │
┌────┴──────┐      ┌──────┴───────┐               │
│ MealPlan  │──1:N─│ MealPlanItem │               │
│           │      │              │               │
└────┬──────┘      └──────────────┘               │
     │                                            │
     │ 1:1                                        │
     │                                            │
┌────┴────────────┐                               │
│  ShoppingList   │──1:N──┌───────────────────┐   │
│                 │       │ ShoppingListItem   │───┘
└─────────────────┘       └───────────────────┘
```

## Modelos

### User

Usuarios de la aplicacion.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| email | String | Email unico |
| passwordHash | String | Hash bcrypt del password |
| name | String | Nombre del usuario |
| dietaryPreferences | String? | Preferencias dieteticas |
| weeklyBudget | Float? | Presupuesto semanal |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Ultima actualizacion |

**Relaciones**: recipes (1:N), mealPlans (1:N), shoppingLists (1:N)

---

### Recipe

Recetas con ingredientes y metadatos nutricionales.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| userId | String? | Propietario (null = receta del sistema) |
| title | String | Titulo de la receta |
| description | String? | Descripcion |
| servings | Int | Numero de porciones (default: 4) |
| prepTimeMinutes | Int | Tiempo de preparacion |
| cookTimeMinutes | Int | Tiempo de coccion |
| calories | Int? | Calorias por porcion |
| imageUrl | String? | URL de imagen |
| isPublic | Boolean | Visible para todos (default: true) |

**Indices**: userId, title

**Relaciones**: user (N:1), ingredients (1:N via RecipeIngredient), mealPlanItems (1:N)

---

### Ingredient

Ingredientes maestros reutilizados entre recetas.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| name | String | Nombre unico del ingrediente |
| category | String | Categoria/pasillo (default: OTHER) |
| unit | String | Unidad base (default: unit) |

**Indice**: name (unique)

**Relaciones**: recipeIngredients (1:N), shoppingListItems (1:N)

---

### RecipeIngredient

Tabla intermedia receta-ingrediente con cantidad y unidad.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| recipeId | String | FK a Recipe |
| ingredientId | String | FK a Ingredient |
| quantity | Float | Cantidad |
| unit | String | Unidad de medida |
| notes | String? | Notas (ej: "picado", "sin piel") |

**Constraint unico**: (recipeId, ingredientId)

---

### MealPlan

Plan de comidas para una semana.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| userId | String | FK a User |
| weekStartDate | DateTime | Fecha de inicio de la semana (domingo) |

**Constraint unico**: (userId, weekStartDate)

**Relaciones**: user (N:1), items (1:N), shoppingList (1:1)

---

### MealPlanItem

Asignacion de una receta a un dia y tipo de comida.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| mealPlanId | String | FK a MealPlan |
| recipeId | String | FK a Recipe |
| dayOfWeek | Int | 0 (domingo) a 6 (sabado) |
| mealType | String | BREAKFAST, LUNCH, DINNER, SNACK |
| servings | Int | Porciones (default: 1) |

**Constraint unico**: (mealPlanId, dayOfWeek, mealType)

---

### ShoppingList

Lista de compras generada desde un plan semanal.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| mealPlanId | String | FK a MealPlan (unique - 1:1) |
| userId | String | FK a User |

**Relaciones**: mealPlan (1:1), user (N:1), items (1:N)

---

### ShoppingListItem

Item individual de la lista de compras.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | UUID | Identificador unico |
| shoppingListId | String | FK a ShoppingList |
| ingredientId | String | FK a Ingredient |
| quantity | Float | Cantidad agregada |
| unit | String | Unidad formateada |
| isChecked | Boolean | Marcado como comprado |
| category | String | Categoria/pasillo |

**Constraint unico**: (shoppingListId, ingredientId)

## Categorias Disponibles

| Valor | Descripcion |
|-------|-------------|
| PRODUCE | Frutas, verduras y hierbas frescas |
| DAIRY | Lacteos, huevos y mantequilla |
| MEAT | Carnes, aves, pescados y mariscos |
| PANTRY | Despensa: cereales, aceites, especias, enlatados |
| FROZEN | Productos congelados |
| BAKERY | Pan y productos de panaderia |
| BEVERAGES | Bebidas |
| OTHER | Sin categoria asignada |

## Autor

Ronald
