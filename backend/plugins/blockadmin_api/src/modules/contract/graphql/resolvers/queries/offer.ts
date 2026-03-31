import { IContext } from '~/connectionResolvers';

export const offerQueries = {
  blockGetOffer: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const offer = await models.Offer.findOne({ _id }).lean();

    if (!offer) {
      throw new Error('Offer not found');
    }

    return offer;
  },

  blockGetOffers: async (
    _parent: undefined,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.Offer.find({ unit });
  },
};

