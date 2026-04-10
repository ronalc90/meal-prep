import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './routes/authRouter';
import recipeRouter from './routes/recipeRouter';
import mealPlanRouter from './routes/mealPlanRouter';
import shoppingListRouter from './routes/shoppingListRouter';
import dashboardRouter from './routes/dashboardRouter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3011', 'http://localhost:8080', 'http://127.0.0.1:5500'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/meal-plans', mealPlanRouter);
app.use('/api/shopping-lists', shoppingListRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
