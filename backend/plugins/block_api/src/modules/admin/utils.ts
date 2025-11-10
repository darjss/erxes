import { Resolver } from 'erxes-api-shared/core-types';
import fetch from 'node-fetch';

const { BLOCK_ADMIN_API_URL } = process.env;

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

  try {
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
