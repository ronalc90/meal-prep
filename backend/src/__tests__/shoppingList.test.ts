import request from 'supertest';
import { app, createTestUser } from './helpers';
import './setup';

describe('ShoppingList API', () => {
  async function setupMealPlanWithRecipes(token: string) {
    // Create two recipes that share some ingredients (for aggregation testing)
    const recipe1Res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Shopping Recipe A',
        servings: 2,
        ingredients: [
          { name: 'chicken breast', quantity: 500, unit: 'g', category: 'MEAT' },
          { name: 'olive oil', quantity: 2, unit: 'tbsp', category: 'PANTRY' },
          { name: 'garlic', quantity: 3, unit: 'unit', category: 'PRODUCE' },
          { name: 'salt', quantity: 1, unit: 'tsp', category: 'PANTRY' },
        ],
      });

    const recipe2Res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Shopping Recipe B',
        servings: 4,
        ingredients: [
          { name: 'chicken breast', quantity: 800, unit: 'g', category: 'MEAT' },
          { name: 'olive oil', quantity: 3, unit: 'tbsp', category: 'PANTRY' },
          { name: 'onion', quantity: 2, unit: 'unit', category: 'PRODUCE' },
          { name: 'salt', quantity: 0.5, unit: 'tsp', category: 'PANTRY' },
        ],
      });

    // Create a meal plan with both recipes
    const planRes = await request(app)
      .post('/api/meal-plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        weekStartDate: '2026-06-07',
        items: [
          {
            recipeId: recipe1Res.body.id,
            dayOfWeek: 1,
            mealType: 'LUNCH',
            servings: 2,
          },
          {
            recipeId: recipe2Res.body.id,
            dayOfWeek: 2,
            mealType: 'DINNER',
            servings: 1,
          },
        ],
      });

    return {
      recipe1: recipe1Res.body,
      recipe2: recipe2Res.body,
      mealPlan: planRes.body,
    };
  }

  describe('POST /api/shopping-lists/generate', () => {
    it('should generate a shopping list with aggregated ingredients', async () => {
      const user = await createTestUser();
      const { mealPlan } = await setupMealPlanWithRecipes(user.token);

      const res = await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      expect(res.status).toBe(201);
      expect(res.body.items).toBeDefined();
      expect(res.body.items.length).toBeGreaterThan(0);

      // Verify deduplication: chicken breast appears once (combined from both recipes)
      const chickenItems = res.body.items.filter(
        (item: { ingredient: { name: string } }) => item.ingredient.name === 'chicken breast',
      );
      expect(chickenItems).toHaveLength(1);

      // Verify olive oil is combined
      const oilItems = res.body.items.filter(
        (item: { ingredient: { name: string } }) => item.ingredient.name === 'olive oil',
      );
      expect(oilItems).toHaveLength(1);
    });

    it('should replace existing shopping list on regeneration', async () => {
      const user = await createTestUser();
      const { mealPlan } = await setupMealPlanWithRecipes(user.token);

      // Generate twice
      await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      const res = await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/shopping-lists/:mealPlanId', () => {
    it('should get shopping list grouped by category', async () => {
      const user = await createTestUser();
      const { mealPlan } = await setupMealPlanWithRecipes(user.token);

      await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      const res = await request(app)
        .get(`/api/shopping-lists/${mealPlan.id}`)
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toBeDefined();

      // Verify items have category
      for (const item of res.body.items) {
        expect(item.category).toBeDefined();
      }
    });
  });

  describe('PATCH /api/shopping-lists/:id/items/:itemId', () => {
    it('should toggle item checked status', async () => {
      const user = await createTestUser();
      const { mealPlan } = await setupMealPlanWithRecipes(user.token);

      const listRes = await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      const listId = listRes.body.id;
      const itemId = listRes.body.items[0].id;

      // Check item
      const checkRes = await request(app)
        .patch(`/api/shopping-lists/${listId}/items/${itemId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ isChecked: true });

      expect(checkRes.status).toBe(200);
      expect(checkRes.body.isChecked).toBe(true);

      // Uncheck item
      const uncheckRes = await request(app)
        .patch(`/api/shopping-lists/${listId}/items/${itemId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ isChecked: false });

      expect(uncheckRes.status).toBe(200);
      expect(uncheckRes.body.isChecked).toBe(false);
    });
  });

  describe('GET /api/shopping-lists/:mealPlanId/export', () => {
    it('should export shopping list as text', async () => {
      const user = await createTestUser();
      const { mealPlan } = await setupMealPlanWithRecipes(user.token);

      await request(app)
        .post('/api/shopping-lists/generate')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ mealPlanId: mealPlan.id });

      const res = await request(app)
        .get(`/api/shopping-lists/${mealPlan.id}/export`)
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.type).toBe('text/plain');
      expect(res.text).toContain('SHOPPING LIST');
    });
  });
});
