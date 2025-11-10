import { Router } from 'express';
import { router as buildingRoutes } from './building';
import { router as zoningRoutes } from './zoning';

const router: Router = Router();

router.use(buildingRoutes);
router.use(zoningRoutes);

export { router };
