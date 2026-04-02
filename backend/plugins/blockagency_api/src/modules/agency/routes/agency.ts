import { getSubdomain } from 'erxes-api-shared/utils';
import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockAgency } from '../@types/agency';

const router: Router = Router();

router.post(
  '/updateAgencyVerificationStatus',
  async (
    req: IRequest<
      IBlockAgency,
      {
        status: string;
        message?: string;
      }
    >,
    res: IResponse,
  ) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      const { payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { status } = data || {};

      models.BlockAgency.updateAgencyVerificationStatus(entityId, status);

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
