import { IContext } from '~/connectionResolvers';
import { BLOCK_VERIFICATION_STATUS } from '~/constants';
import { sendBlockAgencyMessage } from '~/modules/blockagency/utils';

interface IBlockAdminAgencyRejectionInput {
  reasons: string[];
  notes?: string;
}

export const agencyMutations = {
  blockAdminAgencyVerify: async (
    _root: undefined,
    { agencyId }: { agencyId: string },
    { models }: IContext,
  ) => {
    const agency = await models.Agency.findOne({ _id: agencyId });

    if (!agency) {
      throw new Error('Agency not found');
    }

    const { _id, subdomain, entityId } = agency;

    const response = await sendBlockAgencyMessage({
      subdomain,
      path: 'updateAgencyVerificationStatus',
      payload: {
        data: { status: BLOCK_VERIFICATION_STATUS.VERIFIED },
        entityId,
      },
    });

    console.log('response', response)

    if (!response.ok) {
      throw new Error(
        `Failed to update agency verification status: ${response.statusText}`,
      );
    }

    return models.Agency.findOneAndUpdate(
      { _id },
      {
        verificationStatus: BLOCK_VERIFICATION_STATUS.VERIFIED,
        $unset: { rejectionReasons: '', rejectionNotes: '' },
      },
      { new: true },
    );
  },

  blockAdminAgencyReject: async (
    _root: undefined,
    {
      agencyId,
      input,
    }: { agencyId: string; input: IBlockAdminAgencyRejectionInput },
    { models }: IContext,
  ) => {
    const agency = await models.Agency.findOne({ _id: agencyId });

    if (!agency) {
      throw new Error('Agency not found');
    }

    const { _id, subdomain, entityId } = agency;

    const response = await sendBlockAgencyMessage({
      subdomain,
      path: 'updateAgencyVerificationStatus',
      payload: {
        data: {
          status: BLOCK_VERIFICATION_STATUS.UNVERIFIED,
          reasons: input.reasons,
          message: input.notes,
        },
        entityId,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update agency verification status: ${response.statusText}`,
      );
    }

    return models.Agency.findOneAndUpdate(
      { _id },
      {
        verificationStatus: BLOCK_VERIFICATION_STATUS.UNVERIFIED,
        rejectionReasons: input.reasons,
        rejectionNotes: input.notes,
      },
      { new: true },
    );
  },

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

      const response = await sendBlockAgencyMessage({
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
      throw new Error(`Failed to update agency verification status: ${error}`);
    }
  },
};
