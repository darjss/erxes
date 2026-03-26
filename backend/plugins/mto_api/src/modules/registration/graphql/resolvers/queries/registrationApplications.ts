import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { mapRegistrationApplicationGql } from '@/registration/utils/mapRegistrationApplicationGql';

export interface IRegistrationApplicationsQueryParams
  extends ICursorPaginateParams {
  membershipTypeId?: string;
  status?: string;
}

function buildRegistrationApplicationsFilter(
  params: IRegistrationApplicationsQueryParams,
  subdomain: string,
  instanceId?: string,
) {
  const filter: Record<string, unknown> = { subdomain };

  if (instanceId) {
    filter.instanceId = instanceId;
  }

  if (params.membershipTypeId) {
    filter.membershipTypeId = params.membershipTypeId;
  }

  if (params.status) {
    filter.status = params.status;
  }

  return filter;
}

export const registrationApplicationsQueries: Record<string, Resolver> = {
  async mtoRegistrationApplications(
    _root: undefined,
    params: IRegistrationApplicationsQueryParams,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const filter = buildRegistrationApplicationsFilter(
      params,
      subdomain,
      instanceId,
    );

    const result = await cursorPaginate({
      model: models.RegistrationApplication,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });

    const list = await Promise.all(
      result.list.map((doc) =>
        mapRegistrationApplicationGql(
          models,
          doc as unknown as Record<string, unknown>,
        ) as Promise<Record<string, unknown>>,
      ),
    );

    return {
      ...result,
      list,
    };
  },

  async mtoRegistrationApplicationsCount(
    _root: undefined,
    params: Pick<
      IRegistrationApplicationsQueryParams,
      'membershipTypeId' | 'status'
    >,
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const filter = buildRegistrationApplicationsFilter(
      params,
      subdomain,
      instanceId,
    );

    return models.RegistrationApplication.countDocuments(filter);
  },

  async mtoRegistrationApplication(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, subdomain, instanceId } = context;

    const doc = await models.RegistrationApplication.findOne({
      _id,
      subdomain,
    }).lean();

    if (!doc) {
      return null;
    }

    if (instanceId && doc.instanceId && doc.instanceId !== instanceId) {
      return null;
    }

    return mapRegistrationApplicationGql(models, doc as Record<string, unknown>);
  },
};

markResolvers(registrationApplicationsQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
