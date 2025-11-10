import { IProject, IProjectDocument } from '@/project/@types/project';
import { projectSchema } from '@/project/db/definitions/project';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

export interface IProjectModel extends Model<IProjectDocument> {
  getProject(subdomain: string, entityId: string): Promise<IProjectDocument>;
  createProject(doc: IProject): Promise<IProjectDocument>;
  updateProject(
    subdomain: string,
    entityId: string,
    input: IProject,
  ): Promise<IProjectDocument>;
  removeProject(subdomain: string, entityId: string): Promise<{ ok: number }>;
}

export const loadProjectClass = (models: IModels) => {
  class Project {
    public static async getProject(subdomain: string, entityId: string) {
      const Project = await models.Project.findOne({
        subdomain,
        entityId,
      }).lean();

      if (!Project) {
        throw new Error('Project not found');
      }

      return Project;
    }

    public static async createProject(
      doc: IProject,
    ): Promise<IProjectDocument> {
      return models.Project.create(doc);
    }

    public static async updateProject(
      subdomain: string,
      entityId: string,
      input: IProject,
    ) {
      const { _id } = await models.Project.getProject(subdomain, entityId);

      return models.Project.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );
    }

    /**
     * Remove block
     */
    public static async removeProject(subdomain: string, entityId: string) {
      console.log('removeProject', subdomain, entityId);

      const { _id } = await models.Project.getProject(subdomain, entityId);

      return models.Project.findOneAndDelete({ _id });
    }
  }

  projectSchema.loadClass(Project);

  return projectSchema;
};
