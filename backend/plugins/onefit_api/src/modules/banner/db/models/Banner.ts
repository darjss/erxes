import { IBanner, IBannerDocument } from '@/banner/@types/banner';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { bannerSchema } from '../definitions/banner';

export interface IBannerModel extends Model<IBannerDocument> {
  createBanner(doc: IBanner): Promise<IBannerDocument>;
  updateBanner(_id: string, doc: Partial<IBanner>): Promise<IBannerDocument>;
  removeBanners(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadBannerClass = (models: IModels) => {
  class Banner {
    public static async createBanner(doc: IBanner) {
      return await models.Banner.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateBanner(_id: string, doc: Partial<IBanner>) {
      return await models.Banner.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...doc,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async removeBanners(ids: string[]) {
      return models.Banner.deleteMany({ _id: { $in: ids } });
    }
  }

  bannerSchema.loadClass(Banner);

  return bannerSchema;
};
