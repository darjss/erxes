import { IUserDocument } from 'erxes-api-shared/core-types';

import { IModels } from '~/connectionResolvers';

type TIdentifier = {
  _id: string;
  createdUserId?: string;
  memberIds?: string[];
};

export const requireUser = (user?: IUserDocument) => {
  if (!user?._id) {
    throw new Error('User not authenticated');
  }

  return user;
};

export const isAdminUser = (user?: IUserDocument) => {
  return !!user?.isOwner;
};

export const buildIdentifierAccessQuery = (user?: IUserDocument) => {
  const currentUser = requireUser(user);

  if (isAdminUser(currentUser)) {
    return {};
  }

  return {
    $or: [
      { createdUserId: currentUser._id },
      { memberIds: currentUser._id },
    ],
  };
};

export const hasIdentifierAccess = (
  identifier: TIdentifier | null | undefined,
  user?: IUserDocument,
) => {
  if (!identifier) {
    return false;
  }

  const currentUser = requireUser(user);

  if (isAdminUser(currentUser)) {
    return true;
  }

  return (
    identifier.createdUserId === currentUser._id ||
    (identifier.memberIds || []).includes(currentUser._id)
  );
};

export const canManageIdentifier = (
  identifier: TIdentifier | null | undefined,
  user?: IUserDocument,
) => {
  if (!identifier) {
    return false;
  }

  const currentUser = requireUser(user);

  return isAdminUser(currentUser) || identifier.createdUserId === currentUser._id;
};

export const assertIdentifierAccess = async (
  models: IModels,
  identifierId: string,
  user?: IUserDocument,
) => {
  if (!identifierId) {
    throw new Error('identifierId is required');
  }

  const identifier = await models.Identifier.findById(identifierId).lean();

  if (!identifier) {
    throw new Error('Identifier not found');
  }

  if (!hasIdentifierAccess(identifier, user)) {
    throw new Error('You do not have permission to access this identifier');
  }

  return identifier;
};

export const assertIdentifierManageAccess = async (
  models: IModels,
  identifierId: string,
  user?: IUserDocument,
) => {
  const identifier = await assertIdentifierAccess(models, identifierId, user);

  if (!canManageIdentifier(identifier, user)) {
    throw new Error('You do not have permission to manage this identifier');
  }

  return identifier;
};

