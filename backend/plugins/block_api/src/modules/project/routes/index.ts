import { Router } from 'express';
import { router as projectRoutes } from './project';

const router: Router = Router();

router.use(projectRoutes);

export { router };
