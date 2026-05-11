import { Router, Request, Response } from 'express';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { getActiveBundleTypes } from '@/collective/utils/getActiveBundleTypes';

const COLLECTIVE_BUNDLE_TYPE = 'mushop-coshop';

const router: Router = Router();

interface CollectiveProductResult {
  code?: string;
  ok: boolean;
  productId?: string;
  error?: string;
}

router.post('/collective', async (req: Request, res: Response) => {
  try {
    const { subdomain, payload } = req.body || {};
    const { collectiveId, products } = payload || {};

    if (!subdomain) {
      return res.status(400).json({ error: 'subdomain is required' });
    }
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: 'payload.products must be an array' });
    }

    const bundleTypes = await getActiveBundleTypes(subdomain);
    if (!bundleTypes.includes(COLLECTIVE_BUNDLE_TYPE)) {
      return res.status(403).json({
        error: `Subdomain "${subdomain}" does not have an active "${COLLECTIVE_BUNDLE_TYPE}" bundle`,
      });
    }

    const results: CollectiveProductResult[] = [];

    for (const doc of products) {
      try {
        const created = await sendTRPCMessage({
          subdomain,
          pluginName: 'core',
          method: 'mutation',
          module: 'products',
          action: 'createProduct',
          input: { doc },
          defaultValue: null,
        });
        if (!created) {
          results.push({
            code: doc?.code,
            ok: false,
            error: 'createProduct returned null',
          });
        } else {
          results.push({ code: doc?.code, ok: true, productId: created._id });
        }
      } catch (e: any) {
        results.push({
          code: doc?.code,
          ok: false,
          error: e?.message || String(e),
        });
      }
    }

    const created = results.filter((r) => r.ok).length;
    const failed = results.length - created;

    return res.status(200).json({
      success: true,
      collectiveId,
      total: results.length,
      created,
      failed,
      results,
    });
  } catch (e: any) {
    console.error('collective webhook failed:', e);
    return res.status(400).json({ error: e.message });
  }
});

export { router };
