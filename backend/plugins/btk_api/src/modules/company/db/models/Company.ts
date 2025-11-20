import { ICompanyDocument } from '@/company/db/@types/company';
import { companySchema } from '@/company/db/definitions/company';
import { IModels } from '~/connectionResolvers';
import { Model } from 'mongoose';

export interface ICompanyModel extends Model<ICompanyDocument> {
  createCompany(input: ICompanyDocument): Promise<ICompanyDocument>;
  updateCompany(
    _id: string,
    input: ICompanyDocument,
  ): Promise<ICompanyDocument>;
}

export const loadCompanyClass = (models: IModels) => {
  class Company {
    public static async createCompany(input: ICompanyDocument) {
      return models.Company.create(input);
    }

    public static async updateCompany(_id: string, input: ICompanyDocument) {
      return models.Company.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  companySchema.loadClass(Company);

  return companySchema;
};
