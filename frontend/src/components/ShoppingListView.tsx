import type { ShoppingListItem, IngredientCategory } from '../types';

interface ShoppingListViewProps {
  items: ShoppingListItem[];
  onToggleItem: (itemId: string, isChecked: boolean) => void;
}

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  PRODUCE: 'Frutas y Verduras',
  DAIRY: 'Lacteos',
  MEAT: 'Carnes y Mariscos',
  PANTRY: 'Despensa',
  FROZEN: 'Congelados',
  BAKERY: 'Panaderia',
  BEVERAGES: 'Bebidas',
  OTHER: 'Otros',
};

const CATEGORY_ICONS: Record<IngredientCategory, string> = {
  PRODUCE: '🥬',
  DAIRY: '🧀',
  MEAT: '🥩',
  PANTRY: '🥫',
  FROZEN: '🧊',
  BAKERY: '🍞',
  BEVERAGES: '🥤',
  OTHER: '📦',
};

export default function ShoppingListView({ items, onToggleItem }: ShoppingListViewProps) {
  // Group items by category
  const grouped = items.reduce<Record<string, ShoppingListItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort() as IngredientCategory[];

  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso de Compras</span>
          <span className="text-sm text-gray-500">
            {checkedCount}/{totalCount} articulos ({progress}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items grouped by category */}
      {categories.map((category) => (
        <div key={category} className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">{CATEGORY_ICONS[category]}</span>
            {CATEGORY_LABELS[category]}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({grouped[category]?.length})
            </span>
          </h3>
          <ul className="space-y-2">
            {grouped[category]?.map((item) => (
              <li key={item.id} className="flex items-center group">
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => onToggleItem(item.id, !item.isChecked)}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 mr-3"
                />
                <span
                  className={`flex-1 ${
                    item.isChecked ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {item.ingredient.name}
                </span>
                <span className="text-sm text-gray-500">
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay articulos en tu lista de compras.</p>
          <p className="text-sm mt-1">Genera una desde tu plan de comidas.</p>
        </div>
      )}
    </div>
  );
}
