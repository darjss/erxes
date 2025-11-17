import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockDeveloper } from '../db/@types/developer';

const router: Router = Router();

router.post(
  '/updateDeveloperInfo',
  async (req: IRequest<IBlockDeveloper>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const developer = await models.Developer.findOne({ subdomain, entityId });

      if (!developer) {
        models.Developer.createDeveloper({ ...input, subdomain, entityId });
      } else {
        models.Developer.updateDeveloper(subdomain, entityId, input);
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
