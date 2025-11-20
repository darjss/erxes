import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/btkCreateAttachment', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};
    models.BtkAttachment.createBtkAttachment({
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

router.post('/btkUpdateAttachment', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};

    models.BtkAttachment.updateBtkAttachment(subdomain, entityId, input);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post('/btkDeleteAttachment', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId } = payload || {};

    models.BtkAttachment.removeBtkAttachment(subdomain, entityId);

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
