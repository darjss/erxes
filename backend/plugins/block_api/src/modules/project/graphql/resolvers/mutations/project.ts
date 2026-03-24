import { IContext } from '~/connectionResolvers';
import { IProject } from '@/project/@types/project';

export const projectMutations = {
  blockCreateProject: async (
    _parent: undefined,
    { name }: { name: string },
    { models }: IContext,
  ) => {
    return models.Project.createProject(name);
  },

  blockUpdateProjectGeneralInfo: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IProject },
    { models, user }: IContext,
  ) => {
    return models.Project.updateProject({
      _id,
      input,
      userId: user?._id || '',
    });
  },

  blockPublishProject: async (
    _parent: undefined,
    { _id, isPublished }: { _id: string; isPublished: boolean },
    { models, user }: IContext,
  ) => {
    return models.Project.updateProject({
      _id,
      input: { isPublished },
      userId: user?._id || '',
    });
  },

  blockRemoveProject: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Project.removeProject(_id);
  },
};
