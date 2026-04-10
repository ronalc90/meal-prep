# MealPrep - Arquitectura Tecnica

**Autor:** Ronald

---

## Resumen de Arquitectura

MealPrep sigue una arquitectura de cliente movil (Flutter) con backend serverless (Supabase). La comunicacion es directa entre la app y Supabase para operaciones CRUD, con Edge Functions para logica de negocio compleja y proxying de APIs externas.

```
+------------------------------------------------------------------+
|                        FLUTTER APP                                |
|                                                                    |
|  +-------------+    +-------------+    +------------------------+ |
|  | Presentation|    |    BLoC     |    |      Repository        | |
|  |   Layer     +--->|   Layer     +--->|       Layer             | |
|  | (Screens,   |    | (Estado,    |    | (Abstraccion datos)    | |
|  |  Widgets)   |    |  Eventos)   |    +---+----------------+---+ |
|  +-------------+    +-------------+        |                |     |
|                                            v                v     |
|                                   +--------+---+    +------+---+ |
|                                   | Remote     |    | Local    | |
|                                   | DataSource |    | DataSource| |
|                                   | (Supabase) |    | (SQLite) | |
|                                   +------+-----+    +----+-----+ |
+------------------------------------------------------------------+
                       |                        |
            +----------+----------+    (Solo local)
            |     SUPABASE        |
            |                     |
            | +--Auth-----------+ |
            | +--PostgreSQL-----+ |
            | +--Edge Functions-+ |
            | +--Storage--------+ |
            | +--Realtime-------+ |
            +----------+----------+
                       |
            +----------+----------+
            |   SPOONACULAR API   |
            +---------------------+
```

---

## Arquitectura Flutter - Patron BLoC

### Estructura de Carpetas

```
lib/
  app/
    app.dart                    # MaterialApp, rutas, tema
    routes.dart                 # Definicion de rutas (GoRouter)
    theme.dart                  # Tema visual de la app
  
  core/
    constants/
      api_constants.dart        # URLs, keys, timeouts
      app_constants.dart        # Valores por defecto
      storage_constants.dart    # Keys de almacenamiento local
    errors/
      exceptions.dart           # Excepciones personalizadas
      failures.dart             # Clases Failure (Either pattern)
    network/
      network_info.dart         # Verificar conectividad
      supabase_client.dart      # Singleton de Supabase client
    utils/
      date_utils.dart           # Helpers de fecha (inicio de semana, etc.)
      unit_converter.dart       # Conversion de unidades de cocina
      ingredient_aggregator.dart # Logica de agregacion de ingredientes
  
  features/
    auth/
      data/
        datasources/
          auth_remote_datasource.dart
        repositories/
          auth_repository_impl.dart
      domain/
        entities/
          user_entity.dart
        repositories/
          auth_repository.dart
        usecases/
          sign_in_usecase.dart
          sign_up_usecase.dart
          sign_in_with_google_usecase.dart
          sign_out_usecase.dart
      presentation/
        bloc/
          auth_bloc.dart
          auth_event.dart
          auth_state.dart
        screens/
          login_screen.dart
          register_screen.dart
          onboarding_screen.dart
        widgets/
          auth_form.dart
          social_login_button.dart
    
    recipes/
      data/
        datasources/
          recipe_remote_datasource.dart   # Spoonacular via Edge Function
          recipe_local_datasource.dart    # SQLite cache
        models/
          recipe_model.dart               # JSON serialization
          ingredient_model.dart
        repositories/
          recipe_repository_impl.dart
      domain/
        entities/
          recipe.dart
          ingredient.dart
        repositories/
          recipe_repository.dart
        usecases/
          search_recipes_usecase.dart
          get_recipe_detail_usecase.dart
          toggle_favorite_usecase.dart
          get_favorites_usecase.dart
      presentation/
        bloc/
          recipe_search_bloc.dart
          recipe_detail_bloc.dart
          favorites_bloc.dart
        screens/
          recipe_search_screen.dart
          recipe_detail_screen.dart
          favorites_screen.dart
        widgets/
          recipe_card.dart
          recipe_filters_sheet.dart
          ingredient_list_tile.dart
    
    meal_plan/
      data/
        datasources/
          meal_plan_remote_datasource.dart
          meal_plan_local_datasource.dart
        models/
          meal_plan_model.dart
          meal_plan_item_model.dart
        repositories/
          meal_plan_repository_impl.dart
      domain/
        entities/
          meal_plan.dart
          meal_plan_item.dart
        repositories/
          meal_plan_repository.dart
        usecases/
          get_weekly_plan_usecase.dart
          add_meal_usecase.dart
          move_meal_usecase.dart
          remove_meal_usecase.dart
          auto_fill_week_usecase.dart
          save_template_usecase.dart
      presentation/
        bloc/
          meal_plan_bloc.dart
        screens/
          meal_plan_screen.dart
        widgets/
          week_calendar.dart
          day_column.dart
          meal_slot.dart
          draggable_meal_card.dart
    
    shopping_list/
      data/
        datasources/
          shopping_list_remote_datasource.dart
          shopping_list_local_datasource.dart
        models/
          shopping_list_model.dart
          shopping_list_item_model.dart
        repositories/
          shopping_list_repository_impl.dart
      domain/
        entities/
          shopping_list.dart
          shopping_list_item.dart
        repositories/
          shopping_list_repository.dart
        usecases/
          generate_shopping_list_usecase.dart
          toggle_item_usecase.dart
          add_manual_item_usecase.dart
          get_list_history_usecase.dart
      presentation/
        bloc/
          shopping_list_bloc.dart
        screens/
          shopping_list_screen.dart
          shopping_list_history_screen.dart
        widgets/
          aisle_section.dart
          shopping_item_tile.dart
          progress_indicator.dart
    
    profile/
      data/ ...
      domain/ ...
      presentation/
        bloc/
          profile_bloc.dart
        screens/
          profile_screen.dart
          preferences_screen.dart
          notification_settings_screen.dart
        widgets/
          preference_chips.dart
          allergy_selector.dart
```

