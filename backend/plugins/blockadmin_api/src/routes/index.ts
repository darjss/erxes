import { router as attachmentRoutes } from '@/attachment/routes';
import { router as buildingRoutes } from '@/building/routes';
import { router as developerRoutes } from '@/developer/routes';
import { router as documentRoutes } from '@/document/routes';
import { router as invoiceRoutes } from '@/invoice/routes';
import { router as projectRoutes } from '@/project/routes';
import { router as unitRoutes } from '@/unit/routes';
import { Router } from 'express';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';

const router: Router = Router();

router.use('/webhook', validationMiddleware, [
  attachmentRoutes,
  buildingRoutes,
  developerRoutes,
  documentRoutes,
  invoiceRoutes,
  projectRoutes,
  unitRoutes,
]);

export { router };
