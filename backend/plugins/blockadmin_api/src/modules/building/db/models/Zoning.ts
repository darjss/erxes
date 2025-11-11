import { IZoning, IZoningDocument } from '@/building/@types/zoning';
import { zoningSchema } from '@/building/db/definitions/zoning';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IZoningModel extends Model<IZoningDocument> {
  getBuildingZoning(
    subdomain: string,
    entityId: string,
  ): Promise<IZoningDocument>;
  getBuildingZonings(building: string): Promise<IZoningDocument[]>;
  createZoning(input: IZoning): Promise<IZoningDocument>;
  updateZoning(
    subdomain: string,
    entityId: string,
    input: IZoning,
  ): Promise<IZoningDocument>;
  deleteZoning(subdomain: string, entityId: string): Promise<IZoningDocument>;
}

export const loadZoningClass = (models: IModels) => {
  class Zoning {
    public static async getBuildingZoning(subdomain: string, entityId: string) {
      const zoning = await models.Zoning.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!zoning) {
        throw new Error('Zoning not found');
      }

      return zoning;
    }

    public static async getBuildingZonings(building: string) {
      return models.Zoning.find({ building }).lean();
    }

    public static async createZoning(input: IZoning) {
      return models.Zoning.create(input);
    }

    public static async updateZoning(
      subdomain: string,
      entityId: string,
      input: IZoning,
    ) {
      const { _id } = await models.Zoning.getBuildingZoning(
        subdomain,
        entityId,
      );

      return models.Zoning.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }

    public static async deleteZoning(subdomain: string, entityId: string) {
      const { _id } = await models.Zoning.getBuildingZoning(
        subdomain,
        entityId,
      );

      return models.Zoning.findOneAndDelete({ _id });
    }
  }

  zoningSchema.loadClass(Zoning);

  return zoningSchema;
};
