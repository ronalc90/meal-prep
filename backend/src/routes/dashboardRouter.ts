import { Router, Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get(
  '/stats',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await dashboardService.getDashboardStats(req.user!.userId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
