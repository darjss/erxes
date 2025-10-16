import { IZoning, IZoningDocument } from '@/building/@types/zoning';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { zoningSchema } from '@/building/db/definitions/zoning';

export interface IZoningModel extends Model<IZoningDocument> {
  createZoning(input: IZoning): Promise<IZoningDocument>;
  updateZoning(_id: string, input: IZoning): Promise<IZoningDocument>;
  getBuildingZoning(_id: string): Promise<IZoningDocument>;
  getBuildingZonings(building: string): Promise<IZoningDocument[]>;
}

export const loadZoningClass = (models: IModels) => {
  class Zoning {
    public static async createZoning(input: IZoning) {
      return models.Zoning.create(input);
    }

    public static async updateZoning(_id: string, input: IZoning) {
      return models.Zoning.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }

    public static async getBuildingZoning(_id: string) {
      return models.Zoning.findOne({ _id }).lean();
    }

    public static async getBuildingZonings(building: string) {
      return models.Zoning.find({ building }).lean();
    }
  }

  zoningSchema.loadClass(Zoning);

  return zoningSchema;
};
