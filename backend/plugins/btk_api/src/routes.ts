import { getSubdomain } from 'erxes-api-shared/utils';
import { Router, Request, Response } from 'express';
import { generateModels } from '~/connectionResolvers';
import { validator as validationMiddleware } from '~/middlewares/validationMiddleware';

const router: Router = Router();

router.post(
  '/api/updateCompanyVerificationStatus',
  validationMiddleware,
  async (req: Request, res: Response) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      const { entityId, verificationStatus } = req.body || {};

      await models.Company.findOneAndUpdate(
        { _id: entityId },
        { verificationStatus },
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

router.post(
  '/api/updateNewsVerificationStatus',
  validationMiddleware,
  async (req: Request, res: Response) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      const { entityId, verificationStatus } = req.body || {};

      await models.News.findOneAndUpdate(
        { _id: entityId },
        { verificationStatus },
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

export { router };
