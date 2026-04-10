import request from 'supertest';
import app from '../app';
import { prisma } from './setup';
import bcrypt from 'bcryptjs';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

let userCounter = 0;

export async function createTestUser(overrides?: { email?: string; name?: string }): Promise<TestUser> {
  userCounter++;
  const email = overrides?.email || `test${userCounter}@mealprep.test`;
  const name = overrides?.name || `Test User ${userCounter}`;

  const passwordHash = await bcrypt.hash('password123', 4); // Low rounds for speed in tests

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'password123' });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    token: loginResponse.body.token,
  };
}

export async function createTestRecipe(token: string, overrides?: Record<string, unknown>) {
  const defaultRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe for automated testing',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    calories: 400,
    isPublic: true,
    ingredients: [
      { name: 'test ingredient 1', quantity: 2, unit: 'cups', category: 'PRODUCE' },
      { name: 'test ingredient 2', quantity: 500, unit: 'g', category: 'MEAT' },
    ],
    ...overrides,
  };

  const response = await request(app)
    .post('/api/recipes')
    .set('Authorization', `Bearer ${token}`)
    .send(defaultRecipe);

  return response.body;
}

export { app };
