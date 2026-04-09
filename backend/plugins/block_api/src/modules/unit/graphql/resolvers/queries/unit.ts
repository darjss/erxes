import { IContext } from '~/connectionResolvers';
import { blockAgencyTRPCClient } from '~/trpc/blockAgencyTRPCClient';

export const unitQueries = {
  blockGetUnit: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.findOne({ _id });
  },

  blockGetUnits: async (
    _root: undefined,
    { zoning, zonings }: { zoning: string; zonings: string[] },
    { models }: IContext,
  ) => {
    if (zonings?.length) {
      return models.Unit.find({ zoning: { $in: zonings } });
    }

    return models.Unit.getUnitsByZoning(zoning);
  },

  blockGetAgencies: async () => {
    try {
      const client = await blockAgencyTRPCClient();
      if (!client) return [];
      return client.query('agency.getAgencies');
    } catch (e) {
      console.error('[blockGetAgencies] error:', e);
      return [];
    }
  },
};

