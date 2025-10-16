import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const buildingMutations = {
  blockCreateBuilding: async (
    _parent: undefined,
    { input },
    { models }: IContext,
  ) => {
    return models.Building.createBuilding(input);
  },

  blockUpdateBuilding: async (
    _parent: undefined,
    { _id, input },
    { models }: IContext,
  ) => {
    return models.Building.updateBuilding(_id, input);
  },

  blockDeleteBuilding: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const zonings = await models.Zoning.find({ building: _id });
    if (zonings.length > 0) throw new Error('Building has zonings');

    return models.Building.findOneAndDelete({ _id });
  },

  blockDupplicateBuilding: async (
    _parent: undefined,
    { buildingId }: { buildingId: string },
    { models }: IContext,
  ) => {
    const building = await models.Building.findOne({ _id: buildingId });
    if (!building) throw new Error('Building not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = building;

    const newBuilding = await models.Building.createBuilding({
      ...rest,
      name: `${rest.name} duplicated`,
    });

    return newBuilding;
  },
};

requireLogin(buildingMutations, 'blockCreateBuilding');
requireLogin(buildingMutations, 'blockUpdateBuilding');
requireLogin(buildingMutations, 'blockDeleteBuilding');
requireLogin(buildingMutations, 'blockDupplicateBuilding');
