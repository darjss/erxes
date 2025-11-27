import { router as projectRoutes } from '@/project/routes';
import { router as developerRoutes } from '@/developer/routes';
import { Router } from 'express';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';

const router: Router = Router();

router.use('/webhook', validationMiddleware, [developerRoutes, projectRoutes]);

export { router };
