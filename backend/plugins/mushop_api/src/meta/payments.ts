import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';

interface IPaymentCallbackData {
  _id: string;
  contentType: string;
  status: string;
  amount: number;
  currency: string;
  data: {
    cpUserId: string;
    clientPortalId: string;
    planId: string;
  };
}

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

    return;
  }

  const customerId = cpUser.erxesCustomerId || cpUser._id;

  // const planId = data.data?.planId;
  const planId = process.env.MUSHOP_SUBSCRIPTION_PLAN_ID;

  if (!planId) {
    console.error(
      `[mushop:payments] Invoice ${data._id} missing planId — cannot determine subscription duration`,
    );

    return;
  }

  const existSubscription = await models.MushopSubscription.getActiveSubscription(
    customerId,
  );

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
          ],
        },
      ],
    },
  });
};

export const payments = {
  callback: async (subdomain: string, data: IPaymentCallbackData) => {
    if (data.contentType !== 'mushop:subscription') {
      return;
    }

    if (data.status !== 'paid') {
      return;
    }

    try {
      await handleSubscriptionPayment(subdomain, data);
    } catch (e: any) {
      console.error(
        `[mushop:payments] callback failed for invoice ${data._id}: ${e.message}`,
      );
      throw e;
    }
  },
};
