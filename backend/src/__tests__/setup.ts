import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean the database before running tests
  await prisma.$transaction([
    prisma.shoppingListItem.deleteMany(),
    prisma.shoppingList.deleteMany(),
    prisma.mealPlanItem.deleteMany(),
    prisma.mealPlan.deleteMany(),
    prisma.recipeIngredient.deleteMany(),
    prisma.recipe.deleteMany(),
    prisma.ingredient.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
