import { IProject, IProjectDocument } from '@/project/@types/project';
import { projectSchema } from '@/project/db/definitions/project';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';

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
      const project = await models.Project.create({ name });

      // Create default statuses for the project
      if (project) {
        await models.Status.generateDefaultStatus(project._id);
      }

      return project;
    }

    public static async updateProject({
      _id,
      input,
    }: {
      _id: string;
      input: IProject;
    }) {
      const status = await models.Status.exists({ projectId: _id });

      if (!status) {
        await models.Status.generateDefaultStatus(_id);
      }

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
