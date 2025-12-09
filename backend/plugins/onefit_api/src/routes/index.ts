import { Router } from 'express';
import { contextMiddleware } from '~/middlewares/contextMiddleware';
import { validationMiddleware } from '~/middlewares/validationMiddleware';
// import { modifierMiddleware } from '~/middlewares/modifierMiddleware';

const router: Router = Router();

router.use('/webhook', [validationMiddleware, contextMiddleware], []);

export { router };
