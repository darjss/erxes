import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICVMarketFilter, ICVMarketDocument } from '@/market/@types/market';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { FilterQuery } from 'mongoose';

export const cvMarketQueries = {
  cvGetMarket: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVMarket.cvGetMarket(_id);
  },
  cvGetMarkets: async (
    _parent: undefined,
    { filter, ...params }: { filter: ICursorPaginateParams & ICVMarketFilter },
    { models }: IContext,
  ) => {
    const query = {} as FilterQuery<ICVMarketDocument>;

    if (filter.name) {
      query.name = { $regex: filter.name, $options: 'i' };
    }

    if (filter.description) {
      query.description = { $regex: filter.description, $options: 'i' };
    }

    if (filter.registration_number) {
      query.registration_number = filter.registration_number;
    }

    if (filter.operational_address) {
      query.operational_address = {
        $regex: filter.operational_address,
        $options: 'i',
      };
    }

    if (filter.type) {
      query.type = filter.type;
    }

    if (filter.specialization) {
      query.specialization = filter.specialization;
    }

    if (filter.region) {
      query.region = filter.region;
    }

    if (filter.country) {
      query.country = filter.country;
    }

    if (filter.onboarded) {
      query.onboarded = filter.onboarded;
    }

    if (filter.onboarding_status) {
      query.onboarding_status = filter.onboarding_status;
    }

    if (filter.business_partner_questionnaire_sent) {
      query.business_partner_questionnaire_sent =
        filter.business_partner_questionnaire_sent;
    }

    if (filter.business_partner_questionnaire_received) {
      query.business_partner_questionnaire_received =
        filter.business_partner_questionnaire_received;
    }

    if (filter.certificate_of_incorporation_sent) {
      query.certificate_of_incorporation_sent =
        filter.certificate_of_incorporation_sent;
    }

    if (filter.certificate_of_incorporation_received) {
      query.certificate_of_incorporation_received =
        filter.certificate_of_incorporation_received;
    }

    return cursorPaginate<ICVMarketDocument>({
      model: models.CVMarket,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query,
    });
  },
};
