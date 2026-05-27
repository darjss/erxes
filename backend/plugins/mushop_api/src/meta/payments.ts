import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';

interface ITicketInput {
  name: string;
  statusId: string;
  channelId?: string;
  pipelineId?: string;
  description?: string;
  priority?: number;
  assigneeId?: string;
  startDate?: string;
  attachments?: any[];
  propertiesData?: Record<string, any>;
  [key: string]: any;
}

interface IPaymentCallbackData {
  _id: string;
  contentType: string;
  status: string;
  amount: number;
  currency: string;
  data: {
    cpUserId: string;
    clientPortalId: string;
    planId?: string;
    ticket?: ITicketInput;
  };
}

const resolveCustomerId = async (
  subdomain: string,
  data: IPaymentCallbackData,
): Promise<string | null> => {
  const cpUser = await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'query',
    module: 'cpUsers',
    action: 'get',
    input: {
      id: data.data.cpUserId,
      clientPortalId: data.data.clientPortalId,
    },
  });

  if (!cpUser) {
    console.error(
      `[mushop:payments] cpUser not found for id=${data.data.cpUserId}`,
    );

    return null;
  }

  return cpUser.erxesCustomerId || cpUser._id;
};

const handleTicketPayment = async (
  subdomain: string,
  data: IPaymentCallbackData,
) => {
  const doc = data.data.ticket;

  if (!doc) {
    console.error(
      `[mushop:payments] Invoice ${data._id} is a ticket purchase but carries no ticket data`,
    );

    return;
  }

  const customerId = await resolveCustomerId(subdomain, data);

  if (!customerId) {
    return;
  }

  const ticket = await sendTRPCMessage({
    subdomain,
    pluginName: 'frontline',
    method: 'mutation',
    module: 'ticket',
    action: 'create',
    input: {
      doc,
      userId: `cp:${data.data.cpUserId}`,
    },
  });

  if (!ticket?._id) {
    console.error(
      `[mushop:payments] ticket creation failed for invoice ${data._id}`,
    );

    return;
  }

  await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'mutation',
    module: 'relation',
    action: 'createMultipleRelations',
    input: {
      relations: [
        {
          entities: [
            { contentType: 'frontline:ticket', contentId: ticket._id },
            { contentType: 'core:customer', contentId: customerId },
            { contentType: 'payment:invoice', contentId: data._id },
          ],
        },
      ],
    },
  });
};

const handleSubscriptionPayment = async (
  subdomain: string,
  data: IPaymentCallbackData,
) => {
  const models = await generateModels(subdomain);

  const exists = await models.MushopSubscription.findOne({
    invoiceId: data._id,
  }).lean();

  if (exists) {
    return;
  }

  const customerId = await resolveCustomerId(subdomain, data);

  if (!customerId) {
    return;
  }

  const planId = process.env.MUSHOP_SUBSCRIPTION_PLAN_ID;

  if (!planId) {
    console.error(
      `[mushop:payments] Invoice ${data._id} missing planId — cannot determine subscription duration`,
    );

    return;
  }

  const existSubscription =
    await models.MushopSubscription.getActiveSubscription(customerId);

  if (existSubscription) {
    await models.MushopSubscription.renewSubscription(existSubscription._id, {
      planId,
      invoiceId: data._id,
      amount: data.amount,
      currency: data.currency,
    });

    return;
  }

  const subscription = await models.MushopSubscription.createSubscription({
    customerId,
    planId,
    invoiceId: data._id,
    amount: data.amount,
    currency: data.currency,
  });

  await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'mutation',
    module: 'relation',
    action: 'createMultipleRelations',
    input: {
      relations: [
        {
          entities: [
            { contentType: 'mushop:subscription', contentId: subscription._id },
            { contentType: 'core:customer', contentId: customerId },
            { contentType: 'payment:invoice', contentId: data._id },
          ],
        },
      ],
    },
  });
};

export const payments = {
  callback: async (subdomain: string, data: IPaymentCallbackData) => {
    if (data.status !== 'paid') {
      return;
    }

    try {
      switch (data.contentType) {
        case 'mushop:subscription':
          await handleSubscriptionPayment(subdomain, data);
          break;
        case 'frontline:ticket':
          await handleTicketPayment(subdomain, data);
          break;
        default:
          return;
      }
    } catch (e: any) {
      console.error(
        `[mushop:payments] callback failed for invoice ${data._id}: ${e.message}`,
      );
      throw e;
    }
  },
};
