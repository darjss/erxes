import { IContext } from '~/connectionResolvers';

const isSubscribed = async (
  models: IContext['models'],
  cpUser: any,
): Promise<boolean> => {
  if (!cpUser) return false;

  const sub = await models.MushopSubscription.getActiveSubscription(cpUser._id);

  return !!sub;
};

export const cpPoscProduct = {
  supplier: async (
    product: { _id: string },
    _args: undefined,
    { models }: IContext,
  ) => {
    const mushopProduct = await models.MushopProduct.findOne({
      entityId: product._id,
    }).lean();

    if (!mushopProduct?.subdomain) return null;

    return models.Supplier.findOne({
      subdomain: mushopProduct.subdomain,
    }).lean();
  },
  unitPrice: async (
    product: { _id: string; unitPrice?: number },
    _args: any,
    { models, cpUser, clientPortal }: IContext,
  ) => {
    if (clientPortal || cpUser) {
      if (!(await isSubscribed(models, cpUser))) return null;
    }

    return product.unitPrice ?? null;
  },
};
