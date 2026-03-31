import { gql } from '@apollo/client';

export const BLOCK_CREATE_NOTE = gql`
  mutation BlockCreateNote(
    $content: String
    $contentId: String
    $mentions: [String]
    $contentType: EnumBlockNoteContentType
  ) {
    blockCreateNote(
      content: $content
      contentId: $contentId
      mentions: $mentions
      contentType: $contentType
    ) {
      _id
    }
  }
`;
