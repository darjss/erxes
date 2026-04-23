import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, encodeCursor, PageInfo } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { requirePermission } from '~/utils/onefitPermissionCheck';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { FilterQuery, SortOrder } from 'mongoose';
import { ICreditTransactionDocument } from '@/membership/@types/credittransaction';

export interface ICreditTransactionQueryParams extends ICursorPaginateParams {
  userId?: string;
  transactionType?: CreditTransactionType;
  source?: CreditSource;
  bookingId?: string;
}

const generateFilter = async (params: ICreditTransactionQueryParams) => {
  const filter: any = {};

  if (params.userId) {
    filter.userId = params.userId;
  }

  if (params.transactionType) {
    filter.transactionType = params.transactionType;
  }

  if (params.source) {
    filter.source = params.source;
  }

  if (params.bookingId) {
    filter.bookingId = params.bookingId;
  }

  return filter;
};

const creditTransactionCursorPaginationWithMaxDate = async ({
  model,
  params,
  query,
}: {
  model: any;
  params: ICreditTransactionQueryParams;
  query: FilterQuery<ICreditTransactionDocument>;
}) => {
  const { limit = 20, cursor, direction = 'forward' } = params;

  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  const baseQuery = { ...query };

  const [items, totalCount] = await Promise.all([
    model.aggregate([
      { $match: baseQuery as FilterQuery<ICreditTransactionDocument> },
      {
        $addFields: {
          maxDate: {
            $max: ['$createdAt', '$updatedAt'],
          },
        },
      },
      { $sort: { maxDate: -1, _id: -1 } },
      { $limit: limit + 1 },
    ]),
    model.countDocuments(query as FilterQuery<ICreditTransactionDocument>),
  ]);

  const hasMore = items.length > limit;
  let list = hasMore ? items.slice(0, limit) : items;

  if (direction === 'backward') {
    list = list.reverse();
  }

  const sortFields = ['maxDate', '_id'];

  const startCursor =
    list.length > 0 ? encodeCursor(list[0], sortFields) : null;
  const endCursor =
    list.length > 0 ? encodeCursor(list[list.length - 1], sortFields) : null;

  const pageInfo: PageInfo = {
    hasNextPage: direction === 'forward' ? hasMore : Boolean(cursor),
    hasPreviousPage: direction === 'backward' ? hasMore : Boolean(cursor),
    startCursor,
    endCursor,
  };

  return {
    list: list as ICreditTransactionDocument[],
    totalCount,
    pageInfo,
  };
};

export const creditTransactionQueries = {
  async oneFitCreditTransactions(
    _root: undefined,
    params: ICreditTransactionQueryParams,
    context: IContext,
  ) {
    await requirePermission(context, 'transactionRead');
    const { models } = context;
    const filter = await generateFilter(params);

    // Order by createdAt only (newest first)
    return await cursorPaginate({
      model: models.CreditTransaction,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async oneFitCreditTransactionsCount(
    _root: undefined,
    params: ICreditTransactionQueryParams,
    context: IContext,
  ) {
    await requirePermission(context, 'transactionRead');
    const { models } = context;
    const filter = await generateFilter(params);
    return models.CreditTransaction.find(filter).countDocuments();
  },

  async oneFitCreditTransaction(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    await requirePermission(context, 'transactionRead');
    const { models } = context;
    return models.CreditTransaction.findOne({ _id });
  },

  async oneFitUserCreditBalance(
    _root: undefined,
    { userId }: { userId: string },
    context: IContext,
  ) {
    await requirePermission(context, 'transactionRead');
    const { models } = context;
    const totalBalance = await models.CreditTransaction.getUserBalance(userId);

    // Calculate individual and corporate balances separately
    const individualTransactions = await models.CreditTransaction.find({
      userId,
      source: CreditSource.INDIVIDUAL,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    const corporateTransactions = await models.CreditTransaction.find({
      userId,
      source: CreditSource.CORPORATE,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    const individualBalance =
      individualTransactions.length > 0
        ? individualTransactions[0].balanceAfter
        : 0;
    const corporateBalance =
      corporateTransactions.length > 0
        ? corporateTransactions[0].balanceAfter
        : 0;

    return {
      userId,
      balance: totalBalance,
      individualBalance,
      corporateBalance,
    };
  },

  async oneFitUserCreditTransactions(
    _root: undefined,
    { userId, limit }: { userId: string; limit?: number },
    context: IContext,
  ) {
    await requirePermission(context, 'transactionRead');
    const { models } = context;
    return models.CreditTransaction.getUserTransactions(userId, limit);
  },
};
