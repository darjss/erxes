import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IUnit } from '../@types/unit';

const router: Router = Router();

router.post(
  '/blockCreateUnit',
  async (req: IRequest<IUnit>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const zoning = await models.Zoning.getBuildingZoning(
        subdomain,
        input.zoning,
      );
      
      console.log('zoning', zoning)
      
      if (input?.type) {
        const unitType = await models.UnitType.getUnitType(subdomain, input.type);

        input['type'] = unitType._id;
      }
      
      models.Unit.createUnit({
        ...input,
        subdomain,
        entityId,
        zoning: zoning._id,
      });

      console.log('created')

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
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      if (input?.type) {
        const unitType = await models.UnitType.getUnitType(subdomain, input.type);

        input['type'] = unitType._id;
      }

      models.Unit.updateUnit(subdomain, entityId, {
        ...input,
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
  '/blockRemoveUnit',
  async (req: IRequest<IUnit>, res: IResponse) => {
    const { models } = res.locals as IContext;

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

router.post(
  '/blockRemoveUnits',
  async (req: IRequest<IUnit, { _ids: string[] }>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { data } = payload || {};

      const { _ids } = data || {};

      const unitIds = await models.Unit.find({
        subdomain,
        entityId: { $in: _ids },
      }).distinct('_id');

      models.Unit.deleteMany({
        _id: { $in: unitIds },
      })
        .then(() => console.log('yey'))
        .catch((error) => console.log(error));

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
