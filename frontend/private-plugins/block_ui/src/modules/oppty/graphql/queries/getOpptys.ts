import { gql } from '@apollo/client';
import { GQL_PAGE_INFO } from 'erxes-ui';

export const GET_OPPTYS = gql`
  query BlockGetOpptys($projectId: String!, $filter: IOpptyFilter) {
    blockGetOpptys(projectId: $projectId, filter: $filter) {
      list {
        _id
        number
        description
        customerId
        unitTypes
        units
        assignedUserId
        status
        labelIds
        tagIds
        projectId
        startDate
        targetDate
        customerSource
        createdAt
        updatedAt
      }
      ${GQL_PAGE_INFO}
      totalCount
    }
  }
`;
