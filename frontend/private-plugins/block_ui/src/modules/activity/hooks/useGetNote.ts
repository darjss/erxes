import { useQuery } from '@apollo/client';
import { INote } from '../types/activityTypes';
import { BLOCK_GET_NOTE_QUERY } from '../graphql/activitiesQueries';

interface IBlockGetNoteQueryResponse {
  blockGetNote: INote;
}

export const useBlockGetNote = (id: string | undefined, skip?: boolean) => {
  const { data, loading, refetch } = useQuery<IBlockGetNoteQueryResponse>(
    BLOCK_GET_NOTE_QUERY,
    {
      variables: { id },
      skip: !id || skip,
    },
  );

  return { blockGetNote: data?.blockGetNote, loading, refetch };
};
