import {
  ISystemConfig,
  ISystemConfigDocument,
} from '@/config/@types/config';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { systemConfigSchema } from '../definitions/config';

export interface ISystemConfigModel extends Model<ISystemConfigDocument> {
  createConfig(doc: ISystemConfig): Promise<ISystemConfigDocument>;
  updateConfig(
    key: string,
    value: any,
  ): Promise<ISystemConfigDocument>;
  getConfig(key: string): Promise<ISystemConfigDocument | null>;
  getAllConfigs(): Promise<ISystemConfigDocument[]>;
  removeConfigs(keys: string[]): Promise<{ n: number; ok: number }>;
}

export const loadSystemConfigClass = (models: IModels) => {
  class SystemConfig {
    public static async createConfig(doc: ISystemConfig) {
      return await models.SystemConfig.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateConfig(key: string, value: any) {
      return await models.SystemConfig.findOneAndUpdate(
        { key },
        {
          $set: {
            value,
            modifiedAt: new Date(),
          },
        },
        { upsert: true, new: true },
      );
    }

    public static async getConfig(key: string) {
      return await models.SystemConfig.findOne({ key });
    }

    public static async getAllConfigs() {
      return await models.SystemConfig.find({});
    }

    public static async removeConfigs(keys: string[]) {
      return models.SystemConfig.deleteMany({ key: { $in: keys } });
    }
  }

  systemConfigSchema.loadClass(SystemConfig);

  return systemConfigSchema;
};

