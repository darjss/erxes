import { Router } from 'express';
import { router as unitRoutes } from './unit';
import { router as unitLeadRoutes } from './unitLead';
import { router as unitTypeRoutes } from './unitType';

const router: Router = Router();

router.use(unitRoutes);
router.use(unitTypeRoutes);
router.use(unitLeadRoutes);

export { router };
