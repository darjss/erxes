import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const associationQueries: Record<string, Resolver> = {
  async mtoAssociations(
    _root: undefined,
    { isActive, parentId }: { isActive?: boolean; parentId?: string },
    { models }: IContext,
  ) {
    const filter: any = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (parentId !== undefined) {
      filter.parentId = parentId;
    }

    return models.Association.find(filter).sort({ createdAt: 1 });
  },

  async mtoAssociation(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Association.findOne({ _id });
  },
};

markResolvers(associationQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
