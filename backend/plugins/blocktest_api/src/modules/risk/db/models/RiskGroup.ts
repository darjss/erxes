import { ICVRiskGroupDocument } from '../../@types/riskGroup';

import { Model } from 'mongoose';
import { ICVRiskGroup } from '@/risk/@types/riskGroup';
import { IModels } from '~/connectionResolvers';
import { riskGroupSchema } from '@/risk/db/definitions/riskGroup';

export interface ICVRiskGroupModel extends Model<ICVRiskGroupDocument> {
  createRiskGroup(doc: ICVRiskGroup): Promise<ICVRiskGroupDocument>;
  updateRiskGroup(
    _id: string,
    doc: ICVRiskGroup,
  ): Promise<ICVRiskGroupDocument>;
  removeRiskGroup(_id: string): Promise<ICVRiskGroupDocument>;
}

export const loadRiskGroupClass = (models: IModels) => {
  class CVRiskGroups {
    public static async createRiskGroup(doc: ICVRiskGroup) {
      return models.CVRiskGroups.create(doc);
    }
    public static async updateRiskGroup(_id: string, doc: ICVRiskGroup) {
      return models.CVRiskGroups.findOneAndUpdate(
        { _id },
        { $set: { ...doc } },
      );
    }
    public static async removeRiskGroup(_id: string) {
      return models.CVRiskGroups.deleteOne({ _id });
    }
  }

  riskGroupSchema.loadClass(CVRiskGroups);

  return riskGroupSchema;
};
