import { getPureDate, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BookingStatus } from '@/booking/@types/booking';
import { addInstanceIdFilter } from '~/utils/providerFilter';

export interface IOneFitCreditConsumptionFilterParams {
  providerId?: string;
  userId?: string;
  companyId?: string;
  planId?: string;
  startDate: Date;
  endDate: Date;
}

export async function buildOneFitCreditConsumptionFilter(
  context: IContext,
  params: IOneFitCreditConsumptionFilterParams,
) {
  const { subdomain } = context;
  const { providerId, userId, companyId, planId, startDate, endDate } = params;

  const filter: any = {
    status: { $in: [BookingStatus.COMPLETED, BookingStatus.NO_SHOW] },
    bookingDate: {
      $gte: getPureDate(startDate),
      $lte: (() => {
        const end = new Date(getPureDate(endDate));
        end.setHours(23, 59, 59, 999);
        return end;
      })(),
    },
  };

  if (providerId) {
    filter.providerId = providerId;
  }

  if (userId) {
    filter.userId = userId;
  } else if (companyId) {
    const customerIds = (await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'relation',
      action: 'getRelationIds',
      input: {
        contentType: 'core:company',
        contentId: companyId,
        relatedContentType: 'core:customer',
      },
      defaultValue: [] as string[],
    })) as string[];

    const ids = customerIds?.filter((id) => id && id.trim()) ?? [];
    filter.userId = ids.length > 0 ? { $in: ids } : { $in: [] };
  }

  if (planId) {
    const existingUserFilter = filter.userId;
    const planCustomerIds = await context.models.OneFitCustomer.distinct('_id', {
      __t: 'OneFitCustomer',
      membershipPlanId: planId,
    });
    const planUserIds = planCustomerIds.map((id) => String(id));

    if (!planUserIds.length) {
      filter.userId = { $in: [] };
    } else if (!existingUserFilter) {
      filter.userId = { $in: planUserIds };
    } else if (typeof existingUserFilter === 'string') {
      filter.userId = planUserIds.includes(existingUserFilter)
        ? existingUserFilter
        : { $in: [] };
    } else if (
      existingUserFilter &&
      typeof existingUserFilter === 'object' &&
      '$in' in existingUserFilter &&
      Array.isArray(existingUserFilter.$in)
    ) {
      const intersectedIds = existingUserFilter.$in.filter((id: string) =>
        planUserIds.includes(id),
      );
      filter.userId = { $in: intersectedIds };
    } else {
      filter.userId = { $in: planUserIds };
    }
  }

  return addInstanceIdFilter(context, filter);
}
