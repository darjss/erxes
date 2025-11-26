import { IBuilding, IBuildingDocument } from '@/building/@types/building';
import { buildingSchema } from '@/building/db/definitions/building';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBuildingModel extends Model<IBuildingDocument> {
  getBuilding(subdomain: string, entityId: string): Promise<IBuildingDocument>;
  createBuilding(input: IBuilding): Promise<IBuildingDocument>;
  updateBuilding(
    subdomain: string,
    entityId: string,
    input: IBuilding,
  ): Promise<IBuildingDocument>;
  deleteBuilding(
    subdomain: string,
    entityId: string,
  ): Promise<IBuildingDocument>;
}

export const loadBuildingClass = (models: IModels) => {
  class Building {
    public static async getBuilding(subdomain: string, entityId: string) {

      console.log('entityId', entityId)

      const building = await models.Building.findOne({
        subdomain,
        entityId,
      }).lean();

      console.log('building', building)

      if (!building) {
        throw new Error('Building not found');
      }

      return building;
    }

    public static async createBuilding(input: IBuilding) {
      console.log('input', input)
      return models.Building.create(input);
    }

    public static async updateBuilding(
      subdomain: string,
      entityId: string,
      input: IBuilding,
    ) {
      const { _id } = await models.Building.getBuilding(subdomain, entityId);

      console.log('input', input);
      console.log('_id', _id);

      return models.Building.findOneAndUpdate(
        { _id },
        {
          $set: input,
        },
        {
          new: true,
        },
      );
    }

    public static async deleteBuilding(subdomain: string, entityId: string) {
      const { _id } = await models.Building.getBuilding(subdomain, entityId);

      return models.Building.findOneAndDelete({ _id });
    }
  }

  buildingSchema.loadClass(Building);

  return buildingSchema;
};
