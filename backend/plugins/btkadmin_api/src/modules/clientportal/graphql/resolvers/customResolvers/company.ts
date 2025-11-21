import { IContext } from '~/connectionResolvers';

export default {
  async companyData({ companyId }, _params, { models }: IContext) {
    if (!companyId) {
      return null;
    }
    return await models.Company.findOne({ entityId: companyId });
  },
};
