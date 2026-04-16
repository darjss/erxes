import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const BlockListing = {
  agent: async (
    listing: { memberId?: string },
    _args: unknown,
    { models, subdomain }: IContext,
  ) => {
    if (!listing.memberId) return null;

    const agencyMember = await models.BlockAgencyMember.findById(
      listing.memberId,
    ).lean();
    if (!agencyMember?.memberId) return null;

    const users = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      module: 'users',
      action: 'find',
      input: {
        query: { _id: agencyMember.memberId },
        fields: { _id: 1, email: 1, details: 1 },
      },
      defaultValue: [],
    });

    const user = Array.isArray(users) ? users[0] : null;
    if (!user) return null;

    return {
      _id: String(user._id),
      firstName: user.details?.firstName || null,
      lastName: user.details?.lastName || null,
      email: user.email || null,
    };
  },
};
