import { IContext } from '~/connectionResolvers';
import { ICarDocument } from '~/modules/car/@types/car';

export const Car = {
  __resolveReference: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return await models.Cars.getCar(_id);
  },

  owner: (car: ICarDocument) => {
    if (!car.ownerId) {
      return null;
    }

    return {
      __typename: 'User',
      _id: car.ownerId,
    };
  },

  customers: async (car: ICarDocument, _args, { loaders }: IContext) => {
    return await loaders.car.customersByCarId.load(car._id);
  },

  companies: async (car: ICarDocument, _args, { loaders }: IContext) => {
    return await loaders.car.companiesByCarId.load(car._id);
  },

  category: async (car: ICarDocument, _args, { loaders }: IContext) => {
    if (!car.categoryId) {
      return null;
    }

    return await loaders.car.categoryById.load(car.categoryId);
  },

  getTags: (car: ICarDocument) => {
    return (car.tagIds || []).map((_id) => ({
      __typename: 'Tag',
      _id,
    }));
  },
};
