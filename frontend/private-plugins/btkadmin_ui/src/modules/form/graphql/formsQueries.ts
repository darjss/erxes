import { gql } from '@apollo/client';

export const BTK_GET_FORMS = gql`
  query BtkAdminGetSubmissions {
    btkAdminGetSubmissions {
      email
      name
      phone
      answer1
      answer2
      answer3
      answer4
      answer5
      answer6
      submittedAt
    }
  }
`;
