import type { MealPlanItem, MealType } from '../types';

interface WeeklyCalendarProps {
  items: MealPlanItem[];
  onSlotClick: (dayOfWeek: number, mealType: MealType) => void;
  onRemoveItem: (item: MealPlanItem) => void;
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const MEAL_TYPES: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Desayuno',
  LUNCH: 'Almuerzo',
  DINNER: 'Cena',
  SNACK: 'Merienda',
};

const MEAL_TYPE_COLORS: Record<MealType, string> = {
  BREAKFAST: 'bg-amber-50 border-amber-200',
  LUNCH: 'bg-blue-50 border-blue-200',
  DINNER: 'bg-purple-50 border-purple-200',
  SNACK: 'bg-green-50 border-green-200',
};

export default function WeeklyCalendar({ items, onSlotClick, onRemoveItem }: WeeklyCalendarProps) {
  const getItem = (day: number, mealType: MealType) =>
    items.find((item) => item.dayOfWeek === day && item.mealType === mealType);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header row with days */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="p-2 text-sm font-medium text-gray-500" />
          {DAYS.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-700 bg-gray-100 rounded">
              {day}
            </div>
          ))}
        </div>

        {/* Rows for each meal type */}
        {MEAL_TYPES.map((mealType) => (
          <div key={mealType} className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 text-sm font-medium text-gray-500 flex items-center">
              {MEAL_TYPE_LABELS[mealType]}
            </div>
            {DAYS.map((_, dayIndex) => {
              const item = getItem(dayIndex, mealType);
              return (
                <div
                  key={`${dayIndex}-${mealType}`}
                  className={`min-h-[80px] rounded border-2 border-dashed p-1.5 transition-colors ${
                    item
                      ? MEAL_TYPE_COLORS[mealType] + ' border-solid'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {item ? (
                    <MealSlot item={item} onRemove={() => onRemoveItem(item)} />
                  ) : (
                    <button
                      onClick={() => onSlotClick(dayIndex, mealType)}
                      className="w-full h-full flex items-center justify-center text-gray-400 hover:text-primary-500 text-xl"
                      title={`Add ${MEAL_TYPE_LABELS[mealType]} for ${DAYS[dayIndex]}`}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MealSlot({ item, onRemove }: { item: MealPlanItem; onRemove: () => void }) {
  return (
    <div className="text-xs h-full flex flex-col">
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-800 line-clamp-2 flex-1">
          {item.recipe.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
          title="Eliminar"
        >
          x
        </button>
      </div>
      {item.recipe.calories && (
        <span className="text-gray-400 mt-auto">
          {item.recipe.calories * item.servings} cal
        </span>
      )}
    </div>
  );
}
