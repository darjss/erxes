import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { projectSchema } from '@/project/db/definitions/project';
import { IProject, IProjectDocument } from '@/project/@types/project';

export interface IProjectModel extends Model<IProjectDocument> {
  getProject(_id: string): Promise<IProjectDocument>;
  createProject(name: string): Promise<IProjectDocument>;
  updateProject({
    _id,
    input,
  }: {
    _id: string;
    input: IProject;
  }): Promise<IProjectDocument>;
  removeProject(ProjectId: string): Promise<{ ok: number }>;
}

export const loadProjectClass = (models: IModels) => {
  class Project {
    public static async getProject(_id: string) {
      const Project = await models.Project.findById(_id);

      if (!Project) {
        throw new Error('Project not found');
      }

      return Project;
    }

    public static async createProject(name: string): Promise<IProjectDocument> {
      return models.Project.insertOne({ name });
    }

    public static async updateProject({
      _id,
      input,
    }: {
      _id: string;
      input: IProject;
    }) {
      return await models.Project.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );
    }

    /**
     * Remove block
     */
    public static async removeProject(ProjectId: string[]) {
      return models.Project.deleteOne({ _id: { $in: ProjectId } });
    }
  }

  projectSchema.loadClass(Project);

  return projectSchema;
};
