import { Router } from 'express';
import { router as attachmentRoutes } from './attachment';

const router: Router = Router();

router.use(attachmentRoutes);

export { router };
