import { gql } from '@apollo/client';

export const CREATE_OPPTY_MUTATION = gql`
  mutation BlockCreateOppty($input: IOpptyInput!) {
    blockCreateOppty(input: $input) {
      _id
      number
      description
      customerId
      unitType
      tenureType
      unit
      units
      propertyRows {
        buildingId
        zoningId
        unitId
        isMain
      }
      assignedUserId
      status
      labelIds
      tagIds
      projectId
      startDate
      targetDate
      customerSource
      propertiesData
      createdAt
      updatedAt
    }
  }
`;
