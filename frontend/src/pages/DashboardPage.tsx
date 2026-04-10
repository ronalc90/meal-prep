import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import type { DashboardStats } from '../types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then((data) => setStats(data as DashboardStats))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inicio</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Comidas esta Semana"
          value={stats?.currentWeek.mealsPlanned ?? 0}
          subtitle="comidas planificadas"
          color="primary"
        />
        <StatCard
          label="Calorias/Dia Promedio"
          value={stats?.currentWeek.avgCaloriesPerDay ?? 0}
          subtitle="calorias"
          color="amber"
        />
        <StatCard
          label="Total Recetas"
          value={stats?.overall.totalRecipes ?? 0}
          subtitle="en tu coleccion"
          color="blue"
        />
        <StatCard
          label="Planes de Comida"
          value={stats?.overall.totalMealPlans ?? 0}
          subtitle="creados en total"
          color="purple"
        />
      </div>

      {/* Shopping Progress */}
      {stats?.currentWeek.shoppingProgress.total !== undefined &&
        stats.currentWeek.shoppingProgress.total > 0 && (
          <div className="card mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Progreso de Compras</h2>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                {stats.currentWeek.shoppingProgress.checked} de{' '}
                {stats.currentWeek.shoppingProgress.total} articulos
              </span>
              <span>{stats.currentWeek.shoppingProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all"
                style={{ width: `${stats.currentWeek.shoppingProgress.percentage}%` }}
              />
            </div>
          </div>
        )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/meal-planner" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold text-gray-900">Planifica tu Semana</h3>
          <p className="text-sm text-gray-500 mt-1">Crea o edita tu plan semanal de comidas</p>
        </Link>
        <Link to="/recipes" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🍳</div>
          <h3 className="font-semibold text-gray-900">Explorar Recetas</h3>
          <p className="text-sm text-gray-500 mt-1">Descubre y agrega nuevas recetas</p>
        </Link>
        <Link to="/shopping-list" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-semibold text-gray-900">Lista de Compras</h3>
          <p className="text-sm text-gray-500 mt-1">Ve y administra tu lista de compras</p>
        </Link>
      </div>

      {/* Popular Recipes */}
      {stats?.overall.popularRecipes && stats.overall.popularRecipes.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recetas Mas Usadas</h2>
          <div className="space-y-3">
            {stats.overall.popularRecipes.map((recipe, index) => (
              <div key={recipe.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-mono text-gray-400 w-6">
                    {index + 1}.
                  </span>
                  <span className="font-medium text-gray-800">{recipe.title}</span>
                  {recipe.calories && (
                    <span className="text-xs text-gray-400 ml-2">
                      {recipe.calories} cal
                    </span>
                  )}
                </div>
                <span className="text-sm text-primary-600 font-medium">
                  {recipe.usageCount}x usada
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: number;
  subtitle: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="card">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${colorMap[color] || 'text-gray-900'} mt-1`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
