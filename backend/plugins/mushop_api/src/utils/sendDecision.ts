import crypto from 'crypto';

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

  const API_ENDPOINT = `${SUPPLIER_API_URL}/webhook/mushop/submission`;

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
