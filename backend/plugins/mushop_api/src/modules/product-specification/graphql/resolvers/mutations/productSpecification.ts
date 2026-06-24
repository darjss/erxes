import { IContext } from '~/connectionResolvers';
import { IMushopProductSpecification } from '@/product-specification/@types/productSpecification';

export const productSpecificationMutations = {
  mushopProductSpecificationSave: async (
    _root: undefined,
    {
      productId,
      input,
    }: {
      productId: string;
      input: Omit<IMushopProductSpecification, 'productId'>;
    },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopProductSpecificationSave');
    return models.ProductSpecification.save(productId, input);
  },
};
