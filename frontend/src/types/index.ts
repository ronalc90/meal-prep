export interface User {
  id: string;
  email: string;
  name: string;
  dietaryPreferences?: Record<string, unknown>;
  weeklyBudget?: number;
  createdAt?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
}

export type IngredientCategory =
  | 'PRODUCE'
  | 'DAIRY'
  | 'MEAT'
  | 'PANTRY'
  | 'FROZEN'
  | 'BAKERY'
  | 'BEVERAGES'
  | 'OTHER';

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories?: number;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: string;
  ingredients: RecipeIngredient[];
  user?: { id: string; name: string };
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface MealPlanItem {
  id: string;
  mealPlanId: string;
  recipeId: string;
  dayOfWeek: number;
  mealType: MealType;
  servings: number;
  recipe: Recipe;
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  createdAt: string;
  items: MealPlanItem[];
  shoppingList?: ShoppingList;
}

export interface ShoppingListItem {
  id: string;
  shoppingListId: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
  category: IngredientCategory;
  ingredient: Ingredient;
}

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  userId: string;
  createdAt: string;
  items: ShoppingListItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  currentWeek: {
    mealsPlanned: number;
    totalCalories: number;
    avgCaloriesPerDay: number;
    shoppingProgress: {
      total: number;
      checked: number;
      percentage: number;
    };
  };
  overall: {
    totalRecipes: number;
    totalMealPlans: number;
    popularRecipes: Array<{
      id: string;
      title: string;
      calories?: number;
      imageUrl?: string;
      usageCount: number;
    }>;
  };
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories?: number;
  imageUrl?: string;
  isPublic: boolean;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    category: IngredientCategory;
    notes?: string;
  }>;
}

export interface CreateMealPlanInput {
  weekStartDate: string;
  items?: Array<{
    recipeId: string;
    dayOfWeek: number;
    mealType: MealType;
    servings: number;
  }>;
}
