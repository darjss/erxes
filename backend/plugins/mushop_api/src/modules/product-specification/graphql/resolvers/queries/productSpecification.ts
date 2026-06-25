import { IContext } from '~/connectionResolvers';

export const productSpecificationQueries = {
  mushopProductSpecification: async (
    _root: undefined,
    { productId }: { productId: string },
    { models }: IContext,
  ) => {
    return models.ProductSpecification.getByProductId(productId);
  },
};
