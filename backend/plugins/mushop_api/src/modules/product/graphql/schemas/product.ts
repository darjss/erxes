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
    mushopCategoryId: String
    mushopCategory: MushopProductCategory
    createdAt: Date
    updatedAt: Date
  }
`;

const productQueryParams = `
  supplierId: String
  categoryId: String
  status: String
  searchValue: String
  page: Int
  perPage: Int
`;

export const queries = `
  mushopProducts(${productQueryParams}): [MushopProduct]
  mushopProductsTotalCount(${productQueryParams}): Int
  mushopProductDetail(_id: String!): MushopProduct
  mushopCoreProductCategories(parentId: String, searchValue: String): [MushopProductCategory]
`;

export const mutations = `
  mushopUpdateProductStatus(_id: String!, status: String!): MushopProduct
  mushopAssignProductCategory(_id: String!, mushopCategoryId: String): MushopProduct
`;
