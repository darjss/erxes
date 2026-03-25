import { IContext } from '~/connectionResolvers';
import { BLOCK_VERIFICATION_STATUS } from '~/constants';
import { sendBlockAgentMessage } from '~/modules/blockagent/utils';

export const agencyMutations = {
  updateBlockAdminAgencyVerificationStatus: async (
    _root: undefined,
    {
      agencyId,
      status,
      message,
    }: { agencyId: string; status: string; message?: string },
    { models }: IContext,
  ) => {
    const agency = await models.Agency.findOne({ _id: agencyId });

    if (!agency) {
      throw new Error('Agency not found');
    }

    if (agency.verificationStatus === status) {
      throw new Error('Already executed this action');
    }

    if (
      status !== BLOCK_VERIFICATION_STATUS.VERIFIED &&
      status !== BLOCK_VERIFICATION_STATUS.UNVERIFIED
    ) {
      throw new Error('Invalid status');
    }

    try {
      const { _id, subdomain, entityId } = agency;

      const response = await sendBlockAgentMessage({
        subdomain,
        path: 'updateAgencyVerificationStatus',
        payload: { data: { status, message }, entityId },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update agency verification status: ${response.statusText}`,
        );
      }

      const updatedAgency = await models.Agency.findOneAndUpdate(
        { _id },
        { verificationStatus: status },
        { new: true },
      );

      return updatedAgency;
    } catch (error) {
      throw new Error(
        `Failed to update agency verification status: ${error}`,
      );
    }
  },
};
