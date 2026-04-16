import { getSubdomain } from 'erxes-api-shared/utils';
import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/updateListingStatus', async (req, res) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  try {
    const { payload } = req.body || {};
    const { entityId, data } = payload || {};
    const { input } = data || {};

    if (!entityId) {
      return res.status(400).json({ error: 'entityId is required' });
    }

    await models.BlockListing.findByIdAndUpdate(
      entityId,
      { $set: input },
      { new: true },
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/removeListing', async (req, res) => {
  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  try {
    const { payload } = req.body || {};
    const { entityId } = payload || {};

    if (!entityId) {
      return res.status(400).json({ error: 'entityId is required' });
    }

    await models.BlockListing.removeListing(entityId);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export { router };
