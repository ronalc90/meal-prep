import request from 'supertest';
import { app, createTestUser } from './helpers';
import './setup';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@mealprep.test',
          password: 'securepass123',
          name: 'New User',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('newuser@mealprep.test');
      expect(res.body.user.name).toBe('New User');
      expect(res.body.token).toBeDefined();
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should reject duplicate emails', async () => {
      await createTestUser({ email: 'dupe@mealprep.test' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'dupe@mealprep.test',
          password: 'securepass123',
          name: 'Dupe User',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'notanemail',
          password: 'securepass123',
          name: 'Bad Email',
        });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'short@mealprep.test',
          password: '123',
          name: 'Short Pass',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const user = await createTestUser({ email: 'login@mealprep.test' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@mealprep.test',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('login@mealprep.test');
    });

    it('should reject invalid password', async () => {
      await createTestUser({ email: 'wrongpass@mealprep.test' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpass@mealprep.test',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@mealprep.test',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return profile for authenticated user', async () => {
      const user = await createTestUser({ email: 'me@mealprep.test' });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${user.token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('me@mealprep.test');
      expect(res.body).not.toHaveProperty('passwordHash');
    });

    it('should reject missing token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
