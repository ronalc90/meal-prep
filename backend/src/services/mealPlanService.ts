import { prisma } from '../utils/prisma';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors';
import type { CreateMealPlanInput, UpdateMealPlanInput } from '../types/schemas';

function getWeekStart(dateStr: string): Date {
  const date = new Date(dateStr);
  const day = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() - day);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  now.setUTCDate(now.getUTCDate() - day);
  now.setUTCHours(0, 0, 0, 0);
  return now;
}

function getMealPlanInclude() {
  return {
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
      orderBy: [
        { dayOfWeek: 'asc' as const },
        { mealType: 'asc' as const },
      ],
    },
    shoppingList: true,
  };
}

export async function getCurrentMealPlan(userId: string) {
  const weekStart = getCurrentWeekStart();

  const mealPlan = await prisma.mealPlan.findUnique({
    where: {
      userId_weekStartDate: { userId, weekStartDate: weekStart },
    },
    include: getMealPlanInclude(),
  });

  return mealPlan;
}

export async function getMealPlanByWeek(userId: string, weekStartDate: string) {
  const weekStart = getWeekStart(weekStartDate);

  const mealPlan = await prisma.mealPlan.findUnique({
    where: {
      userId_weekStartDate: { userId, weekStartDate: weekStart },
    },
    include: getMealPlanInclude(),
  });

  return mealPlan;
}

export async function createMealPlan(input: CreateMealPlanInput, userId: string) {
  const weekStart = getWeekStart(input.weekStartDate);

  const existing = await prisma.mealPlan.findUnique({
    where: {
      userId_weekStartDate: { userId, weekStartDate: weekStart },
    },
  });

  if (existing) {
    throw new ConflictError('A meal plan already exists for this week');
  }

  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      weekStartDate: weekStart,
      items: input.items
        ? {
            create: input.items.map((item) => ({
              recipeId: item.recipeId,
              dayOfWeek: item.dayOfWeek,
              mealType: item.mealType,
              servings: item.servings,
            })),
          }
        : undefined,
    },
    include: getMealPlanInclude(),
  });

  return mealPlan;
}

export async function updateMealPlan(
  id: string,
  input: UpdateMealPlanInput,
  userId: string,
) {
  const existing = await prisma.mealPlan.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('MealPlan', id);
  }

  if (existing.userId !== userId) {
    throw new ForbiddenError('You can only update your own meal plans');
  }

  const mealPlan = await prisma.$transaction(async (tx) => {
    await tx.mealPlanItem.deleteMany({ where: { mealPlanId: id } });

    return tx.mealPlan.update({
      where: { id },
      data: {
        items: {
          create: input.items.map((item) => ({
            recipeId: item.recipeId,
            dayOfWeek: item.dayOfWeek,
            mealType: item.mealType,
            servings: item.servings,
          })),
        },
      },
      include: getMealPlanInclude(),
    });
  });

  return mealPlan;
}

export async function autoGenerateMealPlan(
  mealPlanId: string,
  userId: string,
  preferences?: {
    maxCaloriesPerDay?: number;
    mealsPerDay?: number;
    includeSnacks?: boolean;
  },
) {
  const mealPlan = await prisma.mealPlan.findUnique({ where: { id: mealPlanId } });

  if (!mealPlan) {
    throw new NotFoundError('MealPlan', mealPlanId);
  }

  if (mealPlan.userId !== userId) {
    throw new ForbiddenError('You can only modify your own meal plans');
  }

  const mealsPerDay = preferences?.mealsPerDay ?? 3;
  const includeSnacks = preferences?.includeSnacks ?? false;

  const where: Record<string, unknown> = {
    OR: [{ isPublic: true }, { userId }],
  };

  if (preferences?.maxCaloriesPerDay) {
    where.calories = { lte: Math.floor(preferences.maxCaloriesPerDay / mealsPerDay) };
  }

  const recipes = await prisma.recipe.findMany({
    where,
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  if (recipes.length === 0) {
    throw new NotFoundError('No recipes available for auto-generation');
  }

  const mealTypes: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'> = ['BREAKFAST', 'LUNCH', 'DINNER'];
  if (includeSnacks) {
    mealTypes.push('SNACK');
  }

  const selectedMealTypes = mealTypes.slice(0, mealsPerDay);

  const items: Array<{
    recipeId: string;
    dayOfWeek: number;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    servings: number;
  }> = [];

  for (let day = 0; day < 7; day++) {
    for (const mealType of selectedMealTypes) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      items.push({
        recipeId: randomRecipe.id,
        dayOfWeek: day,
        mealType,
        servings: 1,
      });
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.mealPlanItem.deleteMany({ where: { mealPlanId } });

    return tx.mealPlan.update({
      where: { id: mealPlanId },
      data: {
        items: {
          create: items,
        },
      },
      include: getMealPlanInclude(),
    });
  });

  return updated;
}
