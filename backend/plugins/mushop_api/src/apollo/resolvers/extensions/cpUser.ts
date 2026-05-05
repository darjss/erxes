import { IContext } from '~/connectionResolvers';

type ICPUser = {
  _id: string;
};

export const CPUser = {
  isSubscribed: async (
    cpUser: ICPUser,
    _args: undefined,
    context: IContext,
  ) => {
    const { models } = context;

    if (!cpUser._id) return false;

    const sub = await models.MushopSubscription.getActiveSubscription(
      cpUser._id,
    );

    return !!sub;
  },
  subscription: async (
    cpUser: ICPUser,
    _args: undefined,
    context: IContext,
  ) => {
    const { models } = context;

    if (!cpUser._id) return null;

    return models.MushopSubscription.getActiveSubscription(cpUser._id);
  },
};
