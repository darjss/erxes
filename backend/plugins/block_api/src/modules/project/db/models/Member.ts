import { Model } from 'mongoose';

import { IProjectMemberDocument } from '@/project/@types/member';
import { IModels } from '~/connectionResolvers';
import { IProjectMember } from '@/project/@types/member';
import { blockProjectMemberSchema } from '@/project/db/definitions/member';

export interface IProjectMemberModel extends Model<IProjectMemberDocument> {
  addProjectMembers(
    members: IProjectMember[],
  ): Promise<IProjectMemberDocument[]>;
  updateProjectMember(
    _id: string,
    role: string,
  ): Promise<IProjectMemberDocument>;
  deleteProjectMember(_id: string): Promise<IProjectMemberDocument>;
}

export const loadProjectMemberClass = (models: IModels) => {
  class ProjectMember {
    public static async addProjectMembers(members: IProjectMember[]) {
      return models.ProjectMember.insertMany(members);
    }

    public static async updateProjectMember(_id: string, role: string) {
      return models.ProjectMember.findOneAndUpdate(
        { _id },
        { $set: { role } },
        { new: true },
      );
    }

    public static async deleteProjectMember(_id: string) {
      return models.ProjectMember.findOneAndDelete({ _id });
    }
  }

  blockProjectMemberSchema.loadClass(ProjectMember);

  return blockProjectMemberSchema;
};
