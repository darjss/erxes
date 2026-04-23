import { getPureDate, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BookingStatus } from '@/booking/@types/booking';
import { addInstanceIdFilter } from '~/utils/providerFilter';

export interface IOneFitCreditConsumptionFilterParams {
  providerId?: string;
  userId?: string;
  companyId?: string;
  startDate: Date;
  endDate: Date;
}

export async function buildOneFitCreditConsumptionFilter(
  context: IContext,
  params: IOneFitCreditConsumptionFilterParams,
) {
  const { subdomain } = context;
  const { providerId, userId, companyId, startDate, endDate } = params;

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

  return addInstanceIdFilter(context, filter);
}
