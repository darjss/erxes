import { IUnitType, IUnitTypeDocument } from '@/unit/@types/unitType';
import { unitTypeSchema } from '@/unit/db/definitions/unitType';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { createActivity } from '@/activity/utils/createActivity';
import { BLOCK_MODULES } from '~/constants';

export interface IUnitTypeModel extends Model<IUnitTypeDocument> {
  getUnitType(_id: string): Promise<IUnitTypeDocument>;
  createUnitType(input: IUnitType): Promise<IUnitTypeDocument>;
  updateUnitType(_id: string, input: IUnitType, userId: string): Promise<IUnitTypeDocument>;
}

export const loadUnitTypeClass = (models: IModels, subdomain: string) => {
  class UnitType {
    public static async getUnitType(_id: string) {
      return models.UnitType.findOne({ _id });
    }

    public static async createUnitType(input: IUnitType) {
      return models.UnitType.create(input);
    }

    public static async updateUnitType(_id: string, input: IUnitType, userId: string) {
      const oldUnitType = await models.UnitType.findOne({ _id }).lean();
      
      const updatedUnitType = await models.UnitType.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );

      if (userId && updatedUnitType) {
        await createActivity<IUnitType>({
          subdomain,
          oldDoc: oldUnitType || undefined,
          newDoc: updatedUnitType.toObject(),
          userId,
          contentId: _id,
          module: BLOCK_MODULES.UNIT_TYPE,
        });
      }

      return updatedUnitType;
    }
  }

  unitTypeSchema.loadClass(UnitType);

  return unitTypeSchema;
};
