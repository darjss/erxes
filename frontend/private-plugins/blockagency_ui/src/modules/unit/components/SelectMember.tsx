import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Select } from 'erxes-ui';
import { useAgencyMembers } from '../../agency/hooks/useAgencyMembers';
import { useAssignUnitMember } from '../hooks/useAssignUnitMember';

const GET_USERS = gql`
  query AllUsers($ids: [String]) {
    allUsers(ids: $ids) {
      _id
      email
      details {
        firstName
        lastName
      }
    }
  }
`;

interface SelectMemberProps {
  unitId: string;
  memberId?: string;
}

const getUserLabel = (user?: { email?: string; details?: { firstName?: string; lastName?: string } }) => {
  if (!user) return '';
  const name = [user.details?.firstName, user.details?.lastName].filter(Boolean).join(' ');
  return name || user.email || '';
};

export const SelectMember = ({ unitId, memberId }: SelectMemberProps) => {
  const { agencyMembers, loading: membersLoading } = useAgencyMembers();
  const { assignMember, loading: assigning } = useAssignUnitMember();

  const memberUserIds = agencyMembers.map((m) => m.memberId);
  const { data: usersData } = useQuery(GET_USERS, {
    variables: { ids: memberUserIds },
    skip: memberUserIds.length === 0,
  });

  const users: Array<{ _id: string; email?: string; details?: { firstName?: string; lastName?: string } }> =
    usersData?.allUsers || [];

  const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

  const currentMember = agencyMembers.find((m) => m._id === memberId);
  const currentUser = currentMember ? userMap[currentMember.memberId] : undefined;

  const handleChange = (value: string) => {
    const next = value === 'unassigned' ? undefined : value;
    assignMember(unitId, next);
  };

  return (
    <Select
      value={memberId || 'unassigned'}
      onValueChange={handleChange}
      disabled={membersLoading || assigning}
    >
      <Select.Trigger className="h-7 min-w-[120px] max-w-[200px] text-xs border-none shadow-none focus:ring-0 px-2">
        <Select.Value placeholder="Assign member">
          {memberId && currentUser ? getUserLabel(currentUser) : memberId ? memberId : 'Unassigned'}
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="unassigned">
          <span className="text-muted-foreground">Unassigned</span>
        </Select.Item>
        {agencyMembers.map((m) => {
          const user = userMap[m.memberId];
          const label = getUserLabel(user) || m.memberId;
          return (
            <Select.Item key={m._id} value={m._id}>
              {label}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select>
  );
};
