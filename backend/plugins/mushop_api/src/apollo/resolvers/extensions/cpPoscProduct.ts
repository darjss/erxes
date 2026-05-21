import { IContext } from '~/connectionResolvers';

export const cpPoscProduct = {
  supplier: async (
    product: { _id: string },
    _args: undefined,
    { models }: IContext,
  ) => {
    console.log('product', product)
    
    const mushopProduct = await models.MushopProduct.findOne({
      _id: product._id,
    }).lean();

    console.log('mushopProduct', mushopProduct)

    if (!mushopProduct?.subdomain) return null;

    console.log('mushopProduct.subdomain', mushopProduct.subdomain)

    return models.Supplier.findOne({
      subdomain: mushopProduct.subdomain,
    }).lean();
  }
};
