import { sendNotification } from 'erxes-api-shared/core-modules';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { Router } from 'express';
import { IRequest, IResponse } from '~/types';
import { IBlockDeveloper } from '../db/@types/developer';

const router: Router = Router();

router.post(
  '/updateDeveloperInfo',
  async (req: IRequest<IBlockDeveloper>, res: IResponse) => {
    const { models } = res.locals;

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

router.post(
  '/updateDeveloperVerificationStatus',
  async (req: IRequest<IBlockDeveloper>, res: IResponse) => {
    const { subdomain: block, models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      const developer = await models.Developer.getDeveloper(
        subdomain,
        entityId,
      );

      if (!developer) {
        return res.status(400).json({
          error: 'Developer not found',
        });
      }

      models.Developer.updateDeveloperVerificationStatus(
        subdomain,
        entityId,
        'pending',
      );

      const owners = await sendTRPCMessage({
        subdomain: block,
        pluginName: 'core',
        method: 'query',
        module: 'roles',
        action: 'find',
        input: {
          query: { role: 'owner' },
        },
        defaultValue: [],
      });

      sendNotification(block, {
        title: 'New developer verification request',
        message: 'A new developer verification request has been received.',
        type: 'info',
        userIds: owners.map((owner) => owner.userId),
        priority: 'low',
        kind: 'system',
        contentType: `block:developer.verification`,
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
