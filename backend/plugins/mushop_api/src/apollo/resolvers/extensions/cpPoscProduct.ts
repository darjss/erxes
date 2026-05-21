import { IContext } from '~/connectionResolvers';

export const cpPoscProduct = {
  supplier: async (
    product: { _id: string },
    _args: undefined,
    { models }: IContext,
  ) => {
    console.log('product', product)
    const mushopProduct = await models.MushopProduct.findOne({
      entityId: product._id,
    }).lean();

    if (!mushopProduct?.subdomain) return null;

    console.log('mushopProduct.subdomain', mushopProduct.subdomain)

    return models.Supplier.findOne({
      subdomain: mushopProduct.subdomain,
    }).lean();
  }
};
