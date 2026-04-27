import crypto from 'crypto';

const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

interface SendProductPayload {
  subdomain: string;
  entityId: string;
  action: 'update' | 'delete';
  product?: Record<string, any>;
}

export const sendProductToSupplier = async ({
  subdomain,
  entityId,
  action,
  product,
}: SendProductPayload): Promise<void> => {
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    console.error('SUPPLIER_API_URL or MUSHOP_SECRET is not set');
    return;
  }

  const API_ENDPOINT = `${SUPPLIER_API_URL}/webhook/mushop/product`;

  try {
    const body = JSON.stringify({
      subdomain,
      payload: {
        entityId,
        data: { action, product },
      },
    });

    const signature = crypto
      .createHmac('sha256', MUSHOP_SECRET)
      .update(body)
      .digest('hex');

    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`Failed to send product to supplier: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error(`Failed to send product to supplier: ${e}`);
  }
};
