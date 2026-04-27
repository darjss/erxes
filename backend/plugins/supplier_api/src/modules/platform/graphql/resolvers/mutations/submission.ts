import { IContext } from '~/connectionResolvers';
import { sendMessage } from '~/modules/admin/utils';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import {
  ISubmissionOffering,
  SubmissionPlatform,
} from '@/platform/@types/submission';

const fetchProductPayload = async (subdomain: string, productId: string) => {
  const product = await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    module: 'products',
    action: 'findOne',
    input: { query: { _id: productId } },
    defaultValue: null,
  });

  if (!product) throw new Error('Product not found');

  let category: any = null;

  if (product.categoryId) {
    try {
      category = await sendTRPCMessage({
        subdomain,
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

  return {
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
  };
};

const sendMessageToPlatform = async (
  subdomain: string,
  platform: SubmissionPlatform,
  productId: string,
  product: any,
  offering: ISubmissionOffering,
  action: 'create' | 'update',
): Promise<void> => {
  await sendMessage({
    subdomain,
    platform,
    path: 'syncProduct',
    payload: {
      entityId: productId,
      data: { product: { ...product, offering }, action },
    },
  });
};

const assertSupplierCanSubmit = async (
  models: IContext['models'],
  user: IContext['user'],
) => {
  const supplier = await models.Supplier.getGetSupplier(user._id);
  if (!supplier) throw new Error('Supplier profile not found');
  if (supplier.verificationStatus === 'unverified') {
    const reason = supplier.verificationNote
      ? `Your profile was rejected: ${supplier.verificationNote}`
      : 'Your supplier profile has been rejected. You cannot submit products.';
    throw new Error(reason);
  }
};

export const submissionMutations = {
  supplierResubmitProduct: async (
    _root: undefined,
    {
      platform,
      productId,
      offering,
    }: {
      platform: SubmissionPlatform;
      productId: string;
      offering?: ISubmissionOffering;
    },
    { models, subdomain, user }: IContext,
  ) => {
    await assertSupplierCanSubmit(models, user);

    const product = await fetchProductPayload(subdomain, productId);
    const submission = await models.Submission.resubmitProduct(platform, productId, offering);

    await sendMessageToPlatform(subdomain, platform, productId, product, offering || {}, 'update');

    return submission;
  },

  supplierSubmitProductsBulk: async (
    _root: undefined,
    {
      platform,
      items,
    }: {
      platform: SubmissionPlatform;
      items: Array<{ productId: string; offering?: ISubmissionOffering }>;
    },
    { models, subdomain, user }: IContext,
  ) => {
    await assertSupplierCanSubmit(models, user);
    return Promise.all(
      items.map(async ({ productId, offering }) => {
        const product = await fetchProductPayload(subdomain, productId);
        const submission = await models.Submission.submitProduct(platform, productId, offering);

        await sendMessageToPlatform(subdomain, platform, productId, product, offering || {}, 'create');

        return submission;
      }),
    );
  },
};
