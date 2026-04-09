import { IUnit, IUnitDocument, ITransferUnit } from '@/unit/@types/unit';
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
  transferUnit(payload: ITransferUnit): Promise<IUnitDocument>;
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
      const unit = await models.Unit.getUnit(subdomain, entityId);
      if (!unit)
        throw new Error(
          `Unit "${entityId}" not found in subdomain "${subdomain}"`,
        );
      return models.Unit.findOneAndUpdate({ _id: unit._id }, input, {
        new: true,
      });
    }

    public static async removeUnit(subdomain: string, entityId: string) {
      const unit = await models.Unit.getUnit(subdomain, entityId);
      if (!unit)
        throw new Error(
          `Unit "${entityId}" not found in subdomain "${subdomain}"`,
        );
      return models.Unit.findOneAndDelete({ _id: unit._id });
    }

    public static async getUnitsByZoning(zoning: string) {
      return models.Unit.find({ zoning }).sort({ unitNumber: 1 });
    }

    public static async transferUnit(payload: ITransferUnit) {
      const { blockSubdomain, unitId, agencySubdomain, agencyId } = payload;

      const unit = await models.Unit.getUnit(blockSubdomain, unitId);
      if (!unit) {
        throw new Error(
          `Unit "${unitId}" not found in subdomain "${blockSubdomain}"`,
        );
      }

      if (unit.agencyEntityId) {
        throw new Error(`Unit "${unitId}" is already assigned to an agency`);
      }

      if (unit.status && unit.status !== 'available') {
        throw new Error(
          `Unit "${unitId}" is not available for transfer (status: ${unit.status})`,
        );
      }

      return models.Unit.findOneAndUpdate(
        { _id: unit._id },
        { $set: { agencySubdomain, agencyEntityId: agencyId } },
        { new: true },
      );
    }
  }

  unitSchema.loadClass(Unit);

  return unitSchema;
};
