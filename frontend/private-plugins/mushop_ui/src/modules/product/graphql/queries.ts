import { gql } from '@apollo/client';

const MUSHOP_PRODUCT_FRAGMENT = gql`
  fragment MushopProductFields on MushopProduct {
    _id
    name
    shortName
    code
    type
    description
    barcodes
    variants
    barcodeDescription
    unitPrice
    categoryId
    category {
      _id
      name
      code
    }
    vendorId
    supplier {
      _id
      name
      logo
    }
    propertiesData
    tagIds
    attachment
    attachmentMore
    scopeBrandIds
    uom
    subUoms
    currency
    pdfAttachment
    status
    mushopCategoryId
    mushopCategory {
      _id
      name
      code
    }
    createdAt
    updatedAt
  }
`;

export const MUSHOP_CORE_PRODUCT_CATEGORIES = gql`
  query MushopCoreProductCategories($parentId: String, $searchValue: String) {
    mushopCoreProductCategories(parentId: $parentId, searchValue: $searchValue) {
      _id
      name
      code
    }
  }
`;

export const MUSHOP_PRODUCTS = gql`
  query MushopProducts(
    $categoryId: String
    $status: String
    $searchValue: String
    $page: Int
    $perPage: Int
  ) {
    mushopProducts(
      categoryId: $categoryId
      status: $status
      searchValue: $searchValue
      page: $page
      perPage: $perPage
    ) {
      ...MushopProductFields
    }
  }
  ${MUSHOP_PRODUCT_FRAGMENT}
`;

export const MUSHOP_PRODUCTS_TOTAL_COUNT = gql`
  query MushopProductsTotalCount(
    $supplierId: String
    $categoryId: String
    $status: String
    $searchValue: String
  ) {
    mushopProductsTotalCount(
      supplierId: $supplierId
      categoryId: $categoryId
      status: $status
      searchValue: $searchValue
    )
  }
`;

export const MUSHOP_PRODUCT_DETAIL = gql`
  query MushopProductDetail($_id: String!) {
    mushopProductDetail(_id: $_id) {
      ...MushopProductFields
    }
  }
  ${MUSHOP_PRODUCT_FRAGMENT}
`;
