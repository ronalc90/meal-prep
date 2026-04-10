import request from 'supertest';
import { app, createTestUser, createTestRecipe } from './helpers';
import './setup';

describe('Dashboard API', () => {
  describe('GET /api/dashboard/stats', () => {
    it('should return dashboard statistics', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body.currentWeek).toBeDefined();
      expect(res.body.currentWeek.mealsPlanned).toBeDefined();
      expect(res.body.currentWeek.totalCalories).toBeDefined();
      expect(res.body.currentWeek.shoppingProgress).toBeDefined();
      expect(res.body.overall).toBeDefined();
      expect(res.body.overall.totalRecipes).toBeDefined();
      expect(res.body.overall.totalMealPlans).toBeDefined();
    });

    it('should reflect created recipes in stats', async () => {
      const user = await createTestUser();

      await createTestRecipe(user.token, { title: 'Stats Recipe 1' });
      await createTestRecipe(user.token, { title: 'Stats Recipe 2' });

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body.overall.totalRecipes).toBeGreaterThanOrEqual(2);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(401);
    });
  });
});
