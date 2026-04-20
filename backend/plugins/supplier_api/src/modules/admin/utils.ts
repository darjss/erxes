import crypto from 'crypto';
import { Resolver } from 'erxes-api-shared/core-types';
import { SubmissionPlatform } from '@/platform/@types/submission';

interface IData {
  [key: string]: any;
}

interface IPayload {
  data: IData;
  entityId?: string;
  entityIds?: string[];
  entities?: IData;
}

interface SendMessagePayload {
  subdomain: string;
  path: string;
  payload: IPayload;
  // when specified, only sends to that platform; otherwise fans out to all
  platform?: SubmissionPlatform;
}

interface ConsumerConfig {
  name: SubmissionPlatform;
  url: string;
  secret: string;
}

const getConsumers = (): ConsumerConfig[] => {
  const consumers: ConsumerConfig[] = [];

  if (process.env.MUSHOP_API_URL && (process.env.MUSHOP_SECRET || process.env.MUSHOP_PUBLIC_API_KEY)) {
    consumers.push({
      name: 'mushop',
      url: process.env.MUSHOP_API_URL,
      secret: (process.env.MUSHOP_SECRET || process.env.MUSHOP_PUBLIC_API_KEY)!,
    });
  }

  if (process.env.BLOCKADMIN_API_URL && (process.env.BLOCKADMIN_SECRET || process.env.BLOCKADMIN_PUBLIC_API_KEY)) {
    consumers.push({
      name: 'blockadmin',
      url: process.env.BLOCKADMIN_API_URL,
      secret: (process.env.BLOCKADMIN_SECRET || process.env.BLOCKADMIN_PUBLIC_API_KEY)!,
    });
  }

  return consumers;
};

const sendToConsumer = (
  consumer: ConsumerConfig,
  subdomain: string,
  path: string,
  payload: IPayload,
) => {
  const endpoint = `${consumer.url}/webhook/${path}`;

  try {
    const body = JSON.stringify({ subdomain, payload });
    const signature = crypto
      .createHmac('sha256', consumer.secret)
      .update(body)
      .digest('hex');

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    }).catch((e) => {
      console.error(`Failed to send message to ${consumer.name}: ${e}`);
    });
  } catch (e) {
    console.error(`Failed to send message to ${consumer.name}: ${e}`);
  }
};

export const sendMessage = ({ subdomain, path, payload, platform }: SendMessagePayload) => {
  const consumers = getConsumers();

  if (!consumers.length) {
    return console.error('No consumers configured (MUSHOP_API_URL / BLOCKADMIN_API_URL)');
  }

  const targets = platform ? consumers.filter((c) => c.name === platform) : consumers;

  for (const consumer of targets) {
    sendToConsumer(consumer, subdomain, path, payload);
  }
};

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
