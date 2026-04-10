# MealPrep - Alcance del MVP

**Autor:** Ronald

---

## Resumen del MVP

El MVP de MealPrep cubre el flujo completo: registrarse, planificar la semana, explorar recetas, generar la lista de compras y marcar items comprados. Se omiten intencionalmente las funcionalidades de costo, sobrantes, compartir y recetas personalizadas para la primera version.

**Duracion estimada:** 10 sprints de 1 semana cada uno.

---

## Desglose por Sprint

### Sprint 1 - Fundamentos y Autenticacion
**Objetivo:** Proyecto base funcional con registro/login.

- Inicializar proyecto Flutter con estructura BLoC
- Configurar Supabase (proyecto, tablas iniciales, RLS basico)
- Pantalla de onboarding (3 slides explicativos)
- Registro con email y contrasena
- Login con email y contrasena
- Login con Google (OAuth via Supabase)
- Pantalla de perfil basico (nombre, email)
- Navegacion principal (bottom navigation bar)
- Configurar CI basico con GitHub Actions (lint + tests)

**Entregable:** Usuario puede registrarse, iniciar sesion y ver pantalla principal vacia.

---

### Sprint 2 - Modelo de Datos y Recetas
**Objetivo:** Base de datos completa y primera integracion con Spoonacular.

- Crear esquema completo en Supabase (ver seccion de DB)
- Configurar Row Level Security para todas las tablas
- Integrar Spoonacular API (busqueda de recetas)
- Pantalla de exploracion de recetas con grid de tarjetas
- Busqueda de recetas por nombre
- Pantalla de detalle de receta (ingredientes, pasos, tiempo, dificultad)
- Cache de recetas consultadas en SQLite local
- Edge Function para proxy de Spoonacular (ocultar API key)

**Entregable:** Usuario puede buscar y ver recetas desde Spoonacular.

---

### Sprint 3 - Filtros y Preferencias
**Objetivo:** Personalizar la experiencia segun dieta y gustos.

- Pantalla de preferencias alimentarias en perfil
- Filtros: vegetariano, vegano, sin gluten, sin lactosa
- Registro de alergias (frutos secos, mariscos, huevo, etc.)
- Ingredientes excluidos (lista personalizable)
- Aplicar filtros a la busqueda de recetas en Spoonacular
- Filtro por tiempo de preparacion (menos de 15, 30, 60 min)
- Filtro por dificultad (facil, media, dificil)
- Persistir preferencias en Supabase

**Entregable:** Las recetas mostradas respetan las preferencias del usuario.

---

### Sprint 4 - Planificacion Semanal (Core)
**Objetivo:** Funcionalidad central -- el calendario semanal de comidas.

- Pantalla de calendario semanal (vista de 7 dias)
- Slots por dia: desayuno, almuerzo, cena, snack
- Agregar receta a un slot (seleccionar desde busqueda)
- Eliminar receta de un slot
- Navegacion entre semanas (anterior/siguiente)
- Crear registro meal_plan en Supabase al iniciar semana
- Crear registros meal_plan_items al asignar recetas
- Indicador visual de dias completos vs incompletos
- Numero de porciones por slot (default: 1)

**Entregable:** Usuario puede armar su plan semanal completo.

---

### Sprint 5 - Drag-and-Drop y UX del Calendario
**Objetivo:** Mejorar la experiencia de planificacion.

- Drag-and-drop de recetas entre slots y dias
- Copiar comida de un dia a otro (long press menu)
- Sugerencias rapidas al agregar comida (basadas en favoritos)
- "Rellenar semana" automatico con recetas aleatorias filtradas
- Vista compacta vs vista detallada del calendario
- Animaciones de transicion suaves
- Indicador de calorias totales del dia (basico, solo si Spoonacular provee datos)
- Guardar como plantilla de semana

**Entregable:** Experiencia fluida y rapida para planificar la semana.

---

### Sprint 6 - Lista de Compras Automatica
**Objetivo:** Generar lista de compras inteligente a partir del plan.

- Boton "Generar lista de compras" desde el plan semanal
- Edge Function: agregar ingredientes de todas las recetas del plan
- Algoritmo de agregacion: combinar cantidades del mismo ingrediente
- Conversion de unidades (200g + 0.5kg = 700g)
- Agrupar items por categoria/pasillo del supermercado
- Pantalla de lista de compras con secciones colapsables
- Marcar items como comprados (checkbox con animacion)
- Progreso de compra (X de Y items completados)
- Guardar estado de la lista en Supabase

