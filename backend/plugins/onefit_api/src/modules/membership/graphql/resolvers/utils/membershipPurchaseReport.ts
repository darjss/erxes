import { getPureDate } from 'erxes-api-shared/utils';
import { MembershipPurchaseStatus } from '@/membership/@types/membershippurchase';
import { IContext } from '~/connectionResolvers';

export type OneFitMembershipPurchaseReportInterval = 'day' | 'week' | 'month';

function getReportDateBounds(startDate: Date, endDate: Date) {
  const gte = getPureDate(startDate);
  const lte = new Date(getPureDate(endDate));
  lte.setHours(23, 59, 59, 999);
  return { gte, lte };
}

function paidPurchaseDateMatch(gte: Date, lte: Date) {
  return {
    status: MembershipPurchaseStatus.PAID,
    deletedAt: null,
    $or: [
      { paidAt: { $gte: gte, $lte: lte } },
      {
        paidAt: { $exists: false },
        purchasedAt: { $gte: gte, $lte: lte },
      },
      {
        paidAt: null,
        purchasedAt: { $gte: gte, $lte: lte },
      },
    ],
  };
}

function bucketGroupId(interval: OneFitMembershipPurchaseReportInterval) {
  switch (interval) {
    case 'day':
      return {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$reportAt',
          timezone: 'UTC',
        },
      };
    case 'month':
      return {
        $dateToString: {
          format: '%Y-%m',
          date: '$reportAt',
          timezone: 'UTC',
        },
      };
    case 'week':
      return {
        $concat: [
          {
            $dateToString: {
              format: '%G',
              date: '$reportAt',
              timezone: 'UTC',
            },
          },
          '-W',
          {
            $dateToString: {
              format: '%V',
              date: '$reportAt',
              timezone: 'UTC',
            },
          },
        ],
      };
    default:
      return {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$reportAt',
          timezone: 'UTC',
        },
      };
  }
}

export async function aggregateMembershipPurchaseReport(
  context: IContext,
  startDate: Date,
  endDate: Date,
  interval: OneFitMembershipPurchaseReportInterval,
): Promise<
  Array<{ periodKey: string; purchaseCount: number; totalAmount: number }>
> {
  const { models } = context;
  const { gte, lte } = getReportDateBounds(startDate, endDate);

  const groupId = bucketGroupId(interval);

  const rows = await models.MembershipPurchase.aggregate([
    { $match: paidPurchaseDateMatch(gte, lte) },
    {
      $addFields: {
        reportAt: { $ifNull: ['$paidAt', '$purchasedAt'] },
      },
    },
    {
      $match: {
        reportAt: { $gte: gte, $lte: lte },
      },
    },
    {
      $group: {
        _id: groupId,
        purchaseCount: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return rows.map((row) => ({
    periodKey: String(row._id),
    purchaseCount: row.purchaseCount || 0,
    totalAmount: row.totalAmount || 0,
  }));
}

export async function aggregateMembershipPurchasePlanShares(
  context: IContext,
  startDate: Date,
  endDate: Date,
): Promise<
  Array<{
    planId: string;
    planName: string;
    purchaseCount: number;
    percent: number;
  }>
> {
  const { models } = context;
  const { gte, lte } = getReportDateBounds(startDate, endDate);

  const grouped = await models.MembershipPurchase.aggregate([
    { $match: paidPurchaseDateMatch(gte, lte) },
    {
      $addFields: {
        reportAt: { $ifNull: ['$paidAt', '$purchasedAt'] },
      },
    },
    {
      $match: {
        reportAt: { $gte: gte, $lte: lte },
      },
    },
    {
      $group: {
        _id: '$planId',
        purchaseCount: { $sum: 1 },
      },
    },
    { $sort: { purchaseCount: -1 } },
  ]);

  const planIds = grouped
    .map((g) => g._id)
    .filter((id): id is string => Boolean(id));

  const plans = planIds.length
    ? await models.MembershipPlan.find(
        { _id: { $in: planIds } },
        { name: 1 },
      ).lean()
    : [];

  const nameById = new Map(
    plans.map((p: { _id: string; name?: string }) => [
      String(p._id),
      String(p.name || ''),
    ]),
  );

  const total = grouped.reduce(
    (sum, g) => sum + (g.purchaseCount as number),
    0,
  );

  return grouped.map((g) => {
    const planId = String(g._id ?? '');
    const purchaseCount = (g.purchaseCount as number) || 0;
    const rawName = nameById.get(planId);
    const planName = rawName && rawName.length > 0 ? rawName : 'Unknown plan';

    return {
      planId,
      planName,
      purchaseCount,
      percent: total > 0 ? (purchaseCount / total) * 100 : 0,
    };
  });
}
