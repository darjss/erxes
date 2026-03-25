import { sendNotification } from 'erxes-api-shared/core-modules';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
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

router.post(
  '/updateAgencyVerificationStatus',
  async (req: IRequest<IBlockAgency>, res: IResponse) => {
    const { subdomain: block, models } = res.locals;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      const agency = await models.Agency.getAgency(subdomain, entityId);

      if (!agency) {
        return res.status(400).json({
          error: 'Agency not found',
        });
      }

      models.Agency.updateAgencyVerificationStatus(
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
        title: 'New agency verification request',
        message: 'A new agency verification request has been received.',
        type: 'info',
        userIds: owners.map((owner) => owner.userId),
        priority: 'low',
        kind: 'system',
        contentType: `block:agency.verification`,
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
