import request from 'supertest';
import { app, createTestUser, createTestRecipe } from './helpers';
import './setup';

describe('MealPlan API', () => {
  describe('POST /api/meal-plans', () => {
    it('should create an empty meal plan', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ weekStartDate: '2026-04-05' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.userId).toBe(user.id);
    });

    it('should create meal plan with items', async () => {
      const user = await createTestUser();
      const recipe = await createTestRecipe(user.token);

      const res = await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          weekStartDate: '2026-04-12',
          items: [
            { recipeId: recipe.id, dayOfWeek: 1, mealType: 'BREAKFAST', servings: 2 },
            { recipeId: recipe.id, dayOfWeek: 1, mealType: 'LUNCH', servings: 1 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.items).toHaveLength(2);
    });

    it('should reject duplicate week', async () => {
      const user = await createTestUser();

      await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ weekStartDate: '2026-04-19' });

      const res = await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ weekStartDate: '2026-04-19' });

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/meal-plans/current', () => {
    it('should return current week meal plan', async () => {
      const user = await createTestUser();

      // Create a plan for current week
      const now = new Date();
      const day = now.getUTCDay();
      now.setUTCDate(now.getUTCDate() - day);
      const weekStart = now.toISOString().split('T')[0];

      await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ weekStartDate: weekStart });

      const res = await request(app)
        .get('/api/meal-plans/current')
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
    });

    it('should return structured response if no plan exists', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .get('/api/meal-plans/current')
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeNull();
      expect(res.body.message).toBeDefined();
    });
  });

  describe('PUT /api/meal-plans/:id', () => {
    it('should update meal plan items', async () => {
      const user = await createTestUser();
      const recipe1 = await createTestRecipe(user.token, { title: 'MP Recipe 1' });
      const recipe2 = await createTestRecipe(user.token, { title: 'MP Recipe 2' });

      const createRes = await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          weekStartDate: '2026-05-03',
          items: [
            { recipeId: recipe1.id, dayOfWeek: 0, mealType: 'BREAKFAST', servings: 1 },
          ],
        });

      const res = await request(app)
        .put(`/api/meal-plans/${createRes.body.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          items: [
            { recipeId: recipe1.id, dayOfWeek: 0, mealType: 'BREAKFAST', servings: 2 },
            { recipeId: recipe2.id, dayOfWeek: 0, mealType: 'LUNCH', servings: 1 },
            { recipeId: recipe2.id, dayOfWeek: 1, mealType: 'DINNER', servings: 3 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(3);
    });
  });

  describe('POST /api/meal-plans/:id/auto-generate', () => {
    it('should auto-generate meal plan from available recipes', async () => {
      const user = await createTestUser();
      // Create several recipes
      for (let i = 0; i < 5; i++) {
        await createTestRecipe(user.token, { title: `AutoGen Recipe ${i}` });
      }

      const planRes = await request(app)
        .post('/api/meal-plans')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ weekStartDate: '2026-05-10' });

      const res = await request(app)
        .post(`/api/meal-plans/${planRes.body.id}/auto-generate`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          preferences: {
            mealsPerDay: 3,
            includeSnacks: false,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.items.length).toBe(21); // 7 days * 3 meals
    });
  });
});
