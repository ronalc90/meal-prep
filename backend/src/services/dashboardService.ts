import { prisma } from '../utils/prisma';

function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  now.setUTCDate(now.getUTCDate() - day);
  now.setUTCHours(0, 0, 0, 0);
  return now;
}

export async function getDashboardStats(userId: string) {
  const weekStart = getCurrentWeekStart();

  // Get current week's meal plan
  const currentMealPlan = await prisma.mealPlan.findUnique({
    where: {
      userId_weekStartDate: { userId, weekStartDate: weekStart },
    },
    include: {
      items: {
        include: {
          recipe: true,
        },
      },
      shoppingList: {
        include: {
          items: true,
        },
      },
    },
  });

  // Count meals planned this week
  const mealsPlannedThisWeek = currentMealPlan?.items.length ?? 0;

  // Calculate total calories this week
  const totalCaloriesThisWeek = currentMealPlan?.items.reduce((sum, item) => {
    return sum + (item.recipe.calories ?? 0) * item.servings;
  }, 0) ?? 0;

  // Calculate average calories per day
  const avgCaloriesPerDay = mealsPlannedThisWeek > 0
    ? Math.round(totalCaloriesThisWeek / 7)
    : 0;

  // Shopping list progress
  const shoppingListItems = currentMealPlan?.shoppingList?.items ?? [];
  const totalShoppingItems = shoppingListItems.length;
  const checkedItems = shoppingListItems.filter((item) => item.isChecked).length;

  // Get user's total recipe count
  const totalRecipes = await prisma.recipe.count({
    where: { userId },
  });

  // Get total meal plans
  const totalMealPlans = await prisma.mealPlan.count({
    where: { userId },
  });

  // Popular recipes (most used in meal plans)
  const popularRecipes = await prisma.mealPlanItem.groupBy({
    by: ['recipeId'],
    where: {
      mealPlan: { userId },
    },
    _count: { recipeId: true },
    orderBy: { _count: { recipeId: 'desc' } },
    take: 5,
  });

  const popularRecipeDetails = await prisma.recipe.findMany({
    where: {
      id: { in: popularRecipes.map((r) => r.recipeId) },
    },
    select: {
      id: true,
      title: true,
      calories: true,
      imageUrl: true,
    },
  });

  const popularRecipesWithCount = popularRecipes.map((pr) => ({
    ...popularRecipeDetails.find((r) => r.id === pr.recipeId),
    usageCount: pr._count.recipeId,
  }));

  return {
    currentWeek: {
      mealsPlanned: mealsPlannedThisWeek,
      totalCalories: totalCaloriesThisWeek,
      avgCaloriesPerDay,
      shoppingProgress: {
        total: totalShoppingItems,
        checked: checkedItems,
        percentage: totalShoppingItems > 0
          ? Math.round((checkedItems / totalShoppingItems) * 100)
          : 0,
      },
    },
    overall: {
      totalRecipes,
      totalMealPlans,
      popularRecipes: popularRecipesWithCount,
    },
  };
}
