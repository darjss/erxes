import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockAttachment } from '../@types/attachment';

const router: Router = Router();

router.post(
  '/blockCreateAttachment',
  async (req: IRequest<IBlockAttachment>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.BlockAttachment.createBlockAttachment({
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
  '/blockUpdateAttachment',
  async (req: IRequest<IBlockAttachment>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.BlockAttachment.updateBlockAttachment(subdomain, entityId, input);

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
  '/blockDeleteAttachment',
  async (req: IRequest<IBlockAttachment>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.BlockAttachment.removeBlockAttachment(subdomain, entityId);

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
