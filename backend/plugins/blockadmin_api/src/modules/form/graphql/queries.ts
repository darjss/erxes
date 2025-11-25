import { ISubmission, ISubmissionParams } from '@/form/@types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';

export const formQueries = {
  blockAdminGetSubmissions: async (
    _root: undefined,
    params: ISubmissionParams,
    { models }: IContext,
  ) => {
    const { formId } = params;

    const filter: FilterQuery<ISubmission> = {};

    if (formId) {
      filter.form = formId;
    }

    return await cursorPaginate({
      model: models.Submission,
      params: params,
      query: filter,
    });
  },
};