**Entregable:** Lista de compras funcional generada automaticamente.

---

### Sprint 7 - Recetas Favoritas y Mejoras de Lista
**Objetivo:** Sistema de favoritos y refinamiento de la lista de compras.

- Boton de favorito en tarjeta y detalle de receta
- Pantalla de "Mis Favoritos" con grid de recetas guardadas
- Editar items de la lista de compras (cambiar cantidad, eliminar)
- Agregar items manuales a la lista de compras
- Reordenar items dentro de una seccion
- Desmarcar todos los items (reiniciar lista)
- Historial de listas de compras anteriores
- Indicador de items nuevos vs recurrentes

**Entregable:** Favoritos funcionales y lista de compras refinada.

---

### Sprint 8 - Offline y Sincronizacion
**Objetivo:** La app funciona sin conexion a internet.

- Configurar SQLite local con drift (esquema espejo)
- Sincronizacion bidireccional: local <-> Supabase
- Cache de recetas favoritas para acceso offline
- Plan semanal disponible offline
- Lista de compras disponible y editable offline
- Cola de operaciones pendientes (sync cuando haya red)
- Indicador visual de estado de conexion
- Manejo de conflictos de sincronizacion (last-write-wins)

**Entregable:** Funcionalidad core disponible sin internet.

---

### Sprint 9 - Notificaciones y Polish
**Objetivo:** Recordatorios y pulir la experiencia general.

- Integrar Firebase Cloud Messaging
- Notificacion: "Es hora de preparar [comida]" (configurable)
- Notificacion: "No has planificado la semana" (lunes AM)
- Notificacion: "No olvides ir al supermercado" (dia configurable)
- Pantalla de configuracion de notificaciones
- Pulir todas las pantallas (consistencia visual, spacing)
- Manejar estados vacios con ilustraciones
- Manejar estados de error con mensajes claros
- Loading skeletons en todas las listas
- Splash screen y app icon

**Entregable:** App pulida con notificaciones funcionales.

---

### Sprint 10 - Testing, QA y Preparacion de Release
**Objetivo:** App lista para publicar en stores.

- Tests unitarios para BLoCs principales
- Tests unitarios para algoritmo de agregacion de lista
- Tests de integracion para flujos criticos (plan -> lista)
- Tests de widget para pantallas principales
- QA manual completo (checklist de flujos)
- Configurar Fastlane para iOS y Android
- Generar screenshots para store listings
- Escribir descripcion y metadata para App Store y Play Store
- Configurar analytics basico (eventos clave)
- Build de release y subir a TestFlight / Play Console internal track

**Entregable:** App lista para publicar en tiendas.

---

## Esquema de Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    dietary_preferences JSONB DEFAULT '{}',
    -- Ejemplo: {"vegetarian": false, "vegan": false, "gluten_free": true}
    allergies TEXT[] DEFAULT '{}',
    excluded_ingredients TEXT[] DEFAULT '{}',
    default_servings INTEGER DEFAULT 1,
    notification_settings JSONB DEFAULT '{}',
    timezone TEXT DEFAULT 'America/Santiago',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: recipes
```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spoonacular_id INTEGER UNIQUE,
    -- NULL si es receta custom
    user_id UUID REFERENCES users(id),
    -- NULL si es de Spoonacular
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    total_time_minutes INTEGER,
    servings INTEGER DEFAULT 1,
    difficulty TEXT CHECK (difficulty IN ('facil', 'media', 'dificil')),
    meal_type TEXT[] DEFAULT '{}',
    -- {'desayuno', 'almuerzo', 'cena', 'snack'}
    tags TEXT[] DEFAULT '{}',
    instructions JSONB,
    -- Array de pasos: [{"step": 1, "text": "..."}]
    nutrition_info JSONB,
    -- {"calories": 350, "protein": 25, ...}
    estimated_cost DECIMAL(10,2),
    source_url TEXT,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: ingredients
```sql
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spoonacular_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    category TEXT,
    -- 'frutas_verduras', 'carnes', 'lacteos', 'panaderia',
    -- 'granos_cereales', 'condimentos', 'enlatados', 'congelados',
    -- 'bebidas', 'limpieza', 'otros'
    default_unit TEXT,
    -- 'g', 'kg', 'ml', 'l', 'unidad', 'taza', 'cucharada'
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: recipe_ingredients
```sql
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit TEXT NOT NULL,
    notes TEXT,
    -- 'picado', 'sin piel', 'a temperatura ambiente'
    is_optional BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: meal_plans
```sql
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    -- Siempre un lunes
    name TEXT,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, week_start_date)
);
```

### Tabla: meal_plan_items
```sql
CREATE TABLE meal_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    -- 0 = lunes, 6 = domingo
    meal_type TEXT NOT NULL CHECK (meal_type IN ('desayuno', 'almuerzo', 'cena', 'snack')),
    servings INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(meal_plan_id, day_of_week, meal_type, sort_order)
);
```

### Tabla: shopping_lists
```sql
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_plan_id UUID REFERENCES meal_plans(id),
    name TEXT,
    status TEXT DEFAULT 'activa' CHECK (status IN ('activa', 'completada', 'archivada')),
    completed_items_count INTEGER DEFAULT 0,
    total_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: shopping_list_items
