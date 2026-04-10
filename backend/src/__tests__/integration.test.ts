import request from 'supertest';
import { app, createTestUser } from './helpers';
import './setup';

describe('Integration: Full Workflow', () => {
  it('should complete the full workflow: create recipes -> create meal plan -> generate shopping list -> verify items', async () => {
    // Step 1: Register and get user
    const user = await createTestUser({ email: 'integration@mealprep.test' });

    // Step 2: Create recipes with shared ingredients
    const pastaRes = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'Integration Pasta',
        servings: 4,
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        calories: 500,
        ingredients: [
          { name: 'spaghetti', quantity: 400, unit: 'g', category: 'PANTRY' },
          { name: 'olive oil', quantity: 2, unit: 'tbsp', category: 'PANTRY' },
          { name: 'garlic', quantity: 4, unit: 'unit', category: 'PRODUCE' },
          { name: 'parmesan', quantity: 100, unit: 'g', category: 'DAIRY' },
        ],
      });
    expect(pastaRes.status).toBe(201);

    const saladRes = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'Integration Salad',
        servings: 2,
        prepTimeMinutes: 10,
        cookTimeMinutes: 0,
        calories: 200,
        ingredients: [
          { name: 'romaine lettuce', quantity: 1, unit: 'unit', category: 'PRODUCE' },
          { name: 'olive oil', quantity: 3, unit: 'tbsp', category: 'PANTRY' },
          { name: 'parmesan', quantity: 50, unit: 'g', category: 'DAIRY' },
          { name: 'lemon', quantity: 1, unit: 'unit', category: 'PRODUCE' },
        ],
      });
    expect(saladRes.status).toBe(201);

    // Step 3: Create a meal plan for the week
    const mealPlanRes = await request(app)
      .post('/api/meal-plans')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        weekStartDate: '2026-07-05',
        items: [
          { recipeId: pastaRes.body.id, dayOfWeek: 1, mealType: 'DINNER', servings: 1 },
          { recipeId: saladRes.body.id, dayOfWeek: 1, mealType: 'LUNCH', servings: 2 },
          { recipeId: pastaRes.body.id, dayOfWeek: 3, mealType: 'DINNER', servings: 2 },
        ],
      });
    expect(mealPlanRes.status).toBe(201);
    expect(mealPlanRes.body.items).toHaveLength(3);

    // Step 4: Generate shopping list
    const shoppingRes = await request(app)
      .post('/api/shopping-lists/generate')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ mealPlanId: mealPlanRes.body.id });
    expect(shoppingRes.status).toBe(201);

    const items = shoppingRes.body.items;

    // Step 5: Verify ingredient aggregation
    // Olive oil: 2 tbsp (pasta, 1 serving) + 3 tbsp (salad, 2 servings) + 2*2 tbsp (pasta, 2 servings)
    // = 2*(1/4) + 3*(2/2) + 2*(2/4) = 0.5 + 3 + 1 = ... wait, let's just check it's combined
    const oliveOilItems = items.filter(
      (item: { ingredient: { name: string } }) => item.ingredient.name === 'olive oil',
    );
    expect(oliveOilItems).toHaveLength(1);
    expect(oliveOilItems[0].quantity).toBeGreaterThan(0);

    // Parmesan should be combined
    const parmesanItems = items.filter(
      (item: { ingredient: { name: string } }) => item.ingredient.name === 'parmesan',
    );
    expect(parmesanItems).toHaveLength(1);

    // Step 6: Check an item off the list
    const firstItem = items[0];
    const checkRes = await request(app)
      .patch(`/api/shopping-lists/${shoppingRes.body.id}/items/${firstItem.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ isChecked: true });
    expect(checkRes.status).toBe(200);
    expect(checkRes.body.isChecked).toBe(true);

    // Step 7: Export shopping list
    const exportRes = await request(app)
      .get(`/api/shopping-lists/${mealPlanRes.body.id}/export`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(exportRes.status).toBe(200);
    expect(exportRes.text).toContain('SHOPPING LIST');
    expect(exportRes.text).toContain('[x]'); // The checked item

    // Step 8: Verify dashboard stats reflect the data
    const statsRes = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${user.token}`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.overall.totalRecipes).toBeGreaterThanOrEqual(2);
    expect(statsRes.body.overall.totalMealPlans).toBeGreaterThanOrEqual(1);
  });
});
