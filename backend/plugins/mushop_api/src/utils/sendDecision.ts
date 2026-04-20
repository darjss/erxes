import crypto from 'crypto';

const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

interface SendDecisionPayload {
  subdomain: string;
  entityId: string;
  status: string;
  note?: string;
}

export const sendDecisionToSupplier = ({
  subdomain,
  entityId,
  status,
  note,
}: SendDecisionPayload) => {
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    return console.error(
      'SUPPLIER_API_URL or MUSHOP_SECRET is not set',
    );
  }

  const API_ENDPOINT = `${SUPPLIER_API_URL}/webhook/receiveDecision`;

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

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    }).catch((e) => {
      console.error(`Failed to send decision to supplier: ${e}`);
    });
  } catch (e) {
    console.error(`Failed to send decision to supplier: ${e}`);
  }
};
