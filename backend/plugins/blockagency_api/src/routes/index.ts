import { router as agencyRoutes } from '@/agency/routes';
import { router as listingRoutes } from '@/listing/routes';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';

import { Router } from 'express';

const router: Router = Router();

router.use('/webhook', validationMiddleware, [agencyRoutes, listingRoutes]);
export { router };
