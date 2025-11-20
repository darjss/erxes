import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IUnit } from '../@types/unit';

const router: Router = Router();

router.post(
  '/blockCreateUnit',
  async (req: IRequest<IUnit>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const zoning = await models.Zoning.getBuildingZoning(
        subdomain,
        input.zoning,
      );

      models.Unit.createUnit({
        ...input,
        subdomain,
        entityId,
        zoning: zoning._id,
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
  '/blockUpdateUnit',
  async (req: IRequest<IUnit>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.Unit.updateUnit(subdomain, entityId, input);

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
  '/blockDeleteUnit',
  async (req: IRequest<IUnit>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.Unit.removeUnit(subdomain, entityId);

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
