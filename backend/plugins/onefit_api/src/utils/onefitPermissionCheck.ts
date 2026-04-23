import { IContext } from '~/connectionResolvers';

/**
 * For resolvers marked with skipPermission (public queries). When a team user is
 * authenticated, enforce the action. Anonymous and client-portal-only calls are unchanged.
 */
export async function ifTeamUserCheck(
  context: IContext,
  action: string,
): Promise<void> {
  if (context.user?._id) {
    await context.checkPermission(action);
  }
}

/**
 * Staff resolvers where GraphQL already requires a logged-in team user.
 */
export async function requirePermission(
  context: IContext,
  action: string,
): Promise<void> {
  await context.checkPermission(action);
}
