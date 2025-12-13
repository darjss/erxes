import { useMutation } from '@apollo/client';
import { CREATE_CV_MARKET } from '../graphql/cvMarketsMutation';

export const useMarketsCreate = () => {
  const [createMarket, { loading }] = useMutation(CREATE_CV_MARKET, {
    refetchQueries: ['GetCVMarkets'],
  });

  return { createMarket, loading };
};

