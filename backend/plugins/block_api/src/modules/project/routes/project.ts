import { getSubdomain } from 'erxes-api-shared/utils';
import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IProject } from '../@types/project';

const router: Router = Router();

router.post(
  '/updateProjectPublishInfo',
  async (req: IRequest<IProject>, res: IResponse) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      const { payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { isPublished } = data || {};

      models.Project.updateProject({ _id: entityId, input: { isPublished } });

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
