import { IContext } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICVClient, ICVClientDocument } from '~/modules/client/@types/client';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

export const cvClientQueries = {
  cvGetClient: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CVClient.cvGetClient(_id);
  },

  cvGetClients: async (
    _parent: undefined,
    params: ICursorPaginateParams & ICVClient,
    { models }: IContext,
  ) => {
    return cursorPaginate<ICVClientDocument>({
      model: models.CVClient,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: {},
    });
  },
};
