import crypto from 'crypto';
import { isDev } from 'erxes-api-shared/utils';

const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

interface SendDecisionPayload {
  subdomain: string;
  entityId: string;
  status: string;
  note?: string;
}

export const sendMessageToSupplier = async ({
  subdomain,
  entityId,
  status,
  note,
}: SendDecisionPayload): Promise<void> => {
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    console.error('SUPPLIER_API_URL or MUSHOP_SECRET is not set');
    return;
  }

  const SUPPLIER_DOMAIN = isDev
    ? SUPPLIER_API_URL
    : SUPPLIER_API_URL.replace('<subdomain>', subdomain);

  const API_ENDPOINT = `${SUPPLIER_DOMAIN}/pl:supplier/webhook/mushop/submission`;

  try {
    const body = JSON.stringify({
      subdomain,
      payload: {
        entityId,
        data: { status, note },
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
      console.error(`Failed to send decision to supplier: HTTP ${res.status}`);
    }
  } catch (e) {
    console.error(`Failed to send decision to supplier: ${e}`);
  }
};
