import { IModels } from '~/connectionResolvers';

/**
 * Updates a provider's categoryIds based on all active activity-types for that provider
 * @param models - Database models
 * @param providerId - The provider ID to update
 */
export async function updateProviderCategoriesFromActivityTypes(
  models: IModels,
  providerId: string,
): Promise<void> {
  // Find all active activity-types for this provider
  const activeActivityTypes = await models.ActivityType.find({
    providerId,
    isActive: true,
  });

  // Collect unique category IDs from active activity-types
  const categorySet = new Set<string>();

  for (const activityType of activeActivityTypes) {
    if (activityType.categoryIds && Array.isArray(activityType.categoryIds)) {
      for (const categoryId of activityType.categoryIds) {
        if (categoryId && typeof categoryId === 'string') {
          categorySet.add(categoryId);
        }
      }
    }
  }

  // Sort for consistency
  const newCategoryIds = Array.from(categorySet).sort();

  // Update the provider's categoryIds
  await models.Provider.updateProvider(providerId, {
    categoryIds: newCategoryIds,
  });
}
