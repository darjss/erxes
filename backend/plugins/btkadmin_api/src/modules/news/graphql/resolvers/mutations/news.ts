import crypto from 'crypto';
import { IContext } from '~/connectionResolvers';

const { BTK_API_URL = '', BTK_ADMIN_SECRET = '' } = process.env;

const VERIFICATION_STATUSES = ['pending', 'need_info', 'approved', 'rejected', 'violation'];

const syncNewsVerificationStatusToBtk = async (
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
    await fetch(`${btkUrl}/api/updateNewsVerificationStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': `sha256=${signature}`,
      },
      body,
    });
  } catch (e) {
    console.error('Failed to sync news verificationStatus to btk_api:', e);
  }
};

export const newsMutations = {
  btkAdminUpdateNewsVerificationStatus: async (
    _root: undefined,
    { _id, verificationStatus }: { _id: string; verificationStatus: string },
    { models }: IContext,
  ) => {
    if (!VERIFICATION_STATUSES.includes(verificationStatus)) {
      throw new Error('Invalid verification status');
    }

    const news = await models.News.findOneAndUpdate(
      { _id },
      { verificationStatus },
      { new: true },
    ).lean();

    if (news?.entityId && news?.subdomain) {
      syncNewsVerificationStatusToBtk(news.subdomain, news.entityId, verificationStatus);
    }

    return news;
  },
};
