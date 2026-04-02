import { Router } from 'express';
import { router as agencyRoutes } from './agency';

const router: Router = Router();

router.use(agencyRoutes);

export { router };
