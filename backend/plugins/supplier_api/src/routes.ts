import { Router } from 'express';
import { router as webhookRouter } from '@/platform/routes/webhook';

const router: Router = Router();

router.use('/webhook', webhookRouter);

export { router };
