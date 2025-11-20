import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const cpBuildingQueries = {
  cpBlockAdminGetBuildings: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.Building.find({ project }).lean();
  },
  cpBlockAdminGetBuilding: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Building.findOne({ _id }).lean();
  },
};

markResolvers(cpBuildingQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
