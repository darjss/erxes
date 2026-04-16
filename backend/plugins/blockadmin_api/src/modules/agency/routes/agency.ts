import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockAgency } from '../@types/agency';

const router: Router = Router();

router.post(
  '/updateAgencyInfo',
  async (req: IRequest<IBlockAgency>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const agency = await models.Agency.findOne({ subdomain, entityId });

      if (!agency) {
        models.Agency.createAgency({ ...input, subdomain, entityId });
      } else {
        models.Agency.updateAgency(subdomain, entityId, input);
      }

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
