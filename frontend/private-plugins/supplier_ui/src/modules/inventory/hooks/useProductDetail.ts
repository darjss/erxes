import { gql, useQuery } from '@apollo/client';

const GET_PRODUCT_DETAIL = gql`
  query InventoryProductDetail($_id: String) {
    productDetail(_id: $_id) {
      _id
      name
      code
      unitPrice
      uom
    }
  }
`;

export const useProductDetail = (productId?: string) => {
  const { data } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { _id: productId },
    skip: !productId,
  });
  return data?.productDetail ?? null;
};
