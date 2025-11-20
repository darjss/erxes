import { InfoCard, InfoCardContent } from '@/btk/components/card';
import { useNewsMembers } from '~/modules/news/hooks/useNewsDetail';
import { Button, Label, Select, SkeletonArray, useConfirm } from 'erxes-ui';
import { NewsDetailAddMember } from './NewsDetailAddMember';
import { MembersInline } from 'ui-modules';
import {
  useDeleteNewsMember,
  useUpdateNewsMember,
} from '~/modules/news/hooks/useNewsMembers';
import { IconTrash } from '@tabler/icons-react';

export const NewsDetailMembers = () => {
  const { projectMembers, loading } = useNewsMembers();
  const { handleUpdateNewsMember } = useUpdateNewsMember();

  return (
    <div className="p-8">
      <InfoCard title="Members">
        <InfoCardContent>
          <div className="grid grid-cols-3 gap-3">
            <Label asChild>
              <span>Member</span>
            </Label>
            <Label asChild>
              <span>Role</span>
            </Label>
            <Label asChild>
              <span>Actions</span>
            </Label>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              <SkeletonArray count={3} />
            </div>
          ) : (
            projectMembers?.map((member) => (
              <div key={member._id} className="grid grid-cols-3 gap-3">
                <div className="flex gap-2 items-center font-medium">
                  <MembersInline memberIds={[member.memberId]} />
                </div>
                <div className="inline-flex gap-2 items-center font-medium">
                  <Select
                    value={member.role}
                    onValueChange={(value) => {
                      handleUpdateNewsMember({
                        projectMemberId: member._id,
                        role: value,
                      });
                    }}
                  >
                    <Select.Trigger className="h-8 w-auto min-w-32">
                      <Select.Value placeholder="Select role" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="admin">Admin</Select.Item>
                      <Select.Item value="lead">Lead</Select.Item>
                      <Select.Item value="member">Member</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                <div className="flex gap-2 items-center font-medium">
                  <NewsDetailMemberDelete memberId={member._id} />
                </div>
              </div>
            ))
          )}
          <NewsDetailAddMember
            members={projectMembers?.map((member) => member.memberId) || []}
          />
        </InfoCardContent>
      </InfoCard>
    </div>
  );
};

export const NewsDetailMemberDelete = ({ memberId }: { memberId: string }) => {
  const { deleteNewsMember } = useDeleteNewsMember();
  const { confirm } = useConfirm();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => {
        confirm({
          message: 'Are you sure you want to delete this member?',
          options: {
            okLabel: 'Delete',
          },
        }).then(() => {
          deleteNewsMember({ variables: { id: memberId } });
        });
      }}
      className="bg-destructive/10 text-destructive hover:bg-destructive/20"
    >
      <IconTrash />
    </Button>
  );
};