### Flujo de Datos BLoC

```
UI (Screen/Widget)
    |
    | dispara Evento
    v
BLoC
    |
    | llama UseCase
    v
UseCase
    |
    | llama Repository (abstraccion)
    v
Repository Impl
    |
    +--- Remote DataSource (Supabase) --- si hay red
    |
    +--- Local DataSource (SQLite) ----- siempre (cache)
    |
    v
BLoC recibe resultado (Either<Failure, Data>)
    |
    | emite nuevo State
    v
UI se reconstruye con el nuevo State
```

### Ejemplo: Generar Lista de Compras

```dart
// Evento
class GenerateShoppingListEvent extends ShoppingListEvent {
  final String mealPlanId;
  const GenerateShoppingListEvent(this.mealPlanId);
}

// BLoC
on<GenerateShoppingListEvent>((event, emit) async {
  emit(ShoppingListLoading());
  
  final result = await generateShoppingListUseCase(
    GenerateShoppingListParams(mealPlanId: event.mealPlanId),
  );
  
  result.fold(
    (failure) => emit(ShoppingListError(failure.message)),
    (shoppingList) => emit(ShoppingListLoaded(shoppingList)),
  );
});

// UseCase
class GenerateShoppingListUseCase {
  final ShoppingListRepository repository;
  
  Future<Either<Failure, ShoppingList>> call(
    GenerateShoppingListParams params,
  ) {
    return repository.generateFromMealPlan(params.mealPlanId);
  }
}
```

---

## Supabase - Esquema con Row Level Security

### Politicas RLS

Cada tabla tiene politicas RLS que garantizan que un usuario solo puede acceder a sus propios datos.

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- USERS: Solo puede ver y editar su propio perfil
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- MEAL PLANS: Solo puede ver y gestionar sus propios planes
CREATE POLICY "meal_plans_select_own" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meal_plans_insert_own" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_plans_update_own" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "meal_plans_delete_own" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- MEAL PLAN ITEMS: Acceso via meal_plan ownership
CREATE POLICY "meal_plan_items_select" ON meal_plan_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meal_plan_items.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_plan_items_insert" ON meal_plan_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meal_plan_items.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_plan_items_update" ON meal_plan_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meal_plan_items.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "meal_plan_items_delete" ON meal_plan_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meal_plan_items.meal_plan_id 
      AND meal_plans.user_id = auth.uid()
    )
  );

