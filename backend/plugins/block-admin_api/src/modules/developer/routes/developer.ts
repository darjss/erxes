import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/updateDeveloperInfo', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};

    const developer = await models.Developer.findOne({ subdomain, entityId });

    if (!developer) {
      models.Developer.createDeveloper({ subdomain, entityId, ...input });
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
});

export { router };
