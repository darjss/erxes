import {
  coreModelAddons,
  coreModelBundles,
  coreModelInstallations,
  coreModelOrganizations,
  getSaasCoreConnection,
} from 'erxes-api-shared/utils';

export const getActiveBundleTypes = async (
  subdomain: string,
): Promise<string[]> => {
  await getSaasCoreConnection();

  const organization = await coreModelOrganizations
    .findOne({ subdomain })
    .lean();
  if (!organization) return [];

  const installation = await coreModelInstallations.findOne({
    organizationId: organization._id,
  });
  if (!installation) return [];

  const bundleTypes: string[] = await coreModelBundles
    .find({})
    .distinct('type')
    .lean();

  // 'canceled' is included so a bundle stays active until its expiryDate even
  // if the customer canceled renewal — matches getSaasOrganizationDetail.
  const activeBundles = await coreModelAddons
    .find(
      {
        installationId: installation._id.toString(),
        kind: { $in: bundleTypes },
        paymentStatus: { $in: ['complete', 'canceled'] },
        expiryDate: { $gt: new Date() },
      },
      { kind: 1 },
    )
    .lean();

  return Array.from(
    new Set((activeBundles as any[]).map((a) => a.kind).filter(Boolean)),
  );
};
