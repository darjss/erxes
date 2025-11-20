import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockDocument } from '../@types/document';

const router: Router = Router();

router.post(
  '/blockCreateDocument',
  async (req: IRequest<IBlockDocument>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.BlockDocument.createBlockDocument({
        ...input,
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

router.post(
  '/blockUpdateDocument',
  async (req: IRequest<IBlockDocument>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.BlockDocument.updateBlockDocument(subdomain, entityId, input);

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
  '/blockDeleteDocument',
  async (req: IRequest<IBlockDocument>, res: IResponse) => {
    const models = await generateModels();

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.BlockDocument.removeBlockDocument(subdomain, entityId);

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
