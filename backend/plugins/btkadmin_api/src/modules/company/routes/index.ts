import { Router } from 'express';
import { router as companyRoutes } from './company';

const router: Router = Router();

router.use(companyRoutes);

export { router };
