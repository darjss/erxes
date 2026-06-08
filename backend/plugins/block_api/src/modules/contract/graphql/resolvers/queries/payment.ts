import { cursorPaginateAggregation } from 'erxes-api-shared/utils';
import { Types } from 'mongoose';
import { IContractPaymentDocument } from '@/contract/@types/payment';
import { IContext } from '~/connectionResolvers';

const paymentSortPipeline = (matchStage: Record<string, any>) => [
  { $match: matchStage },
  {
    $addFields: {
      _sortPriority: {
        $switch: {
          branches: [
            { case: { $eq: ['$status', 'paid'] }, then: 2 },
            {
              case: {
                $and: [
                  { $ne: ['$status', 'paid'] },
                  { $lt: ['$dueDate', new Date()] },
                ],
              },
              then: 0,
            },
          ],
          default: 1,
        },
      },
    },
  },
];

export const contractPaymentQueries = {
  blockGetContractPayments: async (
    _parent: undefined,
    {
      contractId,
      limit,
      cursor,
      direction,
    }: {
      contractId: string;
      limit?: number;
      cursor?: string;
      direction?: 'forward' | 'backward';
    },
    { models }: IContext,
  ) => {
    return cursorPaginateAggregation<IContractPaymentDocument>({
      model: models.ContractPayment as any,
      pipeline: paymentSortPipeline({ contractId: new Types.ObjectId(contractId) }),
      params: {
        limit: limit ?? 30,
        cursor,
        direction: direction ?? 'forward',
        orderBy: { _sortPriority: 1, dueDate: 1 } as any,
      },
    });
  },

  blockGetProjectPayments: async (
    _parent: undefined,
    {
      projectId,
      paid,
      contractNumber,
      customerId,
      unitNumber,
      limit,
      cursor,
      direction,
    }: {
      projectId: string;
      paid?: boolean;
      contractNumber?: string;
      customerId?: string;
      unitNumber?: string;
      limit?: number;
      cursor?: string;
      direction?: 'forward' | 'backward';
    },
    { models }: IContext,
  ) => {
    const match: Record<string, any> = { projectId: new Types.ObjectId(projectId) };
    if (typeof paid === 'boolean') {
      match.status = paid ? 'paid' : { $in: ['unpaid', 'partial'] };
    }
    if (contractNumber) {
      match.contractNumber = { $regex: contractNumber, $options: 'i' };
    }
    if (customerId) {
      match.partyId = customerId;
      match.partyType = 'customer';
    }
    if (unitNumber) {
      const matchedUnits = await models.Unit.find(
        { number: { $regex: unitNumber, $options: 'i' } },
        { _id: 1 },
      ).lean();
      match.unit = { $in: matchedUnits.map((u: any) => u._id) };
    }

    return cursorPaginateAggregation<IContractPaymentDocument>({
      model: models.ContractPayment as any,
      pipeline: paymentSortPipeline(match),
      params: {
        limit: limit ?? 10,
        cursor,
        direction: direction ?? 'forward',
        orderBy: { _sortPriority: 1, dueDate: 1 } as any,
      },
    });
  },

  blockGetPaymentTransactions: async (
    _parent: undefined,
    { paymentId }: { paymentId: string },
    { models }: IContext,
  ) => {
    return models.ContractPaymentTransaction.find({ paymentId }).sort({
      date: -1,
    });
  },
};
