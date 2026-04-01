import { IUnitType, IUnitTypeDocument } from '@/unit/@types/unitType';
import { unitTypeSchema } from '@/unit/db/definitions/unitType';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { generateUnitTypeUpdateActivityLogs } from '../../meta/activity-log/unitType';

export interface IUnitTypeModel extends Model<IUnitTypeDocument> {
  getUnitType(_id: string): Promise<IUnitTypeDocument>;
  createUnitType(input: IUnitType): Promise<IUnitTypeDocument>;
  updateUnitType(_id: string, input: IUnitType, userId: string): Promise<IUnitTypeDocument>;
}

export const loadUnitTypeClass = (
  models: IModels,
  subdomain: string,
  { createActivityLog }: EventDispatcherReturn,
) => {
  class UnitType {
    public static async getUnitType(_id: string) {
      return models.UnitType.findOne({ _id });
    }

    public static async createUnitType(input: IUnitType) {
      return models.UnitType.create(input);
    }

    public static async updateUnitType(_id: string, input: IUnitType, userId: string) {
      const prevUnitType = await models.UnitType.findOne({ _id }).lean();

      const updatedUnitType = await models.UnitType.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );

      if (prevUnitType && updatedUnitType) {
        await generateUnitTypeUpdateActivityLogs(
          prevUnitType,
          updatedUnitType.toObject(),
          createActivityLog,
        );
      }

      return updatedUnitType;
    }
  }

  unitTypeSchema.loadClass(UnitType);

  return unitTypeSchema;
};