-- SHOPPING LISTS: Solo puede ver y gestionar sus propias listas
CREATE POLICY "shopping_lists_select_own" ON shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "shopping_lists_insert_own" ON shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shopping_lists_update_own" ON shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "shopping_lists_delete_own" ON shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- SHOPPING LIST ITEMS: Acceso via shopping_list ownership
CREATE POLICY "shopping_list_items_select" ON shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "shopping_list_items_insert" ON shopping_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "shopping_list_items_update" ON shopping_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "shopping_list_items_delete" ON shopping_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

-- RECIPES: Publicas (Spoonacular) visibles para todos, custom solo para el dueno
CREATE POLICY "recipes_select_public" ON recipes
  FOR SELECT USING (is_custom = false OR user_id = auth.uid());

CREATE POLICY "recipes_insert_own" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "recipes_update_own" ON recipes
  FOR UPDATE USING (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "recipes_delete_own" ON recipes
  FOR DELETE USING (auth.uid() = user_id AND is_custom = true);

-- USER FAVORITES: Solo puede ver y gestionar sus propios favoritos
CREATE POLICY "favorites_select_own" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- INGREDIENTS: Lectura publica (catalogo compartido)
CREATE POLICY "ingredients_select_all" ON ingredients
  FOR SELECT USING (true);
```

### Indices para Rendimiento

```sql
-- Busqueda de recetas
CREATE INDEX idx_recipes_spoonacular_id ON recipes(spoonacular_id);
CREATE INDEX idx_recipes_meal_type ON recipes USING GIN(meal_type);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_title_search ON recipes USING GIN(to_tsvector('spanish', title));

-- Plan semanal
CREATE INDEX idx_meal_plans_user_week ON meal_plans(user_id, week_start_date);
CREATE INDEX idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id);
CREATE INDEX idx_meal_plan_items_day ON meal_plan_items(meal_plan_id, day_of_week);

-- Lista de compras
CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_shopping_list_items_category ON shopping_list_items(shopping_list_id, category);

-- Favoritos
CREATE INDEX idx_favorites_user ON user_favorites(user_id);

-- Ingredientes
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
```

---

## Algoritmo de Recomendacion de Recetas

### Logica de Sugerencias

El sistema sugiere recetas basandose en multiples factores con un sistema de puntuacion simple.

```
Puntuacion = (peso_preferencia * match_preferencias)
           + (peso_favoritos * es_similar_a_favorito)
           + (peso_variedad * no_repetida_esta_semana)
           + (peso_temporal * adecuada_para_el_momento)
           + (peso_estacional * ingredientes_de_temporada)
```

### Factores de Puntuacion

| Factor | Peso | Descripcion |
|--------|------|-------------|
| Match de preferencias | 0.30 | Cumple con filtros dietarios y alergias |
| Similitud con favoritos | 0.25 | Comparte tags/ingredientes con recetas favoritas |
| Variedad semanal | 0.20 | Penaliza recetas ya usadas en la semana actual |
| Adecuacion temporal | 0.15 | Desayunos ligeros, cenas completas, etc. |
| Ingredientes de temporada | 0.10 | Bonus por ingredientes disponibles en la temporada |

### Implementacion (Edge Function)

```typescript
// supabase/functions/suggest-recipes/index.ts

interface ScoredRecipe {
  recipe: Recipe;
  score: number;
}

