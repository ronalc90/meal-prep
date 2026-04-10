import { Router, Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipeService';
import { createRecipeSchema, updateRecipeSchema } from '../types/schemas';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// List recipes (public + own) with search/filter
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Optional auth - if authenticated, include private recipes
      let userId: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const { verifyToken } = await import('../utils/jwt');
          const payload = verifyToken(authHeader.split(' ')[1]);
          userId = payload.userId;
        } catch {
          // Invalid token is fine for public listing
        }
      }

      const result = await recipeService.listRecipes(
        req.query as Record<string, string>,
        userId,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

// Get single recipe
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await recipeService.getRecipeById(req.params.id);
      res.json(recipe);
    } catch (error) {
      next(error);
    }
  },
);

// Create recipe (auth required)
router.post(
  '/',
  authenticate,
  validate(createRecipeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await recipeService.createRecipe(req.body, req.user!.userId);
      res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  },
);

// Update recipe (auth required)
router.put(
  '/:id',
  authenticate,
  validate(updateRecipeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await recipeService.updateRecipe(req.params.id, req.body, req.user!.userId);
      res.json(recipe);
    } catch (error) {
      next(error);
    }
  },
);

// Delete recipe (auth required)
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await recipeService.deleteRecipe(req.params.id, req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export default router;
