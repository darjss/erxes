import { IContext } from '~/connectionResolvers';
import { IZoning } from '@/building/@types/zoning';

export const zoningMutations = {
  blockCreateBuildingZoning: async (
    _parent: undefined,
    { input }: { input: IZoning },
    { models }: IContext,
  ) => {
    const existingZoning = await models.Zoning.findOne({
      building: input.building,
      floor: input.floor,
    });

    if (existingZoning) throw new Error('Zoning already exists');

    return models.Zoning.createZoning(input);
  },

  blockUpdateBuildingZoning: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IZoning },
    { models }: IContext,
  ) => {
    return models.Zoning.updateZoning(_id, input);
  },

  blockDeleteBuildingZoning: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const units = await models.Unit.find({ zoning: _id });
    if (units.length > 0) throw new Error('Zoning has units');

    return models.Zoning.findOneAndDelete({ _id });
  },

  blockDupplicateBuildingZoning: async (
    _parent: undefined,
    { zoningId }: { zoningId: string },
    { models }: IContext,
  ) => {
    const zoning = await models.Zoning.findOne({ _id: zoningId });
    if (!zoning) throw new Error('Zoning not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = zoning;

    const newZoning = await models.Zoning.createZoning({
      ...rest,
      floor: rest.floor > 0 ? rest.floor + 1 : rest.floor - 1,
    });

    return newZoning;
  },
};

