import crypto from 'crypto';

const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

interface SendProductPayload {
  subdomain: string;
  entityId: string;
  action: 'update' | 'delete';
  product?: Record<string, any>;
}

export const sendProductToSupplier = ({
  subdomain,
  entityId,
  action,
  product,
}: SendProductPayload) => {
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    return console.error('SUPPLIER_API_URL or MUSHOP_SECRET is not set');
  }

  const API_ENDPOINT = `${SUPPLIER_API_URL}/webhook/receiveProductUpdate`;

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

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    }).catch((e) => {
      console.error(`Failed to send product to supplier: ${e}`);
    });
  } catch (e) {
    console.error(`Failed to send product to supplier: ${e}`);
  }
};
