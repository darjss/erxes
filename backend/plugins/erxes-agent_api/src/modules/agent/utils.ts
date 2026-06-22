import { FilterQuery } from 'mongoose';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { IMastraAgentDocument } from '@/agent/@types/agent';
import { AGENT_ADMIN_GROUP_ID } from '~/meta/permissions';

/** True when the user holds owner or agent-admin role. */
export const isAgentAdmin = (user: IUserDocument) =>
  Boolean(
    user?.isOwner ||
      (user?.permissionGroupIds ?? []).includes(AGENT_ADMIN_GROUP_ID),
  );

/**
 * Single source of truth for "can user X read agent Y".
 * Private agents are visible only to their creator — even admins cannot see another
 * user's private agent. Admins can read all shared (team/department/org) agents
 * regardless of team membership. Admin write capability (edit/remove any agent)
 * is enforced separately in mutations by omitting the createdBy ownership filter.
 */
export const canUserAccessAgent = (
  agent: {
    createdBy?: string;
    visibility?: string;
    teamId?: string;
    departmentId?: string;
  },
  userId: string,
  isAdmin: boolean,
  teamIds: string[] = [],
  deptIds: string[] = [],
): boolean => {
  if (agent.createdBy === userId) return true;
  const vis = agent.visibility ?? 'private';
  if (vis === 'org') return true;
  if (isAdmin) return vis !== 'private'; // admin reads all shared agents
  if (vis === 'team') return teamIds.includes(agent.teamId ?? '');
  if (vis === 'department') return deptIds.includes(agent.departmentId ?? '');
  return false;
};

/**
 * Mongo $or filter expressing the same logic as canUserAccessAgent.
 * branchIds → teamIds, departmentIds → deptIds come from IUserDocument.
 */
export const visibilityFilter = (
  userId: string,
  isAdmin: boolean,
  teamIds: string[] = [],
  deptIds: string[] = [],
): FilterQuery<IMastraAgentDocument> =>
  isAdmin
    ? { $or: [{ createdBy: userId }, { visibility: { $in: ['team', 'department', 'org'] } }] }
    : {
        $or: [
          { createdBy: userId },
          { visibility: 'org' },
          ...(teamIds.length ? [{ visibility: 'team', teamId: { $in: teamIds } }] : []),
          ...(deptIds.length ? [{ visibility: 'department', departmentId: { $in: deptIds } }] : []),
        ],
      };

