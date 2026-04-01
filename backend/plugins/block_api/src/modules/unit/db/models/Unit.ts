import { IUnit, IUnitDocument } from '@/unit/@types/unit';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { unitSchema } from '@/unit/db/definitions/unit';
import { generateUnitUpdateActivityLogs } from '../../meta/activity-log';

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
  { createActivityLog }: EventDispatcherReturn,
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

      if (prevUnit && updatedUnit) {
        await generateUnitUpdateActivityLogs(
          prevUnit,
          updatedUnit.toObject(),
          createActivityLog,
        );
      }

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
