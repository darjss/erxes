import { useQuery } from '@apollo/client';
import { BTK_GET_FORMS } from '../graphql/formsQueries';
import { IForm } from '../types/formTypes';

interface BtkGetAllFormsData {
  btkAdminGetSubmissions: IForm[];
}

export const useForms = (enabled = true) => {
  const { data, loading, error } = useQuery<BtkGetAllFormsData>(BTK_GET_FORMS, {
    fetchPolicy: 'cache-and-network',
    skip: !enabled,
  });

  return { forms: data?.btkAdminGetSubmissions, loading, error };
};