```sql
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id),
    name TEXT NOT NULL,
    -- Nombre legible, puede ser manual
    quantity DECIMAL(10,3),
    unit TEXT,
    category TEXT,
    -- Pasillo del supermercado
    is_checked BOOLEAN DEFAULT false,
    is_manual BOOLEAN DEFAULT false,
    -- true si el usuario lo agrego manualmente
    sort_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: user_favorites
```sql
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, recipe_id)
);
```

### Diagrama de Relaciones

```
users
  |--- 1:N --- meal_plans
  |               |--- 1:N --- meal_plan_items --- N:1 --- recipes
  |
  |--- 1:N --- shopping_lists
  |               |--- 1:N --- shopping_list_items --- N:1 --- ingredients
  |
  |--- 1:N --- user_favorites --- N:1 --- recipes
  |
  recipes
    |--- 1:N --- recipe_ingredients --- N:1 --- ingredients
```

---

## Endpoints de la API (Supabase Edge Functions)

### Autenticacion (via Supabase Auth nativo)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/auth/signup` | Registro con email |
| POST | `/auth/signin` | Login con email |
| POST | `/auth/oauth/google` | Login con Google |
| POST | `/auth/signout` | Cerrar sesion |
| POST | `/auth/reset-password` | Solicitar reset de contrasena |

### Perfil de Usuario
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/users/me` | Obtener perfil del usuario actual |
| PATCH | `/users/me` | Actualizar perfil |
| PATCH | `/users/me/preferences` | Actualizar preferencias alimentarias |
| PATCH | `/users/me/notifications` | Actualizar configuracion de notificaciones |

### Recetas
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/recipes/search?q=&filters=` | Buscar recetas (proxy Spoonacular) |
| GET | `/recipes/:id` | Detalle de receta |
| GET | `/recipes/suggestions` | Sugerencias basadas en preferencias |
| POST | `/recipes/favorites` | Agregar a favoritos |
| DELETE | `/recipes/favorites/:recipe_id` | Eliminar de favoritos |
| GET | `/recipes/favorites` | Listar favoritos |

### Plan Semanal
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/meal-plans?week=2026-04-06` | Obtener plan de la semana |
| POST | `/meal-plans` | Crear plan semanal |
| POST | `/meal-plans/:id/items` | Agregar receta al plan |
| PATCH | `/meal-plans/:id/items/:item_id` | Mover/editar item del plan |
| DELETE | `/meal-plans/:id/items/:item_id` | Eliminar item del plan |
| POST | `/meal-plans/:id/auto-fill` | Rellenar semana automaticamente |
| POST | `/meal-plans/:id/save-template` | Guardar como plantilla |

### Lista de Compras
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/shopping-lists/generate` | Generar lista desde plan semanal |
| GET | `/shopping-lists/:id` | Obtener lista de compras |
| PATCH | `/shopping-lists/:id/items/:item_id` | Actualizar item (check/uncheck, cantidad) |
| POST | `/shopping-lists/:id/items` | Agregar item manual |
| DELETE | `/shopping-lists/:id/items/:item_id` | Eliminar item |
| POST | `/shopping-lists/:id/reset` | Reiniciar todos los checks |
| GET | `/shopping-lists/history` | Historial de listas |

---

## Pantallas de la App

