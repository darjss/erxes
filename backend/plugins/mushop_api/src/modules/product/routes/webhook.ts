import { Router, Request, Response } from 'express';
import { generateModels } from '~/connectionResolvers';

const router: Router = Router();

router.post('/syncProduct', async (req: Request, res: Response) => {
  try {
    const { subdomain, payload } = req.body || {};
    const { entityId, data } = payload || {};
    const { product, action } = data || {};

    console.log('req.body', JSON.stringify(payload, null, 2))

    if (!subdomain) {
      return res.status(400).json({ error: 'subdomain is required' });
    }

    if (!entityId) {
      return res.status(400).json({ error: 'payload.entityId is required' });
    }

    const models = await generateModels(subdomain);

    console.log('action', action)

    if (action === 'delete') {
      await models.MushopProduct.deleteOne({ subdomain, entityId });
      return res.status(200).json({ success: true });
    }

    const {
      vendorId,
      name,
      shortName,
      code,
      type,
      description,
      barcodes,
      variants,
      barcodeDescription,
      unitPrice,
      categoryId,
      category,
      propertiesData,
      tagIds,
      attachment,
      attachmentMore,
      scopeBrandIds,
      uom,
      subUoms,
      currency,
      pdfAttachment,
    } = product || {};

    await models.MushopProduct.syncProduct(subdomain, entityId, {
      vendorId,
      name,
      shortName,
      code,
      type,
      description,
      barcodes,
      variants,
      barcodeDescription,
      unitPrice,
      categoryId,
      category,
      propertiesData,
      tagIds,
      attachment,
      attachmentMore,
      scopeBrandIds,
      uom,
      subUoms,
      currency,
      pdfAttachment,
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

export { router };
