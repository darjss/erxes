import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface IPromoCodeQueryParams extends ICursorPaginateParams {
  code?: string;
  isActive?: boolean;
  validNow?: boolean;
}

const generateFilter = (params: IPromoCodeQueryParams) => {
  const filter: Record<string, unknown> = {};

  if (params.code) {
    filter.code = { $regex: params.code, $options: 'i' };
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  if (params.validNow === true) {
    const now = new Date();
    filter.$and = [
      {
        $or: [
          { validFrom: { $exists: false } },
          { validFrom: null },
          { validFrom: { $lte: now } },
        ],
      },
      {
        $or: [
          { validTo: { $exists: false } },
          { validTo: null },
          { validTo: { $gte: now } },
        ],
      },
    ];
  }

  return filter;
};

export const promoCodeQueries: Record<string, Resolver> = {
  async oneFitPromoCodes(
    _root: undefined,
    params: IPromoCodeQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = generateFilter(params);

    return await cursorPaginate({
      model: models.PromoCode,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async oneFitPromoCodesCount(
    _root: undefined,
    params: IPromoCodeQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = generateFilter(params);
    return models.PromoCode.find(filter).countDocuments();
  },

  async oneFitPromoCode(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;
    return models.PromoCode.findOne({ _id });
  },
};

markResolvers(promoCodeQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