function scoreRecipe(
  recipe: Recipe,
  userPreferences: UserPreferences,
  favoriteRecipes: Recipe[],
  currentWeekRecipes: Recipe[],
  mealType: string,
): number {
  let score = 0;

  // 1. Match de preferencias (filtro obligatorio, no puntua si no cumple)
  if (!matchesDietaryPreferences(recipe, userPreferences)) {
    return -1; // Excluir
  }
  if (containsAllergen(recipe, userPreferences.allergies)) {
    return -1; // Excluir
  }
  score += 0.30;

  // 2. Similitud con favoritos
  const similarityScore = calculateSimilarity(recipe, favoriteRecipes);
  score += 0.25 * similarityScore;

  // 3. Variedad semanal
  const isRepeat = currentWeekRecipes.some(r => r.id === recipe.id);
  if (!isRepeat) {
    score += 0.20;
  }

  // 4. Adecuacion temporal
  if (recipe.meal_type.includes(mealType)) {
    score += 0.15;
  }

  // 5. Ingredientes de temporada (simplificado)
  const seasonalBonus = calculateSeasonalBonus(recipe);
  score += 0.10 * seasonalBonus;

  return score;
}

function calculateSimilarity(
  recipe: Recipe, 
  favorites: Recipe[]
): number {
  if (favorites.length === 0) return 0.5; // Neutral

  const recipeTags = new Set(recipe.tags);
  let maxSimilarity = 0;

  for (const fav of favorites) {
    const favTags = new Set(fav.tags);
    const intersection = [...recipeTags].filter(t => favTags.has(t));
    const union = new Set([...recipeTags, ...favTags]);
    const jaccard = intersection.length / union.size;
    maxSimilarity = Math.max(maxSimilarity, jaccard);
  }

  return maxSimilarity;
}
```

---

## Algoritmo de Agregacion de Lista de Compras

### Problema

Multiples recetas del plan semanal comparten ingredientes. La app debe combinar cantidades y normalizar unidades para generar una lista limpia.

Ejemplo:
- Receta A: 200g de cebolla
- Receta B: 1 cebolla mediana (~150g)
- Receta C: 0.5 kg de cebolla
- **Resultado esperado:** 850g de cebolla (o ~5 cebollas)

### Algoritmo

```
ENTRADA: Lista de meal_plan_items con sus recipe_ingredients
SALIDA: Lista agrupada de shopping_list_items

1. Para cada meal_plan_item en el plan semanal:
   a. Obtener la receta y sus ingredientes
   b. Multiplicar cantidades por el numero de porciones del slot

2. Agrupar ingredientes por ingredient_id (mismo ingrediente)

3. Para cada grupo de ingredientes:
   a. Normalizar todas las unidades a la unidad base:
      - Peso: todo a gramos (g)
      - Volumen: todo a mililitros (ml)
      - Unidades: mantener como "unidad"
   b. Sumar las cantidades normalizadas
   c. Convertir el resultado a la unidad mas legible:
      - Si >= 1000g -> mostrar en kg
      - Si >= 1000ml -> mostrar en litros
      - Si < 5g -> mostrar en cucharaditas
   d. Redondear a cantidades practicas de compra

4. Asignar categoria de supermercado a cada item
   (basado en ingredient.category)

5. Ordenar items dentro de cada categoria alfabeticamente

6. Retornar lista agrupada por categoria
```

### Tabla de Conversion de Unidades

```typescript
// core/utils/unit_converter.dart

const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Peso (base: gramos)
  'peso': {
    'mg': 0.001,
    'g': 1,
    'kg': 1000,
    'oz': 28.3495,
    'lb': 453.592,
  },
  // Volumen (base: mililitros)
  'volumen': {
    'ml': 1,
    'cl': 10,
    'dl': 100,
    'l': 1000,
    'cucharadita': 5,
    'cucharada': 15,
    'taza': 240,
    'fl_oz': 29.5735,
  },
  // Unidades (sin conversion, se suman directamente)
  'unidad': {
    'unidad': 1,
    'pieza': 1,
    'diente': 1,  // ajo
    'rodaja': 1,
    'manojo': 1,
    'paquete': 1,
    'lata': 1,
    'botella': 1,
  },
};

function getUnitType(unit: string): string {
  for (const [type, units] of Object.entries(UNIT_CONVERSIONS)) {
    if (unit.toLowerCase() in units) return type;
  }
  return 'unidad'; // Default
}

