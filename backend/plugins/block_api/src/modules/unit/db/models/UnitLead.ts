import { IUnitLead, IUnitLeadDocument } from '@/unit/@types/unitLead';
import { IModels } from '~/connectionResolvers';
import { unitLeadSchema } from '@/unit/db/definitions/unitLead';
import { Model } from 'mongoose';

export interface IUnitLeadModel extends Model<IUnitLeadDocument> {
  getUnitLead(_id: string): Promise<IUnitLeadDocument>;
  createUnitLead(input: IUnitLead): Promise<IUnitLeadDocument>;
  removeUnitLead(id: string): Promise<IUnitLeadDocument>;
}

export const loadUnitLeadClass = (models: IModels) => {
  class UnitLead {
    public static async getUnitLead(_id: string) {
      return models.UnitLead.findOne({ _id });
    }

    public static async createUnitLead(input: IUnitLead) {
      return models.UnitLead.create(input);
    }

    public static async removeUnitLead(id: string) {
      return models.UnitLead.findOneAndDelete({ _id: id });
    }
  }

  unitLeadSchema.loadClass(UnitLead);

  return unitLeadSchema;
};
