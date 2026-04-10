# Algoritmo de Lista de Compras

## Resumen

El algoritmo toma un plan de comidas semanal y genera una lista de compras optimizada en 6 pasos:

1. Recoleccion de ingredientes
2. Escalado por porciones
3. Normalizacion de unidades
4. Agregacion por ingrediente
5. Formato legible
6. Agrupacion por categoria

## Pipeline

```
Plan Semanal → Recolectar → Escalar → Normalizar → Agregar → Formatear → Agrupar → Lista
```

## Conversion de Unidades

### Volumen (base: ml)

| Unidad | Factor |
|--------|--------|
| tsp | 4.929 |
| tbsp | 14.787 |
| cup | 236.588 |
| fl oz | 29.574 |
| L | 1000 |

### Peso (base: g)

| Unidad | Factor |
|--------|--------|
| oz | 28.3495 |
| lb | 453.592 |
| kg | 1000 |

### Sin conversion

Unidades como `unit`, `bunch`, `slices`, `stalks`, `scoop`, `leaves` se mantienen sin convertir.

## Escalado

```
multiplicador = porciones_solicitadas / porciones_receta
cantidad_escalada = cantidad_original * multiplicador
```

## Agregacion

Se usa un `Map<ingredientId, AggregatedIngredient>` para acumular cantidades:

- **Unidades compatibles** (ambas volumen o ambas peso): se suman en unidad base
- **Unidades incompatibles**: se suman las cantidades originales

## Formato de Salida

| Rango (ml) | Unidad |
|------------|--------|
| >= 1000 | L |
| >= 236 | cups |
| >= 14.5 | tbsp |
| < 14.5 | tsp |

| Rango (g) | Unidad |
|-----------|--------|
| >= 1000 | kg |
| < 1000 | g |

## Categorias (Pasillos del Supermercado)

PRODUCE, DAIRY, MEAT, PANTRY, FROZEN, BAKERY, BEVERAGES, OTHER

Los items se agrupan por categoria y se ordenan alfabeticamente.

## Archivos de Implementacion

- `backend/src/services/shoppingListService.ts` - Pipeline principal
- `backend/src/utils/unitConversion.ts` - Funciones de conversion

Para una explicacion detallada con ejemplos, ver [docs/SHOPPING-LIST-ALGORITHM.md](../SHOPPING-LIST-ALGORITHM.md).

## Autor

Ronald
