import request from 'supertest';
import { app, createTestUser, createTestRecipe } from './helpers';
import './setup';

describe('Recipe API', () => {
  describe('POST /api/recipes', () => {
    it('should create a recipe with ingredients', async () => {
      const user = await createTestUser();
      const recipe = await createTestRecipe(user.token, {
        title: 'My New Recipe',
        calories: 500,
      });

      expect(recipe.title).toBe('My New Recipe');
      expect(recipe.calories).toBe(500);
      expect(recipe.ingredients).toHaveLength(2);
      expect(recipe.userId).toBe(user.id);
    });

    it('should reject recipe without ingredients', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'No ingredients',
          ingredients: [],
        });

      expect(res.status).toBe(400);
    });

    it('should reject recipe without title', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          ingredients: [{ name: 'test', quantity: 1, unit: 'cup' }],
        });

      expect(res.status).toBe(400);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/recipes')
        .send({ title: 'No Auth', ingredients: [{ name: 'x', quantity: 1, unit: 'cup' }] });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/recipes', () => {
    it('should list public recipes', async () => {
      const user = await createTestUser();
      await createTestRecipe(user.token, { title: 'Public Recipe 1' });
      await createTestRecipe(user.token, { title: 'Public Recipe 2' });

      const res = await request(app).get('/api/recipes');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    });

    it('should support search', async () => {
      const user = await createTestUser();
      await createTestRecipe(user.token, { title: 'Unique Chicken Soup' });

      const res = await request(app)
        .get('/api/recipes?search=Unique Chicken');

      expect(res.status).toBe(200);
      expect(res.body.data.some((r: { title: string }) => r.title === 'Unique Chicken Soup')).toBe(true);
    });

    it('should support pagination', async () => {
      const user = await createTestUser();
      for (let i = 0; i < 5; i++) {
        await createTestRecipe(user.token, { title: `Paginated Recipe ${i}` });
      }

      const res = await request(app).get('/api/recipes?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(2);
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should get a single recipe with ingredients', async () => {
      const user = await createTestUser();
      const recipe = await createTestRecipe(user.token, { title: 'Detail Recipe' });

      const res = await request(app).get(`/api/recipes/${recipe.id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Detail Recipe');
      expect(res.body.ingredients).toBeDefined();
    });

    it('should return 404 for non-existent recipe', async () => {
      const res = await request(app).get('/api/recipes/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('should update own recipe', async () => {
      const user = await createTestUser();
      const recipe = await createTestRecipe(user.token, { title: 'Original Title' });

      const res = await request(app)
        .put(`/api/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
    });

    it('should reject updating another user recipe', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const recipe = await createTestRecipe(user1.token, { title: 'User1 Recipe' });

      const res = await request(app)
        .put(`/api/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ title: 'Stolen' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('should delete own recipe', async () => {
      const user = await createTestUser();
      const recipe = await createTestRecipe(user.token, { title: 'To Delete' });

      const res = await request(app)
        .delete(`/api/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(204);

      // Verify deleted
      const getRes = await request(app).get(`/api/recipes/${recipe.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
