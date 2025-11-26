import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IUnitType } from '../@types/unitType';

const router: Router = Router();

router.post(
  '/blockCreateUnitType',
  async (req: IRequest<IUnitType>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const project = await models.Project.getProject(subdomain, entityId);

      models.UnitType.create({
        ...input,
        subdomain,
        entityId,
        project: project._id,
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
  '/blockUpdateUnitType',
  async (req: IRequest<IUnitType>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.UnitType.updateUnitType(subdomain, entityId, input);

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
