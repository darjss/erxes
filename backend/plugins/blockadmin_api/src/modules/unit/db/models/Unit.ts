import { IUnit, IUnitDocument } from '@/unit/@types/unit';
import { unitSchema } from '@/unit/db/definitions/unit';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IUnitModel extends Model<IUnitDocument> {
  getUnit(subdomain: string, entityId: string): Promise<IUnitDocument>;
  createUnit(input: IUnit): Promise<IUnitDocument>;
  updateUnit(
    subdomain: string,
    entityId: string,
    input: IUnit,
  ): Promise<IUnitDocument>;
  removeUnit(subdomain: string, entityId: string): Promise<IUnitDocument>;
  getUnitsByZoning(zoning: string): Promise<IUnitDocument[]>;
}

export const loadUnitClass = (models: IModels) => {
  class Unit {
    public static async getUnit(subdomain: string, entityId: string) {
      return models.Unit.findOne({ subdomain, entityId });
    }

    public static async createUnit(input: IUnit) {
      return models.Unit.create(input);
    }

    public static async updateUnit(
      subdomain: string,
      entityId: string,
      input: IUnit,
    ) {
      const { _id } = await models.Unit.getUnit(subdomain, entityId);

      return models.Unit.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }

    public static async removeUnit(subdomain: string, entityId: string) {
      const { _id } = await models.Unit.getUnit(subdomain, entityId);

      return models.Unit.findOneAndDelete({ _id });
    }

    public static async getUnitsByZoning(zoning: string) {
      return models.Unit.find({ zoning }).sort({ unitNumber: 1 });
    }
  }

  unitSchema.loadClass(Unit);

  return unitSchema;
};
