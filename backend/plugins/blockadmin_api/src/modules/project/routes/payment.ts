import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IProjectPaymentPlan } from '../@types/payment';

const router: Router = Router();

router.post(
  '/blockCreateProjectPaymentPlan',
  async (req: IRequest<IProjectPaymentPlan>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.ProjectPaymentPlan.createProjectPaymentPlan({
        ...input,
        subdomain,
        entityId,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  },
);

router.post(
  '/blockUpdateProjectPaymentPlan',
  async (req: IRequest<IProjectPaymentPlan>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.ProjectPaymentPlan.updateProjectPaymentPlan(
        subdomain,
        entityId,
        input,
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  },
);

export { router };
