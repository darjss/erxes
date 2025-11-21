import { router as attachmentRoutes } from '@/attachment/routes';
import { router as documentRoutes } from '@/document/routes';
import { modifierMiddleware } from '~/middlewares/modifierMiddleware';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';
import { router as companyRoutes } from '~/modules/company/routes';
import { router as newsRoutes } from '~/modules/news/routes';

import { Router } from 'express';

const router: Router = Router();

router.use(
  '/api',
  [validationMiddleware, modifierMiddleware],
  [attachmentRoutes, companyRoutes, documentRoutes, newsRoutes],
);

export { router };
