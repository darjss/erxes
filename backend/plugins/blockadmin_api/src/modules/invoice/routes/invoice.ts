import { Router } from 'express';
import { IRequest, IResponse } from '~/types';

const router: Router = Router();

router.post(
  '/blockPayInvoice',
  async (req: IRequest<{}, { paidDate: Date }>, res: IResponse) => {
    const { models } = res.locals;

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
  },
);

export { router };
