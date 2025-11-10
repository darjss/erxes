import { Router } from 'express';
import { router as memberRoutes } from './member';
import { router as paymentRoutes } from './payment';
import { router as projectRoutes } from './project';

const router: Router = Router();

router.use(projectRoutes);
router.use(memberRoutes);
router.use(paymentRoutes);

export { router };
