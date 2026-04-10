import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { mealPlansApi, shoppingListsApi } from '../services/api';
import type { MealPlan, ShoppingList } from '../types';

interface MealPlanContextValue {
  currentPlan: MealPlan | null;
  shoppingList: ShoppingList | null;
  isLoading: boolean;
  error: string | null;
  fetchCurrentPlan: () => Promise<void>;
  fetchPlanByWeek: (weekStart: string) => Promise<void>;
  createPlan: (weekStartDate: string) => Promise<MealPlan>;
  updatePlan: (id: string, items: MealPlan['items']) => Promise<void>;
  autoGenerate: (id: string) => Promise<void>;
  generateShoppingList: (mealPlanId: string) => Promise<void>;
  toggleShoppingItem: (listId: string, itemId: string, isChecked: boolean) => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = (await mealPlansApi.getCurrent()) as MealPlan | null;
      setCurrentPlan(plan);
      if (plan?.shoppingList) {
        setShoppingList(plan.shoppingList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlanByWeek = useCallback(async (weekStart: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = (await mealPlansApi.getByWeek(weekStart)) as MealPlan | null;
      setCurrentPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (weekStartDate: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = (await mealPlansApi.create({ weekStartDate })) as MealPlan;
      setCurrentPlan(plan);
      return plan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create meal plan';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (id: string, items: MealPlan['items']) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = (await mealPlansApi.update(id, {
        items: items.map((item) => ({
          recipeId: item.recipeId,
          dayOfWeek: item.dayOfWeek,
          mealType: item.mealType,
          servings: item.servings,
        })),
      })) as MealPlan;
      setCurrentPlan(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const autoGenerate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = (await mealPlansApi.autoGenerate(id)) as MealPlan;
      setCurrentPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to auto-generate meals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateShoppingList = useCallback(async (mealPlanId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const list = (await shoppingListsApi.generate(mealPlanId)) as ShoppingList;
      setShoppingList(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate shopping list');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleShoppingItem = useCallback(
    async (listId: string, itemId: string, isChecked: boolean) => {
      try {
        await shoppingListsApi.toggleItem(listId, itemId, isChecked);
        setShoppingList((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? { ...item, isChecked } : item,
            ),
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update item');
      }
    },
    [],
  );

  return (
    <MealPlanContext.Provider
      value={{
        currentPlan,
        shoppingList,
        isLoading,
        error,
        fetchCurrentPlan,
        fetchPlanByWeek,
        createPlan,
        updatePlan,
        autoGenerate,
        generateShoppingList,
        toggleShoppingItem,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan(): MealPlanContextValue {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
