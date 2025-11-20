import { router as attachmentRoutes } from '@/attachment/routes';
import { router as companyRoutes } from '~/modules/company/routes';
import { router as documentRoutes } from '@/document/routes';
import { router as newsRoutes } from '~/modules/news/routes';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';

import { Router } from 'express';

const router: Router = Router();

router.use('/api', validationMiddleware, [
  attachmentRoutes,
  companyRoutes,
  documentRoutes,
  newsRoutes,
]);

export { router };
