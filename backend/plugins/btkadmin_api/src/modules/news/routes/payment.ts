import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/btkCreateNewsPaymentPlan', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};

    models.NewsPaymentPlan.createNewsPaymentPlan({
      subdomain,
      entityId,
      ...input,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post('/btkUpdateNewsPaymentPlan', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};

    models.NewsPaymentPlan.updateNewsPaymentPlan(subdomain, entityId, input);

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
