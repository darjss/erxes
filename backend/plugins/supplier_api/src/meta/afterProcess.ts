import {
  AfterProcessConfigs,
  IAfterProcessRule,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { sendMessage } from '~/modules/admin/utils';

const mutationNames = ['productsAdd', 'productsEdit', 'productsRemove'];

const allRules: IAfterProcessRule[] = [
  {
    type: 'afterMutation',
    mutationNames,
  },
];

export const afterProcess: AfterProcessConfigs = {
  rules: allRules,
  afterMutation: async (ctx, input) => {
    const { mutationName, args, result } = input?.data ?? {};

    console.log('input?.data', input?.data);

    if (!mutationNames.includes(mutationName)) {
      return;
    }

    if (mutationName === 'productsRemove') {
      const productIds: string[] = args?.productIds || [];

      for (const productId of productIds) {
        sendMessage({
          subdomain: ctx.subdomain,
          path: 'syncProduct',
          payload: {
            entityId: productId,
            data: { action: 'delete' },
          },
        });
      }

      return;
    }

    const product = result;

    let category: any = null;

    if (product.categoryId) {
      try {
        category = await sendTRPCMessage({
          subdomain: ctx.subdomain,
          pluginName: 'core',
          module: 'productCategories',
          action: 'findOne',
          input: { query: { _id: product.categoryId } },
          defaultValue: null,
        });
      } catch (e) {
        console.error('Failed to fetch product category:', e);
      }
    }

    sendMessage({
      subdomain: ctx.subdomain,
      path: 'syncProduct',
      payload: {
        entityId: product._id,
        data: {
          product: {
            vendorId: product.vendorId,
            name: product.name,
            shortName: product.shortName,
            code: product.code,
            type: product.type,
            description: product.description,
            barcodes: product.barcodes,
            variants: product.variants,
            barcodeDescription: product.barcodeDescription,
            unitPrice: product.unitPrice,
            category: category
              ? {
                  _id: category._id,
                  name: category.name,
                  code: category.code,
                  order: category.order,
                  parentId: category.parentId,
                }
              : null,
            propertiesData: product.propertiesData,
            tagIds: product.tagIds,
            attachment: product.attachment,
            attachmentMore: product.attachmentMore,
            scopeBrandIds: product.scopeBrandIds,
            uom: product.uom,
            subUoms: product.subUoms,
            currency: product.currency,
            pdfAttachment: product.pdfAttachment,
          },
          action: mutationName === 'productsAdd' ? 'create' : 'update',
        },
      },
    });
  },
};
