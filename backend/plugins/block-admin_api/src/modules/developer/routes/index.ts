import { Router } from 'express';
import { router as developerRoutes } from './developer';

const router: Router = Router();

router.use(developerRoutes);

export { router };
