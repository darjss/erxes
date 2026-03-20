import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
    type BlockActivityMetadata {
      newValue: String
      previousValue: String
    }
    
    type BlockActivity {
      _id: String
      action: String  
      contentId: String
      field: String
      fieldType: String
      metadata:BlockActivityMetadata
      createdBy: String

      createdAt: Date
      updatedAt: Date
    }

    type BlockActivityListResponse {
      list: [BlockActivity],
      pageInfo: PageInfo
      totalCount: Int,
    }
`;

const queryParams = `
    contentId: String!
    ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
    blockActivities(${queryParams}): BlockActivityListResponse
`;
