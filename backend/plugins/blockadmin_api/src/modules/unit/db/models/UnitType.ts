import { IUnitType, IUnitTypeDocument } from '@/unit/@types/unitType';
import { unitTypeSchema } from '@/unit/db/definitions/unitType';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IUnitTypeModel extends Model<IUnitTypeDocument> {
  getUnitType(subdomain: string, entityId: string): Promise<IUnitTypeDocument>;
  createUnitType(input: IUnitType): Promise<IUnitTypeDocument>;
  updateUnitType(
    subdomain: string,
    entityId: string,
    input: IUnitType,
  ): Promise<IUnitTypeDocument>;
}

export const loadUnitTypeClass = (models: IModels) => {
  class UnitType {
    public static async getUnitType(subdomain: string, entityId: string) {
      return models.UnitType.findOne({ subdomain, entityId });
    }

    public static async createUnitType(input: IUnitType) {
      return models.UnitType.create(input);
    }

    public static async updateUnitType(
      subdomain: string,
      entityId: string,
      input: IUnitType,
    ) {
      const { _id } = await models.UnitType.getUnitType(subdomain, entityId) || {};

      return models.UnitType.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  unitTypeSchema.loadClass(UnitType);

  return unitTypeSchema;
};
