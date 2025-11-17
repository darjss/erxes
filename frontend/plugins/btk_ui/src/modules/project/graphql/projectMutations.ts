import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation BtkCreateProject($name: String!) {
    btkCreateProject(name: $name) {
      _id
    }
  }
`;

export const BTK_PUBLISH_PROJECT = gql`
  mutation BtkPublishProject($id: String!) {
    btkPublishProject(_id: $id) {
      _id
    }
  }
`;

export const BTK_REMOVE_PROJECT = gql`
  mutation BtkRemoveProject($id: String!) {
    btkRemoveProject(_id: $id) {
      _id
    }
  }
`;

export const UPDATE_PROJECT_GENERAL_INFO = gql`
  mutation BtkUpdateProjectGeneralInfo(
    $id: String!
    $input: BtkProjectGeneralInput!
  ) {
    btkUpdateProjectGeneralInfo(_id: $id, input: $input) {
      _id
    }
  }
`;

export const BTK_ADD_PROJECT_MEMBERS = gql`
  mutation BtkAddProjectMembers($project: String!, $memberIds: [String!]!) {
    btkAddProjectMembers(project: $project, memberIds: $memberIds) {
      _id
    }
  }
`;

export const BTK_UPDATE_PROJECT_MEMBER = gql`
  mutation BtkUpdateProjectMember($id: String!, $role: BtkProjectMemberRole) {
    btkUpdateProjectMember(_id: $id, role: $role) {
      _id
    }
  }
`;

export const BTK_DELETE_PROJECT_MEMBER = gql`
  mutation BtkDeleteProjectMember($id: String!) {
    btkDeleteProjectMember(_id: $id) {
      _id
    }
  }
`;
