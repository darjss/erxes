import crypto from 'crypto';
import { IContext } from '~/connectionResolvers';

const { BTK_API_URL = '', BTK_ADMIN_SECRET = '' } = process.env;

const VERIFICATION_STATUSES = ['pending', 'need_info', 'approved', 'rejected', 'violation'];

const syncVerificationStatusToBtk = async (
  subdomain: string,
  entityId: string,
  verificationStatus: string,
) => {
  if (!BTK_API_URL) return;

  const btkUrl = BTK_API_URL.replace('<subdomain>', subdomain);
  const body = JSON.stringify({ entityId, verificationStatus });
  const signature = crypto
    .createHmac('sha256', BTK_ADMIN_SECRET)
    .update(body)
    .digest('hex');

  try {
    await fetch(`${btkUrl}/api/updateCompanyVerificationStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    });
  } catch (e) {
    console.error('Failed to sync verificationStatus to btk_api:', e);
  }
};

export const companyMutations = {
  btkAdminUpdateCompanyVerificationStatus: async (
    _root: undefined,
    { _id, verificationStatus }: { _id: string; verificationStatus: string },
    { models }: IContext,
  ) => {
    if (!VERIFICATION_STATUSES.includes(verificationStatus)) {
      throw new Error('Invalid verification status');
    }

    const company = await models.Company.findOneAndUpdate(
      { _id },
      { verificationStatus },
      { new: true },
    ).lean();

    if (company?.entityId && company?.subdomain) {
      syncVerificationStatusToBtk(company.subdomain, company.entityId, verificationStatus);
    }

    return company;
  },
};
