import { IContext } from '~/connectionResolvers';
import { requestMessage } from '~/modules/admin/utils';

export const collectiveQueries = {
  getCollective: async (
    _root: undefined,
    _args: any,
    { models }: IContext,
  ) => {
    return models.Collective.getCollective();
  },

  collectiveDetail: async (
    _root: undefined,
    _args: { _id: string },
    { models }: IContext,
  ) => {
    return models.Collective.getCollective();
  },

  collectiveSuppliers: async (
    _root: undefined,
    _args: any,
    { subdomain }: IContext,
  ) => {
    const result = await requestMessage<{
      collective: any;
      suppliers: any[];
    }>({
      subdomain,
      path: 'collective/members',
      platform: 'mushop',
      payload: { data: { targetSubdomain: subdomain } },
    });

    const suppliers = result?.suppliers || [];

    return suppliers.map((s: any) => ({
      _id: s._id,
      name: s.name,
      logo: s.logo,
      primaryEmail: s.primaryEmail,
      primaryPhone: s.primaryPhone,
      verificationStatus: s.verificationStatus,
    }));
  },
};