function convertToBase(quantity: number, unit: string): number {
  const unitType = getUnitType(unit);
  const factor = UNIT_CONVERSIONS[unitType][unit.toLowerCase()];
  return quantity * (factor || 1);
}

function convertToReadable(
  quantityInBase: number, 
  unitType: string
): { quantity: number; unit: string } {
  if (unitType === 'peso') {
    if (quantityInBase >= 1000) {
      return { quantity: Math.round(quantityInBase / 100) / 10, unit: 'kg' };
    }
    return { quantity: Math.round(quantityInBase), unit: 'g' };
  }
  if (unitType === 'volumen') {
    if (quantityInBase >= 1000) {
      return { quantity: Math.round(quantityInBase / 100) / 10, unit: 'l' };
    }
    return { quantity: Math.round(quantityInBase), unit: 'ml' };
  }
  return { quantity: Math.ceil(quantityInBase), unit: 'unidad' };
}
```

### Categorias de Supermercado (Agrupacion por Pasillo)

```typescript
const SUPERMARKET_CATEGORIES = {
  'frutas_verduras': {
    label: 'Frutas y Verduras',
    order: 1,
    icon: 'carrot',
  },
  'carnes': {
    label: 'Carnes y Pescados',
    order: 2,
    icon: 'drumstick',
  },
  'lacteos': {
    label: 'Lacteos y Huevos',
    order: 3,
    icon: 'cheese',
  },
  'panaderia': {
    label: 'Panaderia',
    order: 4,
    icon: 'bread',
  },
  'granos_cereales': {
    label: 'Granos, Cereales y Pastas',
    order: 5,
    icon: 'grain',
  },
  'enlatados': {
    label: 'Enlatados y Conservas',
    order: 6,
    icon: 'can',
  },
  'condimentos': {
    label: 'Condimentos y Especias',
    order: 7,
    icon: 'pepper',
  },
  'congelados': {
    label: 'Congelados',
    order: 8,
    icon: 'snowflake',
  },
  'bebidas': {
    label: 'Bebidas',
    order: 9,
    icon: 'bottle',
  },
  'limpieza': {
    label: 'Limpieza y Hogar',
    order: 10,
    icon: 'spray',
  },
  'otros': {
    label: 'Otros',
    order: 11,
    icon: 'basket',
  },
};
```

---

## Soporte Offline con SQLite + Sincronizacion

### Estrategia

La app usa un enfoque "offline-first" donde todas las operaciones se ejecutan primero contra la base de datos local (SQLite via drift) y luego se sincronizan con Supabase cuando hay conexion.

### Esquema Local (drift)

```dart
// Espejo simplificado del esquema de Supabase
@DriftDatabase(tables: [
  LocalRecipes,
  LocalMealPlans,
  LocalMealPlanItems,
  LocalShoppingLists,
  LocalShoppingListItems,
  LocalFavorites,
  LocalIngredients,
  SyncQueue,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

// Tabla de cola de sincronizacion
class SyncQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get tableName => text()();
  TextColumn get recordId => text()();
  TextColumn get operation => text()(); // 'INSERT', 'UPDATE', 'DELETE'
  TextColumn get payload => text()();  // JSON del cambio
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  BoolColumn get synced => boolean().withDefault(const Constant(false))();
}
```

### Flujo de Sincronizacion

```
1. Usuario realiza accion (ej: marcar item como comprado)
    |
2. Guardar cambio en SQLite local inmediatamente
    |
3. Agregar entrada a SyncQueue con operation='UPDATE'
    |
4. Verificar conectividad
    |
    +--- Sin conexion: Nada mas. El cambio esta guardado localmente.
    |
    +--- Con conexion:
          |
          5. Procesar SyncQueue (FIFO)
          |
          6. Para cada entrada pendiente:
          |   a. Enviar cambio a Supabase
          |   b. Si exito: marcar como synced=true
          |   c. Si error: reintentar hasta 3 veces, luego dejar pendiente
          |
          7. Descargar cambios remotos desde Supabase
          |   (usar campo updated_at para delta sync)
          |
          8. Aplicar cambios remotos a SQLite local
          |
          9. Resolver conflictos con last-write-wins
              (el timestamp mas reciente gana)
```

### Manejo de Conflictos

```dart
enum ConflictResolution { localWins, remoteWins, lastWriteWins }

Future<void> resolveConflict({
  required dynamic localRecord,
  required dynamic remoteRecord,
  ConflictResolution strategy = ConflictResolution.lastWriteWins,
}) async {
  switch (strategy) {
    case ConflictResolution.lastWriteWins:
      if (localRecord.updatedAt.isAfter(remoteRecord.updatedAt)) {
        // Subir local a remoto
        await pushToRemote(localRecord);
      } else {
        // Sobreescribir local con remoto
        await updateLocal(remoteRecord);
      }
      break;
    // ...
  }
}
```

### Datos Disponibles Offline

| Dato | Disponible Offline | Sincronizable |
|------|-------------------|---------------|
| Plan semanal actual | Si | Si |
| Recetas en favoritos | Si (cacheadas) | Si |
| Recetas buscadas recientemente | Si (cache LRU) | No |
| Lista de compras activa | Si | Si |
| Perfil y preferencias | Si | Si |
| Busqueda de nuevas recetas | No (requiere Spoonacular) | -- |
| Imagenes de recetas | Si (cache de imagenes) | No |

---

## Push Notifications

### Configuracion

Firebase Cloud Messaging (FCM) para Android e iOS, integrado con Supabase Edge Functions para programar notificaciones server-side.

### Tipos de Notificaciones

| Tipo | Trigger | Hora por Defecto | Personalizable |
|------|---------|-----------------|----------------|
| Recordatorio de comida | Antes de cada comida | 30 min antes | Si (15, 30, 60 min) |
| Planificar la semana | Lunes sin plan creado | 9:00 AM lunes | Si (dia y hora) |
| Recordatorio de compras | Dia antes de la compra | 8:00 PM | Si (dia y hora) |
| Plan incompleto | Semana con dias vacios | 6:00 PM miercoles | No |
| Prueba Pro por vencer | 2 dias antes de fin de trial | 10:00 AM | No |

### Implementacion Server-Side

```typescript
// supabase/functions/send-notification/index.ts

import { createClient } from '@supabase/supabase-js';

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

async function sendPushNotification(payload: NotificationPayload) {
  // 1. Obtener FCM token del usuario
  const { data: user } = await supabase
    .from('users')
    .select('fcm_token, notification_settings')
    .eq('id', payload.userId)
    .single();

  if (!user?.fcm_token) return;

  // 2. Verificar que el tipo de notificacion esta habilitado
  const settings = user.notification_settings;
  // ... verificar tipo

  // 3. Enviar via FCM
  const response = await fetch(
    'https://fcm.googleapis.com/fcm/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: user.fcm_token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      }),
    }
  );

  return response.json();
}
```

---

## Manejo de Imagenes

### Flujo para Recetas Personalizadas (Fase 2)

```
1. Usuario toma/selecciona foto desde la app
    |
