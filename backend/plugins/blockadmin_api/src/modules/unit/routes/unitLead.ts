import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IUnitLead } from '../@types/unitLead';

const router: Router = Router();

router.post(
  '/blockAddUnitLead',
  async (req: IRequest<IUnitLead>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.UnitLead.createUnitLead({ ...input, subdomain, entityId });

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
  '/blockRemoveUnitLead',
  async (req: IRequest<IUnitLead>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.UnitLead.removeUnitLead(subdomain, entityId);

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
