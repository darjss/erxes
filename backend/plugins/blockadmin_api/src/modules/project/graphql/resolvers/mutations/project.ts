import { IContext } from '~/connectionResolvers';
import { sendBlockMessage } from '~/modules/block/utils';

export const projectMutations = {
  blockAdminUpdateProject: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: any },
    { models }: IContext,
  ) => {
    const project = await models.Project.findOne({ _id });

    if (!project) {
      throw new Error('Project not found');
    }

    try {
      const { subdomain, entityId } = project;

      const response = await sendBlockMessage({
        subdomain,
        path: 'updateProjectPublishInfo',
        payload: {
          data: { isPublished: input.isPublished },
          entityId: entityId,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update project general info: ${response.statusText}`,
        );
      }

      const updatedProject = await models.Project.findOneAndUpdate(
        { _id },
        { isPublished: input.isPublished },
        { new: true },
      );

      return updatedProject;
    } catch (error) {
      throw new Error(`Failed to update project general info: ${error}`);
    }
  },
};
