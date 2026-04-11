import { Link } from 'react-router-dom';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
  selectable?: boolean;
}

export default function RecipeCard({ recipe, onSelect, selectable }: RecipeCardProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const content = (
    <div className="card hover:shadow-md transition-shadow cursor-pointer">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{recipe.title}</h3>
      {recipe.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
      )}
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center">
          <ClockIcon />
          <span className="ml-1">{totalTime} min</span>
        </span>
        <span className="flex items-center">
          <UsersIcon />
          <span className="ml-1">{recipe.servings} porc.</span>
        </span>
        {recipe.calories && (
          <span className="flex items-center">
            <FireIcon />
            <span className="ml-1">{recipe.calories} cal</span>
          </span>
        )}
      </div>
      {recipe.ingredients.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.ingredients.slice(0, 4).map((ri) => (
            <span
              key={ri.id}
              className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
            >
              {ri.ingredient.name}
            </span>
          ))}
          {recipe.ingredients.length > 4 && (
            <span className="text-xs text-gray-400">
              +{recipe.ingredients.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (selectable && onSelect) {
    return (
      <button onClick={() => onSelect(recipe)} className="text-left w-full">
        {content}
      </button>
    );
  }

  return <Link to={`/recipes/${recipe.id}`}>{content}</Link>;
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
    </svg>
  );
}
