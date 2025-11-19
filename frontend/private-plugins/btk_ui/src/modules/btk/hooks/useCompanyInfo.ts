import { useQuery } from '@apollo/client';
import { BTK_GET_Company_INFO } from '../graphql/btkQueries';

export const useCompanyInfo = () => {
  const { data, loading, error } = useQuery(BTK_GET_Company_INFO);
  const { getCompanyInfo: companyInfo } = data || {};
  return { loading, error, companyInfo };
};
