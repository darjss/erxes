import {
  BeforeResolverParams,
  BeforeResolverResult,
  BeforeResolversConfig,
} from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { getSupplierId } from '~/utils/getSupplierId';
import { sendSupplierMessage } from '~/utils/sendSupplierMessage';

export const supplierBeforeResolvers: BeforeResolversConfig = {
  resolvers: { posclient: ['cpOrdersAdd'] },
  handler: async (
    subdomain: string,
    params: BeforeResolverParams,
  ): Promise<BeforeResolverResult> => {
    const { resolver, args = {}, headers } = params;

    if (resolver !== 'cpOrdersAdd') {
      return args;
    }

    const supplierId = getSupplierId(headers);

    if (!supplierId) {
      return args;
    }

    const models = await generateModels(subdomain);

    const supplier = await models.Supplier.findOne({ _id: supplierId }).lean<{
      _id: string;
      subdomain: string;
      posToken?: string;
    }>();

    if (!supplier?.subdomain || !supplier.posToken) {
      return args;
    }

    const items = Array.isArray((args as any).items)
      ? ((args as any).items as Record<string, any>[])
      : [];

    const forwardItems = await Promise.all(
      items.map(async (item) => {
        const product = await models.Product.findOne({
          $or: [{ _id: item.productId }, { entityId: item.productId }],
          subdomain: supplier.subdomain,
        }).lean<{ entityId: string }>();

        return { ...item, productId: product?.entityId ?? item.productId };
      }),
    );

    const order = { ...args, items: forwardItems };

    const log = await models.Order.logForward({
      subdomain: supplier.subdomain,
      posToken: supplier.posToken,
      order,
    });

    let result: { ok: boolean; orderId?: string; error?: string };

    try {
      const res = await sendSupplierMessage<{ order?: { _id?: string } }>({
        subdomain: supplier.subdomain,
        action: 'order',
        payload: { posToken: supplier.posToken, order },
      });

      result = { ok: true, orderId: res?.order?._id };
    } catch (e: any) {
      result = { ok: false, error: e.message };
    }

    await models.Order.markResult(log._id, result);

    if (!result.ok) {
      return {
        status: 'blocked',
        code: 'SUPPLIER_ROUTE_FAILED',
        message: `Failed to route order to supplier ${supplier._id}: ${result.error}`,
      };
    }

    return {
      status: 'blocked',
      code: 'ROUTED_TO_SUPPLIER',
      message: `Order routed to supplier ${supplier._id} (${result.orderId})`,
    };
  },
};
