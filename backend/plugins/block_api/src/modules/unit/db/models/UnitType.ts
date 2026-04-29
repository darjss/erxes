import { IUnitType, IUnitTypeDocument } from '@/unit/@types/unitType';
import { unitTypeSchema } from '@/unit/db/definitions/unitType';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IUnitTypeModel extends Model<IUnitTypeDocument> {
  getUnitType(_id: string): Promise<IUnitTypeDocument>;
  createUnitType(input: IUnitType): Promise<IUnitTypeDocument>;
  updateUnitType(
    _id: string,
    input: IUnitType,
    userId: string,
  ): Promise<IUnitTypeDocument>;
  removeUnitType(_id: string): Promise<IUnitTypeDocument>;
}

export const loadUnitTypeClass = (models: IModels, subdomain: string) => {
  class UnitType {
    public static async getUnitType(_id: string) {
      return models.UnitType.findOne({ _id });
    }

    public static async createUnitType(input: IUnitType) {
      return models.UnitType.create(input);
    }

    public static async updateUnitType(
      _id: string,
      input: IUnitType,
      userId: string,
    ) {
      const prevUnitType = await models.UnitType.findOne({ _id }).lean();

      const updatedUnitType = await models.UnitType.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );

      return updatedUnitType;
    }

    public static async removeUnitType(_id: string) {
      await models.Unit.updateMany(
        { type: _id },
        {
          $unset: { unitTypeId: 1 },
        },
      );

      return models.UnitType.findOneAndDelete({ _id });
    }
  }

  unitTypeSchema.loadClass(UnitType);

  return unitTypeSchema;
};
