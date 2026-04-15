import crypto from 'crypto';
import { Resolver } from 'erxes-api-shared/core-types';

const { MUSHOP_API_URL, MUSHOP_SECRET, MUSHOP_PUBLIC_API_KEY } = process.env;

interface IData {
  [key: string]: any;
}

interface IPayload {
  data: IData;
  entityId?: string;
  entities?: IData;
}

interface SendMessagePayload {
  subdomain: string;
  path: string;
  payload: IPayload;
}

const buildPayload = (
  entity: any,
  args: any,
  context: any,
  options: { fields?: string[] },
) => {
  const payload: IPayload = {
    data: {
      ...args,
      userId: context?.user?._id,
    },
  };

  if (Array.isArray(entity)) {
    payload.entities = entity;

    if (options.fields) {
      const entities = {};

      for (const item of entity) {
        entities[item._id] = {};

        for (const field of options.fields) {
          entities[item._id][field] = item[field];
        }
      }

      payload.entities = entities;
    }
  }

  if (typeof entity === 'object') {
    payload.entityId = entity._id;
  }

  return payload;
};

export const sendMessage = ({ subdomain, path, payload }: SendMessagePayload) => {
  const base = MUSHOP_API_URL;
  const secret = MUSHOP_SECRET || MUSHOP_PUBLIC_API_KEY;

  if (!base || !secret) {
    return console.error(
      'MUSHOP_API_URL or (MUSHOP_SECRET/MUSHOP_PUBLIC_API_KEY) is not set',
    );
  }

  const API_ENDPOINT = `${base}/webhook/${path}`;

  try {
    const body = JSON.stringify({ subdomain, payload });

    const signature = crypto
      .createHmac('sha256', secret)
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
      console.error(`Failed to send message to mushop: ${e}`);
    });
  } catch (e) {
    console.error(`Failed to send message to mushop: ${e}`);
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
          payload: buildPayload(
            entity?.response || entity,
            args,
            context,
            entity.options,
          ),
        });
      }

      return entity?.response || entity;
    };
  }

  return mutations;
};
