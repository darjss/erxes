import crypto from 'crypto';
import { isDev } from 'erxes-api-shared/utils';

const { SUPPLIER_API_URL, MUSHOP_SECRET } = process.env;

interface SendSupplierStatusPayload {
  subdomain: string;
  entityId: string;
  verificationStatus: string;
  note?: string;
}

export const sendSupplierStatusToSupplier = async ({
  subdomain,
  entityId,
  verificationStatus,
  note,
}: SendSupplierStatusPayload) => {
  if (!SUPPLIER_API_URL || !MUSHOP_SECRET) {
    throw new Error('SUPPLIER_API_URL or MUSHOP_SECRET is not configured');
  }

  const SUPPLIER_DOMAIN = isDev
    ? SUPPLIER_API_URL
    : SUPPLIER_API_URL.replace('<subdomain>', subdomain);

  const API_ENDPOINT = `${SUPPLIER_DOMAIN}/pl:supplier/webhook/mushop/supplier`;

  try {
    const body = JSON.stringify({
      subdomain,
      payload: {
        entityId,
        data: { verificationStatus, note },
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
      throw new Error(`Supplier API returned HTTP ${res.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to send supplier status: ${error.message}`);
  }
};
