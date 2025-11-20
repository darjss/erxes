import { INews, INewsDocument } from '~/modules/news/@types/news';
import { newsSchema } from '~/modules/news/db/definitions/news';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface INewsModel extends Model<INewsDocument> {
  getNews(subdomain: string, entityId: string): Promise<INewsDocument>;
  createNews(doc: INews): Promise<INewsDocument>;
  updateNews(
    subdomain: string,
    entityId: string,
    input: INews,
  ): Promise<INewsDocument>;
  removeNews(subdomain: string, entityId: string): Promise<{ ok: number }>;
}

export const loadNewsClass = (models: IModels) => {
  class News {
    public static async getNews(subdomain: string, entityId: string) {
      const news = await models.News.findOne({
        subdomain,
        entityId,
      }).lean();

      return news;
    }

    public static async createNews(doc: INews): Promise<INewsDocument> {
      return models.News.create(doc);
    }

    public static async updateNews(
      subdomain: string,
      entityId: string,
      input: INews,
    ) {
      const news = await models.News.getNews(subdomain, entityId);

      if (!news) {
        return models.News.create({ ...input, subdomain, entityId });
      }

      return models.News.findOneAndUpdate(
        { _id: news._id },
        { $set: { ...input } },
        { new: true },
      );
    }

    /**
     * Remove btk
     */
    public static async removeNews(subdomain: string, entityId: string) {
      const { _id } = (await models.News.getNews(subdomain, entityId)) || {};

      return models.News.findOneAndDelete({ _id });
    }
  }

  newsSchema.loadClass(News);

  return newsSchema;
};
