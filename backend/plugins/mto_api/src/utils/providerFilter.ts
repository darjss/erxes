import { IContext } from '~/connectionResolvers';

/**
 * Get provider IDs that belong to the instanceId from context
 * Returns undefined if no instanceId filtering is needed
 */
export const getProviderIdsByInstanceId = async (
  context: IContext,
): Promise<string[] | undefined> => {
  // If no instanceId in context, no filtering needed
  if (!context.instanceId) {
    return undefined;
  }

  // Find all providers with matching instanceId
  const providers = await context.models.Provider.find({
    instanceId: context.instanceId,
  })
    .select('_id')
    .lean();

  return providers.map((p) => p._id);
};

/**
 * Add instanceId filtering to a filter object by adding providerId filter
 * This ensures only data belonging to providers with matching instanceId is returned
 */
export const addInstanceIdFilter = async (
  context: IContext,
  filter: any,
): Promise<any> => {
  const providerIds = await getProviderIdsByInstanceId(context);

  // If no instanceId filtering needed, return filter as-is
  if (!providerIds) {
    return filter;
  }

  // If filter already has providerId, combine with instanceId filter
  if (filter.providerId) {
    // If the specified providerId is not in our allowed list, return empty result
    if (!providerIds.includes(filter.providerId)) {
      return { ...filter, _id: { $in: [] } }; // Empty result
    }
    // ProviderId is valid, keep it
    return filter;
  }

  // Add providerId filter to only include providers with matching instanceId
  return {
    ...filter,
    providerId: { $in: providerIds },
  };
};
