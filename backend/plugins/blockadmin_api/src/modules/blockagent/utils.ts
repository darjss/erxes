import crypto from 'crypto';
import { isDev } from 'erxes-api-shared/utils';

const { BLOCKAGENT_API_URL, BLOCK_ADMIN_SECRET } = process.env;

interface SendMessagePayload {
  subdomain: string;
  path: string;
  payload: {
    data: Record<string, any>;
    entityId: string;
  };
}

export const sendBlockAgentMessage = async ({
  subdomain,
  path,
  payload,
}: SendMessagePayload): Promise<Response> => {
  if (!BLOCKAGENT_API_URL || !BLOCK_ADMIN_SECRET) {
    throw new Error('BLOCKAGENT_API_URL or BLOCK_ADMIN_SECRET is not set');
  }

  const BLOCKAGENT_DOMAIN = isDev
    ? BLOCKAGENT_API_URL
    : BLOCKAGENT_API_URL.replace('<subdomain>', subdomain);

  const API_ENDPOINT = `${BLOCKAGENT_DOMAIN}/pl:blockagent/webhook/${path}`;

  try {
    const body = JSON.stringify({ payload });

    const signature = crypto
      .createHmac('sha256', BLOCK_ADMIN_SECRET)
      .update(body)
      .digest('hex');

    return await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    });
  } catch (e) {
    throw new Error(`Failed to send message to blockagent: ${e}`);
  }
};
