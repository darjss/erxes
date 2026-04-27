import { Router } from 'express';
import { validationMiddleware } from '~/middlewares/validationMiddleware';
import { router as webhookRouter } from '@/platform/routes/webhook';

const router: Router = Router();

router.use('/webhook', validationMiddleware, webhookRouter);

export { router };
