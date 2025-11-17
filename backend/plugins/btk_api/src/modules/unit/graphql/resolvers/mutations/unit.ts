import { IContext } from '~/connectionResolvers';
import { IUnitInput } from '@/unit/@types/unit';
import { CONTRACT_STATUS } from '@/contract/constants';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const unitMutations = {
  btkCreateUnit: async (
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
      rest.mainPrice = project.mainPrice || 0;
      rest.prices = project.prices || [];
    }

    return models.Unit.createUnit(rest);
  },

  btkUpdateUnit: async (
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
      rest.mainPrice = project.mainPrice || 0;
      rest.prices = project.prices || [];
    }

    return models.Unit.updateUnit(_id, rest);
  },

  btkDeleteUnit: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.removeUnit(_id);
  },
};

requireLogin(unitMutations, 'btkCreateUnit');
requireLogin(unitMutations, 'btkUpdateUnit');
requireLogin(unitMutations, 'btkDeleteUnit');
