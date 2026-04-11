import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedIngredient {
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

interface SeedRecipe {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  calories: number;
  isPublic: boolean;
  ingredients: SeedIngredient[];
}

const recipes: SeedRecipe[] = [
  {
    title: 'Classic Oatmeal with Berries',
    description: 'A hearty breakfast with rolled oats topped with fresh mixed berries and honey.',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    calories: 320,
    isPublic: true,
    ingredients: [
      { name: 'rolled oats', category: 'PANTRY', quantity: 1, unit: 'cup' },
      { name: 'milk', category: 'DAIRY', quantity: 2, unit: 'cups' },
      { name: 'mixed berries', category: 'PRODUCE', quantity: 1, unit: 'cup' },
      { name: 'honey', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
    ],
  },
  {
    title: 'Avocado Toast with Eggs',
    description: 'Crispy whole grain toast topped with mashed avocado and poached eggs.',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    calories: 380,
    isPublic: true,
    ingredients: [
      { name: 'whole grain bread', category: 'BAKERY', quantity: 4, unit: 'slices' },
      { name: 'avocado', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'eggs', category: 'DAIRY', quantity: 4, unit: 'unit' },
      { name: 'lemon juice', category: 'PRODUCE', quantity: 1, unit: 'tbsp' },
      { name: 'salt', category: 'PANTRY', quantity: 0.5, unit: 'tsp' },
      { name: 'red pepper flakes', category: 'PANTRY', quantity: 0.25, unit: 'tsp' },
    ],
  },
  {
    title: 'Greek Yogurt Parfait',
    description: 'Layers of Greek yogurt, granola, and fresh fruit.',
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    calories: 290,
    isPublic: true,
    ingredients: [
      { name: 'greek yogurt', category: 'DAIRY', quantity: 1, unit: 'cup' },
      { name: 'granola', category: 'PANTRY', quantity: 0.5, unit: 'cup' },
      { name: 'mixed berries', category: 'PRODUCE', quantity: 0.5, unit: 'cup' },
      { name: 'honey', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    title: 'Chicken Caesar Salad',
    description: 'Crispy romaine lettuce with grilled chicken, parmesan, and Caesar dressing.',
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    calories: 450,
    isPublic: true,
    ingredients: [
      { name: 'chicken breast', category: 'MEAT', quantity: 400, unit: 'g' },
      { name: 'romaine lettuce', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'parmesan cheese', category: 'DAIRY', quantity: 50, unit: 'g' },
      { name: 'caesar dressing', category: 'PANTRY', quantity: 4, unit: 'tbsp' },
      { name: 'croutons', category: 'BAKERY', quantity: 1, unit: 'cup' },
    ],
  },
  {
    title: 'Vegetable Stir Fry',
    description: 'Colorful mixed vegetables stir-fried with soy sauce and ginger over rice.',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    calories: 280,
    isPublic: true,
    ingredients: [
      { name: 'bell peppers', category: 'PRODUCE', quantity: 3, unit: 'unit' },
      { name: 'broccoli', category: 'PRODUCE', quantity: 2, unit: 'cups' },
      { name: 'carrots', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'soy sauce', category: 'PANTRY', quantity: 3, unit: 'tbsp' },
      { name: 'fresh ginger', category: 'PRODUCE', quantity: 1, unit: 'tbsp' },
      { name: 'garlic', category: 'PRODUCE', quantity: 3, unit: 'unit' },
      { name: 'rice', category: 'PANTRY', quantity: 2, unit: 'cups' },
      { name: 'sesame oil', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
    ],
  },
  {
    title: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with a rich ground beef and tomato sauce.',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    calories: 520,
    isPublic: true,
    ingredients: [
      { name: 'spaghetti', category: 'PANTRY', quantity: 400, unit: 'g' },
      { name: 'ground beef', category: 'MEAT', quantity: 500, unit: 'g' },
      { name: 'canned tomatoes', category: 'PANTRY', quantity: 400, unit: 'g' },
      { name: 'onion', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'garlic', category: 'PRODUCE', quantity: 3, unit: 'unit' },
      { name: 'olive oil', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
      { name: 'parmesan cheese', category: 'DAIRY', quantity: 50, unit: 'g' },
    ],
  },
  {
    title: 'Grilled Salmon with Asparagus',
    description: 'Perfectly grilled salmon fillet with roasted asparagus and lemon butter.',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    calories: 480,
    isPublic: true,
    ingredients: [
      { name: 'salmon fillet', category: 'MEAT', quantity: 400, unit: 'g' },
      { name: 'asparagus', category: 'PRODUCE', quantity: 1, unit: 'bunch' },
      { name: 'lemon', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'butter', category: 'DAIRY', quantity: 2, unit: 'tbsp' },
      { name: 'olive oil', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
      { name: 'salt', category: 'PANTRY', quantity: 0.5, unit: 'tsp' },
    ],
  },
  {
    title: 'Black Bean Tacos',
    description: 'Spiced black bean tacos with fresh salsa, avocado, and lime crema.',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    calories: 350,
    isPublic: true,
    ingredients: [
      { name: 'black beans', category: 'PANTRY', quantity: 400, unit: 'g' },
      { name: 'corn tortillas', category: 'BAKERY', quantity: 8, unit: 'unit' },
      { name: 'avocado', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'tomatoes', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'lime', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'sour cream', category: 'DAIRY', quantity: 0.5, unit: 'cup' },
      { name: 'cumin', category: 'PANTRY', quantity: 1, unit: 'tsp' },
    ],
  },
  {
    title: 'Chicken Curry',
    description: 'Rich and creamy chicken curry with basmati rice.',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    calories: 490,
    isPublic: true,
    ingredients: [
      { name: 'chicken thighs', category: 'MEAT', quantity: 600, unit: 'g' },
      { name: 'coconut milk', category: 'PANTRY', quantity: 400, unit: 'ml' },
      { name: 'curry paste', category: 'PANTRY', quantity: 3, unit: 'tbsp' },
      { name: 'onion', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'garlic', category: 'PRODUCE', quantity: 4, unit: 'unit' },
      { name: 'rice', category: 'PANTRY', quantity: 2, unit: 'cups' },
      { name: 'fresh cilantro', category: 'PRODUCE', quantity: 0.25, unit: 'cup' },
    ],
  },
  {
    title: 'Mushroom Risotto',
    description: 'Creamy arborio rice with sauteed mushrooms and parmesan.',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    calories: 420,
    isPublic: true,
    ingredients: [
      { name: 'arborio rice', category: 'PANTRY', quantity: 2, unit: 'cups' },
      { name: 'mushrooms', category: 'PRODUCE', quantity: 300, unit: 'g' },
      { name: 'chicken broth', category: 'PANTRY', quantity: 4, unit: 'cups' },
      { name: 'white wine', category: 'BEVERAGES', quantity: 0.5, unit: 'cup' },
      { name: 'parmesan cheese', category: 'DAIRY', quantity: 75, unit: 'g' },
      { name: 'butter', category: 'DAIRY', quantity: 2, unit: 'tbsp' },
      { name: 'onion', category: 'PRODUCE', quantity: 1, unit: 'unit' },
    ],
  },
  {
    title: 'Turkey Club Sandwich',
    description: 'Triple-decker sandwich with turkey, bacon, lettuce, and tomato.',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    calories: 480,
    isPublic: true,
    ingredients: [
      { name: 'whole grain bread', category: 'BAKERY', quantity: 6, unit: 'slices' },
      { name: 'turkey breast sliced', category: 'MEAT', quantity: 200, unit: 'g' },
      { name: 'bacon', category: 'MEAT', quantity: 4, unit: 'slices' },
      { name: 'romaine lettuce', category: 'PRODUCE', quantity: 4, unit: 'leaves' },
      { name: 'tomatoes', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'mayonnaise', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
    ],
  },
  {
    title: 'Banana Protein Smoothie',
    description: 'Quick and filling smoothie with banana, protein powder, and peanut butter.',
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    calories: 340,
    isPublic: true,
    ingredients: [
      { name: 'banana', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'protein powder', category: 'PANTRY', quantity: 1, unit: 'scoop' },
      { name: 'peanut butter', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
      { name: 'milk', category: 'DAIRY', quantity: 1, unit: 'cup' },
      { name: 'ice', category: 'FROZEN', quantity: 0.5, unit: 'cup' },
    ],
  },
  {
    title: 'Beef Stew',
    description: 'Hearty slow-cooked beef stew with root vegetables and herbs.',
    servings: 6,
    prepTimeMinutes: 20,
    cookTimeMinutes: 120,
    calories: 380,
    isPublic: true,
    ingredients: [
      { name: 'beef chuck', category: 'MEAT', quantity: 800, unit: 'g' },
      { name: 'potatoes', category: 'PRODUCE', quantity: 4, unit: 'unit' },
      { name: 'carrots', category: 'PRODUCE', quantity: 3, unit: 'unit' },
      { name: 'onion', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'celery', category: 'PRODUCE', quantity: 3, unit: 'stalks' },
      { name: 'beef broth', category: 'PANTRY', quantity: 4, unit: 'cups' },
      { name: 'tomato paste', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
      { name: 'olive oil', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
    ],
  },
  {
    title: 'Caprese Salad',
    description: 'Fresh mozzarella, ripe tomatoes, and basil with balsamic glaze.',
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    calories: 250,
    isPublic: true,
    ingredients: [
      { name: 'fresh mozzarella', category: 'DAIRY', quantity: 250, unit: 'g' },
      { name: 'tomatoes', category: 'PRODUCE', quantity: 3, unit: 'unit' },
      { name: 'fresh basil', category: 'PRODUCE', quantity: 0.25, unit: 'cup' },
      { name: 'olive oil', category: 'PANTRY', quantity: 2, unit: 'tbsp' },
      { name: 'balsamic glaze', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    title: 'Shrimp Fried Rice',
    description: 'Quick and flavorful fried rice with shrimp, vegetables, and soy sauce.',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    calories: 410,
    isPublic: true,
    ingredients: [
      { name: 'shrimp', category: 'MEAT', quantity: 400, unit: 'g' },
      { name: 'rice', category: 'PANTRY', quantity: 3, unit: 'cups' },
      { name: 'eggs', category: 'DAIRY', quantity: 3, unit: 'unit' },
      { name: 'peas', category: 'FROZEN', quantity: 1, unit: 'cup' },
      { name: 'carrots', category: 'PRODUCE', quantity: 2, unit: 'unit' },
      { name: 'soy sauce', category: 'PANTRY', quantity: 3, unit: 'tbsp' },
      { name: 'sesame oil', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
      { name: 'green onions', category: 'PRODUCE', quantity: 4, unit: 'stalks' },
    ],
  },
  {
    title: 'Overnight Chia Pudding',
    description: 'Easy make-ahead chia seed pudding with coconut milk and mango.',
    servings: 2,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    calories: 260,
    isPublic: true,
    ingredients: [
      { name: 'chia seeds', category: 'PANTRY', quantity: 4, unit: 'tbsp' },
      { name: 'coconut milk', category: 'PANTRY', quantity: 1, unit: 'cup' },
      { name: 'mango', category: 'PRODUCE', quantity: 1, unit: 'unit' },
      { name: 'honey', category: 'PANTRY', quantity: 1, unit: 'tbsp' },
      { name: 'vanilla extract', category: 'PANTRY', quantity: 0.5, unit: 'tsp' },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Create a demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'ronald@mealprep.dev' },
    update: {},
    create: {
      email: 'ronald@mealprep.dev',
      passwordHash,
      name: 'Ronald',
      weeklyBudget: 150,
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create public system recipes (no owner - visible to all users)
  for (const recipe of recipes) {
    // Skip if recipe already exists (idempotent seed)
    const existing = await prisma.recipe.findFirst({
      where: { title: recipe.title, isPublic: true, userId: null },
    });
    if (existing) {
      console.log(`Recipe already exists: ${recipe.title}`);
      continue;
    }

    // Upsert ingredients
    const ingredientRecords = await Promise.all(
      recipe.ingredients.map(async (ing) => {
        const ingredient = await prisma.ingredient.upsert({
          where: { name: ing.name },
          update: {},
          create: {
            name: ing.name,
            category: ing.category,
            unit: ing.unit,
          },
        });
        return { ingredientId: ingredient.id, quantity: ing.quantity, unit: ing.unit };
      }),
    );

    // Create recipe without userId (system/public recipe)
    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        calories: recipe.calories,
        isPublic: recipe.isPublic,
        ingredients: {
          create: ingredientRecords,
        },
      },
    });

    console.log(`Created recipe: ${recipe.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
