import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const offerQueries = {
  btkGetOffer: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Offer.getOffer(_id);
  },

  btkGetOffers: async (
    _parent: undefined,
    { unit }: { unit: string },
    { models }: IContext,
  ) => {
    return models.Offer.find({ unit });
  },
};

requireLogin(offerQueries, 'btkGetOffer');
requireLogin(offerQueries, 'btkGetOffers');