### 1. Onboarding (3 pantallas)
- **Slide 1:** "Planifica tu semana en minutos" -- Ilustracion de calendario con comidas
- **Slide 2:** "Lista de compras automatica" -- Ilustracion de lista organizada
- **Slide 3:** "Ahorra dinero, come mejor" -- Ilustracion de alcancia + plato saludable
- Boton "Comenzar" que lleva a registro

### 2. Registro / Login
- Formulario email + contrasena
- Boton "Continuar con Google"
- Link "Ya tengo cuenta" / "Crear cuenta"
- Validacion en tiempo real de campos

### 3. Configuracion Inicial (post-registro)
- Seleccion de preferencias alimentarias (chips seleccionables)
- Numero de personas en el hogar
- Alergias (multiselect)
- Boton "Empezar a planificar"

### 4. Pantalla Principal - Plan Semanal
- Header con semana actual y flechas de navegacion
- 7 columnas (L-D) en scroll horizontal
- Cada columna: 4 slots (desayuno, almuerzo, cena, snack)
- Slot vacio: icono "+" para agregar
- Slot con receta: thumbnail + nombre truncado
- Tap en slot: detalle rapido con opcion de cambiar/eliminar
- Long press: activar drag-and-drop
- FAB: "Generar lista de compras"
- Bottom Nav: Plan | Recetas | Lista | Perfil

### 5. Explorar Recetas
- Barra de busqueda en la parte superior
- Filtros activos como chips debajo de la busqueda
- Boton de filtros avanzados (bottom sheet)
- Grid de tarjetas de recetas (2 columnas)
- Cada tarjeta: imagen, titulo, tiempo, dificultad, corazon de favorito
- Pull to refresh
- Paginacion infinita con scroll

### 6. Detalle de Receta
- Imagen hero con gradiente y titulo
- Badges: tiempo, dificultad, porciones
- Tabs: Ingredientes | Preparacion
- Tab Ingredientes: lista con cantidades, selector de porciones
- Tab Preparacion: pasos numerados con checkbox
- Boton "Agregar al plan" (bottom sheet para seleccionar dia y slot)
- Boton corazon para favoritos

### 7. Lista de Compras
- Header con nombre de la lista y progreso (X/Y items)
- Secciones colapsables por pasillo (Frutas y Verduras, Carnes, etc.)
- Cada item: checkbox + nombre + cantidad + unidad
- Swipe left para eliminar
- Items checked se mueven al fondo con estilo tachado
- Boton "+" para agregar item manual
- Menu: Reiniciar, Historial, Compartir (Fase 2)

### 8. Perfil y Configuracion
- Avatar, nombre, email
- Seccion "Preferencias alimentarias"
- Seccion "Alergias e ingredientes excluidos"
- Seccion "Notificaciones"
- Seccion "Sobre MealPrep"
- Boton "Cerrar sesion"

---

## Matriz de Prioridades (MoSCoW)

### Must Have (Sprint 1-6)
- Registro e inicio de sesion (email + Google)
- Busqueda y visualizacion de recetas
- Calendario semanal con CRUD de comidas
- Lista de compras automatica con agrupacion
- Preferencias alimentarias basicas
- Almacenamiento en Supabase con RLS

### Should Have (Sprint 7-10)
- Drag-and-drop de comidas
- Favoritos
- Soporte offline con SQLite
- Notificaciones push
- Edicion manual de lista de compras
- Historial de listas
- Plantillas de semana

### Could Have (Post-MVP, Fase 2)
- Recetas personalizadas con foto
- Control de costos y presupuesto
- Porciones familiares escalables
- Compartir lista de compras
- Sugerencias de recetas con sobrantes
- Informacion nutricional detallada

### Won't Have (Fase 3+)
- Integracion con delivery de supermercados
- Recetas patrocinadas
- Comunidad y recetas compartidas
- Planificacion mensual
- Escaneo de tickets de compra
- Modo familiar colaborativo

---

## Criterios de Exito del MVP

1. **Funcional:** Un usuario puede registrarse, armar un plan semanal de 7 dias y generar una lista de compras organizada.
2. **Rendimiento:** La app carga en menos de 3 segundos, las busquedas responden en menos de 2 segundos.
3. **Calidad:** Cero crashes criticos en flujos principales. Rating interno de QA mayor a 8/10.
4. **Usabilidad:** Un usuario nuevo puede completar su primer plan semanal sin ayuda en menos de 5 minutos.
5. **Tecnico:** Cobertura de tests mayor al 60% en logica de negocio. Pipeline de CI/CD funcional.
