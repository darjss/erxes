import { Router } from 'express';
import { router as invoiceRoutes } from './invoice';

const router: Router = Router();

router.use(invoiceRoutes);

export { router };
