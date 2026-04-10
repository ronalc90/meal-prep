import { Router, Request, Response, NextFunction } from 'express';
import * as mealPlanService from '../services/mealPlanService';
import { createMealPlanSchema, updateMealPlanSchema, autoGenerateSchema } from '../types/schemas';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// All meal plan routes require authentication
router.use(authenticate);

// Get current week's meal plan
router.get(
  '/current',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealPlan = await mealPlanService.getCurrentMealPlan(req.user!.userId);
      res.json(mealPlan);
    } catch (error) {
      next(error);
    }
  },
);

// Get meal plan by week start date
router.get(
  '/week/:weekStart',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealPlan = await mealPlanService.getMealPlanByWeek(
        req.user!.userId,
        req.params.weekStart,
      );
      res.json(mealPlan);
    } catch (error) {
      next(error);
    }
  },
);

// Create new meal plan
router.post(
  '/',
  validate(createMealPlanSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealPlan = await mealPlanService.createMealPlan(req.body, req.user!.userId);
      res.status(201).json(mealPlan);
    } catch (error) {
      next(error);
    }
  },
);

// Update meal plan
router.put(
  '/:id',
  validate(updateMealPlanSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealPlan = await mealPlanService.updateMealPlan(
        req.params.id,
        req.body,
        req.user!.userId,
      );
      res.json(mealPlan);
    } catch (error) {
      next(error);
    }
  },
);

// Auto-generate meal suggestions
router.post(
  '/:id/auto-generate',
  validate(autoGenerateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealPlan = await mealPlanService.autoGenerateMealPlan(
        req.params.id,
        req.user!.userId,
        req.body?.preferences,
      );
      res.json(mealPlan);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
