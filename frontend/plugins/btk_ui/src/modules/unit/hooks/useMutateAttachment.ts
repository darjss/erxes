import {
  BTK_CREATE_UNIT_ATTACHMENT,
  BTK_REMOVE_UNIT_ATTACHMENT,
  BTK_UPDATE_UNIT_ATTACHMENT,
} from '@/unit/graphql/unitMutations';
import { BTK_UNIT_ATTACHMENTS } from '@/unit/graphql/unitQueries';
import { IUnitAttachment } from '@/unit/types/unitType';
import { useMutation } from '@apollo/client';

export const useMutateAttachment = ({ unitId }: { unitId: string | null }) => {
  const refetchQueries = [
    {
      query: BTK_UNIT_ATTACHMENTS,
      variables: { itemType: 'unit', itemId: unitId },
    },
  ];

  const [createAttachment, { loading: createLoading }] = useMutation(
    BTK_CREATE_UNIT_ATTACHMENT,
    {
      refetchQueries,
    },
  );
  const [updateAttachment, { loading: updateLoading }] = useMutation(
    BTK_UPDATE_UNIT_ATTACHMENT,
    {
      refetchQueries,
    },
  );
  const [deleteAttachment, { loading: deleteLoading }] = useMutation(
    BTK_REMOVE_UNIT_ATTACHMENT,
    {
      refetchQueries,
    },
  );

  const mutateAttachment = (attachment: IUnitAttachment) => {
    if (!unitId) return;
    if (attachment._id && attachment.attachment) {
      updateAttachment({
        variables: {
          id: attachment._id,
          input: {
            attachment: attachment.attachment,
            itemType: 'unit',
            itemId: unitId,
            order: 1,
          },
        },
      });
    } else if (attachment._id && !attachment.attachment) {
      deleteAttachment({ variables: { id: attachment._id } });
    } else if (!attachment._id && attachment.attachment) {
      createAttachment({
        variables: {
          input: {
            attachment: attachment.attachment,
            itemType: 'unit',
            itemId: unitId,
            order: 1,
          },
        },
      });
    }
  };

  return {
    mutateAttachment,
    loading: createLoading || updateLoading || deleteLoading,
  };
};
