import { useState } from 'react';
import type { CreateRecipeInput, IngredientCategory } from '../types';

interface RecipeFormProps {
  onSubmit: (data: CreateRecipeInput) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreateRecipeInput>;
  submitLabel?: string;
}

const CATEGORIES: IngredientCategory[] = [
  'PRODUCE', 'DAIRY', 'MEAT', 'PANTRY', 'FROZEN', 'BAKERY', 'BEVERAGES', 'OTHER',
];

interface IngredientRow {
  name: string;
  quantity: string;
  unit: string;
  category: IngredientCategory;
}

export default function RecipeForm({ onSubmit, onCancel, initialData, submitLabel = 'Crear Receta' }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [servings, setServings] = useState(String(initialData?.servings || 4));
  const [prepTime, setPrepTime] = useState(String(initialData?.prepTimeMinutes || 0));
  const [cookTime, setCookTime] = useState(String(initialData?.cookTimeMinutes || 0));
  const [calories, setCalories] = useState(String(initialData?.calories || ''));
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialData?.ingredients?.map((i) => ({
      name: i.name,
      quantity: String(i.quantity),
      unit: i.unit,
      category: i.category,
    })) || [{ name: '', quantity: '', unit: 'unit', category: 'OTHER' }],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'unit', category: 'OTHER' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string) => {
    setIngredients(
      ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        description: description || undefined,
        servings: parseInt(servings, 10),
        prepTimeMinutes: parseInt(prepTime, 10),
        cookTimeMinutes: parseInt(cookTime, 10),
        calories: calories ? parseInt(calories, 10) : undefined,
        isPublic,
        ingredients: ingredients
          .filter((i) => i.name.trim() !== '')
          .map((i) => ({
            name: i.name,
            quantity: parseFloat(i.quantity) || 1,
            unit: i.unit,
            category: i.category as IngredientCategory,
          })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la receta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
          <textarea
            className="input-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Porciones</label>
          <input
            type="number"
            className="input-field"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Calorias</label>
          <input
            type="number"
            className="input-field"
            min="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Prep. (min)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
          <input
            type="number"
            className="input-field"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-primary-600 rounded border-gray-300"
          />
          <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
            Make recipe public
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700">Ingredients</h3>
          <button type="button" onClick={addIngredient} className="btn-secondary text-sm">
            + Add Ingredient
          </button>
        </div>

        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Name"
                value={ing.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              />
              <input
                type="number"
                className="input-field w-20"
                placeholder="Qty"
                step="0.1"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
              />
              <input
                type="text"
                className="input-field w-20"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
              />
              <select
                className="input-field w-32"
                value={ing.category}
                onChange={(e) => updateIngredient(index, 'category', e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
