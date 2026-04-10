import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { parsePagination, buildPaginatedResult, PaginatedResult } from '../utils/pagination';
import type { CreateRecipeInput, UpdateRecipeInput } from '../types/schemas';

type RecipeWithIngredients = Prisma.RecipeGetPayload<{
  include: {
    ingredients: {
      include: { ingredient: true };
    };
    user: { select: { id: true; name: true } };
  };
}>;

export async function listRecipes(
  query: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    maxPrepTime?: string;
    maxCalories?: string;
  },
  userId?: string,
): Promise<PaginatedResult<RecipeWithIngredients>> {
  const { page, limit } = parsePagination(query);

  const where: Prisma.RecipeWhereInput = {
    OR: [{ isPublic: true }, ...(userId ? [{ userId }] : [])],
  };

  if (query.search) {
    where.AND = [
      {
        OR: [
          { title: { contains: query.search,  } },
          { description: { contains: query.search,  } },
        ],
      },
    ];
  }

  if (query.maxPrepTime) {
    const maxTime = parseInt(query.maxPrepTime, 10);
    if (!isNaN(maxTime)) {
      where.prepTimeMinutes = { lte: maxTime };
    }
  }

  if (query.maxCalories) {
    const maxCal = parseInt(query.maxCalories, 10);
    if (!isNaN(maxCal)) {
      where.calories = { lte: maxCal };
    }
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.recipe.count({ where }),
  ]);

  return buildPaginatedResult(recipes, total, { page, limit });
}

export async function getRecipeById(id: string): Promise<RecipeWithIngredients> {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: { ingredient: true },
      },
      user: { select: { id: true, name: true } },
    },
  });

  if (!recipe) {
    throw new NotFoundError('Recipe', id);
  }

  return recipe;
}

export async function createRecipe(
  input: CreateRecipeInput,
  userId: string,
): Promise<RecipeWithIngredients> {
  const recipe = await prisma.$transaction(async (tx) => {
    const ingredientRecords = await Promise.all(
      input.ingredients.map(async (ing) => {
        if (ing.ingredientId) {
          const existing = await tx.ingredient.findUnique({
            where: { id: ing.ingredientId },
          });
          if (existing) return { id: existing.id, quantity: ing.quantity, unit: ing.unit, notes: ing.notes };
        }

        const upserted = await tx.ingredient.upsert({
          where: { name: ing.name.toLowerCase().trim() },
          update: {},
          create: {
            name: ing.name.toLowerCase().trim(),
            category: ing.category || 'OTHER',
            unit: ing.unit,
          },
        });

        return { id: upserted.id, quantity: ing.quantity, unit: ing.unit, notes: ing.notes };
      }),
    );

    return tx.recipe.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        servings: input.servings,
        prepTimeMinutes: input.prepTimeMinutes,
        cookTimeMinutes: input.cookTimeMinutes,
        calories: input.calories,
        imageUrl: input.imageUrl,
        isPublic: input.isPublic,
        ingredients: {
          create: ingredientRecords.map((ing) => ({
            ingredientId: ing.id,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
          })),
        },
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        user: { select: { id: true, name: true } },
      },
    });
  });

  return recipe;
}

export async function updateRecipe(
  id: string,
  input: UpdateRecipeInput,
  userId: string,
): Promise<RecipeWithIngredients> {
  const existing = await prisma.recipe.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Recipe', id);
  }

  if (existing.userId && existing.userId !== userId) {
    throw new ForbiddenError('You can only update your own recipes');
  }

  const recipe = await prisma.$transaction(async (tx) => {
    if (input.ingredients) {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });

      const ingredientRecords = await Promise.all(
        input.ingredients.map(async (ing) => {
          const upserted = await tx.ingredient.upsert({
            where: { name: ing.name.toLowerCase().trim() },
            update: {},
            create: {
              name: ing.name.toLowerCase().trim(),
              category: ing.category || 'OTHER',
              unit: ing.unit,
            },
          });
          return { id: upserted.id, quantity: ing.quantity, unit: ing.unit, notes: ing.notes };
        }),
      );

      await tx.recipeIngredient.createMany({
        data: ingredientRecords.map((ing) => ({
          recipeId: id,
          ingredientId: ing.id,
          quantity: ing.quantity,
          unit: ing.unit,
          notes: ing.notes,
        })),
      });
    }

    return tx.recipe.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.servings !== undefined && { servings: input.servings }),
        ...(input.prepTimeMinutes !== undefined && { prepTimeMinutes: input.prepTimeMinutes }),
        ...(input.cookTimeMinutes !== undefined && { cookTimeMinutes: input.cookTimeMinutes }),
        ...(input.calories !== undefined && { calories: input.calories }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        user: { select: { id: true, name: true } },
      },
    });
  });

  return recipe;
}

export async function deleteRecipe(id: string, userId: string): Promise<void> {
  const existing = await prisma.recipe.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Recipe', id);
  }

  if (existing.userId && existing.userId !== userId) {
    throw new ForbiddenError('You can only delete your own recipes');
  }

  await prisma.recipe.delete({ where: { id } });
}
