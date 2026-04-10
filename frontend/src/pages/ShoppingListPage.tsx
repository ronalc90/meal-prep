import { useEffect, useState } from 'react';
import { useMealPlan } from '../context/MealPlanContext';
import { shoppingListsApi } from '../services/api';
import ShoppingListView from '../components/ShoppingListView';

export default function ShoppingListPage() {
  const {
    currentPlan,
    shoppingList,
    isLoading,
    error,
    fetchCurrentPlan,
    generateShoppingList,
    toggleShoppingItem,
  } = useMealPlan();

  const [exportText, setExportText] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentPlan();
  }, [fetchCurrentPlan]);

  const handleGenerate = async () => {
    if (!currentPlan) return;
    await generateShoppingList(currentPlan.id);
  };

  const handleToggle = async (itemId: string, isChecked: boolean) => {
    if (!shoppingList) return;
    await toggleShoppingItem(shoppingList.id, itemId, isChecked);
  };

  const handleExport = async () => {
    if (!currentPlan) return;
    try {
      const text = await shoppingListsApi.export(currentPlan.id);
      setExportText(text);
    } catch {
      // Silent fail
    }
  };

  const handleCopyExport = () => {
    if (!exportText) return;
    navigator.clipboard.writeText(exportText).catch(() => {});
    setExportText(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Compras</h1>
        <div className="flex space-x-2">
          {currentPlan && (
            <button onClick={handleGenerate} className="btn-primary text-sm">
              {shoppingList ? 'Regenerar' : 'Generar'} Lista
            </button>
          )}
          {shoppingList && shoppingList.items.length > 0 && (
            <button onClick={handleExport} className="btn-secondary text-sm">
              Exportar
            </button>
          )}
        </div>
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
          <p className="text-gray-500 text-lg">No hay plan de comidas para esta semana.</p>
          <p className="text-sm text-gray-400 mt-1">
            Crea un plan de comidas primero para generar una lista de compras.
          </p>
        </div>
      ) : !shoppingList ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Tienes {currentPlan.items.length} comidas planificadas esta semana.
          </p>
          <button onClick={handleGenerate} className="btn-primary">
            Generar Lista de Compras
          </button>
        </div>
      ) : (
        <ShoppingListView items={shoppingList.items} onToggleItem={handleToggle} />
      )}

      {/* Export Modal */}
      {exportText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Exportar Lista de Compras</h2>
              <button
                onClick={() => setExportText(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
              {exportText}
            </pre>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setExportText(null)} className="btn-secondary">
                Cerrar
              </button>
              <button onClick={handleCopyExport} className="btn-primary">
                Copiar al Portapapeles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
