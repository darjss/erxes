import { IUnitLead, IUnitLeadDocument } from '@/unit/@types/unitLead';
import { unitLeadSchema } from '@/unit/db/definitions/unitLead';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IUnitLeadModel extends Model<IUnitLeadDocument> {
  getUnitLead(subdomain: string, entityId: string): Promise<IUnitLeadDocument>;
  createUnitLead(input: IUnitLead): Promise<IUnitLeadDocument>;
  removeUnitLead(
    subdomain: string,
    entityId: string,
  ): Promise<IUnitLeadDocument>;
}

export const loadUnitLeadClass = (models: IModels) => {
  class UnitLead {
    public static async getUnitLead(subdomain: string, entityId: string) {
      const unitLead = await models.UnitLead.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!unitLead) {
        throw new Error('Unit Lead not found');
      }

      return unitLead;
    }

    public static async createUnitLead(input: IUnitLead) {
      return models.UnitLead.create(input);
    }

    public static async removeUnitLead(subdomain: string, entityId: string) {
      const { _id } = await models.UnitLead.getUnitLead(subdomain, entityId);

      return models.UnitLead.findOneAndDelete({ _id });
    }
  }

  unitLeadSchema.loadClass(UnitLead);

  return unitLeadSchema;
};
