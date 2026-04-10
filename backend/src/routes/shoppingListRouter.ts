import { Router, Request, Response, NextFunction } from 'express';
import * as shoppingListService from '../services/shoppingListService';
import { generateShoppingListSchema, toggleItemSchema } from '../types/schemas';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Generate shopping list from meal plan
router.post(
  '/generate',
  validate(generateShoppingListSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shoppingList = await shoppingListService.generateShoppingList(
        req.body.mealPlanId,
        req.user!.userId,
      );
      res.status(201).json(shoppingList);
    } catch (error) {
      next(error);
    }
  },
);

// Get shopping list by meal plan id
router.get(
  '/:mealPlanId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shoppingList = await shoppingListService.getShoppingList(
        req.params.mealPlanId,
        req.user!.userId,
      );
      res.json(shoppingList);
    } catch (error) {
      next(error);
    }
  },
);

// Toggle shopping list item checked status
router.patch(
  '/:id/items/:itemId',
  validate(toggleItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await shoppingListService.toggleItem(
        req.params.id,
        req.params.itemId,
        req.body.isChecked,
        req.user!.userId,
      );
      res.json(item);
    } catch (error) {
      next(error);
    }
  },
);

// Export shopping list as text
router.get(
  '/:mealPlanId/export',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const text = await shoppingListService.exportShoppingList(
        req.params.mealPlanId,
        req.user!.userId,
      );
      res.type('text/plain').send(text);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
