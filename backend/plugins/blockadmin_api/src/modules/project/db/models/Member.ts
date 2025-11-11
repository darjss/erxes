import { Model } from 'mongoose';

import {
  IProjectMember,
  IProjectMemberDocument,
} from '@/project/@types/member';
import { blockProjectMemberSchema } from '@/project/db/definitions/member';
import { IModels } from '~/connectionResolvers';

export interface IProjectMemberModel extends Model<IProjectMemberDocument> {
  getProjectMember(
    subdomain: string,
    entityId: string,
  ): Promise<IProjectMemberDocument>;
  addProjectMember(member: IProjectMember): Promise<IProjectMemberDocument[]>;
  updateProjectMember(
    subdomain: string,
    entityId: string,
    role: string,
  ): Promise<IProjectMemberDocument>;
  deleteProjectMember(
    subdomain: string,
    entityId: string,
  ): Promise<IProjectMemberDocument>;
}

export const loadProjectMemberClass = (models: IModels) => {
  class ProjectMember {
    public static async getProjectMember(subdomain: string, entityId: string) {
      const projectMember = await models.ProjectMember.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!projectMember) {
        throw new Error('Project member not found');
      }

      return projectMember;
    }

    public static async addProjectMember(member: IProjectMember) {
      return models.ProjectMember.create(member);
    }

    public static async updateProjectMember(
      subdomain: string,
      entityId: string,
      role: string,
    ) {
      const { _id } = await models.ProjectMember.getProjectMember(
        subdomain,
        entityId,
      );

      return models.ProjectMember.findOneAndUpdate(
        { _id },
        { $set: { role } },
        { new: true },
      );
    }

    public static async deleteProjectMember(
      subdomain: string,
      entityId: string,
    ) {
      const { _id } = await models.ProjectMember.getProjectMember(
        subdomain,
        entityId,
      );

      return models.ProjectMember.findOneAndDelete({ _id });
    }
  }

  blockProjectMemberSchema.loadClass(ProjectMember);

  return blockProjectMemberSchema;
};
