import { IContext } from '~/connectionResolvers';

type ICPUser = {
  _id: string;
  erxesCustomerId?: string;
};

export const CPUser = {
  isSubscribed: async (
    cpUser: ICPUser,
    _args: undefined,
    context: IContext,
  ) => {
    const { models } = context;

    const subscription = await models.MushopSubscription.getActiveSubscription(
      cpUser?.erxesCustomerId || cpUser?._id,
    );

    return !!subscription;
  },
  subscription: async (
    cpUser: ICPUser,
    _args: undefined,
    context: IContext,
  ) => {
    const { models } = context;

    return models.MushopSubscription.getActiveSubscription(
      cpUser?.erxesCustomerId || cpUser._id,
    );
  },
};
