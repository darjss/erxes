import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { newsSchema } from '~/modules/news/db/definitions/news';
import { INews, INewsDocument } from '~/modules/news/@types/news';

export interface INewsModel extends Model<INewsDocument> {
  getNews(_id: string): Promise<INewsDocument>;
  getAllNews(): Promise<INewsDocument[]>;
  createNews(name: string): Promise<INewsDocument>;
  updateNews({
    _id,
    input,
  }: {
    _id: string;
    input: INews;
  }): Promise<INewsDocument>;
  removeNews(NewsId: string): Promise<{ ok: number }>;
}

export const loadNewsClass = (models: IModels) => {
  class News {
    public static async getNews(_id: string) {
      const News = await models.News.findById(_id);

      if (!News) {
        throw new Error('News not found');
      }

      return News;
    }

    public static async getAllNews(): Promise<INewsDocument[]> {
      return models.News.find().lean();
    }

    public static async createNews(name: string): Promise<INewsDocument> {
      return models.News.insertOne({ name });
    }

    public static async updateNews({
      _id,
      input,
    }: {
      _id: string;
      input: INews;
    }) {
      return await models.News.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );
    }

    /**
     * Remove btk
     */
    public static async removeNews(NewsId: string[]) {
      return models.News.deleteOne({ _id: { $in: NewsId } });
    }
  }

  newsSchema.loadClass(News);

  return newsSchema;
};
