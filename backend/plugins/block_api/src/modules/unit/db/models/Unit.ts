import { IUnit, IUnitDocument } from '@/unit/@types/unit';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { unitSchema } from '@/unit/db/definitions/unit';

export interface IUnitModel extends Model<IUnitDocument> {
  getUnit(_id: string): Promise<IUnitDocument>;
  createUnit(input: IUnit): Promise<IUnitDocument>;
  updateUnit(_id: string, input: IUnit, userId?: string): Promise<IUnitDocument>;
  removeUnit(id: string): Promise<IUnitDocument>;
  getUnitsByZoning(zoning: string): Promise<IUnitDocument[]>;
}

export const loadUnitClass = (
  models: IModels,
  subdomain: string,
) => {
  class Unit {
    public static async getUnit(_id: string) {
      return models.Unit.findOne({ _id });
    }

    public static async createUnit(input: IUnit) {
      return models.Unit.create(input);
    }

    public static async updateUnit(_id: string, input: IUnit, userId?: string) {
      const prevUnit = await models.Unit.findOne({ _id }).lean();

      const updatedUnit = await models.Unit.findOneAndUpdate({ _id }, input, {
        new: true,
      });

      return updatedUnit;
    }

    public static async removeUnit(id: string) {
      return models.Unit.findOneAndDelete({ _id: id });
    }

    public static async getUnitsByZoning(zoning: string) {
      return models.Unit.find({ zoning }).sort({ unitNumber: 1 });
    }
  }

  unitSchema.loadClass(Unit);

  return unitSchema;
};
