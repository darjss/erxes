
  import { IContext } from '~/connectionResolvers';

   export const carQueries = {
    getCar: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Car.getCar(_id);
    },
    
    getCars: async (_parent: undefined, { models }: IContext) => {
      return models.Car.getCars();
    },
  };
