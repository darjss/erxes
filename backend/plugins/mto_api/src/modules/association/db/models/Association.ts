import { IAssociation, IAssociationDocument } from '@/association/@types/association';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { associationSchema } from '../definitions/association';

export interface IAssociationModel extends Model<IAssociationDocument> {
  createAssociation(doc: IAssociation): Promise<IAssociationDocument>;
  updateAssociation(
    _id: string,
    doc: Partial<IAssociation>,
  ): Promise<IAssociationDocument>;
  removeAssociations(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadAssociationClass = (models: IModels) => {
  class Association {
    public static async createAssociation(doc: IAssociation) {
      return await models.Association.create({
        ...doc,
        isActive: doc.isActive ?? true,
        createdAt: new Date(),
      });
    }

    public static async updateAssociation(_id: string, doc: Partial<IAssociation>) {
      return await models.Association.findOneAndUpdate(
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

    public static async removeAssociations(ids: string[]) {
      return models.Association.deleteMany({ _id: { $in: ids } });
    }
  }

  associationSchema.loadClass(Association);

  return associationSchema;
};
