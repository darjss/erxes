import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const submissionQueries = {
  btkAdminGetSubmission: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Submission.findOne({ _id });
  },

  btkAdminGetSubmissions: async (
    _root: any,
    { query }: { query?: any },
    { models }: IContext,
  ) => {
    const {
      page = 1,
      perPage = 20,
      search = '',
      sortField = 'submittedAt',
      sortDirection = -1,
    } = query || {};

    const filter: any = {};

    if (search) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { email: searchRegex },
        { name: searchRegex },
        { phone: searchRegex },
        { answer1: searchRegex },
        { answer2: searchRegex },
        { answer3: searchRegex },
        { answer4: searchRegex },
        { answer5: searchRegex },
        { answer6: searchRegex },
      ];
    }

    const sort: any = {};
    sort[sortField] = sortDirection;

    const list = await models.Submission.find(filter)
      .sort(sort)
      .skip((page - 1) * perPage)
      .limit(perPage + 1)
      .lean();

    const totalCount = await models.Submission.countDocuments(filter);

    const hasMore = list.length > perPage;
    if (hasMore) list.pop();

    return {
      list,
      totalCount,
      hasMore,
    };
  },
};

requireLogin(submissionQueries, 'btkAdminGetSubmission');
requireLogin(submissionQueries, 'btkAdminGetSubmissions');
