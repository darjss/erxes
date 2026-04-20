import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  type MushopProductCategory {
    _id: String
    name: String
    code: String
    order: String
    parentId: String
  }

  type MushopProduct {
    _id: String!
    name: String
    shortName: String
    code: String
    type: String
    description: String
    barcodes: [String]
    variants: JSON
    barcodeDescription: String
    unitPrice: Float
    initialCategory: JSON
    categoryId: String
    category: MushopProductCategory
    vendorId: String
    supplier: MushopSupplier
    propertiesData: JSON
    tagIds: [String]
    attachment: JSON
    attachmentMore: [JSON]
    scopeBrandIds: [String]
    uom: String
    subUoms: JSON
    currency: String
    pdfAttachment: JSON
    status: String
    createdAt: Date
    updatedAt: Date
  }

  type MushopProductListResponse {
    list: [MushopProduct]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const productQueryParams = `
  supplierId: String
  categoryId: String
  status: String
  searchValue: String
  ${GQL_CURSOR_PARAM_DEFS}
`;

export const queries = `
  mushopProducts(${productQueryParams}): MushopProductListResponse
  mushopProductDetail(_id: String!): MushopProduct
  mushopCoreProductCategories(parentId: String, searchValue: String): [MushopProductCategory]
`;

export const mutations = `
  mushopUpdateProductStatus(_id: String!, status: String!, note: String): MushopProduct
  mushopAssignProductCategory(_id: String!, categoryId: String): MushopProduct
  mushopRemoveProduct(_id: String!): JSON
  mushopApproveProduct(_id: String!): MushopProduct
`;
