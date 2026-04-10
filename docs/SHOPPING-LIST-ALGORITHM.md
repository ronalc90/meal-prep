# Algoritmo de Lista de Compras

## Resumen

El algoritmo de generacion de listas de compras es la funcionalidad central de MealPrep. Toma un plan de comidas semanal y produce una lista de compras optimizada con ingredientes agregados, unidades convertidas y items agrupados por pasillo del supermercado.

## Pipeline de Procesamiento

```
Plan Semanal (MealPlan)
    │
    ▼
┌──────────────────────────┐
│ 1. RECOLECCION           │  Extraer todos los ingredientes
│    de todas las recetas   │  de todos los items del plan
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 2. ESCALADO              │  Ajustar cantidades segun
│    por porciones          │  las porciones solicitadas
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 3. NORMALIZACION         │  Convertir a unidad base
│    de unidades            │  (ml para volumen, g para peso)
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 4. AGREGACION            │  Agrupar por ingrediente
│    por ingrediente        │  y sumar cantidades
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 5. FORMATO LEGIBLE       │  Convertir de base a
│    para display           │  unidades practicas
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ 6. AGRUPACION            │  Organizar por categoria
│    por categoria          │  de supermercado
└──────────┬───────────────┘
           │
           ▼
    Lista de Compras (ShoppingList)
```

---

## Paso 1: Recoleccion

El algoritmo comienza cargando el plan de comidas con todas sus relaciones:

```
MealPlan
  └── items[]
       └── recipe
            └── ingredients[]
                 └── ingredient (nombre, categoria)
```

Cada `MealPlanItem` tiene una receta con sus ingredientes. Cada ingrediente tiene una cantidad, unidad y referencia al ingrediente maestro.

---

## Paso 2: Escalado por Porciones

Para cada item del plan, se calcula un multiplicador de porciones:

```
servingMultiplier = item.servings / recipe.servings
scaledQuantity = recipeIngredient.quantity * servingMultiplier
```

**Ejemplo**: Si una receta es para 4 porciones pero el usuario solo quiere 2:
- Multiplicador: `2 / 4 = 0.5`
- 400g de pollo se convierte en 200g

---

## Paso 3: Normalizacion de Unidades

Cada cantidad escalada se normaliza a su unidad base usando el modulo `unitConversion.ts`.

### Tabla de Conversiones - Volumen (base: ml)

| Unidad | Factor |
|--------|--------|
| ml, milliliter(s) | 1 |
| L, liter(s) | 1000 |
| tsp, teaspoon(s) | 4.929 |
| tbsp, tablespoon(s) | 14.787 |
| cup(s) | 236.588 |
| fl oz, fluid ounce(s) | 29.574 |

### Tabla de Conversiones - Peso (base: g)

| Unidad | Factor |
|--------|--------|
| g, gram(s) | 1 |
| kg, kilogram(s) | 1000 |
| oz, ounce(s) | 28.3495 |
| lb(s), pound(s) | 453.592 |

### Unidades sin conversion

Las unidades que no pertenecen a volumen ni peso se mantienen tal cual:
- `unit` (unidad individual: huevos, limones, cebollas)
- `bunch` (manojo: cilantro, perejil)
- `slices` (rebanadas: pan, tocino)
- `stalks` (tallos: apio, cebolla verde)
- `scoop` (medida: proteina en polvo)
- `leaves` (hojas: lechuga)

---

## Paso 4: Agregacion por Ingrediente

Los ingredientes se agrupan usando su `ingredientId` como clave en un `Map`:

```
Map<ingredientId, AggregatedIngredient>
```

### Logica de Combinacion

Para cada ingrediente encontrado:

1. **Primera aparicion**: Se agrega al mapa con su cantidad normalizada
2. **Apariciones posteriores**:
   - Si las unidades son **compatibles** (ambas volumen o ambas peso): se suman las cantidades en unidades base
   - Si las unidades son **incompatibles** (ej: gramos vs unidades): se suman las cantidades originales sin conversion

### Verificacion de Compatibilidad

Dos unidades son compatibles si:
- Son exactamente iguales, o
- Ambas pertenecen al sistema de **volumen** (tsp, tbsp, cup, ml, L, fl oz), o
- Ambas pertenecen al sistema de **peso** (g, kg, oz, lb)

**Ejemplo de agregacion**:
```
Receta A: 2 cups de leche (= 473.18 ml)
Receta B: 250 ml de leche
─────────────────────────────────
Total: 723.18 ml → 3.1 cups (formateado)
```

**Ejemplo con unidades incompatibles**:
```
Receta A: 3 unit de huevo
Receta B: 4 unit de huevo
─────────────────────────────────
Total: 7 unit de huevo (suma directa)
```

