import { CONTRACT_STATUS } from '@/contract/constants';
import { IUnit, IUnitInput } from '@/unit/@types/unit';
import { DeleteResult } from 'mongoose';
import { IContext } from '~/connectionResolvers';

export const unitMutations = {
  blockCreateUnit: async (
    _parent: undefined,
    { input }: { input: IUnitInput },
    { models }: IContext,
  ) => {
    const { useProjectPrice, ...rest } = input;

    if (useProjectPrice) {
      const zoning = await models.Zoning.findOne({ _id: input.zoning });
      if (!zoning) {
        throw new Error('Zoning not found');
      }
      const building = await models.Building.findOne({ _id: zoning.building });
      if (!building) {
        throw new Error('Building not found');
      }
      const project = await models.Project.findOne({ _id: building.project });
      if (!project) {
        throw new Error('Project not found');
      }
    }

    return models.Unit.createUnit(rest);
  },

  blockCreateUnits: async (
    _parent: undefined,
    { input }: { input: IUnitInput & { zonings: string[]; perZone: number } },
    { models }: IContext,
  ) => {
    const { useProjectPrice, zonings, perZone, ...rest } = input;

    const documents: IUnit[] = [];

    if (zonings?.length) {
      for (const zoning of zonings) {
        const zone = await models.Zoning.getBuildingZoning(zoning);

        for (let i = 0; i < perZone; i++) {
          const document: IUnit = { ...rest, zoning };

          document['number'] = `${
            zone.floor < 0 ? `B${zone.floor * -1}` : zone.floor
          }${i + 1 < 10 ? `0${i + 1}` : i + 1}`;

          documents.push(document);
        }
      }
    }

    return {
      response: await models.Unit.insertMany(documents),
      options: {
        fields: ['zoning', 'number'],
      },
    };
  },

  blockUpdateUnit: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IUnitInput },
    { models }: IContext,
  ) => {
    const { useProjectPrice, ...rest } = input;

    const unit = await models.Unit.getUnit(_id);

    if (!unit) {
      throw new Error('Unit not found');
    }

    const contract = await models.Contract.findOne({
      unit: _id,
      status: CONTRACT_STATUS.SIGNED,
    });

    if (contract) {
      throw new Error('Can not update unit because contract is signed');
    }

    if (useProjectPrice) {
      const zoning = await models.Zoning.findOne({ _id: input.zoning });
      if (!zoning) {
        throw new Error('Zoning not found');
      }
      const building = await models.Building.findOne({ _id: zoning.building });
      if (!building) {
        throw new Error('Building not found');
      }
      const project = await models.Project.findOne({ _id: building.project });
      if (!project) {
        throw new Error('Project not found');
      }
    }

    return models.Unit.updateUnit(_id, rest);
  },

  blockRemoveUnit: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.removeUnit(_id);
  },

  blockRemoveUnits: async (
    _parent: undefined,
    { _ids }: { _ids: string[] },
    { models }: IContext,
  ): Promise<DeleteResult> => {
    return models.Unit.deleteMany({ _id: { $in: _ids } });
  },
};
