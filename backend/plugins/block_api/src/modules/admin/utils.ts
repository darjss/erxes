import crypto from 'crypto';
import { Resolver } from 'erxes-api-shared/core-types';
import fetch from 'node-fetch';

const { BLOCK_ADMIN_API_URL, BLOCK_ADMIN_SECRET } = process.env;

interface SendMessagePayload {
  subdomain: string;
  path: string;
  payload: {
    data: Record<string, any>;
    entityId: string;
  };
}

const sendMessage = ({ subdomain, path, payload }: SendMessagePayload) => {
  const API_ENDPOINT = `${BLOCK_ADMIN_API_URL}/${path}`;

  if (!BLOCK_ADMIN_API_URL || !BLOCK_ADMIN_SECRET) {
    return console.log('BLOCK_ADMIN_API_URL or BLOCK_ADMIN_SECRET is not set');
  }

  try {
    const body = JSON.stringify({ subdomain, payload });

    const signature = crypto
      .createHmac('sha256', BLOCK_ADMIN_SECRET)
      .update(body)
      .digest('hex');

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body: JSON.stringify({ subdomain, payload }),
    });
  } catch (e) {
    console.error(`Failed to send message to block-admin: ${e}`);
  }
};

export const wrapMutationResolver = (mutations: Record<string, Resolver>) => {
  for (const [path, resolver] of Object.entries(mutations)) {
    mutations[path] = async (root, args, context, info) => {
      const entity = await resolver(root, args, context, info);

      if (entity) {
        sendMessage({
          subdomain: context.subdomain,
          path,
          payload: {
            data: args,
            entityId: entity?._id || args?._id,
          },
        });
      }

      return entity;
    };
  }

  return mutations;
};
