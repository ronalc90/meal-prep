import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeForm from '../components/RecipeForm';
import type { Recipe, CreateRecipeInput } from '../types';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    recipesApi
      .get(id)
      .then((data) => setRecipe(data as Recipe))
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar la receta'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await recipesApi.delete(id);
      navigate('/recipes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  const handleUpdate = async (data: CreateRecipeInput) => {
    if (!id) return;
    const updated = (await recipesApi.update(id, data)) as Recipe;
    setRecipe(updated);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <p className="text-lg text-red-600">{error || 'Recipe not found'}</p>
          <button onClick={() => navigate('/recipes')} className="btn-secondary mt-4">
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === recipe.userId;
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Recipe</h1>
        <div className="card">
          <RecipeForm
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Save Changes"
            initialData={{
              title: recipe.title,
              description: recipe.description || undefined,
              servings: recipe.servings,
              prepTimeMinutes: recipe.prepTimeMinutes,
              cookTimeMinutes: recipe.cookTimeMinutes,
              calories: recipe.calories || undefined,
              isPublic: recipe.isPublic,
              ingredients: recipe.ingredients.map((ri) => ({
                name: ri.ingredient.name,
                quantity: ri.quantity,
                unit: ri.unit,
                category: ri.ingredient.category,
              })),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/recipes')}
        className="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-block"
      >
        &larr; Back to Recipes
      </button>

      <div className="card">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
            {recipe.user && (
              <p className="text-sm text-gray-500 mt-1">by {recipe.user.name}</p>
            )}
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger text-sm">
                Delete
              </button>
            </div>
          )}
        </div>

        {recipe.description && (
          <p className="text-gray-600 mb-6">{recipe.description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <InfoBadge label="Total Time" value={`${totalTime} min`} />
          <InfoBadge label="Prep" value={`${recipe.prepTimeMinutes} min`} />
          <InfoBadge label="Servings" value={String(recipe.servings)} />
          {recipe.calories && <InfoBadge label="Calories" value={String(recipe.calories)} />}
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h2>
        <ul className="space-y-2 mb-6">
          {recipe.ingredients.map((ri) => (
            <li key={ri.id} className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-primary-400 rounded-full mr-3" />
              <span className="font-medium">{ri.quantity} {ri.unit}</span>
              <span className="mx-1">-</span>
              <span>{ri.ingredient.name}</span>
              {ri.notes && <span className="text-gray-400 ml-1">({ri.notes})</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  );
}
