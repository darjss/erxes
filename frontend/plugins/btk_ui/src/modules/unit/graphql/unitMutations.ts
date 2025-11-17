import { gql } from '@apollo/client';

export const BTK_CREATE_UNIT = gql`
  mutation BtkCreateUnit($input: BtkUnitInput!) {
    btkCreateUnit(input: $input) {
      _id
    }
  }
`;

export const BTK_UPDATE_UNIT = gql`
  mutation BtkUpdateUnit($id: String!, $input: BtkUnitInput!) {
    btkUpdateUnit(_id: $id, input: $input) {
      _id
    }
  }
`;

export const BTK_REMOVE_UNIT = gql`
  mutation BtkRemoveUnit($id: String!) {
    btkRemoveUnit(_id: $id) {
      _id
    }
  }
`;

export const BTK_CREATE_UNIT_ATTACHMENT = gql`
  mutation BtkCreateAttachment($input: BtkAttachmentInput!) {
    btkCreateAttachment(input: $input) {
      _id
    }
  }
`;

export const BTK_UPDATE_UNIT_ATTACHMENT = gql`
  mutation BtkUpdateAttachment($id: String!, $input: BtkAttachmentInput!) {
    btkUpdateAttachment(_id: $id, input: $input) {
      _id
    }
  }
`;

export const BTK_REMOVE_UNIT_ATTACHMENT = gql`
  mutation BtkDeleteAttachment($id: String!) {
    btkDeleteAttachment(_id: $id) {
      _id
    }
  }
`;
