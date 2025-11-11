import { Router } from 'express';
import { router as documentRoutes } from './document';

const router: Router = Router();

router.use(documentRoutes);

export { router };
