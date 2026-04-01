import { IProject, IProjectDocument } from '@/project/@types/project';
import { projectSchema } from '@/project/db/definitions/project';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { generateProjectUpdateActivityLogs } from '../../meta/activity-log';

export interface IProjectModel extends Model<IProjectDocument> {
  getProject(_id: string): Promise<IProjectDocument>;
  createProject(name: string): Promise<IProjectDocument>;
  updateProject({
    _id,
    input,
    userId,
  }: {
    _id: string;
    input: IProject;
    userId: string;
  }): Promise<IProjectDocument>;
  removeProject(ProjectId: string): Promise<{ ok: number }>;
}

export const loadProjectClass = (
  models: IModels,
  subdomain: string,
  { createActivityLog }: EventDispatcherReturn,
) => {
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
      userId,
    }: {
      _id: string;
      input: IProject;
      userId: string;
    }) {
      const prevProject = await models.Project.findOne({ _id }).lean();

      const status = await models.Status.exists({ projectId: _id });

      if (!status) {
        await models.Status.generateDefaultStatus(_id);
      }

      const updatedProject = await models.Project.findOneAndUpdate(
        { _id },
        { $set: { ...input } },
        { new: true },
      );

      if (prevProject && updatedProject) {
        await generateProjectUpdateActivityLogs(
          prevProject,
          updatedProject.toObject(),
          createActivityLog,
        );
      }

      return updatedProject;
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
