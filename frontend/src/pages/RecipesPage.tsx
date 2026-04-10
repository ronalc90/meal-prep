import { useEffect, useState } from 'react';
import { recipesApi } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import type { Recipe, PaginatedResponse, CreateRecipeInput } from '../types';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: '12',
      };
      if (search) params.search = search;

      const result = (await recipesApi.list(params)) as PaginatedResponse<Recipe>;
      setRecipes(result.data);
      setTotalPages(result.meta.totalPages);
    } catch {
      // Silent fail for listing
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, search]);

  const handleCreateRecipe = async (data: CreateRecipeInput) => {
    await recipesApi.create(data);
    setShowForm(false);
    setPage(1);
    await fetchRecipes();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Close Form' : '+ New Recipe'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Recipe</h2>
          <RecipeForm
            onSubmit={handleCreateRecipe}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No recipes found.</p>
          <p className="text-sm mt-1">Create your first recipe to get started!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-secondary text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
