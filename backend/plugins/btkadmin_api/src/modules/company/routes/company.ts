import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/updateCompanyInfo', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { input } = data || {};

    const company = await models.Company.findOne({ subdomain, entityId });

    if (!company) {
      models.Company.createCompany({ subdomain, entityId, ...input });
    } else {
      models.Company.updateCompany(subdomain, entityId, input);
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
