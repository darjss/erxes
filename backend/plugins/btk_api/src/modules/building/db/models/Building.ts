import { IBuilding, IBuildingDocument } from '@/building/@types/building';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { buildingSchema } from '@/building/db/definitions/building';

export interface IBuildingModel extends Model<IBuildingDocument> {
  createBuilding(input: IBuilding): Promise<IBuildingDocument>;
  updateBuilding(_id: string, input: IBuilding): Promise<IBuildingDocument>;
}

export const loadBuildingClass = (models: IModels) => {
  class Building {
    public static async createBuilding(input: IBuilding) {
      return models.Building.create(input);
    }

    public static async updateBuilding(_id: string, input: IBuilding) {
      return models.Building.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  buildingSchema.loadClass(Building);

  return buildingSchema;
};
