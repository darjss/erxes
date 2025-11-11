import { Router } from 'express';
import { router as unitRoutes } from './unit';
import { router as unitLeadRoutes } from './unitLead';

const router: Router = Router();

router.use(unitRoutes);
router.use(unitLeadRoutes);

export { router };