---

## Paso 5: Formato Legible

Las cantidades en unidades base se convierten a unidades practicas para el usuario:

### Volumen (desde ml)

| Rango | Unidad resultante | Ejemplo |
|-------|-------------------|---------|
| >= 1000 ml | L (litros) | 1500 ml -> 1.5 L |
| >= 236 ml | cups (tazas) | 473 ml -> 2 cups |
| >= 14.5 ml | tbsp (cucharadas) | 30 ml -> 2 tbsp |
| < 14.5 ml | tsp (cucharaditas) | 5 ml -> 1 tsp |

### Peso (desde g)

| Rango | Unidad resultante | Ejemplo |
|-------|-------------------|---------|
| >= 1000 g | kg (kilogramos) | 1500 g -> 1.5 kg |
| < 1000 g | g (gramos) | 400 g -> 400 g |

### Precision

- Litros y kg: redondeados a 2 decimales
- Cups, tbsp, tsp, g: redondeados a 1 decimal
- Otras unidades: redondeadas a 2 decimales

---

## Paso 6: Agrupacion por Categoria

Los items finales se agrupan por la categoria del ingrediente, que corresponde a un pasillo del supermercado:

| Categoria | Ejemplos |
|-----------|----------|
| `PRODUCE` | Frutas, verduras, hierbas frescas |
| `DAIRY` | Leche, queso, yogurt, huevos, mantequilla |
| `MEAT` | Pollo, res, cerdo, pescado, mariscos |
| `PANTRY` | Arroz, pasta, aceite, especias, enlatados |
| `FROZEN` | Verduras congeladas, hielo |
| `BAKERY` | Pan, tortillas |
| `BEVERAGES` | Vino, jugos |
| `OTHER` | Ingredientes sin categoria asignada |

La lista final se ordena alfabeticamente por categoria.

---

## Ejemplo Completo

### Entrada: Plan semanal

```
Lunes - Almuerzo: Chicken Caesar Salad (2 porciones, receta para 2)
Martes - Cena: Spaghetti Bolognese (2 porciones, receta para 4)
Miercoles - Almuerzo: Chicken Caesar Salad (1 porcion, receta para 2)
```

### Paso a paso

**Recoleccion + Escalado**:

| Ingrediente | Fuente | Cantidad original | Multiplicador | Cantidad escalada |
|-------------|--------|-------------------|---------------|-------------------|
| chicken breast | Lunes | 400g | 2/2 = 1 | 400g |
| chicken breast | Miercoles | 400g | 1/2 = 0.5 | 200g |
| romaine lettuce | Lunes | 1 unit | 1 | 1 unit |
| romaine lettuce | Miercoles | 1 unit | 0.5 | 0.5 unit |
| parmesan cheese | Lunes | 50g | 1 | 50g |
| parmesan cheese | Martes | 50g | 0.5 | 25g |
| spaghetti | Martes | 400g | 0.5 | 200g |
| ground beef | Martes | 500g | 0.5 | 250g |
| canned tomatoes | Martes | 400g | 0.5 | 200g |

**Normalizacion**: g ya es la unidad base, unit se mantiene.

**Agregacion**:

| Ingrediente | Total | Unidad |
|-------------|-------|--------|
| chicken breast | 600 | g |
| romaine lettuce | 1.5 | unit |
| parmesan cheese | 75 | g |
| spaghetti | 200 | g |
| ground beef | 250 | g |
| canned tomatoes | 200 | g |

**Formato legible**: Todas las cantidades estan bajo 1000g, se mantienen en gramos.

**Agrupacion por categoria**:

```
--- DAIRY ---
[ ] parmesan cheese: 75 g

--- MEAT ---
[ ] chicken breast: 600 g
[ ] ground beef: 250 g

--- PANTRY ---
[ ] canned tomatoes: 200 g
[ ] spaghetti: 200 g

--- PRODUCE ---
[ ] romaine lettuce: 1.5 unit
```

---

## Implementacion

El algoritmo esta implementado en dos archivos:

- `backend/src/services/shoppingListService.ts` - Orquestacion del pipeline
- `backend/src/utils/unitConversion.ts` - Funciones de conversion de unidades

### Funciones clave

| Funcion | Archivo | Descripcion |
|---------|---------|-------------|
| `generateShoppingList()` | shoppingListService.ts | Orquesta todo el pipeline |
| `normalizeUnit()` | unitConversion.ts | Convierte a unidad base |
| `areUnitsCompatible()` | unitConversion.ts | Verifica compatibilidad de unidades |
| `formatForDisplay()` | unitConversion.ts | Convierte de base a unidad legible |

---

## Autor

Ronald
