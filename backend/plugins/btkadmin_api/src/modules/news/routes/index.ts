import { Router } from 'express';
import { router as memberRoutes } from './member';
import { router as paymentRoutes } from './payment';
import { router as newsRoutes } from './news';

const router: Router = Router();

router.use(newsRoutes);
router.use(memberRoutes);
router.use(paymentRoutes);

export { router };
