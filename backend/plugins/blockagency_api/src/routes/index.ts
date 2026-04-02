import { router as agencyRoutes } from '@/agency/routes';
import { Router } from 'express';

const router: Router = Router();

router.use(agencyRoutes);

export { router };
