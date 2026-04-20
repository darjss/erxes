import { Router } from 'express';
import { validationMiddleware } from '~/middlewares/validationMiddleware';
import { router as supplierWebhookRoutes } from '@/supplier/routes/webhook';
import { router as productWebhookRoutes } from '@/product/routes/webhook';

const router: Router = Router();

router.use('/webhook', validationMiddleware, [
  supplierWebhookRoutes,
  productWebhookRoutes,
]);

export default router;
