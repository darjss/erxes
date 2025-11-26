import { IUnitType, IUnitTypeDocument } from '@/unit/@types/unitType';
import { unitTypeSchema } from '@/unit/db/definitions/unitType';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IUnitTypeModel extends Model<IUnitTypeDocument> {
  getUnitType(_id: string): Promise<IUnitTypeDocument>;
  createUnitType(input: IUnitType): Promise<IUnitTypeDocument>;
  updateUnitType(_id: string, input: IUnitType): Promise<IUnitTypeDocument>;
}

export const loadUnitTypeClass = (models: IModels) => {
  class UnitType {
    public static async getUnitType(_id: string) {
      return models.UnitType.findOne({ _id });
    }

    public static async createUnitType(input: IUnitType) {
      return models.UnitType.create(input);
    }

    public static async updateUnitType(_id: string, input: IUnitType) {
      return models.UnitType.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  unitTypeSchema.loadClass(UnitType);

  return unitTypeSchema;
};
