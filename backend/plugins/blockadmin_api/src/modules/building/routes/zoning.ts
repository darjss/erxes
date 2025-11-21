import { Router } from 'express';
import { IRequest, IResponse } from '~/types';
import { IZoning } from '../@types/zoning';

const router: Router = Router();

router.post(
  '/blockCreateBuildingZoning',
  async (req: IRequest<IZoning>, res: IResponse) => {
    const { models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const building = await models.Building.getBuilding(
        subdomain,
        input.building,
      );

      models.Zoning.createZoning({
        ...input,
        subdomain,
        entityId,
        building: building._id,
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
  '/blockUpdateBuildingZoning',
  async (req: IRequest<IZoning>, res: IResponse) => {
    const { models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const building = await models.Building.getBuilding(
        subdomain,
        input.building,
      );

      models.Zoning.updateZoning(subdomain, entityId, {
        ...input,
        building: building._id,
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
  '/blockDeleteBuildingZoning',
  async (req: IRequest<IZoning>, res: IResponse) => {
    const { models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.Zoning.deleteZoning(subdomain, entityId);

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
  '/blockDupplicateBuildingZoning',
  async (req: IRequest<{}, { zoningId: string }>, res: IResponse) => {
    const { models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { zoningId } = data || {};

      const building = await models.Zoning.getBuildingZoning(
        subdomain,
        zoningId,
      );

      const { _id, ...rest } = building;

      models.Zoning.createZoning({
        ...rest,
        floor: rest.floor > 0 ? rest.floor + 1 : rest.floor - 1,
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

export { router };
