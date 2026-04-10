import { z } from 'zod';

// ========== Auth ==========
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ========== Recipe ==========
export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  servings: z.number().int().positive().default(4),
  prepTimeMinutes: z.number().int().min(0).default(0),
  cookTimeMinutes: z.number().int().min(0).default(0),
  calories: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().uuid().optional(),
      name: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.string().min(1),
      category: z.enum([
        'PRODUCE', 'DAIRY', 'MEAT', 'PANTRY', 'FROZEN', 'BAKERY', 'BEVERAGES', 'OTHER',
      ]).default('OTHER'),
      notes: z.string().optional(),
    }),
  ).min(1, 'At least one ingredient is required'),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  maxPrepTime: z.string().optional(),
  maxCalories: z.string().optional(),
});

// ========== Meal Plan ==========
export const createMealPlanSchema = z.object({
  weekStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  items: z.array(
    z.object({
      recipeId: z.string().uuid(),
      dayOfWeek: z.number().int().min(0).max(6),
      mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
      servings: z.number().int().positive().default(1),
    }),
  ).optional(),
});

export const updateMealPlanSchema = z.object({
  items: z.array(
    z.object({
      recipeId: z.string().uuid(),
      dayOfWeek: z.number().int().min(0).max(6),
      mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
      servings: z.number().int().positive().default(1),
    }),
  ),
});

export const autoGenerateSchema = z.object({
  preferences: z
    .object({
      maxCaloriesPerDay: z.number().positive().optional(),
      mealsPerDay: z.number().int().min(1).max(4).default(3),
      includeSnacks: z.boolean().default(false),
    })
    .optional(),
});

// ========== Shopping List ==========
export const generateShoppingListSchema = z.object({
  mealPlanId: z.string().uuid(),
});

export const toggleItemSchema = z.object({
  isChecked: z.boolean(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;
export type AutoGenerateInput = z.infer<typeof autoGenerateSchema>;
export type GenerateShoppingListInput = z.infer<typeof generateShoppingListSchema>;
export type ToggleItemInput = z.infer<typeof toggleItemSchema>;
