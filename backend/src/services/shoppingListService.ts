
import { prisma } from '../utils/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { normalizeUnit, areUnitsCompatible, formatForDisplay } from '../utils/unitConversion';

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalQuantity: number;
  unit: string;
  category: string;
}

/**
 * Core shopping list generation algorithm:
 * 1. Fetch all meal plan items with their recipe ingredients
 * 2. Scale quantities by servings
 * 3. Group by ingredient
 * 4. Convert compatible units to a common base
 * 5. Sum quantities for the same ingredient
 * 6. Format quantities for display
 * 7. Group by supermarket aisle/category
 */
export async function generateShoppingList(mealPlanId: string, userId: string) {
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id: mealPlanId },
    include: {
      items: {
        include: {
          recipe: {
            include: {
              ingredients: {
                include: { ingredient: true },
              },
            },
          },
        },
      },
      shoppingList: true,
    },
  });

  if (!mealPlan) {
    throw new NotFoundError('MealPlan', mealPlanId);
  }

  if (mealPlan.userId !== userId) {
    throw new ForbiddenError('You can only generate shopping lists for your own meal plans');
  }

  // Delete existing shopping list if present
  if (mealPlan.shoppingList) {
    await prisma.shoppingList.delete({ where: { id: mealPlan.shoppingList.id } });
  }

  // Aggregate ingredients across all meals
  const aggregated = new Map<string, AggregatedIngredient>();

  for (const item of mealPlan.items) {
    const servingMultiplier = item.servings / (item.recipe.servings || 1);

    for (const recipeIngredient of item.recipe.ingredients) {
      const key = recipeIngredient.ingredientId;
      const scaledQuantity = recipeIngredient.quantity * servingMultiplier;
      const normalized = normalizeUnit(scaledQuantity, recipeIngredient.unit);

      if (aggregated.has(key)) {
        const existing = aggregated.get(key)!;
        const existingNormalized = normalizeUnit(existing.totalQuantity, existing.unit);

        if (areUnitsCompatible(existing.unit, normalized.unit)) {
          // Both in same system - add in base units
          const totalBase = existingNormalized.quantity + normalized.quantity;
          aggregated.set(key, {
            ...existing,
            totalQuantity: totalBase,
            unit: normalized.unit,
          });
        } else {
          // Different unit systems - keep the one with more quantity and note the other
          aggregated.set(key, {
            ...existing,
            totalQuantity: existing.totalQuantity + scaledQuantity,
          });
        }
      } else {
        aggregated.set(key, {
          ingredientId: key,
          name: recipeIngredient.ingredient.name,
          totalQuantity: normalized.quantity,
          unit: normalized.unit,
          category: recipeIngredient.ingredient.category,
        });
      }
    }
  }

  // Create shopping list with items
  const shoppingList = await prisma.shoppingList.create({
    data: {
      mealPlanId,
      userId,
      items: {
        create: Array.from(aggregated.values()).map((agg) => {
          const display = formatForDisplay(agg.totalQuantity, agg.unit);
          return {
            ingredientId: agg.ingredientId,
            quantity: display.quantity,
            unit: display.unit,
            isChecked: false,
            category: agg.category,
          };
        }),
      },
    },
    include: {
      items: {
        include: { ingredient: true },
        orderBy: { category: 'asc' },
      },
    },
  });

  return shoppingList;
}

export async function getShoppingList(mealPlanId: string, userId: string) {
  const shoppingList = await prisma.shoppingList.findUnique({
    where: { mealPlanId },
    include: {
      items: {
        include: { ingredient: true },
        orderBy: { category: 'asc' },
      },
    },
  });

  if (!shoppingList) {
    throw new NotFoundError('ShoppingList for MealPlan', mealPlanId);
  }

  if (shoppingList.userId !== userId) {
    throw new ForbiddenError('You can only view your own shopping lists');
  }

  return shoppingList;
}

export async function toggleItem(
  listId: string,
  itemId: string,
  isChecked: boolean,
  userId: string,
) {
  const shoppingList = await prisma.shoppingList.findUnique({
    where: { id: listId },
  });

  if (!shoppingList) {
    throw new NotFoundError('ShoppingList', listId);
  }

  if (shoppingList.userId !== userId) {
    throw new ForbiddenError('You can only modify your own shopping lists');
  }

  const item = await prisma.shoppingListItem.findFirst({
    where: { id: itemId, shoppingListId: listId },
  });

  if (!item) {
    throw new NotFoundError('ShoppingListItem', itemId);
  }

  return prisma.shoppingListItem.update({
    where: { id: itemId },
    data: { isChecked },
    include: { ingredient: true },
  });
}

export async function exportShoppingList(mealPlanId: string, userId: string): Promise<string> {
  const shoppingList = await getShoppingList(mealPlanId, userId);

  // Group items by category
  const grouped = new Map<string, typeof shoppingList.items>();

  for (const item of shoppingList.items) {
    const category = item.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(item);
  }

  let output = 'SHOPPING LIST\n';
  output += '=============\n\n';

  for (const [category, items] of grouped) {
    output += `--- ${category} ---\n`;
    for (const item of items) {
      const checked = item.isChecked ? '[x]' : '[ ]';
      output += `${checked} ${item.ingredient.name}: ${item.quantity} ${item.unit}\n`;
    }
    output += '\n';
  }

  return output;
}
