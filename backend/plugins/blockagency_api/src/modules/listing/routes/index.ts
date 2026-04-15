import { Router } from 'express';
import { router as listingRoutes } from './listing';

const router: Router = Router();

router.use(listingRoutes);

export { router };
