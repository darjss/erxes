import { IContext } from '~/connectionResolvers';
import { SubmissionPlatform } from '@/platform/@types/submission';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

export const submissionQueries = {
  supplierSubmissions: async (
    _root: undefined,
    {
      platform,
      status,
      ...params
    }: {
      platform?: SubmissionPlatform;
      status?: string;
    } & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    return await cursorPaginate({
      model: models.Submission,
      params,
      query: {
        ...(platform && { platform }),
        ...(status && { status }),
      },
    });
  },
};
