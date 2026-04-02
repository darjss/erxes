
  import { IContext } from '~/connectionResolvers';

  export const carMutations = {
    createCar: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Car.createCar({name});
    },

    updateCar: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Car.updateCar(_id, {name});
    },

    removeCar: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Car.removeCar(_id);
    },
  };

