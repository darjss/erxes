import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { isDev, sendTRPCMessage } from 'erxes-api-shared/utils';
import {
  COLLECTIVE_BUNDLE_TYPE,
  isValid,
} from '@/collective/utils/isCollective';

const router: Router = Router();

interface CollectiveProductResult {
  code?: string;
  entityId?: string;
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

    if (!(await isValid(subdomain, COLLECTIVE_BUNDLE_TYPE))) {
      return res.status(403).json({
        error: `Subdomain "${subdomain}" does not have an active "${COLLECTIVE_BUNDLE_TYPE}" bundle`,
      });
    }

    const results: CollectiveProductResult[] = [];

    for await (const doc of products) {
      const { _id: entityId, ...createDoc } = doc || {};

      try {
        const created = await sendTRPCMessage({
          subdomain,
          pluginName: 'core',
          method: 'mutation',
          module: 'products',
          action: 'createProduct',
          input: { doc: createDoc },
          defaultValue: null,
        });

        if (!created) {
          results.push({
            code: doc?.code,
            entityId,
            ok: false,
            error: 'createProduct returned null',
          });
        } else {
          results.push({
            code: doc?.code,
            entityId,
            ok: true,
            productId: created._id,
          });
        }
      } catch (e: any) {
        results.push({
          code: doc?.code,
          entityId,
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

router.post('/collective-push', async (req: Request, res: Response) => {
  try {
    const { subdomain, payload } = req.body || {};
    const { collectiveId, targetSubdomain, posToken } = payload || {};

    if (!subdomain) {
      return res.status(400).json({ error: 'subdomain is required' });
    }

    if (!targetSubdomain) {
      return res.status(400).json({ error: 'targetSubdomain is required' });
    }

    if (!posToken) {
      return res.status(400).json({ error: 'posToken is required' });
    }

    if (!(await isValid(subdomain, COLLECTIVE_BUNDLE_TYPE))) {
      return res.status(403).json({
        error: `Subdomain "${subdomain}" does not have an active "${COLLECTIVE_BUNDLE_TYPE}" bundle`,
      });
    }

    const products = (await sendTRPCMessage({
      subdomain,
      pluginName: 'posclient',
      method: 'query',
      module: 'products',
      action: 'findByToken',
      input: { token: posToken },
      defaultValue: [],
    })) as Record<string, any>[];

    if (!products.length) {
      return res.status(200).json({
        success: true,
        collectiveId,
        total: 0,
        created: 0,
        failed: 0,
        results: [],
      });
    }

    const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

    if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
      return res
        .status(500)
        .json({ error: 'SUPPLIER_API_URL or MUSHOP_SECRET is not configured' });
    }

    const baseUrl = isDev
      ? SUPPLIER_API_URL
      : SUPPLIER_API_URL.replace('<subdomain>', targetSubdomain);

    const endpoint = `${baseUrl}/webhook/mushop/collective`;

    const body = JSON.stringify({
      subdomain: targetSubdomain,
      payload: { collectiveId, products: products.map((p) => ({ ...p, code: `${subdomain}:${p.code}` })) },
    });

    const signature = crypto
      .createHmac('sha256', MUSHOP_SECRET)
      .update(body)
      .digest('hex');

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(120000),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return res
        .status(502)
        .json({ error: `target HTTP ${upstream.status}: ${text}` });
    }

    return res.status(200).type('application/json').send(text);
  } catch (e: any) {
    console.error('collective-push webhook failed:', e);

    return res.status(400).json({ error: e.message });
  }
});

export { router };
