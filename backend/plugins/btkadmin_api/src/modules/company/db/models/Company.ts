import { IBtkCompanyDocument } from '~/modules/company/db/@types/company';
import { companySchema } from '~/modules/company/db/definitions/company';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IBtkCompanyModel extends Model<IBtkCompanyDocument> {
  getCompany(subdomain: string, entityId: string): Promise<IBtkCompanyDocument>;
  createCompany(input: IBtkCompanyDocument): Promise<IBtkCompanyDocument>;
  updateCompany(
    subdomain: string,
    entityId: string,
    input: IBtkCompanyDocument,
  ): Promise<IBtkCompanyDocument>;
}

export const loadBtkCompanyClass = (models: IModels) => {
  class Company {
    public static async getCompany(subdomain: string, entityId: string) {
      const company = await models.Company.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!company) {
        throw new Error('Company not found');
      }

      return company;
    }

    public static async createCompany(input: IBtkCompanyDocument) {
      return models.Company.create(input);
    }

    public static async updateCompany(
      subdomain: string,
      entityId: string,
      input: IBtkCompanyDocument,
    ) {
      const { _id } = await models.Company.getCompany(subdomain, entityId);

      return models.Company.findOneAndUpdate({ _id }, input, {
        new: true,
      });
    }
  }

  companySchema.loadClass(Company);

  return companySchema;
};
