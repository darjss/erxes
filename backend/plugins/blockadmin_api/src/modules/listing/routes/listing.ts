import { Router } from 'express';
import { IContext } from '~/connectionResolvers';
import { IRequest, IResponse } from '~/types';
import { IBlockAdminListing } from '../@types/listing';

const router: Router = Router();

router.post(
  '/blockCreateListing',
  async (req: IRequest<IBlockAdminListing>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      const listing = await models.Listing.findOne({ subdomain, entityId });

      if (!listing) {
        models.Listing.createListing({ ...input, subdomain, entityId });
      } else {
        models.Listing.updateListing(subdomain, entityId, input);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

router.post(
  '/blockUpdateListingGeneralInfo',
  async (req: IRequest<IBlockAdminListing>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId, data } = payload || {};

      const { input } = data || {};

      models.Listing.updateListing(subdomain, entityId, input);

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

router.post(
  '/blockRemoveListing',
  async (req: IRequest<IBlockAdminListing>, res: IResponse) => {
    const { models } = res.locals as IContext;

    try {
      const { subdomain, payload } = req.body || {};

      const { entityId } = payload || {};

      models.Listing.removeListing(subdomain, entityId);

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
);

export { router };