2. Comprimir imagen client-side:
   - Redimensionar a max 1080x1080 px
   - Comprimir JPEG quality 80%
   - Resultado: ~200-500 KB por imagen
    |
3. Subir a Supabase Storage:
   - Bucket: 'recipe-images'
   - Path: '{user_id}/{recipe_id}/{timestamp}.jpg'
   - Politica: solo el dueno puede subir/eliminar
    |
4. Guardar URL publica en recipes.image_url
    |
5. Servir imagenes via Supabase CDN con transformaciones:
   - Thumbnail (150x150): para tarjetas
   - Medium (400x400): para detalle
   - Full (1080x1080): para vista completa
```

### Cache de Imagenes en Flutter

```dart
// Usar cached_network_image para cache automatico
CachedNetworkImage(
  imageUrl: recipe.imageUrl,
  placeholder: (context, url) => ShimmerPlaceholder(),
  errorWidget: (context, url, error) => DefaultRecipeImage(),
  memCacheWidth: 400,  // Optimizar memoria
);
```

### Politicas de Storage en Supabase

```sql
-- Bucket: recipe-images (publico para lectura)
CREATE POLICY "recipe_images_read_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "recipe_images_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "recipe_images_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## CI/CD con GitHub Actions + Fastlane

### Pipeline de CI (en cada push/PR)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
      - run: flutter pub get
      - run: flutter analyze --no-fatal-infos
      - run: dart format --set-exit-if-changed .

  test:
    runs-on: ubuntu-latest
    needs: analyze
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
      - run: flutter pub get
      - run: flutter test --coverage
      - name: Check coverage
        run: |
          COVERAGE=$(lcov --summary coverage/lcov.info 2>&1 | grep "lines" | awk '{print $2}' | sed 's/%//')
          if (( $(echo "$COVERAGE < 60" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 60% threshold"
            exit 1
          fi

  build-android:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
      - run: flutter pub get
      - run: flutter build appbundle --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-release
          path: build/app/outputs/bundle/release/

  build-ios:
    runs-on: macos-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
      - run: flutter pub get
      - run: flutter build ipa --release --no-codesign
      - uses: actions/upload-artifact@v4
        with:
          name: ios-release
          path: build/ios/ipa/
```

### Fastlane para Deploy

```ruby
# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Deploy to internal testing track"
  lane :internal do
    upload_to_play_store(
      track: 'internal',
      aab: '../build/app/outputs/bundle/release/app-release.aab',
      json_key: 'play-store-credentials.json',
    )
  end

  desc "Promote internal to production"
  lane :production do
    upload_to_play_store(
      track: 'production',
      track_promote_to: 'production',
      json_key: 'play-store-credentials.json',
    )
  end
end
```

```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Push to TestFlight"
  lane :beta do
    build_app(
      workspace: "Runner.xcworkspace",
      scheme: "Runner",
      export_method: "app-store",
    )
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
    )
  end

  desc "Submit to App Store"
  lane :release do
    deliver(
      submit_for_review: true,
      automatic_release: false,
      force: true,
    )
  end
end
```

### Variables de Entorno y Secretos

```
# GitHub Secrets requeridos
SUPABASE_URL
SUPABASE_ANON_KEY
SPOONACULAR_API_KEY
FCM_SERVER_KEY
PLAY_STORE_CREDENTIALS     # JSON de service account
APP_STORE_CONNECT_API_KEY  # AuthKey de App Store Connect
MATCH_PASSWORD             # Para certificados iOS via match
KEYSTORE_BASE64            # Keystore de Android firmado
KEYSTORE_PASSWORD
KEY_ALIAS
KEY_PASSWORD
```

---

## Dependencias Flutter Principales

```yaml
# pubspec.yaml (dependencias clave)
dependencies:
  flutter:
    sdk: flutter
  
  # Estado
  flutter_bloc: ^8.1.0
  equatable: ^2.0.0
  
  # Navegacion
  go_router: ^14.0.0
  
  # Backend
  supabase_flutter: ^2.5.0
  
  # Base de datos local
  drift: ^2.18.0
  sqlite3_flutter_libs: ^0.5.0
  
  # Red
  connectivity_plus: ^6.0.0
  
  # UI
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  flutter_svg: ^2.0.0
  
  # Notificaciones
  firebase_messaging: ^15.0.0
  firebase_core: ^3.0.0
  flutter_local_notifications: ^17.0.0
  
  # Utilidades
  intl: ^0.19.0            # Fechas y formatos
  uuid: ^4.4.0             # Generacion de IDs
  json_annotation: ^4.9.0  # Serializacion
  
  # Almacenamiento seguro
  flutter_secure_storage: ^9.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  bloc_test: ^9.1.0
  mocktail: ^1.0.0
  drift_dev: ^2.18.0
  build_runner: ^2.4.0
  json_serializable: ^6.8.0
  flutter_lints: ^4.0.0
```
