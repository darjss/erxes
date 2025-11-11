import { Router } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/blockPayInvoice', async (req, res) => {
  const models = await generateModels();

  try {
    const { subdomain, payload } = req.body || {};

    const { entityId, data } = payload || {};

    const { paidDate } = data || {};

    models.Invoice.updateInvoice(subdomain, entityId, {
      paidDate: paidDate || new Date(),
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

export { router };
