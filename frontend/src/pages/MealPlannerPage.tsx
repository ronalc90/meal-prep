import { useEffect, useState, useCallback } from 'react';
import { recipesApi } from '../services/api';
import { useMealPlan } from '../context/MealPlanContext';
import WeeklyCalendar from '../components/WeeklyCalendar';
import RecipeCard from '../components/RecipeCard';
import type { Recipe, MealType, MealPlanItem, PaginatedResponse } from '../types';

function getWeekStartDate(offset = 0): string {
  const now = new Date();
  const day = now.getDay();
  now.setDate(now.getDate() - day + offset * 7);
  return now.toISOString().split('T')[0]!;
}

export default function MealPlannerPage() {
  const {
    currentPlan,
    isLoading,
    error,
    fetchCurrentPlan,
    fetchPlanByWeek,
    createPlan,
    updatePlan,
    autoGenerate,
  } = useMealPlan();

  const [weekOffset, setWeekOffset] = useState(0);
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    dayOfWeek: number;
    mealType: MealType;
  } | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (weekOffset === 0) {
      fetchCurrentPlan();
    } else {
      fetchPlanByWeek(getWeekStartDate(weekOffset));
    }
  }, [weekOffset, fetchCurrentPlan, fetchPlanByWeek]);

  const loadRecipes = useCallback(async (search?: string) => {
    try {
      const params: Record<string, string> = { limit: '20' };
      if (search) params.search = search;
      const result = (await recipesApi.list(params)) as PaginatedResponse<Recipe>;
      setRecipes(result.data);
    } catch {
      // Silent fail
    }
  }, []);

  const handleSlotClick = (dayOfWeek: number, mealType: MealType) => {
    setSelectedSlot({ dayOfWeek, mealType });
    setShowRecipePicker(true);
    loadRecipes();
  };

  const handleSelectRecipe = async (recipe: Recipe) => {
    if (!selectedSlot || !currentPlan) return;

    const newItems: MealPlanItem[] = [
      ...currentPlan.items,
      {
        id: 'temp-' + Date.now(),
        mealPlanId: currentPlan.id,
        recipeId: recipe.id,
        dayOfWeek: selectedSlot.dayOfWeek,
        mealType: selectedSlot.mealType,
        servings: 1,
        recipe,
      },
    ];

    await updatePlan(currentPlan.id, newItems);
    setShowRecipePicker(false);
    setSelectedSlot(null);
  };

  const handleRemoveItem = async (item: MealPlanItem) => {
    if (!currentPlan) return;
    const newItems = currentPlan.items.filter((i) => i.id !== item.id);
    await updatePlan(currentPlan.id, newItems);
  };

  const handleCreatePlan = async () => {
    try {
      await createPlan(getWeekStartDate(weekOffset));
    } catch {
      // Error is set in context
    }
  };

  const handleAutoGenerate = async () => {
    if (!currentPlan) return;
    await autoGenerate(currentPlan.id);
  };

  const weekStart = getWeekStartDate(weekOffset);
  const weekStartFormatted = new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
        <div className="flex items-center space-x-3">
          {currentPlan && (
            <button onClick={handleAutoGenerate} className="btn-secondary text-sm">
              Auto-Generate
            </button>
          )}
        </div>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="btn-secondary text-sm"
        >
          &larr; Prev
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Week of {weekStartFormatted}
        </span>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="btn-secondary text-sm"
        >
          Next &rarr;
        </button>
        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="text-primary-600 text-sm hover:underline"
          >
            Today
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : !currentPlan ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No meal plan for this week yet.</p>
          <button onClick={handleCreatePlan} className="btn-primary">
            Create Meal Plan
          </button>
        </div>
      ) : (
        <div className="card">
          <WeeklyCalendar
            items={currentPlan.items}
            onSlotClick={handleSlotClick}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      )}

      {/* Recipe Picker Modal */}
      {showRecipePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select a Recipe</h2>
              <button
                onClick={() => {
                  setShowRecipePicker(false);
                  setSelectedSlot(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                className="input-field"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadRecipes(e.target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  selectable
                  onSelect={handleSelectRecipe}
                />
              ))}
            </div>

            {recipes.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No recipes found. Create some first!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
